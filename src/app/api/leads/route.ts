import { NextRequest, NextResponse } from 'next/server'
import { sequelize, connectDB } from '@/lib/sequelize'
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment'
import { QueryTypes } from 'sequelize'
import * as XLSX from 'xlsx'
import { verifyToken } from '@/lib/auth'
import { isCeo, isFoeOrBranchManagerOrCeo, isBranchManagerOrCeo, isCounsellor } from '@/lib/roleChecks'
import { checkForDuplicate, findExistingLead, recordDuplicateLeadAttempt, normalizePhone } from '@/lib/duplicateLeadCheck'
import { resolveLeadReferenceId, resolveLeadReferences } from '@/lib/leadReferenceResolver'
import { resolveBranchReference } from '@/lib/branchResolver'

interface CountResult {
  total: number
}

// Initialize database connection
let dbInitialized = false;

const ensureDBConnection = async () => {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
};

function getInsertId(result: unknown): number {
  const values = Array.isArray(result) ? result : [result];
  for (const value of values) {
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) return value;
    if (typeof value === 'string' && Number.isInteger(Number(value)) && Number(value) > 0) return Number(value);
    if (value && typeof value === 'object') {
      const insertId = (value as { insertId?: unknown }).insertId;
      if (typeof insertId === 'number' && Number.isInteger(insertId) && insertId > 0) return insertId;
      if (typeof insertId === 'string' && Number.isInteger(Number(insertId)) && Number(insertId) > 0) return Number(insertId);
    }
  }
  return 0;
}

