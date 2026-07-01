import { NextRequest, NextResponse } from 'next/server';
import { sequelize, connectDB } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { verifyToken } from '@/lib/auth';

let dbInitialized = false;
const ensureDB = async () => { if (!dbInitialized) { await connectDB(); dbInitialized = true; } };

export async function PUT(request: NextRequest) {
  try {
    await ensureDB();
    const body = await request.json();
    const { paymentId, status, remarks } = body;

    if (!paymentId || !status) {
      return NextResponse.json({ error: 'paymentId and status are required' }, { status: 400 });
    }

    if (!['verified', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be verified or rejected' }, { status: 400 });
    }

    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;

    // Update payment status
    await sequelize.query(
      `UPDATE dm_opportunity_payments
       SET accountantStatus = :status,
           accountantRemarks = :remarks,
           accountantId = :accountId,
           accountantVerifiedAt = NOW(),
           updatedAt = NOW()
       WHERE id = :paymentId`,
      {
        replacements: { status, remarks: remarks || null, accountId: currentUser?.id || null, paymentId },
        type: QueryTypes.UPDATE,
      }
    );

    let agreementNumber: string | null = null;

    // When payment is verified, auto-generate an agreement number if one doesn't exist yet
    if (status === 'verified') {
      // Find the opportunity linked to this payment
      const [payment] = await sequelize.query<{ opportunityId: number; clientName: string; totalAmount: number; currency: string }>(
        `SELECT p.opportunityId,
                COALESCE(p.clientName, CONCAT(l.fname,' ',COALESCE(l.lname,''))) AS clientName,
                COALESCE(p.totalAmount,0) AS totalAmount,
                COALESCE(p.currency,'AED') AS currency
         FROM dm_opportunity_payments p
         LEFT JOIN dm_opportunities o ON o.id = p.opportunityId
         LEFT JOIN dmc_forum_leads  l ON l.id = o.leadId
         WHERE p.id = :paymentId LIMIT 1`,
        { replacements: { paymentId }, type: QueryTypes.SELECT }
      );

      if (payment?.opportunityId) {
        // Check if an agreement already exists for this opportunity
        const [existing] = await sequelize.query<{ id: number; agreementNumber: string }>(
          `SELECT id, agreementNumber FROM dm_opportunity_agreements WHERE opportunityId = :oppId LIMIT 1`,
          { replacements: { oppId: payment.opportunityId }, type: QueryTypes.SELECT }
        );

        if (existing) {
          agreementNumber = existing.agreementNumber;
        } else {
          // Auto-generate the agreement record
          const ts = Date.now();
          const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
          agreementNumber = `AGR-${ts}-${rand}`;

          await sequelize.query(
            `INSERT INTO dm_opportunity_agreements
               (opportunityId, agreementNumber, agreementType, title, status,
                clientName, totalAmount, currency, startDate, endDate,
                createdBy, uploadedBy, generatedDate, createdAt, updatedAt)
             VALUES
               (:opportunityId, :agreementNumber, 'service_agreement',
                CONCAT('Service Agreement - ', :clientName),
                'generated',
                :clientName, :totalAmount, :currency,
                CURDATE(),
                DATE_ADD(CURDATE(), INTERVAL 1 YEAR),
                :createdBy, :createdBy, NOW(), NOW(), NOW())`,
            {
              replacements: {
                opportunityId: payment.opportunityId,
                agreementNumber,
                clientName: (payment.clientName || '').trim(),
                totalAmount: Number(payment.totalAmount || 0),
                currency: payment.currency || 'AED',
                createdBy: currentUser?.id || 1,
              },
              type: QueryTypes.INSERT,
            }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${status} successfully`,
      agreementNumber,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
