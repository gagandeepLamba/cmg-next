import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { findProductAgreementTemplate } from '@/lib/productAgreementTemplates';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const leadId = searchParams.get('leadId') || '';
    const agreementNumber = searchParams.get('agreementNumber') || '';
    const module = searchParams.get('module') || '';
    const product = searchParams.get('product') || module;
    const status = searchParams.get('status') || '';
    const limit = Math.min(Number.parseInt(searchParams.get('limit') || '50', 10), 100);

    const productTemplate = findProductAgreementTemplate(product);
    const productTerms = productTemplate
      ? [productTemplate.id, productTemplate.name, ...productTemplate.aliases]
      : product
        ? [product]
        : [];

    const where: string[] = [
      "(o.status = 'won' OR o.retentionStatus = 'approved' OR l.status IN ('retained', 'client', 'Converted'))",
    ];
    const replacements: Record<string, unknown> = { limit };

    if (search) {
      where.push(`(
        a.agreementNumber LIKE :search
        OR CAST(l.id AS CHAR) LIKE :search
        OR l.fname LIKE :search
        OR l.lname LIKE :search
        OR l.email LIKE :search
        OR l.mobile LIKE :search
        OR l.phone LIKE :search
        OR o.opportunityName LIKE :search
      )`);
      replacements.search = `%${search}%`;
    }

    if (leadId) {
      where.push('l.id = :leadId');
      replacements.leadId = Number.parseInt(leadId, 10);
    }

    if (agreementNumber) {
      where.push('a.agreementNumber = :agreementNumber');
      replacements.agreementNumber = agreementNumber;
    }

    if (status) {
      where.push('l.status = :status');
      replacements.status = status;
    }

    if (productTerms.length > 0) {
      const productConditions = productTerms.map((term, index) => {
        replacements[`product${index}`] = `%${term}%`;
        return `(
          o.serviceType LIKE :product${index}
          OR o.serviceRequired LIKE :product${index}
          OR o.opportunityName LIKE :product${index}
          OR l.service_interest LIKE :product${index}
          OR a.agreementType LIKE :product${index}
          OR a.title LIKE :product${index}
        )`;
      });
      // A case that has stage data for a program must always appear in that
      // program's list, even when legacy service fields contain numeric IDs.
      const stageCondition = module
        ? ` OR EXISTS (
            SELECT 1 FROM dm_operation_stage_data osd
            WHERE osd.module = :operationsModule
              AND osd.leadId = l.id
              AND (osd.opportunityId = o.id OR osd.opportunityId IS NULL)
          )`
        : '';
      if (module) replacements.operationsModule = module;
      where.push(`(${productConditions.join(' OR ')}${stageCondition})`);
    }

    const rows = await sequelize.query(
      `SELECT
        o.id AS opportunityId,
        o.opportunityNumber,
        o.opportunityName,
        o.serviceType,
        o.serviceRequired,
        o.status AS opportunityStatus,
        o.retentionStatus,
        o.retentionDate,
        o.estimatedValue,
        o.actualValue,
        o.currency,
        l.id AS leadId,
        l.fname,
        l.lname,
        l.email,
        l.mobile,
        l.phone,
        l.nationality,
        l.country_interest,
        l.service_interest,
        l.type AS leadType,
        l.status AS leadStatus,
        l.branch,
        l.Counsilor,
        l.case_officer,
        a.id AS agreementId,
        a.agreementNumber,
        a.agreementType,
        a.title AS agreementTitle,
        a.status AS agreementStatus,
        a.generatedDate,
        p.id AS latestPaymentId,
        p.paymentNumber,
        p.receiptNumber,
        p.paidAmount,
        p.totalAmount,
        p.status AS paymentStatus
      FROM dmc_opportunities o
      INNER JOIN dmc_forum_leads l ON l.id = o.leadId
      LEFT JOIN dm_opportunity_agreements a ON a.id = o.agreementId
        OR a.id = (
          SELECT a2.id
          FROM dm_opportunity_agreements a2
          WHERE a2.opportunityId = o.id
          ORDER BY a2.createdAt DESC
          LIMIT 1
        )
      LEFT JOIN dm_opportunity_payments p ON p.id = (
        SELECT p2.id
        FROM dm_opportunity_payments p2
        WHERE p2.opportunityId = o.id
        ORDER BY p2.createdAt DESC
        LIMIT 1
      )
      WHERE ${where.join(' AND ')}
      ORDER BY COALESCE(o.retentionDate, o.updatedAt, o.createdAt) DESC
      LIMIT :limit`,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({
      success: true,
      product: productTemplate?.id || product || null,
      count: rows.length,
      data: rows,
    });
  } catch (error: any) {
    console.error('Operations search failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search operations clients' },
      { status: 500 }
    );
  }
}
