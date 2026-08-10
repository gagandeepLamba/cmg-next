import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { DmcOpportunities, DmcOpportunityAgreements } from '@/models';
import { sequelize } from '@/lib/sequelize';
import { verifyToken } from '@/lib/auth';
import { isCeo } from '@/lib/roleChecks';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { resolveBranchCurrency } from '@/lib/branchCurrency';
import { formatDocumentNumber } from '@/lib/documentNumbering';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request, ['agreements.view']);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const agreements = await DmcOpportunityAgreements.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcOpportunity',
          attributes: ['id', 'opportunityName', 'estimatedValue', 'currency']
        },
        {
          association: 'createdEmployee',
          attributes: ['id', 'name']
        },
        {
          association: 'uploadedEmployee',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(agreements);
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agreements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request, ['agreements.create']);
    if (isAuthError(auth)) return auth;

    const body = await request.json();
    const opportunity = await DmcOpportunities.findByPk(body.opportunityId);
    if (!opportunity) return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });

    // Duplicate-submission guard: the frontend already checks for an
    // existing agreement before calling this (GET-then-POST), but that's not
    // atomic - block a second agreement for the same opportunity here too.
    const existingAgreement = await DmcOpportunityAgreements.findOne({ where: { opportunityId: body.opportunityId } });
    if (existingAgreement) {
      return NextResponse.json({ error: 'An agreement already exists for this opportunity.', agreementId: existingAgreement.id }, { status: 409 });
    }

    const agreementData = {
      ...body,
      currency: opportunity.currency,
      generatedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const agreement = await DmcOpportunityAgreements.create(agreementData);

    // Override whatever placeholder number the client sent (it can't know its
    // own row id ahead of time) with the real AG/{branch}/{product}/{DDMMYYYY}/{seq}
    // number, e.g. AG/QTR/CAN/15072026/001, now that the id is known.
    const branchCurrency = await resolveBranchCurrency((opportunity as any).branchId);
    const agreementNumber = formatDocumentNumber({
      prefix: 'AG',
      branchName: branchCurrency?.branchName,
      branchAddress: branchCurrency?.branchAddress,
      product: (opportunity as any).serviceType || (opportunity as any).serviceRequired,
      sequenceId: agreement.id,
    });
    await agreement.update({ agreementNumber });

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error('Error creating agreement:', error);
    return NextResponse.json(
      { error: 'Failed to create agreement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request, ['agreements.update', 'agreements.create']);
    if (isAuthError(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'Agreement ID is required' }, { status: 400 });

    const agreement = await DmcOpportunityAgreements.findByPk(id);
    if (!agreement) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    const editableFields = [
      'agreementType', 'agreementTitle', 'title', 'description', 'duration',
      'startDate', 'endDate', 'amount', 'totalAmount', 'terms',
      'termsAndConditions', 'specialConditions', 'companyName', 'companyAddress',
      'status', 'documentUrl', 'clientSignature', 'signatureDate', 'uploadedToCrm',
      // Lets a not-yet-signed agreement's rendered HTML be refreshed (e.g. when
      // branchAgreementProfiles.ts's per-branch legal text is corrected after the
      // agreement was first generated) without touching any other field. Callers
      // must never set this once the agreement is signed/uploaded.
      'content',
    ] as const;
    const updates = Object.fromEntries(
      editableFields
        .filter((field) => body[field] !== undefined)
        .map((field) => [field, body[field]]),
    );

    // A signed-agreement upload sets status to 'uploaded' with a documentUrl —
    // that's the signal to also mark this lead's signed date.
    const isSignedUpload = body.status === 'uploaded' && Boolean(body.documentUrl);
    if (isSignedUpload) {
      updates.uploadedToCrm = true;
      updates.signedDate = body.signatureDate ? new Date(body.signatureDate) : new Date();
    }

    await agreement.update({ ...updates, updatedAt: new Date() });

    // Keep the legacy contract register (dmc_forum_leads_contracts) in sync: once the
    // signed agreement is uploaded, the lead's contract record should flip from
    // unsigned to signed rather than staying stuck at its initial "generated" state.
    // Raw SQL joined off the URL's own `id` param (not the Sequelize instance) —
    // model instances in this codebase use `public field!` class declarations that
    // shadow the ORM's attribute getters, making reads like `agreement.opportunityId`
    // or `.get('leadId')` unreliable straight after findByPk/create.
    if (isSignedUpload) {
      const oppRows = await sequelize.query<{ leadId: number }>(
        `SELECT o.leadId AS leadId
         FROM dm_opportunity_agreements a
         JOIN dmc_opportunities o ON o.id = a.opportunityId
         WHERE a.id = ? LIMIT 1`,
        { replacements: [id], type: QueryTypes.SELECT }
      );
      const leadId = oppRows[0]?.leadId;
      if (leadId) {
        await sequelize.query(
          `UPDATE dmc_forum_leads_contracts
           SET contract = ?, verify = 1, verify_date = ?
           WHERE id = (SELECT id FROM (SELECT id FROM dmc_forum_leads_contracts WHERE leadId = ? ORDER BY id DESC LIMIT 1) t)`,
          { replacements: [body.documentUrl, new Date(), leadId] }
        );
      }
    }

    return NextResponse.json({ success: true, data: agreement });
  } catch (error) {
    console.error('Error updating agreement:', error);
    return NextResponse.json({ error: 'Failed to update agreement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser || !isCeo(currentUser)) {
      return NextResponse.json({ error: 'Only the CEO can delete records' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Agreement ID is required' }, { status: 400 });

    const agreement = await DmcOpportunityAgreements.findByPk(id);
    if (!agreement) return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });

    const opportunityId = agreement.opportunityId;
    await agreement.destroy();
    const latestAgreement = await DmcOpportunityAgreements.findOne({
      where: { opportunityId },
      order: [['createdAt', 'DESC']],
    });

    if (latestAgreement) {
      await DmcOpportunities.update({
        agreementId: latestAgreement.id,
        agreementGenerated: Boolean(latestAgreement.content),
        updatedAt: new Date(),
      }, { where: { id: opportunityId } });
    } else {
      await DmcOpportunities.update(
        { agreementId: null, agreementGenerated: false, updatedAt: new Date() },
        { where: { id: opportunityId } },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agreement:', error);
    return NextResponse.json({ error: 'Failed to delete agreement' }, { status: 500 });
  }
}
