import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { DmcForumLeads } from '@/models';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

const toPlain = (row: any) => row?.get ? row.get({ plain: true }) : row;
const toPlainArray = (rows: any[]) => rows.map(toPlain);
const numericValue = (value: unknown) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

async function getReferenceMaps() {
  const [countries, services, programTypes] = await Promise.all([
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
    ),
  ]);

  const countryMap = new Map(countries.map((row) => [String(row.value), row.label]));
  const serviceMap = new Map([
    ...services.map((row) => [String(row.value), row.label] as const),
    ...programTypes.map((row) => [String(row.value), row.label] as const),
  ]);

  return { countryMap, serviceMap };
}

const labelFor = (map: Map<string, string>, value: unknown) => {
  const key = String(value || '').trim();
  if (!key) return 'Unknown';
  return map.get(key) || key;
};

const decorateLeadLabels = (items: any[], maps: Awaited<ReturnType<typeof getReferenceMaps>>) => (
  items.map((item) => ({
    ...item,
    country_interest_label: labelFor(maps.countryMap, item.country_interest),
    service_interest_label: labelFor(maps.serviceMap, item.service_interest),
  }))
);

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
    const referenceMaps = await getReferenceMaps();

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
      const leads = decorateLeadLabels(toPlainArray(leadRows), referenceMaps);

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
            byCountry: countBy(leads, 'country_interest_label')
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
      const opportunities = decorateLeadLabels(toPlainArray(opportunityRows), referenceMaps);

      return NextResponse.json({
        success: true,
        data: {
          opportunities,
          summary: {
            total: opportunities.length,
            paid: opportunities.filter((o: any) => numericValue(o.paidYet) > 0).length,
            pending: opportunities.filter((o: any) => numericValue(o.payBalance) > 0).length,
            totalRevenue: opportunities.reduce((sum: number, o: any) => sum + numericValue(o.paidYet), 0),
            pendingRevenue: opportunities.reduce((sum: number, o: any) => sum + numericValue(o.payBalance), 0)
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
            totalReceived: payments.reduce((sum: number, p: any) => sum + numericValue(p.paidYet), 0),
            totalPending: payments.reduce((sum: number, p: any) => sum + numericValue(p.payBalance), 0),
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
    acc[key].revenue += numericValue(lead.paidYet);
    acc[key].items.push(lead);
    return acc;
  }, {} as Record<string, any>);

  return grouped;
}
