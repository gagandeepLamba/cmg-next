import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { DmcForumLeads } from '@/models';

const toPlain = (row: any) => row?.get ? row.get({ plain: true }) : row;
const toPlainArray = (rows: any[]) => rows.map(toPlain);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Saved report definitions are only returned from live storage when a table is configured.
    if (action === 'getSavedReports') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Do not return hardcoded saved report details.
    if (action === 'getReport') {
      const reportId = searchParams.get('reportId');
      if (!reportId) {
        return NextResponse.json({ success: false, error: 'Report ID required' }, { status: 400 });
      }

      return NextResponse.json({ success: false, error: 'Saved report not found' }, { status: 404 });
    }

    // Generate custom report
    const reportType = searchParams.get('reportType') || 'leads';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const programType = searchParams.get('programType');
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const branch = searchParams.get('branch');
    const counselor = searchParams.get('counselor');
    const region = searchParams.get('region');
    const nationality = searchParams.get('nationality');
    const groupBy = searchParams.get('groupBy');

    const where: any = {};

    // Date range filter
    if (startDate && endDate) {
      where.feeAgreeDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Apply filters
    if (programType) where.type = programType;
    if (status) where.status = status;
    if (country) where.country_interest = parseInt(country);
    if (branch) where.branch = parseInt(branch);
    if (counselor) where.Counsilor = parseInt(counselor);
    if (region) where.region = parseInt(region);
    if (nationality) where.nationality = nationality;

    // Only paid clients with agreements
    where.stepComplete = 3;
    where.paidYet = { [Op.ne]: 0 };

    if (reportType === 'leads') {
      const leadRows = await DmcForumLeads.findAll({
        where,
        attributes: [
          'id', 'fname', 'lname', 'email', 'mobile', 'type', 'status',
          'country_interest', 'service_interest', 'feeAgreeDate', 'agreeDate',
          'Counsilor', 'case_officer', 'branch', 'region', 'nationality',
          'paidYet', 'payBalance', 'payTotal', 'payType', 'no_of_applicants'
        ],
        order: [['feeAgreeDate', 'DESC']]
      });
      const leads = toPlainArray(leadRows);

      // Group data if requested
      let groupedData = null;
      if (groupBy) {
        groupedData = groupLeads(leads, groupBy);
      }

      return NextResponse.json({
        success: true,
        data: {
          leads,
          groupedData,
          summary: {
            totalLeads: leads.length,
            totalApplicants: leads.reduce((sum: number, l: any) => sum + (l.noOfApplicants || l.no_of_applicants || 0), 0),
            byStatus: countBy(leads, 'status'),
            byType: countBy(leads, 'type'),
            byCountry: countBy(leads, 'country_interest')
          }
        }
      });
    }

    if (reportType === 'opportunities') {
      // Get opportunities data
      const opportunityRows = await DmcForumLeads.findAll({
        where: {
          ...where,
          stepComplete: { [Op.gte]: 1 }
        },
        attributes: [
          'id', 'fname', 'lname', 'email', 'mobile', 'type', 'status',
          'service_interest', 'country_interest', 'feeAgreeDate', 'agreeDate',
          'Counsilor', 'case_officer', 'branch', 'paidYet', 'payBalance'
        ],
        order: [['feeAgreeDate', 'DESC']]
      });
      const opportunities = toPlainArray(opportunityRows);

      return NextResponse.json({
        success: true,
        data: {
          opportunities,
          summary: {
            total: opportunities.length,
            paid: opportunities.filter((o: any) => o.paidYet > 0).length,
            pending: opportunities.filter((o: any) => o.payBalance > 0).length,
            totalRevenue: opportunities.reduce((sum: number, o: any) => sum + (o.paidYet || 0), 0),
            pendingRevenue: opportunities.reduce((sum: number, o: any) => sum + (o.payBalance || 0), 0)
          }
        }
      });
    }

    if (reportType === 'revenue') {
      // Revenue report
      const paymentRows = await DmcForumLeads.findAll({
        where: {
          ...where,
          paidYet: { [Op.gt]: 0 }
        },
        attributes: [
          'id', 'fname', 'lname', 'type', 'feeAgreeDate', 'paidYet',
          'payBalance', 'payType', 'branch', 'region', 'Counsilor'
        ],
        order: [['feeAgreeDate', 'DESC']]
      });
      const payments = toPlainArray(paymentRows);

      return NextResponse.json({
        success: true,
        data: {
          payments,
          summary: {
            totalReceived: payments.reduce((sum: number, p: any) => sum + (p.paidYet || 0), 0),
            totalPending: payments.reduce((sum: number, p: any) => sum + (p.payBalance || 0), 0),
            totalTransactions: payments.length,
            byPaymentType: countBy(payments, 'payType'),
            byBranch: countBy(payments, 'branch')
          }
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid report type' }, { status: 400 });

  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, reportName, reportType, filters, columns, groupBy, userId } = body;

    if (action === 'saveReport') {
      return NextResponse.json({
        success: false,
        error: 'Saved report storage table is not configured. Generated reports still use live database data.'
      }, { status: 501 });
    }

    if (action === 'deleteReport') {
      return NextResponse.json({
        success: false,
        error: 'Saved report storage table is not configured.'
      }, { status: 501 });
    }

    if (action === 'updateReport') {
      return NextResponse.json({
        success: false,
        error: 'Saved report storage table is not configured.'
      }, { status: 501 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Report save error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Helper functions
function countBy(array: any[], field: string) {
  return array.reduce((acc, item) => {
    const key = item[field] || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function groupLeads(leads: any[], groupBy: string) {
  const grouped = leads.reduce((acc, lead) => {
    const key = lead[groupBy] || 'Unknown';
    if (!acc[key]) {
      acc[key] = {
        count: 0,
        applicants: 0,
        revenue: 0,
        items: []
      };
    }
    acc[key].count += 1;
    acc[key].applicants += lead.no_of_applicants || 0;
    acc[key].revenue += lead.paidYet || 0;
    acc[key].items.push(lead);
    return acc;
  }, {} as Record<string, any>);

  return grouped;
}
