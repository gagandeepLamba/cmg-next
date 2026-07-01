import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await connectDB(); dbReady = true; }
}

/**
 * GET /api/admin/agreements/lookup?agreementNumber=AGR-xxx
 *
 * Returns all data needed to populate the AgreementGenerator form:
 * - Agreement metadata
 * - Lead (client) details: name, nationality, passport, Emirates ID, occupation, email, phone
 * - Opportunity: service name, country name, fee total
 * - Payments: initial payment amount, second payment amount + due date
 */
export async function GET(request: NextRequest) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
  await ensureDB();

  const agreementNumber = (new URL(request.url).searchParams.get('agreementNumber') || '').trim();
  if (!agreementNumber) {
    return NextResponse.json({ error: 'agreementNumber is required' }, { status: 400 });
  }

  // Try numeric ID first, then agreementNumber string
  const isNumeric = /^\d+$/.test(agreementNumber);
  const whereClause = isNumeric
    ? 'a.id = :val'
    : 'a.agreementNumber = :val';

  try { await sequelize.authenticate(); } catch (dbErr: any) {
    return NextResponse.json({ error: 'Database connection failed', detail: dbErr.message }, { status: 500 });
  }

  const [row] = await sequelize.query<{
    id: number;
    agreementNumber: string;
    status: string;
    totalAmount: number;
    currency: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    opportunityId: number;
    leadId: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    fname: string;
    lname: string;
    nationality: string;
    passport_no: string;
    emirates_id: string;
    occupation: string;
    serviceName: string;
    countryName: string;
  }>(
    `SELECT
       a.id,
       a.agreementNumber,
       COALESCE(a.status,'generated')                AS status,
       COALESCE(a.totalAmount, a.amount, 0)          AS totalAmount,
       COALESCE(a.currency,'AED')                    AS currency,
       a.startDate,
       a.endDate,
       a.createdAt,
       a.opportunityId,
       l.id                                           AS leadId,
       COALESCE(a.clientName, CONCAT(l.fname,' ',COALESCE(l.lname,''))) AS clientName,
       COALESCE(a.clientEmail, l.email)               AS clientEmail,
       COALESCE(a.clientPhone, l.mobile, l.phone)     AS clientPhone,
       COALESCE(l.fname,'')                           AS fname,
       COALESCE(l.lname,'')                           AS lname,
       COALESCE(l.nationality,'')                     AS nationality,
       COALESCE(l.id_number,'')                       AS passport_no,
       ''                                             AS emirates_id,
       COALESCE(l.profession,'')                      AS occupation,
       COALESCE(s.name,'')                            AS serviceName,
       COALESCE(c.name,'')                            AS countryName
     FROM dm_opportunity_agreements a
     LEFT JOIN dmc_opportunities     o ON o.id = a.opportunityId
     LEFT JOIN dmc_forum_leads       l ON l.id = o.leadId
     LEFT JOIN dm_service            s ON s.id = l.service_interest
     LEFT JOIN dm_country_proces     c ON c.id = l.country_interest
     WHERE ${whereClause}
     LIMIT 1`,
    { replacements: { val: isNumeric ? Number(agreementNumber) : agreementNumber }, type: QueryTypes.SELECT }
  ).catch((qErr: any) => {
    throw new Error(`Query failed: ${qErr.message}`);
  });

  if (!row) {
    return NextResponse.json({ error: 'Agreement not found. Check the agreement number and try again.' }, { status: 404 });
  }

  // Fetch payments for this opportunity (ordered by paymentDate ASC to get initial vs second)
  const payments = row.opportunityId
    ? await sequelize.query<{
        id: number;
        paidAmount: number;
        totalAmount: number;
        remainingBalance: number;
        dueDate: string;
        paymentDate: string;
        paymentStructure: string;
      }>(
        `SELECT id, paidAmount, totalAmount, remainingBalance, dueDate, paymentDate, paymentStructure
         FROM dm_opportunity_payments
         WHERE opportunityId = :oppId
         ORDER BY paymentDate ASC, id ASC`,
        { replacements: { oppId: row.opportunityId }, type: QueryTypes.SELECT }
      )
    : [];

  // Build payment summary: first payment = initial, second payment from installment or remainder
  let initialPayment = '';
  let secondPayment  = '';
  let secondPaymentDue = '';

  if (payments.length >= 1) {
    initialPayment = String(Number(payments[0].paidAmount || payments[0].totalAmount || 0));
  }
  if (payments.length >= 2) {
    secondPayment    = String(Number(payments[1].paidAmount || payments[1].totalAmount || 0));
    secondPaymentDue = payments[1].dueDate
      ? String(payments[1].dueDate).split('T')[0]
      : (payments[1].paymentDate ? String(payments[1].paymentDate).split('T')[0] : '');
  } else if (payments.length === 1 && Number(payments[0].remainingBalance) > 0) {
    secondPayment    = String(Number(payments[0].remainingBalance));
    secondPaymentDue = payments[0].dueDate ? String(payments[0].dueDate).split('T')[0] : '';
  }

  const totalFee = String(Number(row.totalAmount || 0));
  const agreementDate = row.startDate
    ? String(row.startDate).split('T')[0]
    : String(row.createdAt).split('T')[0];

  return NextResponse.json({
    found: true,
    data: {
      // Agreement details
      agreementNo:        row.agreementNumber,
      date:               agreementDate,
      status:             row.status,
      // Client details
      clientFullName:     (row.clientName || `${row.fname} ${row.lname}`).trim(),
      nationality:        row.nationality,
      passportNo:         row.passport_no,
      emiratesId:         row.emirates_id,
      phone:              row.clientPhone || '',
      email:              row.clientEmail || '',
      occupation:         row.occupation,
      // Service / program
      serviceProgram:     row.serviceName,
      destinationCountry: row.countryName,
      // Fees
      totalRetainerFee:   totalFee,
      initialPayment,
      secondPayment,
      secondPaymentDue,
      // Annexure A (same data, counsellor can refine)
      annexServiceProgram:   row.serviceName,
      annexDestinationCountry: row.countryName,
      annexVisaCategory:     '',
      annexScopeIncludes:    '',
      annexTotalFee:         totalFee,
      annexInitialPayment:   initialPayment,
      annexSecondPayment:    secondPayment,
      annexSecondPaymentDue: secondPaymentDue,
      // Meta
      opportunityId:  row.opportunityId,
      leadId:         row.leadId,
      currency:       row.currency,
    },
  });
  } catch (err: any) {
    console.error('[agreements/lookup] error:', err);
    return NextResponse.json({ error: 'Internal server error', detail: err.message }, { status: 500 });
  }
}
