import { NextRequest, NextResponse } from 'next/server';
import { Op, QueryTypes } from 'sequelize';
import { DmcOpportunityPayments } from '@/models';
import { sequelize } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (isAuthError(auth)) return auth;
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');
    const accountantStatus = searchParams.get('accountantStatus');

    let whereClause: any = {};

    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (accountantStatus) {
      whereClause.accountantStatus = accountantStatus;
    }

    const canViewAllPayments = auth.permissions?.includes('all')
      || auth.permissions?.includes('payments.view')
      || auth.permissions?.includes('finance.view');

    if (!canViewAllPayments) {
      if (!opportunityId) {
        return NextResponse.json({ error: 'You do not have permission to perform this action' }, { status: 403 });
      }

      const [accessRow] = await sequelize.query<{ id: number }>(
        `SELECT o.id
         FROM dmc_opportunities o
         LEFT JOIN dmc_forum_leads l ON l.id = o.leadId
         WHERE o.id = :opportunityId
           AND (o.assignedTo = :userId OR o.createdBy = :userId OR l.assignTo = :userId OR l.Counsilor = :userId)
         LIMIT 1`,
        { replacements: { opportunityId, userId: auth.id }, type: QueryTypes.SELECT },
      );

      if (!accessRow) {
        return NextResponse.json({ error: 'You do not have permission to perform this action' }, { status: 403 });
      }
    }

    const payments = await DmcOpportunityPayments.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcOpportunity',
          attributes: ['id', 'opportunityName', 'estimatedValue', 'currency', 'leadId']
        },
        {
          association: 'createdEmployee',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Attach each payment's opportunity's latest agreement number so printed
    // receipts can reference it (an opportunity's agreement is shared across
    // all of its payments, so one lookup per distinct opportunityId suffices).
    // Read via .get({ plain: true }) rather than direct property access — model
    // classes in this codebase declare `public field!: Type`, which shadows
    // Sequelize's attribute getters and makes direct reads unreliable.
    const plainPayments = payments.map((p) => p.get({ plain: true }) as any);
    const opportunityIds = Array.from(new Set(plainPayments.map((p) => p.opportunityId).filter(Boolean)));
    let agreementByOpportunity: Record<number, string> = {};
    let branchByOpportunity: Record<number, { leadId: number | null; branchName: string | null; branchAddress: string | null; branchEmail: string | null; branchPhone: string | null; branchLicenseNumber: string | null; branchTrn: string | null; branchVatGstPercent: number | string | null; branchBankName: string | null; branchBankAccountName: string | null; branchBankAccountNumber: string | null; branchBankIban: string | null; branchBankBranch: string | null; leadNovat: number | null }> = {};
    if (opportunityIds.length) {
      const [agreementRows, branchRows] = await Promise.all([
        sequelize.query<{ opportunityId: number; agreementNumber: string }>(
        `SELECT a.opportunityId, a.agreementNumber
         FROM dm_opportunity_agreements a
         INNER JOIN (
           SELECT opportunityId, MAX(id) AS latestId
           FROM dm_opportunity_agreements
           WHERE opportunityId IN (:opportunityIds)
           GROUP BY opportunityId
         ) latest ON latest.latestId = a.id
        `,
        { replacements: { opportunityIds }, type: QueryTypes.SELECT },
        ),
        sequelize.query<{ opportunityId: number; leadId: number | null; branchName: string | null; branchAddress: string | null; branchEmail: string | null; branchPhone: string | null; branchLicenseNumber: string | null; branchTrn: string | null; branchVatGstPercent: number | string | null; branchBankName: string | null; branchBankAccountName: string | null; branchBankAccountNumber: string | null; branchBankIban: string | null; branchBankBranch: string | null; leadNovat: number | null }>(
          `SELECT o.id AS opportunityId,
                  l.id AS leadId,
                  b.name AS branchName,
                  b.address AS branchAddress,
                  b.email AS branchEmail,
                  b.mobile AS branchPhone,
                  b.license_number AS branchLicenseNumber,
                  b.trn AS branchTrn,
                  b.vat_gst_percent AS branchVatGstPercent,
                  b.bank_name AS branchBankName,
                  b.bank_account_name AS branchBankAccountName,
                  b.bank_account_number AS branchBankAccountNumber,
                  b.bank_iban AS branchBankIban,
                  b.bank_branch AS branchBankBranch,
                  l.novat AS leadNovat
           FROM dmc_opportunities o
           LEFT JOIN dmc_forum_leads l ON l.id = o.leadId
           LEFT JOIN dm_branch b ON b.id = COALESCE(o.branchId, l.branch)
           WHERE o.id IN (:opportunityIds)`,
          { replacements: { opportunityIds }, type: QueryTypes.SELECT },
        ),
      ]);
      agreementByOpportunity = Object.fromEntries(
        agreementRows.map((row) => [row.opportunityId, row.agreementNumber]),
      );
      branchByOpportunity = Object.fromEntries(
        branchRows.map((row) => [row.opportunityId, {
          leadId: row.leadId,
          branchName: row.branchName,
          branchAddress: row.branchAddress,
          branchEmail: row.branchEmail,
          branchPhone: row.branchPhone,
          branchLicenseNumber: row.branchLicenseNumber,
          branchTrn: row.branchTrn,
          branchVatGstPercent: row.branchVatGstPercent,
          branchBankName: row.branchBankName,
          branchBankAccountName: row.branchBankAccountName,
          branchBankAccountNumber: row.branchBankAccountNumber,
          branchBankIban: row.branchBankIban,
          branchBankBranch: row.branchBankBranch,
          leadNovat: row.leadNovat,
        }]),
      );
    }

    // The Payment stage's "remark" is never stored on dmc_opportunity_payments
    // itself (only on the legacy dm_pay_history ledger, linked by receipt
    // number) — pull it back here so a printed receipt can show it.
    const receiptNumbers = Array.from(new Set(
      plainPayments.map((p) => p.receiptNumber || p.paymentNumber).filter(Boolean)
    ));
    let remarkByReceiptNumber: Record<string, string | null> = {};
    if (receiptNumbers.length) {
      const remarkRows = await sequelize.query<{ counselor_receipt: string; remark: string | null }>(
        `SELECT counselor_receipt, remark
         FROM dm_pay_history
         WHERE counselor_receipt IN (:receiptNumbers) AND remark IS NOT NULL AND remark <> ''`,
        { replacements: { receiptNumbers }, type: QueryTypes.SELECT },
      );
      remarkByReceiptNumber = Object.fromEntries(remarkRows.map((row) => [row.counselor_receipt, row.remark]));
    }

    const paymentsWithAgreement = plainPayments.map((p) => ({
      ...p,
      agreementNumber: agreementByOpportunity[p.opportunityId] || null,
      branchName: p.branchName || branchByOpportunity[p.opportunityId]?.branchName || null,
      branchAddress: p.branchAddress || branchByOpportunity[p.opportunityId]?.branchAddress || null,
      branchEmail: p.branchEmail || branchByOpportunity[p.opportunityId]?.branchEmail || null,
      branchPhone: p.branchPhone || branchByOpportunity[p.opportunityId]?.branchPhone || null,
      branchLicenseNumber: p.branchLicenseNumber || branchByOpportunity[p.opportunityId]?.branchLicenseNumber || null,
      branchTrn: branchByOpportunity[p.opportunityId]?.branchTrn || null,
      branchVatGstPercent: p.branchVatGstPercent ?? branchByOpportunity[p.opportunityId]?.branchVatGstPercent ?? null,
      branchBankName: branchByOpportunity[p.opportunityId]?.branchBankName || null,
      branchBankAccountName: branchByOpportunity[p.opportunityId]?.branchBankAccountName || null,
      branchBankAccountNumber: branchByOpportunity[p.opportunityId]?.branchBankAccountNumber || null,
      branchBankIban: branchByOpportunity[p.opportunityId]?.branchBankIban || null,
      branchBankBranch: branchByOpportunity[p.opportunityId]?.branchBankBranch || null,
      novat: branchByOpportunity[p.opportunityId]?.leadNovat ?? null,
      leadId: branchByOpportunity[p.opportunityId]?.leadId ?? null,
      remark: remarkByReceiptNumber[p.receiptNumber || p.paymentNumber] || null,
    }));

    return NextResponse.json(paymentsWithAgreement);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ['payments.view', 'payments.create', 'finance.view', 'finance.manage']);
  if (isAuthError(auth)) return auth;
  try {
    const body = await request.json();

    const totalAmount = Number(body.totalAmount || body.amount || 0);
    const paidAmount = Number(body.paidAmount || body.amount || 0);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: 'totalAmount must be greater than zero' }, { status: 422 });
    }
    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
      return NextResponse.json({ error: 'paidAmount cannot be negative' }, { status: 422 });
    }

    // Duplicate-submission guard: paymentNumber is minted fresh (Date.now() +
    // random) on every call, so it can never catch a resubmit on its own -
    // block an identical (opportunity, amount) payment created in the last
    // minute instead.
    if (body.opportunityId) {
      const recentDuplicate = await DmcOpportunityPayments.findOne({
        where: {
          opportunityId: body.opportunityId,
          totalAmount,
          paidAmount,
          createdAt: { [Op.gte]: new Date(Date.now() - 60_000) },
        },
      });
      if (recentDuplicate) {
        return NextResponse.json(
          { error: 'A matching payment for this opportunity was already recorded a moment ago.' },
          { status: 409 }
        );
      }
    }

    const paymentData = {
      ...body,
      paymentNumber: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      paymentStructure: body.paymentStructure || 'full',
      paymentType: normalizePaymentType(body.paymentType),
      status: normalizePaymentStatus(body.status),
      totalAmount,
      paidAmount,
      remainingBalance: body.remainingBalance ?? body.balanceAmount ?? Math.max(totalAmount - paidAmount, 0),
      transactionId: body.transactionId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const payment = await DmcOpportunityPayments.create(paymentData);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

function normalizePaymentType(paymentType?: string): 'deposit' | 'installment' | 'final' | 'refund' {
  if (paymentType === 'installment' || paymentType === 'final' || paymentType === 'refund') {
    return paymentType;
  }
  return 'deposit';
}

function normalizePaymentStatus(status?: string): 'pending' | 'paid' | 'failed' | 'refunded' {
  if (status === 'paid' || status === 'failed' || status === 'refunded') {
    return status;
  }
  if (status === 'completed') {
    return 'paid';
  }
  return 'pending';
}
