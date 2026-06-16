import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes, type CreationAttributes } from 'sequelize';
import { DmcForumLeads } from '@/models/DmcForumLeads';
import { sequelize } from '@/lib/sequelize';
import { resolveLeadAutoAssignment } from '@/lib/leadAutoAssignment';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.WEB_TO_LEADS_ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

const json = (body: unknown, init?: ResponseInit) => (
  NextResponse.json(body, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init?.headers || {}),
    },
  })
);

const firstValue = (value: unknown): string => {
  if (Array.isArray(value)) return firstValue(value[0]);
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const readField = (data: Record<string, unknown>, keys: string[], fallback = ''): string => {
  for (const key of keys) {
    const value = firstValue(data[key]);
    if (value) return value;
  }

  return fallback;
};

const readNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number.parseInt(firstValue(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildRemark = (parts: Record<string, string>) => (
  Object.entries(parts)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
);

const authenticate = (request: NextRequest): boolean => {
  const configuredKey = process.env.WEB_TO_LEADS_API_KEY;
  if (!configuredKey) return true;

  const apiKey = request.headers.get('x-api-key');
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return apiKey === configuredKey || bearer === configuredKey;
};

const findBranch = async (branchInput: string) => {
  const numericBranchId = Number.parseInt(branchInput, 10);

  if (Number.isFinite(numericBranchId) && numericBranchId > 0) {
    const rows = await sequelize.query<{ id: number; region: number }>(
      'SELECT id, region FROM dm_branch WHERE id = :branchId AND status = 1 LIMIT 1',
      {
        replacements: { branchId: numericBranchId },
        type: QueryTypes.SELECT,
      }
    );

    if (rows[0]) return rows[0];
  }

  const rows = await sequelize.query<{ id: number; region: number }>(
    `SELECT id, region
     FROM dm_branch
     WHERE status = 1 AND LOWER(name) = LOWER(:branchName)
     LIMIT 1`,
    {
      replacements: { branchName: branchInput || 'Dubai' },
      type: QueryTypes.SELECT,
    }
  );

  return rows[0] || { id: 1, region: 1 };
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return json({
    success: true,
    endpoint: '/api/web-to-leads',
    method: 'POST',
    requiredFields: ['lastName or your-name', 'email or your-email', 'phone or phonetext-718'],
    acceptsSalesforcePayload: true,
    acceptsContactForm7Payload: true,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json() as Record<string, unknown>;

    const fullName = readField(data, ['lastName', 'your-name', 'name', 'fullName']);
    const email = readField(data, ['email', 'your-email']);
    const phone = readField(data, ['phone', 'phonetext-718', 'mobile']);

    if (!fullName || !email || !phone) {
      return json(
        {
          success: false,
          error: 'Missing required lead fields',
          requiredFields: ['lastName or your-name', 'email or your-email', 'phone or phonetext-718'],
        },
        { status: 400 }
      );
    }

    const [fname, ...lastNameParts] = fullName.split(/\s+/);
    const lname = lastNameParts.join(' ') || fullName;
    const ageRange = readField(data, ['AgeRange', 'menu-359']);
    const immigrationType = readField(data, ['ImmigrationType', 'menu-55692']);
    const branchInput = readField(data, ['Branch', 'menu-404'], 'Dubai');
    const residentCountry = readField(data, ['ResidentCountry', 'residentCountry'], 'UAE');
    const utmSource = readField(data, ['UTMSource', 'utm_source'], 'Dubai Website');
    const education = readField(data, ['Education', 'menu-35926']);
    const destinationCountry = readField(data, ['DestinationCountry', 'menu-3065']);
    const leadSource = readField(data, ['LeadSource', 'leadSource'], 'SEO Leads (English)');
    const preferredEmployeeId = readNumber(data.assignTo || data.counsellorId || data.counselorId, 0) || null;
    const branch = await findBranch(branchInput);
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];

    const assignment = await resolveLeadAutoAssignment({
      branchId: branch.id,
      preferredEmployeeId,
      forceAutoAssign: firstValue(data.roundrobin).toLowerCase() === 'true' || !preferredEmployeeId,
      roundRobin: true,
    });
    const assignedBranch = assignment.branchId === branch.id
      ? branch
      : await findBranch(String(assignment.branchId));

    const leadPayload = {
      fname: fname || fullName,
      mname: '',
      lname,
      email,
      phone,
      mobile: phone,
      nationality: residentCountry,
      address: residentCountry,
      dob: null,
      gender: '',
      id_number: '',
      id_expiry: now,
      id_issue_date: now,
      country_interest: destinationCountry,
      sub_country_interest: 0,
      service_interest: immigrationType,
      market_source: leadSource,
      sub_market_source: 0,
      appointment: null,
      followup: now,
      folowuptime: time,
      followupstat: 0,
      enquiry: immigrationType || 'Website lead enquiry',
      convet: 'New',
      priority: 'Medium',
      regdate: now,
      regtime: time,
      last_updated: now.toISOString().slice(0, 10),
      last_updtd_time: time,
      stepComplete: 1,
      payType: null,
      assignTo: assignment.assignedEmployeeId,
      case_officer: assignment.assignedEmployeeId,
      Counsilor: assignment.counselorId,
      branch: assignment.branchId,
      region: assignedBranch.region || 1,
      payTotal: 0,
      discount: 0,
      paidYet: 0,
      payBalance: 0,
      feeAgreeDate: null,
      demandAmt: 0,
      dueDate: null,
      demdRemark: null,
      agreeDate: null,
      renDate: null,
      renExpiryDate: null,
      renew_type: null,
      status: 'New',
      status_date: now,
      notf: 0,
      type: 'lead',
      password: null,
      novat: 0,
      i_p: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
      escalation: null,
      transfer_date: null,
      transfer_time: time,
      transfered: 0,
      transfered_by: 1,
      otp_status: 0,
      otp: null,
      otp_date: null,
      otp_email: null,
      browser: request.headers.get('user-agent') || '',
      hostname: request.headers.get('host') || '',
      digital_signature: null,
      lead_import_by: null,
      lead_import: 0,
      education,
      profession: '',
      exist: 0,
      no_of_applicants: 1,
      advanced: 0,
      do_status: 0,
      arm_status: 0,
      gm_status: 0,
      discount_status: 0,
      discount_remarks: '',
      discount_by: 1,
      discount_date: now,
      campaign: utmSource,
      campaign_group: '',
      pa_fname: '',
      pa_lname: '',
      lead_remark: buildRemark({
        Source: utmSource,
        'Lead Source': leadSource,
        Branch: branchInput,
        'Resident Country': residentCountry,
        'Age Range': ageRange,
        Education: education,
        'Immigration Type': immigrationType,
        Destination: destinationCountry,
      }),
      created: now,
      created_by: 1,
      alert: 0,
      area: branchInput,
      lead_quality: 'Warm',
      transferred_remark_update: 0,
      untouch_transfer: 0,
      lead_nq_reason: '',
      tele_caller_alert: 0,
      tele_caller_remark: '',
      tele_caller_remark_by: 1,
      tele_date: now,
      lead_date: now,
      duplicate: 0,
      duplicate_count: 0,
      ref_remark: '',
      na_record: 0,
      old_assgined: 0,
      nal_count: 0,
      campaign_id: 0,
      old_branch: 0,
    } as unknown as CreationAttributes<DmcForumLeads>;

    const lead = await (DmcForumLeads as any).create(leadPayload);

    return json(
      {
        success: true,
        leadId: lead.id,
        assignedTo: assignment.assignedEmployeeId,
        counselorId: assignment.counselorId,
        branchId: assignment.branchId,
        assignment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating website lead:', error);
    return json(
      {
        success: false,
        error: 'Internal server error',
        message,
      },
      { status: 500 }
    );
  }
}
