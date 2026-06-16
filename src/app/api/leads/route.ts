import { NextRequest, NextResponse } from 'next/server'
import { sequelize, connectDB } from '@/lib/sequelize'
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment'
import { QueryTypes } from 'sequelize'
import * as XLSX from 'xlsx'

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

    const offset = (page - 1) * limit

    // Build WHERE conditions
    let whereConditions = []
    let replacements: any[] = []

    if (search) {
      whereConditions.push(`(l.fname LIKE ? OR l.lname LIKE ? OR l.email LIKE ? OR l.phone LIKE ? OR l.mobile LIKE ? OR l.id_number LIKE ?)`)
      const searchTerm = `%${search}%`
      replacements.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
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

    if (opportunityView === 'opportunities') {
      whereConditions.push(`((l.opportunity_id IS NOT NULL AND l.opportunity_id <> 0) OR EXISTS (SELECT 1 FROM dmc_opportunities o WHERE o.leadId = l.id))`)
    } else {
      whereConditions.push(`((l.opportunity_id IS NULL OR l.opportunity_id = 0) AND NOT EXISTS (SELECT 1 FROM dmc_opportunities o WHERE o.leadId = l.id))`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // If export is requested, return all data without pagination
    if (exportType === 'excel') {
      const leads = await sequelize.query<any>(`
        SELECT 
          l.id, l.fname, l.mname, l.lname, l.email, l.phone, l.mobile, l.nationality,
          l.address, l.dob, l.gender, l.id_number, l.id_expiry, l.country_interest,
          l.service_interest, l.market_source, l.priority, l.status, l.lead_quality,
          l.regdate, l.payTotal, l.paidYet, l.payBalance, l.lead_remark, l.created,
          l.assignTo, l.branch, l.region,
          l.opportunity_id, l.opportunity_status,
          COALESCE(l.opportunity_id, (SELECT MAX(o.id) FROM dmc_opportunities o WHERE o.leadId = l.id)) as resolved_opportunity_id,
          e1.name as assigned_to_name, b.name as branch_name
        FROM dmc_forum_leads l
        LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
        LEFT JOIN dm_branch b ON l.branch = b.id
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
        'Country Interest': lead.country_interest,
        'Service Interest': lead.service_interest,
        'Market Source': lead.market_source,
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
    const leads = await sequelize.query<any>(`
      SELECT 
        l.id, l.fname, l.mname, l.lname, l.email, l.phone, l.mobile, l.nationality,
        l.address, l.dob, l.gender, l.id_number, l.id_expiry, l.country_interest,
        l.service_interest, l.market_source, l.priority, l.status, l.lead_quality,
        l.regdate, l.payTotal, l.paidYet, l.payBalance, l.lead_remark, l.created,
        l.assignTo, l.branch, l.region,
        l.opportunity_id, l.opportunity_status,
        COALESCE(l.opportunity_id, (SELECT MAX(o.id) FROM dmc_opportunities o WHERE o.leadId = l.id)) as resolved_opportunity_id,
        e1.name as assigned_to_name, b.name as branch_name
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
      LEFT JOIN dm_branch b ON l.branch = b.id
      ${whereClause}
      ORDER BY l.created DESC
      LIMIT ? OFFSET ?
    `, {
      replacements: [...replacements, limit, offset],
      type: QueryTypes.SELECT
    })

    const finalLeads = Array.isArray(leads) ? leads : [];

    // Format the response to match the expected structure
    const formattedLeads = (Array.isArray(finalLeads) ? finalLeads : []).map((lead: any) => ({
      ...lead,
      dmEmployeeByASSIGNTo: lead.assigned_to_name ? { id: lead.assignTo, name: lead.assigned_to_name } : null,
      dmBranch: lead.branch_name ? { id: lead.branch, name: lead.branch_name } : null
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
    
    const data = await request.json()

    // Check if this is an Excel import
    if (data.importType === 'excel' && data.fileData) {
      try {
        const workbook = XLSX.read(data.fileData, { type: 'base64' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const createdLeads = []
        const errors = []

        for (const [index, row] of jsonData.entries()) {
          try {
            const typedRow = row as Record<string, any>
            const leadData = {
              fname: typedRow['First Name'] || typedRow['fname'] || '',
              mname: typedRow['Middle Name'] || typedRow['mname'] || '',
              lname: typedRow['Last Name'] || typedRow['lname'] || '',
              email: typedRow['Email'] || typedRow['email'] || '',
              phone: typedRow['Phone'] || typedRow['phone'] || '',
              mobile: typedRow['Mobile'] || typedRow['mobile'] || '',
              nationality: typedRow['Nationality'] || typedRow['nationality'] || '',
              address: typedRow['Address'] || typedRow['address'] || '',
              dob: typedRow['Date of Birth'] || typedRow['dob'] ? new Date(typedRow['Date of Birth'] || typedRow['dob']) : null,
              gender: typedRow['Gender'] || typedRow['gender'] || 'Male',
              id_number: typedRow['ID Number'] || typedRow['id_number'] || '',
              id_expiry: typedRow['ID Expiry'] || typedRow['id_expiry'] ? new Date(typedRow['ID Expiry'] || typedRow['id_expiry']) : new Date(),
              id_issue_date: new Date(),
              country_interest: typedRow['Country Interest'] || typedRow['country_interest'] || '',
              sub_country_interest: 0,
              service_interest: typedRow['Service Interest'] || typedRow['service_interest'] || '',
              market_source: typedRow['Market Source'] || typedRow['market_source'] || '',
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
              stepComplete: 1,
              assignTo: data.assignTo || 1,
              case_officer: data.case_officer || 1,
              Counsilor: data.Counsilor || 1,
              branch: data.branch || 1,
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
              duplicate: 0,
              duplicate_count: 0,
              ref_remark: '',
              na_record: 0,
              old_assgined: 0,
              nal_count: 0,
              campaign_id: 0,
              old_branch: 0,
              status_date: new Date()
            }

            const [, metadata] = await sequelize.query(`
              INSERT INTO dmc_forum_leads (
                fname, mname, lname, email, phone, mobile, nationality, address, dob, gender,
                id_number, id_expiry, id_issue_date, country_interest, sub_country_interest,
                service_interest, market_source, sub_market_source, priority, status, lead_quality,
                enquiry, convet, regdate, regtime, last_updated, last_updtd_time, stepComplete,
                assignTo, case_officer, Counsilor, branch, region, payTotal, discount, paidYet,
                payBalance, demandAmt, notf, type, transfered_by, transfer_time, exist,
                no_of_applicants, advanced, do_status, arm_status, gm_status, discount_status,
                discount_remarks, discount_by, discount_date, campaign, campaign_group,
                pa_fname, pa_lname, lead_remark, created, created_by, alert, area,
                transferred_remark_update, untouch_transfer, lead_nq_reason, tele_caller_alert,
                tele_caller_remark, tele_caller_remark_by, tele_date, lead_date, duplicate,
                duplicate_count, ref_remark, na_record, old_assgined, nal_count, campaign_id,
                old_branch, status_date
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, {
              replacements: [
                leadData.fname, leadData.mname, leadData.lname, leadData.email, leadData.phone, leadData.mobile,
                leadData.nationality, leadData.address, leadData.dob, leadData.gender, leadData.id_number,
                leadData.id_expiry, leadData.id_issue_date, leadData.country_interest, leadData.sub_country_interest,
                leadData.service_interest, leadData.market_source, leadData.sub_market_source, leadData.priority,
                leadData.status, leadData.lead_quality, leadData.enquiry, leadData.convet, leadData.regdate,
                leadData.regtime, leadData.last_updated, leadData.last_updtd_time, leadData.stepComplete,
                leadData.assignTo, leadData.case_officer, leadData.Counsilor, leadData.branch, leadData.region,
                leadData.payTotal, leadData.discount, leadData.paidYet, leadData.payBalance, leadData.demandAmt,
                leadData.notf, leadData.type, leadData.transfered_by, leadData.transfer_time, leadData.exist,
                leadData.no_of_applicants, leadData.advanced, leadData.do_status, leadData.arm_status,
                leadData.gm_status, leadData.discount_status, leadData.discount_remarks, leadData.discount_by,
                leadData.discount_date, leadData.campaign, leadData.campaign_group, leadData.pa_fname,
                leadData.pa_lname, leadData.lead_remark, leadData.created, leadData.created_by, leadData.alert,
                leadData.area, leadData.transferred_remark_update, leadData.untouch_transfer, leadData.lead_nq_reason,
                leadData.tele_caller_alert, leadData.tele_caller_remark, leadData.tele_caller_remark_by,
                leadData.tele_date, leadData.lead_date, leadData.duplicate, leadData.duplicate_count,
                leadData.ref_remark, leadData.na_record, leadData.old_assgined, leadData.nal_count,
                leadData.campaign_id, leadData.old_branch, leadData.status_date
              ],
              type: QueryTypes.INSERT
            })

            createdLeads.push({ id: (metadata as any).insertId, ...leadData })
          } catch (error) {
            errors.push({ row: index + 1, error: (error as Error).message })
          }
        }

        return NextResponse.json({
          message: `Import completed. ${createdLeads.length} leads created, ${errors.length} errors.`,
          createdLeads,
          errors
        })
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid Excel file format' },
          { status: 400 }
        )
      }
    }

    const requestedBranchId = Number.parseInt(String(data.branch || data.branchId || 1), 10) || 1
    const requestedOwnerId = Number.parseInt(String(data.assignTo || data.leadOwner || 0), 10) || null
    const assignment = await resolveLeadAutoAssignment({
      branchId: requestedBranchId,
      preferredEmployeeId: requestedOwnerId,
      forceAutoAssign: Boolean(data.autoAssign || data.roundrobin || !requestedOwnerId),
      roundRobin: true,
    })

    // Regular lead creation - provide defaults for all required fields
    const leadData = {
      // User-provided data
      fname: data.fname || data.firstName || '',
      mname: data.mname || data.middleName || '',
      lname: data.lname || data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      mobile: data.mobile || data.whatsappNumber || data.phone || '',
      nationality: data.nationality || 'UAE',
      address: data.address || data.street || '',
      dob: data.dob || data.dateOfBirth || null,
      gender: data.gender || data.genderIdentity || 'Male',
      id_number: data.id_number || data.idNumber || '',
      id_expiry: data.id_expiry || data.idExpiry || new Date('2025-12-31'),
      id_issue_date: data.id_issue_date || data.idIssueDate || new Date('2015-01-01'),
      country_interest: data.country_interest || data.countryInterest || data.programCountry || data.country || 'Canada',
      sub_country_interest: data.sub_country_interest || 0,
      service_interest: data.service_interest || data.serviceInterest || data.programType || data.program || 'Student Visa',
      market_source: data.market_source || data.leadSource || 'Website',
      sub_market_source: data.sub_market_source || 0,
      appointment: data.appointment || null,
      followup: data.followup || data.prospectFollowUp || new Date(),
      folowuptime: data.folowuptime || data.followupTime || new Date().toTimeString().split(' ')[0],
      followupstat: data.followupstat || 0,
      enquiry: data.enquiry || data.enquiry || 'New lead enquiry',
      convet: data.convet || 'New',
      priority: data.priority || 'Medium',
      regdate: new Date(),
      regtime: new Date(),
      last_updated: new Date().toLocaleDateString(),
      last_updtd_time: new Date().toTimeString().split(' ')[0],
      stepComplete: data.stepComplete || 1,
      payType: data.payType || null,
      assignTo: assignment.assignedEmployeeId,
      case_officer: data.case_officer || 1,
      Counsilor: assignment.counselorId,
      branch: assignment.branchId,
      region: data.region || 1,
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
      duplicate: data.duplicate || 0,
      duplicate_count: data.duplicate_count || 0,
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
    const [insertId] = await sequelize.query(`
      INSERT INTO dmc_forum_leads (
        fname, mname, lname, email, phone, mobile, nationality, address, dob, gender,
        id_number, id_expiry, id_issue_date, country_interest, sub_country_interest,
        service_interest, market_source, sub_market_source, appointment, followup, folowuptime,
        followupstat, enquiry, convet, priority, regdate, regtime, last_updated, last_updtd_time,
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
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `, {
      replacements: [
        leadData.fname, leadData.mname, leadData.lname, leadData.email, leadData.phone, leadData.mobile,
        leadData.nationality, leadData.address, leadData.dob, leadData.gender, leadData.id_number,
        leadData.id_expiry, leadData.id_issue_date, leadData.country_interest, leadData.sub_country_interest,
        leadData.service_interest, leadData.market_source, leadData.sub_market_source, leadData.appointment,
        leadData.followup, leadData.folowuptime, leadData.followupstat, leadData.enquiry, leadData.convet,
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

    // Get the created lead with relations
    const [leadWithRelations] = await sequelize.query(`
      SELECT 
        l.*, e1.name as assigned_to_name, e2.name as counselor_name, b.name as branch_name
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
      LEFT JOIN dm_employee e2 ON l.Counsilor = e2.id
      LEFT JOIN dm_branch b ON l.branch = b.id
      WHERE l.id = ?
    `, {
      replacements: [insertId],
      type: QueryTypes.SELECT
    });

    const createdLead = (leadWithRelations as any[])[0] || { id: insertId }
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
    const [existingLead] = await sequelize.query('SELECT id FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: 'SELECT'
    })

    if (!existingLead || existingLead.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Build dynamic update query
    const updateFields = []
    const updateValues = []

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`)
        updateValues.push(data[key])
      }
    })

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
      type: 'UPDATE'
    })

    // Get updated lead with relations
    const [updatedLead] = await sequelize.query(`
      SELECT 
        l.*, e1.name as assigned_to_name, e2.name as counselor_name, b.name as branch_name
      FROM dmc_forum_leads l
      LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
      LEFT JOIN dm_employee e2 ON l.Counsilor = e2.id
      LEFT JOIN dm_branch b ON l.branch = b.id
      WHERE l.id = ?
    `, {
      replacements: [id],
      type: 'SELECT'
    })

    // Format the response to match the expected structure
    const leadData = updatedLead[0] as any
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
    const [existingLead] = await sequelize.query('SELECT id FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: 'SELECT'
    })

    if (!existingLead || existingLead.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Delete the lead
    await sequelize.query('DELETE FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: 'DELETE'
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
