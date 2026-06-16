import { NextRequest, NextResponse } from 'next/server'
import { DmBranch, DmRegion, DmEmployee } from '@/models'
import { Op } from 'sequelize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const region = searchParams.get('region')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { branch: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } }
      ]
    }

    if (region) {
      where.region = parseInt(region)
    }

    if (status) {
      where.status = parseInt(status)
    }

    const [branches, total] = await Promise.all([
      DmBranch.findAll({
        where,
        offset: skip,
        limit: limit,
        order: [['name', 'ASC']]
      }),
      DmBranch.count({ where })
    ])

    return NextResponse.json({
      branches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const branch = await DmBranch.create({
      ...data,
      status: data.status || 1
    });

    // Reload with associations
    const branchWithRelations = await DmBranch.findByPk(branch.id, {
      include: [
        {
          model: DmRegion,
          as: 'regionInfo',
          attributes: ['id', 'name']
        }
      ]
    });

    return NextResponse.json(branchWithRelations, { status: 201 })
  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
