import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';

let dbInitialized = false;

const ensureDBConnection = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

const editableFields = new Set([
  'fname',
  'mname',
  'lname',
  'email',
  'phone',
  'mobile',
  'nationality',
  'address',
  'dob',
  'gender',
  'country_interest',
  'service_interest',
  'market_source',
  'appointment',
  'followup',
  'folowuptime',
  'followupstat',
  'priority',
  'status',
  'assignTo',
  'branch',
  'region',
  'payTotal',
  'discount',
  'paidYet',
  'payBalance',
  'lead_remark',
  'lead_quality',
  'area'
]);

const aliases: Record<string, string> = {
  firstName: 'fname',
  middleName: 'mname',
  lastName: 'lname',
  whatsappNumber: 'mobile',
  street: 'address',
  dateOfBirth: 'dob',
  genderIdentity: 'gender',
  countryInterest: 'country_interest',
  serviceInterest: 'service_interest',
  programCountry: 'country_interest',
  program: 'service_interest',
  programType: 'service_interest',
  leadSource: 'market_source',
  leadOwner: 'assignTo',
  notes: 'lead_remark',
  leadQuality: 'lead_quality',
  city: 'area'
};

function validateLeadUpdate(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  const hasIdentityFields = 'firstName' in data || 'fname' in data || 'lastName' in data || 'lname' in data ||
    'email' in data || 'phone' in data || 'gender' in data || 'genderIdentity' in data;

  if (hasIdentityFields) {
    const namePattern = /^[\p{L}][\p{L}\s.'-]*$/u;
    const firstName = String(data.firstName ?? data.fname ?? '').trim();
    const lastName = String(data.lastName ?? data.lname ?? '').trim();
    const email = String(data.email ?? '').trim();
    const phone = String(data.phone ?? '').replace(/\D/g, '');
    const gender = String(data.genderIdentity ?? data.gender ?? '').trim();
    const country = String(data.programCountry ?? data.country_interest ?? '').trim();
    const program = String(data.program ?? data.service_interest ?? '').trim();
    const programType = String(data.programType ?? '').trim();

    if (!namePattern.test(firstName)) errors.push('Enter a valid first name.');
    if (!namePattern.test(lastName)) errors.push('Enter a valid last name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email address.');
    if (phone.length < 7 || phone.length > 15) errors.push('Enter a valid phone number with 7 to 15 digits.');
    if (!gender || gender === '--None--') errors.push('Select a gender identity.');
    if (!country || country === '--None--') errors.push('Select a program country.');
    if (!program) errors.push('Select a program.');
    if (!programType) errors.push('Select a program type.');

    if (data.dateOfBirth ?? data.dob) {
      const dob = new Date(String(data.dateOfBirth ?? data.dob));
      if (Number.isNaN(dob.getTime()) || dob > new Date()) errors.push('Date of birth must be a valid past date.');
    }
  }

  return errors;
}

const fetchLead = async (id: string) => {
  const rows = await sequelize.query(`
    SELECT
      l.*,
      e1.name as assigned_to_name,
      e2.name as counselor_name,
      b.name as branch_name,
      b.address as branch_address,
      b.email as branch_email,
      b.mobile as branch_mobile,
      COALESCE(s.name, pt.type, l.service_interest) as service_interest_label,
      COALESCE(cp.name, l.country_interest) as country_interest_label
    FROM dmc_forum_leads l
    LEFT JOIN dm_employee e1 ON l.assignTo = e1.id
    LEFT JOIN dm_employee e2 ON l.Counsilor = e2.id
    LEFT JOIN dm_branch b ON l.branch = b.id
    LEFT JOIN dm_service s ON s.id = CAST(l.service_interest AS UNSIGNED)
    LEFT JOIN dm_program_type pt ON pt.id = CAST(l.service_interest AS UNSIGNED)
    LEFT JOIN dm_country_proces cp ON cp.id = CAST(l.country_interest AS UNSIGNED)
    WHERE l.id = ?
    LIMIT 1
  `, {
    replacements: [id],
    type: QueryTypes.SELECT
  });

  const lead = rows[0] as Record<string, unknown> | undefined;
  if (!lead) return null;

  return {
    ...lead,
    dmEmployeeByASSIGNTo: lead.assigned_to_name ? { id: lead.assignTo, name: lead.assigned_to_name } : null,
    dmEmployeeByCoUNSILOR: lead.counselor_name ? { id: lead.Counsilor, name: lead.counselor_name } : null,
    dmBranch: lead.branch_name ? {
      id: lead.branch,
      name: lead.branch_name,
      address: lead.branch_address,
      email: lead.branch_email,
      mobile: lead.branch_mobile
    } : null
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDBConnection();
    const { id } = await params;
    const lead = await fetchLead(id);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDBConnection();
    const { id } = await params;
    const data = await request.json();

    const validationErrors = validateLeadUpdate(data);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: 'Lead validation failed', errors: validationErrors }, { status: 422 });
    }

    const existingLead = await fetchLead(id);
    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updateFields: string[] = [];
    const updateValues: unknown[] = [];

    Object.entries(data).forEach(([rawKey, value]) => {
      const key = aliases[rawKey] || rawKey;
      if (key === 'id' || !editableFields.has(key) || value === undefined) return;
      updateFields.push(`${key} = ?`);
      updateValues.push(value === '' ? null : value);
    });

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No editable lead fields provided' }, { status: 400 });
    }

    updateFields.push('last_updated = ?', 'last_updtd_time = ?');
    updateValues.push(new Date().toLocaleDateString(), new Date().toTimeString().split(' ')[0], id);

    await sequelize.query(`
      UPDATE dmc_forum_leads
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, {
      replacements: updateValues,
      type: QueryTypes.UPDATE
    });

    const updatedLead = await fetchLead(id);
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDBConnection();
    const { id } = await params;

    const existingLead = await fetchLead(id);
    if (!existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await sequelize.query('DELETE FROM dmc_forum_leads WHERE id = ?', {
      replacements: [id],
      type: QueryTypes.DELETE
    });

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
