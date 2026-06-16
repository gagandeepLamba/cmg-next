import { NextRequest, NextResponse } from 'next/server'
import { Appointments } from '@/models'
import { sequelize } from '@/lib/sequelize'
import { QueryTypes } from 'sequelize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const counselorId = searchParams.get('counselorId')
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const conditions: string[] = []
    const replacements: Record<string, unknown> = { limit, skip }

    if (counselorId) {
      conditions.push('a.counsilorid = :counselorId')
      replacements.counselorId = Number(counselorId)
    }

    if (date) {
      conditions.push('a.date = :date')
      replacements.date = date
    }

    if (status) {
      const statusCondition = getAppointmentStatusCondition(status)
      if (statusCondition) {
        conditions.push(statusCondition)
      }
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const appointments = await sequelize.query(`
      SELECT
        a.id,
        a.leadid,
        a.date,
        a.appointtime,
        a.counsilorid,
        a.booked,
        a.done,
        a.not_done,
        a.region,
        a.branch,
        a.screenshot,
        l.fname,
        l.lname,
        l.email AS leadEmail,
        l.phone AS leadPhone,
        l.mobile AS leadMobile,
        e.name AS counselorName,
        b.name AS branchName,
        r.name AS regionName
      FROM appointments a
      LEFT JOIN dmc_forum_leads l ON l.id = a.leadid
      LEFT JOIN dm_employee e ON e.id = a.counsilorid
      LEFT JOIN dm_branch b ON b.id = a.branch
      LEFT JOIN dm_region r ON r.id = a.region
      ${whereSql}
      ORDER BY a.date DESC, a.appointtime ASC
      LIMIT :limit OFFSET :skip
    `, { replacements, type: QueryTypes.SELECT })

    const countRows = await sequelize.query<{ total: number }>(`
      SELECT COUNT(*) AS total
      FROM appointments a
      ${whereSql}
    `, { replacements, type: QueryTypes.SELECT })
    const total = Number(countRows[0]?.total || 0)

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const leadId = normalizeNumber(data.leadid ?? data.leadId)
    const counselorId = normalizeNumber(data.counsilorid ?? data.counselorId ?? data.employeeId)

    const appointment = await Appointments.create({
      leadid: leadId,
      date: data.date || new Date().toISOString().split('T')[0],
      appointtime: normalizeTime(data.appointtime || data.time || '09:00'),
      counsilorid: counselorId,
      booked: Number(data.booked ?? 1),
      done: Number(data.done ?? 0),
      not_done: Number(data.not_done ?? 0),
      region: normalizeNumber(data.region),
      branch: normalizeNumber(data.branch) || 0,
      screenshot: data.screenshot || '',
      second_done: Number(data.second_done ?? 0),
      second_meet_date: data.second_meet_date || data.date || new Date().toISOString().split('T')[0]
    } as any);

    // Reload with associations
    const appointmentWithRelations = await Appointments.findByPk(appointment.getDataValue('id'));

    return NextResponse.json(appointmentWithRelations, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function normalizeNumber(value: unknown): number | null {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

function normalizeTime(value: unknown): string {
  const time = String(value || '09:00').trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return '09:00:00';
}

function getAppointmentStatusCondition(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized === 'completed') return 'a.done = 1'
  if (normalized === 'cancelled' || normalized === 'no-show') return 'a.not_done = 1'
  if (normalized === 'confirmed' || normalized === 'scheduled' || normalized === 'booked') return 'a.booked = 1 AND COALESCE(a.done, 0) = 0 AND COALESCE(a.not_done, 0) = 0'
  if (normalized === 'pending') return 'COALESCE(a.booked, 0) = 0 AND COALESCE(a.done, 0) = 0 AND COALESCE(a.not_done, 0) = 0'
  return ''
}
