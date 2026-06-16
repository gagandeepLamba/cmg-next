import { NextRequest, NextResponse } from 'next/server';
import { DmBranch, DmcForumLeads, DmEmployee, DmRegion, DmRole } from '@/models';
import { Op } from 'sequelize';

const toPlain = (row: any) => row?.get ? row.get({ plain: true }) : row;
const toPlainArray = (rows: any[]) => rows.map(toPlain);
const amount = (value: unknown) => Number(value || 0);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'month';
    const branchId = searchParams.get('branchId');

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default: // month
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch all branches
    const branchRows = await DmBranch.findAll({
      attributes: ['id', 'name', 'region', 'status'],
      order: [['name', 'ASC']]
    });
    const branches = toPlainArray(branchRows);

    // Fetch regions separately
    const regionRows = await DmRegion.findAll({
      attributes: ['id', 'name']
    });
    const regions = toPlainArray(regionRows);
    
    const regionMap = new Map(regions.map(r => [r.id, r.name]));

    // Fetch leads data for the date range
    const leadsWhereClause: any = {
      regdate: {
        [Op.gte]: startDate
      }
    };

    if (branchId) {
      leadsWhereClause.branch = parseInt(branchId);
    }

    const leads = await DmcForumLeads.findAll({
      where: leadsWhereClause,
      attributes: [
        'id', 'fname', 'mname', 'lname', 'email', 'phone', 'mobile',
        'nationality', 'address', 'dob', 'gender', 'id_number', 'id_expiry',
        'country_interest', 'service_interest', 'market_source', 'appointment',
        'followup', 'folowuptime', 'followupstat', 'enquiry', 'convet',
        'priority', 'status', 'regdate', 'assignTo', 'branch', 'region',
        'payTotal', 'paidYet', 'payBalance', 'demdRemark', 'opportunity_status'
      ],
      include: [
        {
          model: DmEmployee,
          as: 'dmEmployeeByASSIGNTo',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: DmEmployee,
          as: 'dmEmployeeByCoUNSILOR',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: DmBranch,
          as: 'dmBranch',
          attributes: ['id', 'name'],
          required: false
        }
      ]
    });
    const leadData = toPlainArray(leads);

    // Fetch all employees with their roles for counselor counts
    const employeeRows = await DmEmployee.findAll({
      where: {
        status: 1 // Active employees
      },
      attributes: ['id', 'name', 'branch', 'role', 'status']
    });
    const employees = toPlainArray(employeeRows);

    // Fetch role names separately
    const roleRows = await DmRole.findAll({
      attributes: ['id', 'name']
    });
    const roles = toPlainArray(roleRows);
    
    const roleMap = new Map(roles.map(r => [r.id, r.name]));

    // Calculate performance metrics for each branch
    const branchPerformance = branches.map(branch => {
      const branchLeads = leadData.filter(lead => lead.branch === branch.id);
      const branchEmployees = employees.filter(emp => emp.branch === branch.id);
      
      const totalLeads = branchLeads.length;
      const convertedLeads = branchLeads.filter(lead => {
        const status = String(lead.status || '').toLowerCase();
        return ['converted', 'retained', 'client'].includes(status) || String((lead as any).opportunity_status || '').toLowerCase() === 'won';
      }).length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      
      const totalRevenue = branchLeads.reduce((sum, lead) => sum + amount(lead.payTotal), 0);
      const paidAmount = branchLeads.reduce((sum, lead) => sum + amount(lead.paidYet), 0);
      const pendingRevenue = totalRevenue - paidAmount;
      
      // Set targets (you might want to make this configurable)
      const target = totalRevenue * 0.9; // Example: 90% of current revenue as target
      const achievementRate = target > 0 ? (totalRevenue / target) * 100 : 0;
      
      // Count counselors based on role names
      const totalCounselors = branchEmployees.filter(emp => {
        const roleName = emp.role ? roleMap.get(emp.role)?.toLowerCase() || '' : '';
        return roleName.includes('counselor') || roleName.includes('consultant');
      }).length;
      
      const activeCounselors = branchEmployees.filter(emp => {
        const roleName = emp.role ? roleMap.get(emp.role)?.toLowerCase() || '' : '';
        return (roleName.includes('counselor') || roleName.includes('consultant')) && emp.status === 1;
      }).length;

      return {
        id: branch.id,
        name: branch.name,
        region: regionMap.get(branch.region) || 'Unknown',
        totalLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        revenue: totalRevenue,
        target,
        achievementRate: parseFloat(achievementRate.toFixed(1)),
        counselors: totalCounselors,
        activeCounselors,
        branchData: branch
      };
    });

    // Calculate overall statistics
    const totalBranches = branchPerformance.length;
    const totalLeadsAll = branchPerformance.reduce((sum, b) => sum + b.totalLeads, 0);
    const totalConvertedAll = branchPerformance.reduce((sum, b) => sum + b.convertedLeads, 0);
    const avgConversionRate = totalLeadsAll > 0 ? (totalConvertedAll / totalLeadsAll) * 100 : 0;
    const totalRevenueAll = branchPerformance.reduce((sum, b) => sum + b.revenue, 0);
    const totalActiveCounselors = branchPerformance.reduce((sum, b) => sum + b.activeCounselors, 0);

    const statistics = {
      totalBranches,
      totalLeads: totalLeadsAll,
      totalConverted: totalConvertedAll,
      avgConversionRate: parseFloat(avgConversionRate.toFixed(1)),
      totalRevenue: totalRevenueAll,
      totalActiveCounselors
    };

    return NextResponse.json({
      branches: branchPerformance,
      statistics,
      leads: leadData.map(lead => ({
        id: lead.id,
        fname: lead.fname,
        mname: lead.mname,
        lname: lead.lname,
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile,
        nationality: lead.nationality,
        address: lead.address,
        dob: lead.dob,
        gender: lead.gender,
        id_number: lead.id_number,
        id_expiry: lead.id_expiry,
        country_interest: lead.country_interest,
        service_interest: lead.service_interest,
        market_source: lead.market_source,
        appointment: lead.appointment,
        followup: lead.followup,
        folowuptime: lead.folowuptime,
        followupstat: lead.followupstat,
        enquiry: lead.enquiry,
        convet: lead.convet,
        priority: lead.priority,
        status: lead.status,
        regdate: lead.regdate,
        assignTo: lead.assignTo,
        branch: lead.branch,
        region: lead.region,
        payTotal: lead.payTotal,
        paidYet: lead.paidYet,
        payBalance: lead.payBalance,
        lead_remark: lead.demdRemark,
        created: lead.regdate,
        lead_quality: lead.priority,
        dmEmployeeByASSIGNTo: lead.dmEmployeeByASSIGNTo ? {
          id: lead.dmEmployeeByASSIGNTo.id,
          name: lead.dmEmployeeByASSIGNTo.name
        } : null,
        dmEmployeeByCoUNSILOR: lead.dmEmployeeByCoUNSILOR ? {
          id: lead.dmEmployeeByCoUNSILOR.id,
          name: lead.dmEmployeeByCoUNSILOR.name
        } : null,
        dmBranch: lead.branch ? {
          id: lead.branch,
          name: branches.find(b => b.id === lead.branch)?.name || 'Unknown'
        } : null
      }))
    });
  } catch (error) {
    console.error('Error fetching branch performance data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
