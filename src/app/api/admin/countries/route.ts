import { NextRequest, NextResponse } from 'next/server';
import { DmCountryProces } from '@/models/DmCountryProces';
import type { DmCountryProcesAttributes } from '@/models/DmCountryProces';
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
    const total = await DmCountryProces.count({ where: whereClause });

    // Get countries with pagination
    const countries = await DmCountryProces.findAll({
      where: whereClause,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']]
    });

    return NextResponse.json({
      data: countries.map(country => country.get({ plain: true })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCountry = await DmCountryProces.create({
      ...body,
      status: 1,
    });

    return NextResponse.json(newCountry.get({ plain: true }), { status: 201 });
  } catch (error) {
    console.error('Error creating country:', error);
    return NextResponse.json(
      { error: 'Failed to create country' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const country = await DmCountryProces.findByPk(id);
    
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    await country.update(updateData);

    return NextResponse.json(country.get({ plain: true }));
  } catch (error) {
    console.error('Error updating country:', error);
    return NextResponse.json(
      { error: 'Failed to update country' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    const country = await DmCountryProces.findByPk(id);
    
    if (!country) {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      );
    }

    await country.destroy();

    return NextResponse.json({ message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Error deleting country:', error);
    return NextResponse.json(
      { error: 'Failed to delete country' },
      { status: 500 }
    );
  }
}
