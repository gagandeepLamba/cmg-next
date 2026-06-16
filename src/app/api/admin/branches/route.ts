import { NextRequest, NextResponse } from 'next/server';
import { DmBranch, DmBranchAttributes } from '@/models';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || '';
    const status = searchParams.get('status') || '';

    // Build where clause
    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { ar_name: { [Op.like]: `%${search}%` } },
        { branch: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (region) {
      whereClause.region = parseInt(region);
    }

    if (status !== '') {
      whereClause.status = parseInt(status);
    }

    // Get total count
    const total = await DmBranch.count({ where: whereClause });

    // Get branches with pagination
    const branches = await DmBranch.findAll({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']]
    });

    return NextResponse.json({
      data: branches.map(branch => branch.get({ plain: true })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newBranch = await DmBranch.create({
      ...body,
      status: 1,
    });

    return NextResponse.json(newBranch.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Failed to create branch' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const branch = await DmBranch.findByPk(id);
    
    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    await branch.update(updateData);

    return NextResponse.json(branch.get({ plain: true }));
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    const branch = await DmBranch.findByPk(id);
    
    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    await branch.destroy();

    return NextResponse.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 }
    );
  }
}
