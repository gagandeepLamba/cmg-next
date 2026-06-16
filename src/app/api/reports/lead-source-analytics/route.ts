import { NextRequest, NextResponse } from 'next/server';
import { DmcForumLeads } from '@/models';
import { Op } from 'sequelize';

interface LeadSourceAnalytics {
  source: string;
  count: number;
  convertedCount: number;
  conversionRate: number;
  avgConversionTime: number;
}

const LEAD_SOURCE_ATTRIBUTES = [
  'id', 'fname', 'lname', 'email', 'phone', 'mobile', 'nationality',
  'service_interest', 'country_interest', 'status', 'priority', 'lead_quality',
  'assignTo', 'case_officer', 'Counsilor', 'branch', 'region',
  'created', 'last_updated', 'market_source', 'conversion_date', 'opportunity_id', 'opportunity_status'
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '6months';
    const source = searchParams.get('source');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const branch = searchParams.get('branch');
    const region = searchParams.get('region');

    // Calculate date range
    let dateFilter: any = {};
    const currentDate = new Date();
    
    switch (timeRange) {
      case '7days':
        dateFilter = {
          [Op.gte]: new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000))
        };
        break;
      case '30days':
        dateFilter = {
          [Op.gte]: new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000))
        };
        break;
      case '3months':
        dateFilter = {
          [Op.gte]: new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000))
        };
        break;
      case '1month':
        dateFilter = {
          [Op.gte]: new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000))
        };
        break;
      case '6hours':
        dateFilter = {
          [Op.gte]: new Date(currentDate.getTime() - (6 * 60 * 60 * 1000))
        };
        break;
      case 'custom':
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        if (startDate && endDate) {
          dateFilter = {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate)
          };
        }
        break;
      default:
        dateFilter = {
          [Op.gte]: new Date(currentDate.getTime() - (180 * 24 * 60 * 60 * 1000))
        };
    }

    let whereClause: any = {
      created: dateFilter
    };

    // Add additional filters
    if (source) whereClause.market_source = source;
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (branch) whereClause.branch = parseInt(branch);
    if (region) whereClause.region = parseInt(region);

    const leads = await DmcForumLeads.findAll({
      where: whereClause,
      attributes: LEAD_SOURCE_ATTRIBUTES,
      include: [
        {
          association: 'dmEmployeeByASSIGNTo',
          attributes: ['id', 'name']
        }
      ],
      order: [['created', 'DESC']],
      limit: 10000
    });

    // Calculate analytics data from database
    const sourceMap = new Map<string, any>();
    const statusMap = new Map<string, any>();
    const priorityMap = new Map<string, any>();
    
    leads.forEach(lead => {
      const leadData = lead.toJSON();
      const createdDate = new Date(leadData.created);
      const conversionDate = leadData.conversion_date ? new Date(leadData.conversion_date) : null;
      
      // Calculate conversion metrics
      const conversionTime = conversionDate && createdDate ? 
        Math.floor((conversionDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60)) : null;

      // Update source map
      const sourceKey = leadData.market_source || 'Unknown';
      const currentSource = sourceMap.get(sourceKey) || { 
        source: sourceKey,
        count: 0, 
        convertedCount: 0, 
        conversionRate: 0, 
        avgConversionTime: 0,
        totalConversionTime: 0
      };
      
      const isConverted = ['converted', 'retained', 'client'].includes(String(leadData.status || '').toLowerCase()) ||
        String(leadData.opportunity_status || '').toLowerCase() === 'won';
      const newCount = currentSource.count + 1;
      const newConvertedCount = currentSource.convertedCount + (isConverted ? 1 : 0);
      const newTotalConversionTime = currentSource.totalConversionTime + (conversionTime || 0);
      
      sourceMap.set(sourceKey, {
        source: sourceKey,
        count: newCount,
        convertedCount: newConvertedCount,
        conversionRate: newCount > 0 ? (newConvertedCount / newCount) * 100 : 0,
        avgConversionTime: newConvertedCount > 0 ? newTotalConversionTime / newConvertedCount : 0,
        totalConversionTime: newTotalConversionTime
      });

      // Update status map
      const statusKey = leadData.status || 'Unknown';
      const currentStatusData = statusMap.get(statusKey) || { 
        status: statusKey,
        count: 0, 
        convertedCount: 0, 
        conversionRate: 0, 
        avgConversionTime: 0,
        totalConversionTime: 0
      };
      
      const newStatusCount = currentStatusData.count + 1;
      const newStatusConvertedCount = currentStatusData.convertedCount + (isConverted ? 1 : 0);
      const newStatusTotalConversionTime = currentStatusData.totalConversionTime + (conversionTime || 0);
      
      statusMap.set(statusKey, {
        status: statusKey,
        count: newStatusCount,
        convertedCount: newStatusConvertedCount,
        conversionRate: newStatusCount > 0 ? (newStatusConvertedCount / newStatusCount) * 100 : 0,
        avgConversionTime: newStatusConvertedCount > 0 ? newStatusTotalConversionTime / newStatusConvertedCount : 0,
        totalConversionTime: newStatusTotalConversionTime
      });

      // Update priority map
      const priorityKey = leadData.priority || 'Unknown';
      const currentPriorityData = priorityMap.get(priorityKey) || { 
        priority: priorityKey,
        count: 0, 
        convertedCount: 0, 
        conversionRate: 0, 
        avgConversionTime: 0,
        totalConversionTime: 0
      };
      
      const newPriorityCount = currentPriorityData.count + 1;
      const newPriorityConvertedCount = currentPriorityData.convertedCount + (isConverted ? 1 : 0);
      const newPriorityTotalConversionTime = currentPriorityData.totalConversionTime + (conversionTime || 0);
      
      priorityMap.set(priorityKey, {
        priority: priorityKey,
        count: newPriorityCount,
        convertedCount: newPriorityConvertedCount,
        conversionRate: newPriorityCount > 0 ? (newPriorityConvertedCount / newPriorityCount) * 100 : 0,
        avgConversionTime: newPriorityConvertedCount > 0 ? newPriorityTotalConversionTime / newPriorityConvertedCount : 0,
        totalConversionTime: newPriorityTotalConversionTime
      });
    });

    // Convert to arrays
    const sources = Array.from(sourceMap.values());
    const statuses = Array.from(statusMap.values());
    const priorities = Array.from(priorityMap.values());

    // Calculate totals
    const totalLeads = sources.reduce((sum, item) => sum + item.count, 0);
    const totalConverted = sources.reduce((sum, item) => sum + item.convertedCount, 0);
    const overallConversionRate = totalLeads > 0 ? (totalConverted / totalLeads) * 100 : 0;

    return NextResponse.json({
      sources,
      statuses,
      priorities,
      summary: {
        totalLeads,
        totalConverted,
        overallConversionRate,
        dateRange: timeRange,
        filters: {
          timeRange,
          source: source || 'All',
          status: status || 'All',
          priority: priority || 'All',
          branch: branch || 'All',
          region: region || 'All'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching lead source analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead source analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, filters } = body;

    // Get leads with same filters as GET
    const leads = await DmcForumLeads.findAll({
      where: {
        created: {
          [Op.gte]: new Date(Date.now() - (180 * 24 * 60 * 60 * 1000))
        },
        ...(filters.source && { market_source: filters.source }),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.branch && { branch: parseInt(filters.branch) }),
        ...(filters.region && { region: parseInt(filters.region) })
      },
      attributes: LEAD_SOURCE_ATTRIBUTES,
      include: [
        {
          association: 'dmEmployeeByASSIGNTo',
          attributes: ['id', 'name']
        }
      ],
      order: [['created', 'DESC']],
      limit: 10000
    });

    // Generate export data based on format
    let exportData: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'csv':
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Priority', 'Created', 'Converted'];
        const csvRows = leads.map(lead => {
          const data = lead.toJSON();
          return [
            data.id,
            `${data.fname} ${data.lname}`,
            data.email,
            data.phone,
            data.market_source || 'Unknown',
            data.status,
            data.priority,
            new Date(data.created).toLocaleDateString(),
            data.conversion_date ? new Date(data.conversion_date).toLocaleDateString() : 'No'
          ].join(',');
        });
        exportData = [headers.join(','), ...csvRows].join('\n');
        contentType = 'text/csv';
        filename = 'lead-source-analytics.csv';
        break;

      case 'excel':
        // For Excel export, return CSV format (in production, use a library like xlsx)
        const excelHeaders = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Status', 'Priority', 'Created', 'Converted'];
        const excelRows = leads.map(lead => {
          const data = lead.toJSON();
          return [
            data.id,
            `${data.fname} ${data.lname}`,
            data.email,
            data.phone,
            data.market_source || 'Unknown',
            data.status,
            data.priority,
            new Date(data.created).toLocaleDateString(),
            data.conversion_date ? new Date(data.conversion_date).toLocaleDateString() : 'No'
          ].join(',');
        });
        exportData = [excelHeaders.join(','), ...excelRows].join('\n');
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = 'lead-source-analytics.xlsx';
        break;

      case 'pdf':
        // For PDF export, return JSON format (in production, use a PDF library)
        const pdfData = leads.map(lead => ({
          id: lead.id,
          name: `${lead.fname} ${lead.lname}`,
          email: lead.email,
          phone: lead.phone,
          source: lead.market_source || 'Unknown',
          status: lead.status,
          priority: lead.priority,
          created: new Date(lead.created).toLocaleDateString(),
          converted: lead.conversion_date ? new Date(lead.conversion_date).toLocaleDateString() : 'No'
        }));
        exportData = JSON.stringify(pdfData, null, 2);
        contentType = 'application/pdf';
        filename = 'lead-source-analytics.pdf';
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        );
    }

    return new NextResponse(exportData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Error exporting lead source analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export lead source analytics' },
      { status: 500 }
    );
  }
}
