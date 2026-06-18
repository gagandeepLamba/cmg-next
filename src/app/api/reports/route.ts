import { NextRequest, NextResponse } from 'next/server'
import {
  DmcForumLeads,
  Appointments,
  Dm3partyPayment,
  DmEmployee,
  DmBranch,
  DmRegion
} from '@/models'
import { Op, QueryTypes } from 'sequelize'
import { sequelize } from '@/lib/sequelize'

const toPlain = (row: any) => row?.get ? row.get({ plain: true }) : row
const labelFor = (map: Map<string, string>, value: unknown) => {
  const key = String(value || '').trim()
  if (!key) return ''
  return map.get(key) || key
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const branch = searchParams.get('branch')
    const region = searchParams.get('region')
    const employee = searchParams.get('employee')

    if (!reportType) {
      return NextResponse.json(
        { error: 'Report type is required' },
        { status: 400 }
      )
    }

    // Build base conditions
    const dateCondition = startDate && endDate
      ? { created: { [Op.between]: [startDate, endDate] } }
      : {}

    const branchCondition = branch ? { branch: parseInt(branch) } : {}
    const regionCondition = region ? { region: parseInt(region) } : {}
    const employeeCondition = employee ? { assignTo: parseInt(employee) } : {}
    const leadBaseWhere = { ...dateCondition, ...branchCondition, ...regionCondition, ...employeeCondition }
    const convertedStatuses = ['Converted', 'converted', 'retained', 'Retained', 'client', 'Client']
    const newStatuses = ['New', 'new']

    let reportData = {}

    switch (reportType) {
      case 'leads':
        const [totalLeads, newLeads, convertedLeads] = await Promise.all([
          DmcForumLeads.count({
            where: leadBaseWhere
          }),
          DmcForumLeads.count({
            where: {
              ...leadBaseWhere,
              status: { [Op.in]: newStatuses }
            }
          }),
          DmcForumLeads.count({
            where: {
              ...leadBaseWhere,
              [Op.or]: [
                { status: { [Op.in]: convertedStatuses } },
                { opportunity_status: 'won' }
              ]
            }
          })
        ])

        const [activeLeads, totalRevenue, pendingRevenue, recentLeads, countries, services, programTypes] = await Promise.all([
          DmcForumLeads.count({
            where: {
              ...leadBaseWhere,
              status: { [Op.notIn]: [...newStatuses, ...convertedStatuses] }
            }
          }),
          DmcForumLeads.sum('payTotal', { where: leadBaseWhere }),
          DmcForumLeads.sum('payBalance', { where: leadBaseWhere }),
          DmcForumLeads.findAll({
            where: leadBaseWhere,
            attributes: ['id', 'fname', 'lname', 'email', 'phone', 'country_interest', 'service_interest', 'status', 'opportunity_status', 'priority', 'regdate', 'payTotal', 'payBalance'],
            order: [['created', 'DESC']],
            limit: 10
          }),
          sequelize.query<{ value: number | string; label: string }>(
            'SELECT id AS value, name AS label FROM dm_country_proces',
            { type: QueryTypes.SELECT }
          ),
          sequelize.query<{ value: number | string; label: string }>(
            'SELECT id AS value, name AS label FROM dm_service',
            { type: QueryTypes.SELECT }
          ),
          sequelize.query<{ value: number | string; label: string }>(
            'SELECT id AS value, type AS label FROM dm_program_type',
            { type: QueryTypes.SELECT }
          )
        ])
        const countryMap = new Map(countries.map((row) => [String(row.value), row.label]))
        const serviceMap = new Map([
          ...services.map((row) => [String(row.value), row.label] as const),
          ...programTypes.map((row) => [String(row.value), row.label] as const)
        ])
        const decoratedRecentLeads = recentLeads.map((lead) => {
          const item = toPlain(lead)
          return {
            ...item,
            country_interest_label: labelFor(countryMap, item.country_interest),
            service_interest_label: labelFor(serviceMap, item.service_interest)
          }
        })

        reportData = {
          totalLeads,
          newLeads,
          convertedLeads,
          activeLeads,
          totalRevenue: totalRevenue || 0,
          pendingRevenue: pendingRevenue || 0,
          recentLeads: decoratedRecentLeads,
          conversionRate: totalLeads > 0 ? Number((convertedLeads / totalLeads * 100).toFixed(2)) : 0
        }
        break

      case 'appointments':
        const [totalAppointments, completedAppointments, pendingAppointments] = await Promise.all([
          Appointments.count({
            where: { ...branchCondition, ...regionCondition }
          }),
          Appointments.count({
            where: {
              ...branchCondition,
              ...regionCondition,
              done: 1
            }
          }),
          Appointments.count({
            where: {
              ...branchCondition,
              ...regionCondition,
              done: 0,
              not_done: 0
            }
          })
        ])

        reportData = {
          totalAppointments,
          completedAppointments,
          pendingAppointments,
          completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments * 100).toFixed(2) : 0
        }
        break

      case 'payments':
        const [totalPayments, totalAmount] = await Promise.all([
          Dm3partyPayment.count({
            where: { ...branchCondition, ...regionCondition }
          }),
          Dm3partyPayment.sum('amount', {
            where: { ...branchCondition, ...regionCondition }
          })
        ])

        reportData = {
          totalPayments,
          totalAmount: totalAmount || 0,
          averagePayment: totalPayments > 0 ? (totalAmount || 0) / totalPayments : 0
        }
        break

      case 'employees':
        const [totalEmployees, activeEmployees] = await Promise.all([
          DmEmployee.count({
            where: { ...branchCondition, ...regionCondition }
          }),
          DmEmployee.count({
            where: {
              ...branchCondition,
              ...regionCondition,
              status: 1
            }
          })
        ])

        reportData = {
          totalEmployees,
          activeEmployees,
          inactiveEmployees: totalEmployees - activeEmployees
        }
        break

      case 'performance':
        // Performance metrics by employee
        const employees = await DmEmployee.findAll({
          where: { ...branchCondition, ...regionCondition, status: 1 },
          attributes: ['id', 'name'],
          include: [
            {
              model: DmcForumLeads,
              as: 'dmcForumLeadssByASSIGNTo',
              attributes: ['id'],
              required: false
            }
          ]
        })

        const performanceData = await Promise.all(
          employees.map(async (emp) => {
            const employeeData = toPlain(emp)
            const [leadCount, convertedLeadCount, appointmentCount, paymentCount, totalRevenue] = await Promise.all([
              DmcForumLeads.count({
                where: { assignTo: employeeData.id }
              }),
              DmcForumLeads.count({
                where: {
                  assignTo: employeeData.id,
                  [Op.or]: [
                    { status: { [Op.in]: convertedStatuses } },
                    { opportunity_status: 'won' }
                  ]
                }
              }),
              Appointments.count({
                where: { counsilorid: employeeData.id }
              }),
              Dm3partyPayment.count({
                where: { emp_id: employeeData.id }
              }),
              Dm3partyPayment.sum('amount', {
                where: { emp_id: employeeData.id }
              })
            ])

            return {
              employeeId: employeeData.id,
              employeeName: employeeData.name,
              leadCount,
              convertedLeadCount,
              conversionRate: leadCount > 0 ? Number((convertedLeadCount / leadCount * 100).toFixed(2)) : 0,
              appointmentCount,
              paymentCount,
              totalRevenue: totalRevenue || 0
            }
          })
        )

        reportData = {
          performance: performanceData,
          totalRevenue: performanceData.reduce((sum, p) => sum + p.totalRevenue, 0)
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      reportType,
      period: { startDate, endDate },
      filters: { branch, region, employee },
      data: reportData,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
