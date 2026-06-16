import { NextRequest, NextResponse } from 'next/server';
import { DmCountriesTypeProgram } from '@/models/DmCountriesTypeProgram';
import { DmService } from '@/models/DmService';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('countryId');

    if (!countryId) {
      return NextResponse.json(
        { error: 'Country ID is required' },
        { status: 400 }
      );
    }

    const countryPrograms = await DmCountriesTypeProgram.findAll({
      where: {
        country: parseInt(countryId)
      },
      raw:true
    });

    const programIds = countryPrograms.map(cp => cp.program);

    if (programIds.length === 0) {
      return NextResponse.json([]);
    }

    const programs = await DmService.findAll({
      where: {
        id: { [Op.in]: programIds },
        status: 1
      },
      order: [['name', 'ASC']]
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching country programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country programs' },
      { status: 500 }
    );
  }
}
