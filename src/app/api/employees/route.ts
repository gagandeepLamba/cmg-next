import { NextRequest, NextResponse } from 'next/server'
import { DmEmployee, DmRole, DmBranch, DmRegion } from '@/models'
import { Op } from 'sequelize'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role')
    const branch = searchParams.get('branch')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } }
      ]
    }

    if (role) {
      where.role = parseInt(role)
    }

    if (branch) {
      where.branch = parseInt(branch)
    }

    if (status) {
      where.status = parseInt(status)
    }

    const [employees, total] = await Promise.all([
      DmEmployee.findAll({
        where,
        offset: skip,
        limit: limit,
        order: [['name', 'ASC']]
      }),
      DmEmployee.count({ where })
    ])

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const employee = await DmEmployee.create({
      ...data,
      status: data.status || 1,
      crea: 1, // Should be current user ID
      wfh: data.wfh || 0
    });

    // Reload with associations
    const employeeWithRelations = await DmEmployee.findByPk(employee.id, {
      include: [
        {
          association: 'role',
          attributes: ['id', 'name', 'type']
        },
        {
          association: 'branch',
          attributes: ['id', 'name']
        },
        {
          association: 'region',
          attributes: ['id', 'name']
        }
      ]
    });

    return NextResponse.json(employeeWithRelations, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