function validateLeadSubmission(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const firstName = String(data.fname ?? data.firstName ?? '').trim();
  const lastName = String(data.lname ?? data.lastName ?? '').trim();
  const email = String(data.email ?? '').trim();
  const phone = String(data.phone ?? '').replace(/\D/g, '');
  const namePattern = /^[\p{L}][\p{L}\s.'-]*$/u;

  if (!namePattern.test(firstName)) errors.push('First name is required and contains invalid characters.');
  if (!namePattern.test(lastName)) errors.push('Last name is required and contains invalid characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email address is required.');
  if (phone.length < 7 || phone.length > 15) errors.push('A valid phone number with 7 to 15 digits is required.');

  const dateOfBirth = data.dob ?? data.dateOfBirth;
  if (dateOfBirth) {
    const parsedDate = new Date(String(dateOfBirth));
    if (Number.isNaN(parsedDate.getTime()) || parsedDate > new Date()) errors.push('Date of birth must be a valid date in the past.');
  }

  return errors;
}

export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is established
    await ensureDBConnection();

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const branch = searchParams.get('branch')
    const region = searchParams.get('region')
    const assignTo = searchParams.get('assignTo')
    const countryInterest = searchParams.get('countryInterest')
    const serviceInterest = searchParams.get('serviceInterest')
    const marketSource = searchParams.get('marketSource')
    const leadQuality = searchParams.get('leadQuality')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const exportType = searchParams.get('exportType')
    const opportunityView = searchParams.get('opportunityView') || 'leads'
    const kanbanView = searchParams.get('kanban') === 'true'
    const authorization = request.headers.get('authorization')
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '')
    const currentUser = token ? verifyToken(token) : null

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required to view leads' }, { status: 401 })
    }

    const role = String(currentUser.type || '').toLowerCase().replace(/[\s-]+/g, '_')
    const canViewAll = currentUser.role === 1 || [
      'admin', 'administrator', 'super_admin', 'director_of_sales', 'director', 'dos',
      'director_of_operations', 'operation_manager'
    ].includes(role)
    // Receptionists and FOEs share branch-scoped visibility with branch managers so
    // they can see and (re)assign leads at their own front desk without exposing other branches.
    const isBranchManager = ['branch_manager', 'bm', 'receptionist', 'foe'].includes(role) && !canViewAll
    const isRegionalManager = ['regional_manager', 'rm'].includes(role) && !canViewAll && !isBranchManager
    const isMyLeadsView = opportunityView === 'my-leads'

    const offset = (page - 1) * limit

    // Build WHERE conditions
    let whereConditions = []
    let replacements: any[] = []

    if (search) {
      whereConditions.push(`(
        CONCAT_WS(' ', l.fname, NULLIF(l.mname, ''), l.lname) LIKE ?
        OR l.email LIKE ?
        OR l.phone LIKE ?
        OR l.mobile LIKE ?
        OR l.whatsapp_number LIKE ?
        OR CAST(l.id AS CHAR) LIKE ?
        OR l.id_number LIKE ?
      )`)
      const searchTerm = `%${search}%`
      replacements.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
    }

    if (status) {
      whereConditions.push('l.status = ?')
      replacements.push(status)
    }

    if (priority) {
      whereConditions.push('l.priority = ?')
      replacements.push(priority)
    }

    if (branch) {
      whereConditions.push('l.branch = ?')
      replacements.push(parseInt(branch))
    }

    if (region) {
      whereConditions.push('l.region = ?')
      replacements.push(parseInt(region))
    }

    if (assignTo) {
      whereConditions.push('l.assignTo = ?')
      replacements.push(parseInt(assignTo))
    }

    if (countryInterest) {
      whereConditions.push('l.country_interest = ?')
      replacements.push(countryInterest)
    }

    if (serviceInterest) {
      whereConditions.push('l.service_interest = ?')
      replacements.push(serviceInterest)
    }

    if (marketSource) {
      whereConditions.push('l.market_source = ?')
      replacements.push(marketSource)
    }

    if (leadQuality) {
      whereConditions.push('l.lead_quality = ?')
      replacements.push(leadQuality)
    }

    if (dateFrom || dateTo) {
      if (dateFrom) {
        whereConditions.push('l.regdate >= ?')
        replacements.push(dateFrom)
      }
      if (dateTo) {
        whereConditions.push('l.regdate <= ?')
        replacements.push(dateTo)
      }
    }

    // A lead becomes a client once BOTH finance and compliance sign off on its
    // opportunity (dm_opportunity_workflow_reviews - see the table-name note
    // near the `wr` join below), in addition to the older status-based signals
    // this already recognized.
    // COALESCE around every l.status/l.opportunity_status comparison below is
    // load-bearing, not stylistic: these clauses get wrapped in NOT elsewhere
    // (Leads tab, Opportunity Draft tab), and in SQL, FALSE OR NULL = NULL, so
    // NOT(... OR l.opportunity_status = 'draft' ...) evaluates to NULL - not
    // TRUE - for every lead where that column is NULL (i.e. every fresh lead).
    // WHERE treats a NULL result the same as FALSE, so those rows silently
    // vanish. COALESCE(...,'') keeps every comparison a clean boolean.
    const CLIENT_STATUS_SQL = `(COALESCE(l.status,'') IN ('Retained','Client','converted','retained','client') OR COALESCE(l.opportunity_status,'') = 'won' OR EXISTS (SELECT 1 FROM dmc_opportunities oc WHERE oc.leadId = l.id AND oc.status = 'won') OR EXISTS (SELECT 1 FROM dmc_opportunities occ JOIN dm_opportunity_workflow_reviews wrc ON wrc.opportunity_id = occ.id WHERE occ.leadId = l.id AND wrc.finance_status = 'approved' AND wrc.compliance_status = 'approved'))`
    // opportunity_status = 'draft' is set the instant a counselor starts the
    // Opportunity Flow wizard (LeadManagement.tsx handleBulkConvertToOpportunity),
    // before any dmc_opportunities row exists - see that function for why the
    // row itself isn't created until the wizard's Payment stage.
    const HAS_OPP_SQL = `((l.opportunity_id IS NOT NULL AND l.opportunity_id <> 0) OR COALESCE(l.opportunity_status,'') = 'draft' OR EXISTS (SELECT 1 FROM dmc_opportunities o WHERE o.leadId = l.id))`

    if (isMyLeadsView) {
      if (!isBranchManagerOrCeo(currentUser)) {
        return NextResponse.json({ error: 'Only Branch Manager or CEO can view My Leads' }, { status: 403 })
      }
      whereConditions.push(`NOT ${HAS_OPP_SQL}`)
      whereConditions.push('(l.Counsilor = ? OR l.assignTo = ?)')
      replacements.push(currentUser.id, currentUser.id)
    } else if (opportunityView === 'clients') {
      whereConditions.push(HAS_OPP_SQL)
      whereConditions.push(CLIENT_STATUS_SQL)
      if (isBranchManager) {
        whereConditions.push('l.branch = ?')
        replacements.push(currentUser.branch)
      } else if (isRegionalManager) {
        whereConditions.push('l.region = ?')
        replacements.push(currentUser.region)
      } else if (!canViewAll) {
        whereConditions.push(`(l.Counsilor = ? OR l.assignTo = ? OR EXISTS (SELECT 1 FROM dmc_opportunities o WHERE o.leadId = l.id AND (o.assignedTo = ? OR o.createdBy = ?)))`)
        replacements.push(currentUser.id, currentUser.id, currentUser.id, currentUser.id)
      }
    } else if (opportunityView === 'opportunities') {
      whereConditions.push(HAS_OPP_SQL)
      whereConditions.push(`NOT ${CLIENT_STATUS_SQL}`)
      if (isBranchManager) {
        whereConditions.push('l.branch = ?')
        replacements.push(currentUser.branch)
      } else if (isRegionalManager) {
        whereConditions.push('l.region = ?')
        replacements.push(currentUser.region)
      } else if (!canViewAll) {
        whereConditions.push(`(
          l.Counsilor = ? OR l.assignTo = ?
          OR EXISTS (
            SELECT 1 FROM dmc_opportunities o
            WHERE o.leadId = l.id AND (o.assignedTo = ? OR o.createdBy = ?)
          )
          OR (l.Counsilor IS NULL AND l.assignTo IS NULL
              AND NOT EXISTS (SELECT 1 FROM dmc_opportunities o2 WHERE o2.leadId = l.id AND o2.assignedTo IS NOT NULL))
        )`)
        replacements.push(currentUser.id, currentUser.id, currentUser.id, currentUser.id)
      }
    } else if (opportunityView === 'duplicates') {
      whereConditions.push('l.duplicate = 1')
      whereConditions.push(`NOT ${CLIENT_STATUS_SQL}`)
      if (isBranchManager) {
        whereConditions.push('l.branch = ?')
        replacements.push(currentUser.branch)
      } else if (isRegionalManager) {
        whereConditions.push('l.region = ?')
        replacements.push(currentUser.region)
      } else if (!canViewAll) {
        whereConditions.push('(l.Counsilor = ? OR l.assignTo = ?)')
        replacements.push(currentUser.id, currentUser.id)
      }
    } else {
      // Leads tab: show only leads (no opportunities) for all roles
      if (!canViewAll && !isBranchManager && !isRegionalManager) {
        // Counselors: only leads assigned to them, no opportunity. Unassigned
        // leads are intentionally excluded here - only CEO (canViewAll),
        // Branch Manager, and FOE (isBranchManager) should see/triage new
        // unassigned leads before handing them off to a counselor.
        whereConditions.push(`NOT ${HAS_OPP_SQL}`)
        whereConditions.push('(l.Counsilor = ? OR l.assignTo = ?)')
        replacements.push(currentUser.id, currentUser.id)
      } else {
        // Admin/DS/BM/RM: all leads but exclude those with opportunities
        whereConditions.push(`NOT ${HAS_OPP_SQL}`)
        if (isBranchManager) {
          whereConditions.push('l.branch = ?')
          replacements.push(currentUser.branch)
        } else if (isRegionalManager) {
          whereConditions.push('l.region = ?')
          replacements.push(currentUser.region)
        }
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // If export is requested, return all data without pagination
    if (exportType === 'excel') {
      // Export is restricted to CEO (full company, unfiltered by the branch
      // scoping above) and Branch Manager (their own branch only, via the
      // same whereConditions branch-scoping every other role already gets).
      if (!isBranchManagerOrCeo(currentUser)) {
        return NextResponse.json({ error: 'Only the CEO or a Branch Manager can export leads' }, { status: 403 })
      }
      const leads = await sequelize.query<any>(`
        SELECT
          l.id, l.fname, l.mname, l.lname, l.email, l.phone, l.mobile, l.whatsapp_number, l.nationality,
          l.address, l.dob, l.gender, l.id_number, l.id_expiry, l.country_interest,
          l.service_interest, l.market_source, l.priority, l.status, l.lead_quality,
          l.regdate, l.payTotal, l.paidYet, l.payBalance, l.lead_remark, l.created,
          l.assignTo, l.branch, l.region,
          l.opportunity_id, l.opportunity_status,
          COALESCE(cp.name, l.country_interest) as country_interest_label,
          COALESCE(s.name, pt.type, l.service_interest) as service_interest_label,
          COALESCE(ms.name, l.market_source) as market_source_label,
          COALESCE(l.opportunity_id, (SELECT MAX(o.id) FROM dmc_opportunities o WHERE o.leadId = l.id)) as resolved_opportunity_id,
          e1.name as assigned_to_name, b.branch as branch_name
        FROM dmc_forum_leads l
        LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
        LEFT JOIN dm_branch b ON l.branch = b.id
        LEFT JOIN dm_country_proces cp ON cp.id = CAST(l.country_interest AS UNSIGNED)
        LEFT JOIN dm_service s ON s.id = CAST(l.service_interest AS UNSIGNED)
        LEFT JOIN dm_program_type pt ON pt.id = CAST(l.service_interest AS UNSIGNED)
        LEFT JOIN dm_source ms ON ms.id = CAST(l.market_source AS UNSIGNED)
        ${whereClause}
        ORDER BY l.created DESC
      `, {
        replacements,
        type: QueryTypes.SELECT
      })

      // Convert to Excel format
      const ws = XLSX.utils.json_to_sheet(leads.map((lead: any) => ({
        'ID': lead.id,
        'First Name': lead.fname,
        'Middle Name': lead.mname,
        'Last Name': lead.lname,
        'Email': lead.email,
        'Phone': lead.phone,
        'Mobile': lead.mobile,
        'Nationality': lead.nationality,
        'Address': lead.address,
        'Date of Birth': lead.dob,
        'Gender': lead.gender,
        'ID Number': lead.id_number,
        'ID Expiry': lead.id_expiry,
        'Country Interest': lead.country_interest_label || lead.country_interest,
        'Service Interest': lead.service_interest_label || lead.service_interest,
        'Market Source': lead.market_source_label || lead.market_source,
        'Priority': lead.priority,
        'Status': lead.status,
        'Lead Quality': lead.lead_quality,
        'Registration Date': lead.regdate,
        'Assigned To': lead.assigned_to_name || 'Unassigned',
        'Branch': lead.branch_name || 'N/A',
        'Total Payment': lead.payTotal,
        'Paid Yet': lead.paidYet,
        'Balance': lead.payBalance,
        'Lead Remark': lead.lead_remark,
        'Created': lead.created
      })))

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Leads')
      const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="leads-export.xlsx"'
        }
      })
    }

    // Get total count
    const countResult = await sequelize.query<CountResult>(`
      SELECT COUNT(*) as total FROM dmc_forum_leads l ${whereClause}
    `, {
      replacements,
      type: QueryTypes.SELECT
    })

    const total = Number(countResult[0]?.total || 0)

    // Get leads with pagination
    const buildLeadsQuery = (withWorkflow: boolean) => `
        SELECT
        l.id, l.fname, l.mname, l.lname, l.email, l.phone, l.mobile, l.whatsapp_number, l.nationality,
        l.address, l.dob, l.gender, l.id_number, l.id_expiry, l.country_interest,
        l.service_interest, l.market_source, l.priority, l.status, l.lead_quality,
        l.regdate, l.payTotal, l.paidYet, l.payBalance, l.lead_remark, l.created,
        l.assignTo, l.branch, l.region, l.stepComplete,
        l.opportunity_id, l.opportunity_status, l.campaign,
        (SELECT remark FROM dmc_forum_leads_remarks WHERE \`lead\` = l.id ORDER BY id DESC LIMIT 1) as latest_remark,
        COALESCE(cp.name, l.country_interest) as country_interest_label,
        COALESCE(s.name, pt.type, l.service_interest) as service_interest_label,
        COALESCE(ms.name, l.market_source) as market_source_label,
        COALESCE(l.opportunity_id, (SELECT MAX(o.id) FROM dmc_opportunities o WHERE o.leadId = l.id)) as resolved_opportunity_id,
        e1.name as assigned_to_name, b.branch as branch_name,
        b.ar_name as branch_name_ar, b.address as branch_address, b.email as branch_email,
        b.mobile as branch_mobile, b.license_number as branch_license_number,
        b.vat_gst_percent as branch_vat_gst_percent,
        b.bank_name as branch_bank_name, b.bank_account_name as branch_bank_account_name,
        b.bank_account_number as branch_bank_account_number, b.bank_iban as branch_bank_iban,
        b.bank_branch as branch_bank_branch,
        o.status AS opp_status, o.stage AS opp_stage,
        o.paymentReceived, o.agreementSigned, o.retentionStatus,
        (SELECT agr.agreementNumber FROM dm_opportunity_agreements agr WHERE agr.opportunityId = o.id ORDER BY agr.id DESC LIMIT 1) as agreementNumber${withWorkflow ? `,
        wr.workflow_status, wr.finance_status, wr.compliance_status, wr.formal_client_id` : ''}
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
      LEFT JOIN dm_branch b ON l.branch = b.id
      LEFT JOIN dm_country_proces cp ON cp.id = CAST(l.country_interest AS UNSIGNED)
      LEFT JOIN dm_service s ON s.id = CAST(l.service_interest AS UNSIGNED)
      LEFT JOIN dm_program_type pt ON pt.id = CAST(l.service_interest AS UNSIGNED)
      LEFT JOIN dm_source ms ON ms.id = CAST(l.market_source AS UNSIGNED)
      LEFT JOIN dmc_opportunities o ON o.id = COALESCE(l.opportunity_id, (SELECT MAX(o2.id) FROM dmc_opportunities o2 WHERE o2.leadId = l.id))${withWorkflow ? `
      LEFT JOIN dm_opportunity_workflow_reviews wr ON wr.opportunity_id = o.id` : ''}
      ${whereClause}
      ORDER BY l.created DESC
      LIMIT ? OFFSET ?
    `;

    let leads: any[];
    try {
      leads = await sequelize.query<any>(buildLeadsQuery(true), {
        replacements: [...replacements, limit, offset],
        type: QueryTypes.SELECT
      });
    } catch (queryErr: any) {
      const errMsg = String(queryErr?.message || queryErr?.original?.message || '');
      if (errMsg.includes('dm_opportunity_workflow_reviews') || errMsg.includes('ER_NO_SUCH_TABLE')) {
        console.warn('Workflow reviews table missing, retrying without it');
        leads = await sequelize.query<any>(buildLeadsQuery(false), {
          replacements: [...replacements, limit, offset],
          type: QueryTypes.SELECT
        });
      } else {
        throw queryErr;
      }
    }

    const finalLeads = Array.isArray(leads) ? leads : [];

    // Format the response to match the expected structure
    const formattedLeads = (Array.isArray(finalLeads) ? finalLeads : []).map((lead: any) => ({
      ...lead,
      dmEmployeeByASSIGNTo: lead.assigned_to_name ? { id: lead.assignTo, name: lead.assigned_to_name } : null,
      dmBranch: lead.branch_name ? {
        id: lead.branch,
        name: lead.branch_name,
        nameAr: lead.branch_name_ar,
        address: lead.branch_address,
        email: lead.branch_email,
        mobile: lead.branch_mobile,
        licenseNumber: lead.branch_license_number,
        vatGstPercent: lead.branch_vat_gst_percent,
        bankName: lead.branch_bank_name,
        bankAccountName: lead.branch_bank_account_name,
        bankAccountNumber: lead.branch_bank_account_number,
        bankIban: lead.branch_bank_iban,
        bankBranch: lead.branch_bank_branch
      } : null
    }))

    return NextResponse.json({
      leads: formattedLeads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection is established
    await ensureDBConnection();

    const authorization = request.headers.get('authorization')
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '')
    const currentUser = token ? verifyToken(token) : null
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required' }, { status: 401 })
    }

    const data = await request.json()

    // Check if this is an Excel import
    if (data.importType === 'excel' && data.fileData) {
      if (!isFoeOrBranchManagerOrCeo(currentUser) && !isCounsellor(currentUser)) {
        return NextResponse.json({ error: 'Only FOE, Branch Manager, CEO, or Counsellor can bulk-upload leads' }, { status: 403 })
      }
      const uploaderBranchId = Number(currentUser.branch || 0) || 1
      try {
        const workbook = XLSX.read(data.fileData, { type: 'base64' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const createdLeads = []
        const errors = []
        const skipped: Array<{ row: number; reason: string }> = []
        // Duplicates already inserted from *this same file* aren't in the DB
        // yet when checkForDuplicate runs for a later row, so two rows in one
        // upload sharing an email/phone would otherwise both pass the DB-only check.
        const seenInBatch = new Set<string>()

        for (const [index, row] of jsonData.entries()) {
          try {
            const typedRow = row as Record<string, any>

            // "Name" is the single-column fallback from the sample template
            // (src/app/api/leads/sample-template/route.ts); split on first
            // whitespace when the richer First/Last Name columns aren't present.
            const nameParts = String(typedRow['Name'] || '').trim().split(/\s+/).filter(Boolean)
            const nameFallbackFirst = nameParts[0] || ''
            const nameFallbackLast = nameParts.slice(1).join(' ')

            const rowPhone = typedRow['Phone'] || typedRow['phone'] || ''
            const rowEmail = typedRow['Email'] || typedRow['email'] || ''

            // Reject rather than flag: a lead whose phone or email already
            // exists (in the DB, or earlier in this same file) doesn't get
            // created at all, so the CRM never ends up with two records for
            // the same person.
            const batchKey = [normalizePhone(rowPhone), String(rowEmail || '').trim().toLowerCase()].filter(Boolean).join('|')
            if (batchKey && seenInBatch.has(batchKey)) {
              skipped.push({ row: index + 1, reason: 'Duplicate of another row earlier in this file (same email/phone)' })
              continue
            }
            const duplicateCheck = await checkForDuplicate({ phone: rowPhone, email: rowEmail })
            if (duplicateCheck.isDuplicate) {
              skipped.push({ row: index + 1, reason: 'A lead with this email or phone already exists in the CRM' })
              continue
            }
            if (batchKey) seenInBatch.add(batchKey)

            const leadData = {
              fname: typedRow['First Name'] || typedRow['fname'] || nameFallbackFirst,
              mname: typedRow['Middle Name'] || typedRow['mname'] || '',
              lname: typedRow['Last Name'] || typedRow['lname'] || nameFallbackLast,
              email: rowEmail,
              phone: rowPhone,
              mobile: typedRow['Mobile'] || typedRow['mobile'] || '',
              nationality: typedRow['Nationality'] || typedRow['nationality'] || '',
              address: typedRow['Address'] || typedRow['address'] || '',
              dob: typedRow['Date of Birth'] || typedRow['dob'] ? new Date(typedRow['Date of Birth'] || typedRow['dob']) : null,
              gender: typedRow['Gender'] || typedRow['gender'] || 'Male',
              id_number: typedRow['ID Number'] || typedRow['id_number'] || '',
              id_expiry: typedRow['ID Expiry'] || typedRow['id_expiry'] ? new Date(typedRow['ID Expiry'] || typedRow['id_expiry']) : new Date(),
              id_issue_date: new Date(),
              country_interest: typedRow['Country Interest'] || typedRow['country_interest'] || typedRow['Country'] || typedRow['country'] || '',
              sub_country_interest: 0,
              service_interest: typedRow['Service Interest'] || typedRow['service_interest'] || '',
              market_source: typedRow['Market Source'] || typedRow['market_source'] || typedRow['Source'] || typedRow['source'] || '',
              sub_market_source: 0,
              priority: typedRow['Priority'] || typedRow['priority'] || 'Medium',
              status: typedRow['Status'] || typedRow['status'] || 'New',
              lead_quality: typedRow['Lead Quality'] || typedRow['lead_quality'] || 'Warm',
              enquiry: typedRow['Enquiry'] || typedRow['enquiry'] || 'General Inquiry',
              convet: 'New',
              regdate: new Date(),
              regtime: new Date(),
              last_updated: new Date().toLocaleDateString(),
              last_updtd_time: new Date().toTimeString().split(' ')[0],
              followup: new Date(),
              folowuptime: new Date().toTimeString().split(' ')[0],
              sf: 0,
              stepComplete: 1,
              // Imported leads enter unassigned; a FOE/Branch Manager/CEO assigns them afterward.
              assignTo: null,
              case_officer: null,
              Counsilor: null,
              branch: uploaderBranchId,
              region: data.region || 1,
              payTotal: parseFloat(typedRow['Total Payment'] || typedRow['payTotal']) || 0,
              discount: 0,
              paidYet: parseFloat(typedRow['Paid Yet'] || typedRow['paidYet']) || 0,
              payBalance: parseFloat(typedRow['Balance'] || typedRow['payBalance']) || 0,
              demandAmt: 0,
              notf: 0,
              type: 'lead',
              transfered_by: 1,
              transfer_time: new Date().toTimeString().split(' ')[0],
              exist: 0,
              no_of_applicants: 1,
              advanced: 0,
              do_status: 0,
              arm_status: 0,
              gm_status: 0,
              discount_status: 0,
              discount_remarks: '',
              discount_by: 1,
              discount_date: new Date(),
              campaign: '',
              campaign_group: '',
              pa_fname: '',
              pa_lname: '',
              lead_remark: typedRow['Lead Remark'] || typedRow['lead_remark'] || 'Imported from Excel',
              created: new Date(),
              created_by: data.created_by || 1,
              alert: 0,
              area: '',
              transferred_remark_update: 0,
              untouch_transfer: 0,
              lead_nq_reason: '',
              tele_caller_alert: 0,
              tele_caller_remark: '',
              tele_caller_remark_by: 1,
              tele_date: new Date(),
              lead_date: new Date(),
              duplicate: duplicateCheck.isDuplicate ? 1 : 0,
              duplicate_count: duplicateCheck.duplicateCount,
              ref_remark: '',
              na_record: 0,
              old_assgined: 0,
              nal_count: 0,
              campaign_id: 0,
              old_branch: 0,
              status_date: new Date()
            }

            const resolvedLeadData = await resolveLeadReferences(leadData)

            const insertResult = await sequelize.query(`
              INSERT INTO dmc_forum_leads (
                fname, mname, lname, email, phone, mobile, nationality, address, dob, gender,
                id_number, id_expiry, id_issue_date, country_interest, sub_country_interest,
                service_interest, market_source, sub_market_source, priority, status, lead_quality,
                enquiry, convet, regdate, regtime, last_updated, last_updtd_time, followup,
                folowuptime, sf, stepComplete,
                assignTo, case_officer, Counsilor, branch, region, payTotal, discount, paidYet,
                payBalance, demandAmt, notf, type, transfered_by, transfer_time, exist,
                no_of_applicants, advanced, do_status, arm_status, gm_status, discount_status,
                discount_remarks, discount_by, discount_date, campaign, campaign_group,
                pa_fname, pa_lname, lead_remark, created, created_by, alert, area,
                transferred_remark_update, untouch_transfer, lead_nq_reason, tele_caller_alert,
                tele_caller_remark, tele_caller_remark_by, tele_date, lead_date, duplicate,
                duplicate_count, ref_remark, na_record, old_assgined, nal_count, campaign_id,
                old_branch, status_date
              ) VALUES (${Array(81).fill('?').join(', ')})
            `, {
              replacements: [
                leadData.fname, leadData.mname, leadData.lname, leadData.email, leadData.phone, leadData.mobile,
                leadData.nationality, leadData.address, leadData.dob, leadData.gender, leadData.id_number,
                resolvedLeadData.id_expiry, resolvedLeadData.id_issue_date, resolvedLeadData.country_interest, resolvedLeadData.sub_country_interest,
                resolvedLeadData.service_interest, resolvedLeadData.market_source, resolvedLeadData.sub_market_source, resolvedLeadData.priority,
                resolvedLeadData.status, resolvedLeadData.lead_quality, resolvedLeadData.enquiry, resolvedLeadData.convet, resolvedLeadData.regdate,
                resolvedLeadData.regtime, resolvedLeadData.last_updated, resolvedLeadData.last_updtd_time,
                resolvedLeadData.followup, resolvedLeadData.folowuptime, resolvedLeadData.sf, resolvedLeadData.stepComplete,
                resolvedLeadData.assignTo, resolvedLeadData.case_officer, resolvedLeadData.Counsilor, resolvedLeadData.branch, resolvedLeadData.region,
                resolvedLeadData.payTotal, resolvedLeadData.discount, resolvedLeadData.paidYet, resolvedLeadData.payBalance, resolvedLeadData.demandAmt,
                resolvedLeadData.notf, resolvedLeadData.type, resolvedLeadData.transfered_by, resolvedLeadData.transfer_time, resolvedLeadData.exist,
                resolvedLeadData.no_of_applicants, resolvedLeadData.advanced, resolvedLeadData.do_status, resolvedLeadData.arm_status,
                resolvedLeadData.gm_status, resolvedLeadData.discount_status, resolvedLeadData.discount_remarks, resolvedLeadData.discount_by,
                resolvedLeadData.discount_date, resolvedLeadData.campaign, resolvedLeadData.campaign_group, resolvedLeadData.pa_fname,
                resolvedLeadData.pa_lname, resolvedLeadData.lead_remark, resolvedLeadData.created, resolvedLeadData.created_by, resolvedLeadData.alert,
                resolvedLeadData.area, resolvedLeadData.transferred_remark_update, resolvedLeadData.untouch_transfer, resolvedLeadData.lead_nq_reason,
                resolvedLeadData.tele_caller_alert, resolvedLeadData.tele_caller_remark, resolvedLeadData.tele_caller_remark_by,
                resolvedLeadData.tele_date, resolvedLeadData.lead_date, resolvedLeadData.duplicate, resolvedLeadData.duplicate_count,
                resolvedLeadData.ref_remark, resolvedLeadData.na_record, resolvedLeadData.old_assgined, resolvedLeadData.nal_count,
                resolvedLeadData.campaign_id, resolvedLeadData.old_branch, resolvedLeadData.status_date
              ],
              type: QueryTypes.INSERT
            })

            const leadId = getInsertId(insertResult)
            if (!leadId) throw new Error('Lead was created but the new lead ID could not be resolved')
            createdLeads.push({ id: leadId, ...resolvedLeadData })
          } catch (error) {
            const dbMessage = (error as any)?.original?.sqlMessage || (error as any)?.parent?.sqlMessage
            errors.push({ row: index + 1, error: dbMessage || (error as Error).message })
          }
        }

        return NextResponse.json({
          message: `Import completed. ${createdLeads.length} leads created, ${skipped.length} duplicates skipped, ${errors.length} errors.`,
          createdLeads,
          errors,
          skipped
        })
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid Excel file format' },
          { status: 400 }
        )
      }
    }

    const requestedBranch = await resolveBranchReference(data.branch || data.branchId || '')
    const requestedBranchId = requestedBranch?.id || 0
    if (!requestedBranchId) {
      return NextResponse.json({ error: 'A branch is required to create a lead. Select the branch where the lead should enter the unassigned queue.' }, { status: 422 })
    }
    const validationErrors = validateLeadSubmission(data)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Lead validation failed', errors: validationErrors }, { status: 422 })
    }
    let requestedOwnerId = Number.parseInt(String(data.assignTo || data.leadOwner || 0), 10) || null
    // A Branch Manager or CEO who creates a lead without picking a counselor
    // gets it assigned to themselves by default, rather than leaving it
    // unassigned — mirrors the self-assignment default a plain counselor
    // already gets client-side (see create/page.tsx), extended server-side
    // to these roles too since the Add Lead form doesn't default the
    // Counselor picker for them (they're expected to explicitly hand leads
    // off to counselors, but an unassigned lead is still the wrong default).
    if (!requestedOwnerId && isBranchManagerOrCeo(currentUser)) {
      requestedOwnerId = currentUser.id
    }
    // A plain counselor (not FOE/Branch Manager/CEO) can only ever create a
    // lead assigned to themselves — the Add Lead form already hides the
    // Counselor picker for them, but that's client-side only, so enforce it
    // here too against a direct API call.
    if (requestedOwnerId && requestedOwnerId !== currentUser.id && !isFoeOrBranchManagerOrCeo(currentUser)) {
      return NextResponse.json({ error: 'You can only create a lead assigned to yourself' }, { status: 403 })
    }
    // FOE/Branch Manager can only hand a new lead to a counselor in their own
    // branch — the Add Lead form already hides other branches, but that's
    // client-side only, so enforce it here too. CEO is unrestricted.
    if (requestedOwnerId && isFoeOrBranchManagerOrCeo(currentUser) && !isCeo(currentUser)) {
      const [ownerRow] = await sequelize.query<{ branch: number | null }>(
        'SELECT branch FROM dm_employee WHERE id = :id LIMIT 1',
        { replacements: { id: requestedOwnerId }, type: QueryTypes.SELECT }
      )
      if (Number(ownerRow?.branch || 0) !== Number(currentUser?.branch || 0)) {
        return NextResponse.json({ error: 'You can only assign a lead to a counselor in your own branch' }, { status: 403 })
      }
    }
    // A plain counselor's lead is always self-assigned — round-robin/auto-assign
    // would otherwise be able to hand it to a different counselor, which defeats
    // that guarantee. Only FOE/Branch Manager/CEO may request round-robin.
    const wantsAutoAssign = Boolean(data.autoAssign || data.roundrobin) && isFoeOrBranchManagerOrCeo(currentUser)
    let assignment: Awaited<ReturnType<typeof resolveLeadAutoAssignment>> | null = null
    // New leads enter unassigned by default; only resolve an owner when the
    // caller explicitly named one or explicitly asked for auto-assignment.
    // A FOE/Branch Manager/CEO assigns the rest afterward from the lead pool.
    if (requestedOwnerId || wantsAutoAssign) {
      try {
        assignment = await resolveLeadAutoAssignment({
          branchId: requestedBranchId,
          preferredEmployeeId: requestedOwnerId,
          forceAutoAssign: wantsAutoAssign,
          roundRobin: true,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : ''
        if (!message.includes('No active employees are available')) throw error
        // Keep the lead in the branch's unassigned queue until a manager marks
        // an employee present; never reject a customer lead because the office is empty.
      }
    }

    // A lead with this email/phone already exists — block creation rather
    // than silently inserting a second row (the old behavior just tagged the
    // new row duplicate=1 and let it through, which meant two counselors could
    // both "own" the same client). Point the requester at whoever already has
    // it so they can go through the lead-transfer flow instead.
    const existingLead = await findExistingLead({ phone: data.phone, email: data.email })
    if (existingLead) {
      await recordDuplicateLeadAttempt({
        existingLead,
        actorId: currentUser.id,
        actorRole: currentUser.roleName || currentUser.type,
      })
      const ownerLabel = existingLead.ownerName || 'an unassigned queue — contact your Branch Manager'
      return NextResponse.json({
        error: `A lead with this email or phone already exists (Lead #${existingLead.id}, currently with ${ownerLabel}). Request a transfer instead of creating a duplicate.`,
        duplicateLeadId: existingLead.id,
        duplicateLeadOwner: existingLead.ownerName,
        duplicateLeadOwnerId: existingLead.ownerId,
        duplicateLeadStatus: existingLead.status || 'New',
      }, { status: 409 })
    }
    const duplicateCheck = await checkForDuplicate({ phone: data.phone, email: data.email })
    let resolvedCountryInterest: number | null = null
    let resolvedServiceInterest: number | null = null
    let resolvedMarketSource: number | null = null

    try {
      resolvedCountryInterest = await resolveLeadReferenceId(
        'country_interest',
        data.country_interest || data.countryInterest || data.programCountry || null
      )
      resolvedServiceInterest = await resolveLeadReferenceId(
        'service_interest',
        data.service_interest || data.serviceInterest || data.program || null
      )
      resolvedMarketSource = await resolveLeadReferenceId(
        'market_source',
        data.market_source || data.leadSource || null
      )
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid lead reference value' },
        { status: 422 }
      )
    }

    // Regular lead creation - provide defaults for all required fields
    const leadData = {
      // User-provided data
      fname: data.fname || data.firstName || '',
      mname: data.mname || data.middleName || '',
      lname: data.lname || data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      mobile: data.mobile || data.phone || '',
      whatsapp_number: data.whatsapp_number || data.whatsappNumber || '',
      nationality: data.nationality || 'UAE',
      address: data.address || data.street || '',
      dob: data.dob || data.dateOfBirth || null,
      gender: data.gender || data.genderIdentity || 'Male',
      id_number: data.id_number || data.idNumber || '',
      id_expiry: data.id_expiry || data.idExpiry || new Date('2025-12-31'),
      id_issue_date: data.id_issue_date || data.idIssueDate || new Date('2015-01-01'),
      // Interest/Source are optional on the Add Lead form — leaving them
      // unselected must store null, not a fake default value.
      country_interest: resolvedCountryInterest,
      sub_country_interest: data.sub_country_interest || 0,
      service_interest: resolvedServiceInterest,
      market_source: resolvedMarketSource,
      sub_market_source: data.sub_market_source || 0,
      appointment: data.appointment || null,
      followup: data.followup || data.prospectFollowUp || new Date(),
      folowuptime: data.folowuptime || data.followupTime || new Date().toTimeString().split(' ')[0],
      followupstat: data.followupstat || 0,
      sf: data.sf || 0,
      enquiry: data.enquiry || data.enquiry || 'New lead enquiry',
      convet: data.convet || 'New',
      priority: data.priority || 'Medium',
      regdate: new Date(),
      regtime: new Date(),
      last_updated: new Date().toLocaleDateString(),
      last_updtd_time: new Date().toTimeString().split(' ')[0],
      stepComplete: data.stepComplete || 1,
      payType: data.payType || null,
      // New leads enter unassigned; a FOE/Branch Manager/CEO assigns them
      // afterward, unless an owner/auto-assignment was explicitly requested above.
      assignTo: assignment?.assignedEmployeeId || null,
      case_officer: data.case_officer || assignment?.assignedEmployeeId || null,
      Counsilor: assignment?.counselorId || null,
      branch: assignment?.branchId || requestedBranchId,
      region: data.region || requestedBranch?.region || 1,
      payTotal: data.payTotal || 0,
      discount: data.discount || 0,
      paidYet: data.paidYet || 0,
      payBalance: data.payBalance || 0,
      feeAgreeDate: data.feeAgreeDate || null,
      demandAmt: data.demandAmt || 0,
      dueDate: data.dueDate || null,
      demdRemark: data.demdRemark || '',
      agreeDate: data.agreeDate || null,
      renDate: data.renDate || null,
      renExpiryDate: data.renExpiryDate || null,
      renew_type: data.renew_type || null,
      status: data.status || 'New',
      status_date: new Date(),
      notf: data.notf || 0,
      type: data.type || 'lead',
      password: data.password || null,
      novat: data.novat || 0,
      i_p: data.i_p || '',
      escalation: data.escalation || 0,
      transfer_date: data.transfer_date || null,
      transfer_time: data.transfer_time || new Date().toTimeString().split(' ')[0],
      transfered: data.transfered || 0,
      transfered_by: data.transfered_by || 1,
      otp_status: data.otp_status || 0,
      otp: data.otp || null,
      otp_date: data.otp_date || null,
      otp_email: data.otp_email || '',
      browser: data.browser || '',
      hostname: data.hostname || '',
      digital_signature: data.digital_signature || '',
      lead_import_by: data.lead_import_by || null,
      lead_import: data.lead_import || 0,
      education: data.education || '',
      profession: data.profession || '',
      exist: data.exist || 0,
      no_of_applicants: data.no_of_applicants || 1,
      advanced: data.advanced || 0,
      do_status: data.do_status || 0,
      arm_status: data.arm_status || 0,
      gm_status: data.gm_status || 0,
      discount_status: data.discount_status || 0,
      discount_remarks: data.discount_remarks || '',
      discount_by: data.discount_by || 1,
      discount_date: data.discount_date || new Date(),
      campaign: data.campaign || '',
      campaign_group: data.campaign_group || '',
      pa_fname: data.pa_fname || '',
      pa_lname: data.pa_lname || '',
      lead_remark: data.lead_remark || data.notes || 'New lead created',
      created: new Date(),
      created_by: data.created_by || 1,
      alert: data.alert || 0,
      area: data.area || data.city || 'Dubai',
      lead_quality: data.lead_quality || data.leadQuality || 'Warm',
      transferred_remark_update: data.transferred_remark_update || 0,
      untouch_transfer: data.untouch_transfer || 0,
      lead_nq_reason: data.lead_nq_reason || '',
      tele_caller_alert: data.tele_caller_alert || 0,
      tele_caller_remark: data.tele_caller_remark || '',
      tele_caller_remark_by: data.tele_caller_remark_by || 1,
      tele_date: data.tele_date || new Date(),
      lead_date: data.lead_date || new Date(),
      duplicate: duplicateCheck.isDuplicate ? 1 : 0,
      duplicate_count: duplicateCheck.duplicateCount,
      ref_remark: data.ref_remark || '',
      na_record: data.na_record || 0,
      old_assgined: data.old_assgined || 0,
      nal_count: data.nal_count || 0,
      campaign_id: data.campaign_id || 0,
      old_branch: data.old_branch || 0,
      opportunity_id: data.opportunity_id || null,
      opportunity_status: data.opportunity_status || null,
      conversion_date: data.conversion_date || null,
      conversion_reason: data.conversion_reason || '',
      lost_reason: data.lost_reason || '',
      competitor: data.competitor || '',
      qualification_score: data.qualification_score || 0,
      budget_range: data.budget_range || '',
      timeline: data.timeline || '',
      decision_maker: data.decision_maker || '',
      decision_maker_title: data.decision_maker_title || '',
      decision_maker_contact: data.decision_maker_contact || '',
      next_followup_date: data.next_followup_date || null,
      opportunity_notes: data.opportunity_notes || '',
      tags: data.tags || ''
    };

    // Insert the lead using raw SQL
    const insertResult = await sequelize.query(`
      INSERT INTO dmc_forum_leads (
        fname, mname, lname, email, phone, mobile, whatsapp_number, nationality, address, dob, gender,
        id_number, id_expiry, id_issue_date, country_interest, sub_country_interest,
        service_interest, market_source, sub_market_source, appointment, followup, folowuptime,
        followupstat, sf, enquiry, convet, priority, regdate, regtime, last_updated, last_updtd_time,
        stepComplete, payType, assignTo, case_officer, Counsilor, branch, region, payTotal,
        discount, paidYet, payBalance, feeAgreeDate, demandAmt, dueDate, demdRemark, agreeDate,
        renDate, renExpiryDate, renew_type, status, status_date, notf, type, password, novat,
        i_p, escalation, transfer_date, transfer_time, transfered, transfered_by, otp_status,
        otp, otp_date, otp_email, browser, hostname, digital_signature, lead_import_by,
        lead_import, education, profession, exist, no_of_applicants, advanced, do_status,
        arm_status, gm_status, discount_status, discount_remarks, discount_by, discount_date,
        campaign, campaign_group, pa_fname, pa_lname, lead_remark, created, created_by, alert,
        area, lead_quality, transferred_remark_update, untouch_transfer, lead_nq_reason,
        tele_caller_alert, tele_caller_remark, tele_caller_remark_by, tele_date, lead_date,
        duplicate, duplicate_count, ref_remark, na_record, old_assgined, nal_count, campaign_id,
        old_branch
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, {
      replacements: [
        leadData.fname, leadData.mname, leadData.lname, leadData.email, leadData.phone, leadData.mobile,
        leadData.whatsapp_number,
        leadData.nationality, leadData.address, leadData.dob, leadData.gender, leadData.id_number,
        leadData.id_expiry, leadData.id_issue_date, leadData.country_interest, leadData.sub_country_interest,
        leadData.service_interest, leadData.market_source, leadData.sub_market_source, leadData.appointment,
        leadData.followup, leadData.folowuptime, leadData.followupstat, leadData.sf, leadData.enquiry, leadData.convet,
        leadData.priority, leadData.regdate, leadData.regtime, leadData.last_updated, leadData.last_updtd_time,
        leadData.stepComplete, leadData.payType, leadData.assignTo, leadData.case_officer, leadData.Counsilor,
        leadData.branch, leadData.region, leadData.payTotal, leadData.discount, leadData.paidYet, leadData.payBalance,
        leadData.feeAgreeDate, leadData.demandAmt, leadData.dueDate, leadData.demdRemark, leadData.agreeDate,
        leadData.renDate, leadData.renExpiryDate, leadData.renew_type, leadData.status, leadData.status_date,
        leadData.notf, leadData.type, leadData.password, leadData.novat, leadData.i_p, leadData.escalation,
        leadData.transfer_date, leadData.transfer_time, leadData.transfered, leadData.transfered_by,
        leadData.otp_status, leadData.otp, leadData.otp_date, leadData.otp_email, leadData.browser,
        leadData.hostname, leadData.digital_signature, leadData.lead_import_by, leadData.lead_import,
        leadData.education, leadData.profession, leadData.exist, leadData.no_of_applicants, leadData.advanced,
        leadData.do_status, leadData.arm_status, leadData.gm_status, leadData.discount_status,
        leadData.discount_remarks, leadData.discount_by, leadData.discount_date, leadData.campaign,
        leadData.campaign_group, leadData.pa_fname, leadData.pa_lname, leadData.lead_remark, leadData.created,
        leadData.created_by, leadData.alert, leadData.area, leadData.lead_quality, leadData.transferred_remark_update,
        leadData.untouch_transfer, leadData.lead_nq_reason, leadData.tele_caller_alert, leadData.tele_caller_remark,
        leadData.tele_caller_remark_by, leadData.tele_date, leadData.lead_date, leadData.duplicate,
        leadData.duplicate_count, leadData.ref_remark, leadData.na_record, leadData.old_assgined,
        leadData.nal_count, leadData.campaign_id, leadData.old_branch
      ],
      type: QueryTypes.INSERT
    });
    const insertId = getInsertId(insertResult);
    if (!insertId) {
      throw new Error('Lead was created but the new lead ID could not be resolved');
    }

    // Get the created lead with relations
    const leadWithRelations = await sequelize.query<any>(`
      SELECT
        l.*, e1.name as assigned_to_name, e2.name as counselor_name, b.branch as branch_name
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
      LEFT JOIN dm_employee e2 ON l.Counsilor = e2.id
      LEFT JOIN dm_branch b ON l.branch = b.id
      WHERE l.id = ?
    `, {
      replacements: [insertId],
      type: QueryTypes.SELECT
    });

    const createdLead = leadWithRelations[0] || { id: insertId }
    return NextResponse.json({ ...createdLead, assignment }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// PUT endpoint for updating leads
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required' }, { status: 401 })
    }

    // Ensure database connection is established
    await ensureDBConnection();

    const { searchParams } = new URL(request.url)
    const pathId = request.url.split('/').pop()
    const queryId = searchParams.get('id')
    const id = pathId || queryId

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()

    // Check if lead exists
    const existingLeads = await sequelize.query('SELECT id FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT
    })

    if (!existingLeads || existingLeads.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Build dynamic update query
    const updateFields: string[] = []
    const updateValues: unknown[] = []

    for (const key of Object.keys(data)) {
      if (data[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`)
        if (key === 'country_interest' || key === 'service_interest' || key === 'market_source') {
          try {
            updateValues.push(await resolveLeadReferenceId(key, data[key]))
          } catch (error) {
            return NextResponse.json(
              { error: error instanceof Error ? error.message : 'Invalid lead reference value' },
              { status: 422 }
            )
          }
        } else if (key === 'branch') {
          const branch = await resolveBranchReference(data[key])
          if (!branch) {
            return NextResponse.json({ error: `No matching branch found for "${String(data[key]).trim()}"` }, { status: 422 })
          }
          updateValues.push(branch.id)
        } else {
          updateValues.push(data[key])
        }
      }
    }

    // Add timestamp updates
    updateFields.push('last_updated = ?')
    updateFields.push('last_updtd_time = ?')
    updateValues.push(new Date().toLocaleDateString())
    updateValues.push(new Date().toTimeString().split(' ')[0])

    // Add the id for the WHERE clause
    updateValues.push(id)

    const updateQuery = `UPDATE dmc_forum_leads SET ${updateFields.join(', ')} WHERE id = ?`

    await sequelize.query(updateQuery, {
      replacements: updateValues,
      type: QueryTypes.UPDATE
    })

    // Get updated lead with relations
    const updatedLeads = await sequelize.query(`
      SELECT
        l.*, e1.name as assigned_to_name, e2.name as counselor_name, b.branch as branch_name
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
      LEFT JOIN dm_employee e2 ON l.Counsilor = e2.id
      LEFT JOIN dm_branch b ON l.branch = b.id
      WHERE l.id = ?
    `, {
      replacements: [id],
      type: QueryTypes.SELECT
    })

    // Format the response to match the expected structure
    const leadData = (updatedLeads as any[])[0]
    const formattedLead = {
      ...leadData,
      dmEmployeeByASSIGNTo: leadData.assigned_to_name ? { id: leadData.assignTo, name: leadData.assigned_to_name } : null,
      dmEmployeeByCoUNSILOR: leadData.counselor_name ? { id: leadData.Counsilor, name: leadData.counselor_name } : null,
      dmBranch: leadData.branch_name ? { id: leadData.branch, name: leadData.branch_name } : null
    }

    return NextResponse.json(formattedLead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE endpoint for deleting leads
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser || !isCeo(currentUser)) {
      return NextResponse.json({ error: 'Only the CEO can delete records' }, { status: 403 });
    }

    // Ensure database connection is established
    await ensureDBConnection();

    const { searchParams } = new URL(request.url)
    const pathId = request.url.split('/').pop()
    const queryId = searchParams.get('id')
    const id = pathId || queryId

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Check if lead exists
    const existingLeadsForDelete = await sequelize.query('SELECT id FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.SELECT
    })

    if (!existingLeadsForDelete || existingLeadsForDelete.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Delete the lead
    await sequelize.query('DELETE FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.DELETE
    })

    return NextResponse.json({ message: 'Lead deleted successfully' })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
