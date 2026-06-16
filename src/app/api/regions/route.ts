import { NextRequest, NextResponse } from 'next/server'
import { DmRegion, DmBranch, DmEmployee } from '@/models'
import { Op } from 'sequelize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ]
    }

    if (status) {
      where.status = parseInt(status)
    }

    const [regions, total] = await Promise.all([
      DmRegion.findAll({
        where,
        offset: skip,
        limit: limit,
        order: [['name', 'ASC']]
      }),
      DmRegion.count({ where })
    ])

    // Add counts to each region
    const regionsWithCounts = await Promise.all(
      regions.map(async (region) => {
        const [branchCount, employeeCount] = await Promise.all([
          DmBranch.count({ where: { region: region.getDataValue('id') } }),
          DmEmployee.count({ where: { region: region.getDataValue('id') } })
        ])

        return {
          ...region.toJSON(),
          branchCount,
          employeeCount
        }
      })
    )

    return NextResponse.json({
      regions: regionsWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching regions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const region = await DmRegion.create({
      ...data,
      status: data.status || 1
    });

    const regionWithRelations = await DmRegion.findByPk(region.id, {
      include: [DmBranch, DmEmployee]
    });

    return NextResponse.json(regionWithRelations, { status: 201 })
  } catch (error) {
    console.error('Error creating region:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
