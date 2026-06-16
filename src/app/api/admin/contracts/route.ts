import { NextRequest, NextResponse } from 'next/server';
import { DmcForumLeadsContracts } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contractIdStr = `contract_${Date.now()}.pdf`;

    const contract = await DmcForumLeadsContracts.create({
      leadId: Number(body.leadId),
      contract: body.contract || contractIdStr,
      unsigned_contract: body.unsigned_contract || `unsigned_${contractIdStr}`,
      new_contract: body.new_contract || null,
      ar_contract: body.ar_contract || `ar_${contractIdStr}`,
      garys: body.garys || null,
      remarks: body.specialTerms || body.remarks || null,
      verify: body.verify ?? 0,
      verify_by: body.verify_by ?? 0,
      verify_date: body.verify_date || null,
      batch_id: body.batch_id ?? 0,
      wp_batch_id: body.wp_batch_id ?? 0,
      vendor_id: body.vendor_id ?? 0,
      employer_id: body.employer_id ?? 0,
      old_crm_ag_id: body.old_crm_ag_id ?? 0,
      payment_status: body.payment_status ?? 0,
    } as any);

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = Number.parseInt(searchParams.get('leadId') || '', 10);
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const { rows, count } = await DmcForumLeadsContracts.findAndCountAll({
      where: { leadId },
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });

    return NextResponse.json({
      contracts: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}
