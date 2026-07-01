import { NextRequest, NextResponse } from 'next/server';
import { DmRegion } from '@/models/DmRegion';
import type { DmRegionAttributes } from '@/models/DmRegion';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Build where clause
    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status !== '') {
      whereClause.status = parseInt(status);
    }

    // Get total count
    const total = await DmRegion.count({ where: whereClause });

    // Get regions with pagination
    const regions = await DmRegion.findAll({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']]
    });

    return NextResponse.json({
      data: regions.map(region => region.get({ plain: true })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newRegion = await DmRegion.create({
      ...body,
      status: 1,
    });

    return NextResponse.json(newRegion.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating region:', error);
    return NextResponse.json(
      { error: 'Failed to create region' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const region = await DmRegion.findByPk(id);
    
    if (!region) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    await region.update(updateData);

    return NextResponse.json(region.get({ plain: true }));
  } catch (error) {
    console.error('Error updating region:', error);
    return NextResponse.json(
      { error: 'Failed to update region' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    const region = await DmRegion.findByPk(id);
    
    if (!region) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    await region.destroy();

    return NextResponse.json({ message: 'Region deleted successfully' });
  } catch (error) {
    console.error('Error deleting region:', error);
    return NextResponse.json(
      { error: 'Failed to delete region' },
      { status: 500 }
    );
  }
}
