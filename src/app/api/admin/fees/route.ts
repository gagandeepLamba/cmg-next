import { NextRequest, NextResponse } from 'next/server';
import { DmFee } from '@/models/DmFee';
import type { DmFeeAttributes } from '@/models/DmFee';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const service = searchParams.get('service') || '';
    const country = searchParams.get('country') || '';
    const branch = searchParams.get('branch') || '';

    // Build where clause
    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { id: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status !== '') {
      whereClause.status = parseInt(status);
    }

    if (service !== '') {
      whereClause.service = parseInt(service);
    }

    if (country !== '') {
      whereClause.country = parseInt(country);
    }

    if (branch !== '') {
      whereClause.branch = parseInt(branch);
    }

    // Get total count
    const total = await DmFee.count({ where: whereClause });

    // Get fees with pagination
    const fees = await DmFee.findAll({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']]
    });

    return NextResponse.json({
      data: fees.map(fee => fee.get({ plain: true })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching fees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newFee = await DmFee.create({
      ...body,
      status: 1,
    });

    return NextResponse.json(newFee.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating fee:', error);
    return NextResponse.json(
      { error: 'Failed to create fee' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const fee = await DmFee.findByPk(id);
    
    if (!fee) {
      return NextResponse.json(
        { error: 'Fee not found' },
        { status: 404 }
      );
    }

    await fee.update(updateData);

    return NextResponse.json(fee.get({ plain: true }));
  } catch (error) {
    console.error('Error updating fee:', error);
    return NextResponse.json(
      { error: 'Failed to update fee' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    const fee = await DmFee.findByPk(id);
    
    if (!fee) {
      return NextResponse.json(
        { error: 'Fee not found' },
        { status: 404 }
      );
    }

    await fee.destroy();

    return NextResponse.json({ message: 'Fee deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee:', error);
    return NextResponse.json(
      { error: 'Failed to delete fee' },
      { status: 500 }
    );
  }
}
