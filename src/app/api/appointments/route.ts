import { NextRequest, NextResponse } from 'next/server'
import { Appointments } from '@/models'
import { sequelize } from '@/lib/sequelize'
import { QueryTypes } from 'sequelize'
import { logLeadRemark } from '@/lib/leadRemarks'
import { verifyToken } from '@/lib/auth'
import { isCeo, isBranchManagerOrCeo, isFoe } from '@/lib/roleChecks'
import { notifyUser } from '@/lib/notify'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    const currentUser = token ? verifyToken(token) : null
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required to view appointments' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const counselorId = searchParams.get('counselorId')
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const conditions: string[] = []
    const replacements: Record<string, unknown> = { limit, skip }

    // Visibility: counselors see only their own appointments, Branch Manager
    // and FOE see their whole branch (FOE needs this to find meetings a
    // counselor marked done and verify them), CEO sees everything. Enforced
    // server-side so it can't be bypassed by omitting/changing the
    // counselorId query param.
    if (isCeo(currentUser)) {
      // no restriction
    } else if (isBranchManagerOrCeo(currentUser) || isFoe(currentUser)) {
      // Also surface appointments cross-branch-assigned *to* this branch
      // (assigned_branch), not just ones that originated here (branch) - the
      // receiving branch manager/FOE needs to see and help track those too.
      conditions.push('(a.branch = :userBranch OR (a.cross_branch = 1 AND a.assigned_branch = :userBranch))')
      replacements.userBranch = Number(currentUser.branch || 0)
    } else {
      conditions.push('a.counsilorid = :currentUserId')
      replacements.currentUserId = Number(currentUser.id)
    }

    if (counselorId) {
      conditions.push('a.counsilorid = :counselorId')
      replacements.counselorId = Number(counselorId)
    }

    if (date) {
      conditions.push('a.date = :date')
      replacements.date = date
    }

    if (status) {
      const statusCondition = getAppointmentStatusCondition(status)
      if (statusCondition) {
        conditions.push(statusCondition)
      }
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const appointments = await sequelize.query(`
      SELECT
        a.id,
        a.leadid,
        a.date,
        a.appointtime,
        a.counsilorid,
        a.booked,
        a.done,
        a.not_done,
        a.region,
        a.branch,
        a.screenshot,
        a.meeting_status,
        a.meeting_verified,
        a.verified_by,
        a.verified_at,
        a.foe_remark,
        a.cross_branch,
        a.assigned_branch,
        a.assigned_by,
        a.acknowledged,
        a.acknowledged_at,
        l.fname,
        l.lname,
        l.email AS leadEmail,
        l.phone AS leadPhone,
        l.mobile AS leadMobile,
        e.name AS counselorName,
        b.branch AS branchName,
        r.name AS regionName,
        v.name AS verifiedByName,
        ab.branch AS assignedBranchName,
        assigner.name AS assignedByName
      FROM appointments a
      LEFT JOIN dmc_forum_leads l ON l.id = a.leadid
      LEFT JOIN dm_employee e ON e.id = a.counsilorid
      LEFT JOIN dm_branch b ON b.id = a.branch
      LEFT JOIN dm_region r ON r.id = a.region
      LEFT JOIN dm_employee v ON v.id = a.verified_by
      LEFT JOIN dm_branch ab ON ab.id = a.assigned_branch
      LEFT JOIN dm_employee assigner ON assigner.id = a.assigned_by
      ${whereSql}
      ORDER BY a.date DESC, a.appointtime ASC
      LIMIT :limit OFFSET :skip
    `, { replacements, type: QueryTypes.SELECT })

    const countRows = await sequelize.query<{ total: number }>(`
      SELECT COUNT(*) AS total
      FROM appointments a
      ${whereSql}
    `, { replacements, type: QueryTypes.SELECT })
    const total = Number(countRows[0]?.total || 0)

    return NextResponse.json({
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    const currentUser = token ? verifyToken(token) : null
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required to book an appointment' }, { status: 401 })
    }

    const data = await request.json()
    const leadId = normalizeNumber(data.leadid ?? data.leadId)
    const counselorId = normalizeNumber(data.counsilorid ?? data.counselorId ?? data.employeeId)
    const appointmentDate = data.date || new Date().toISOString().split('T')[0]
    const appointmentTime = normalizeTime(data.appointtime || data.time || '09:00')

    // Two clients booking the same counselor at the same date/time otherwise
    // succeed silently, producing a double-booking with nothing to catch it.
    if (counselorId) {
      const [existing] = await sequelize.query<{ total: number }>(`
        SELECT COUNT(*) AS total FROM appointments
        WHERE counsilorid = :counselorId AND date = :date AND appointtime = :appointtime
          AND booked = 1 AND not_done = 0
      `, { replacements: { counselorId, date: appointmentDate, appointtime: appointmentTime }, type: QueryTypes.SELECT })
      if (Number(existing?.total || 0) > 0) {
        return NextResponse.json({ error: 'This counselor already has an appointment booked at that date and time' }, { status: 409 })
      }
    }

    const crossBranch = Boolean(data.crossBranch || data.cross_branch)
    const assignedBranchId = crossBranch ? normalizeNumber(data.assignedBranch ?? data.assigned_branch) : null

    const appointment = await Appointments.create({
      leadid: leadId,
      date: appointmentDate,
      appointtime: appointmentTime,
      counsilorid: counselorId,
      booked: Number(data.booked ?? 1),
      done: Number(data.done ?? 0),
      not_done: Number(data.not_done ?? 0),
      region: normalizeNumber(data.region),
      branch: normalizeNumber(data.branch) || 0,
      screenshot: data.screenshot || '',
      second_done: Number(data.second_done ?? 0),
      second_meet_date: data.second_meet_date || appointmentDate,
      cross_branch: crossBranch ? 1 : 0,
      assigned_branch: assignedBranchId,
      assigned_by: currentUser.id,
      acknowledged: 0,
    } as any);

    // Reload with associations
    const appointmentWithRelations = await Appointments.findByPk(appointment.getDataValue('id'));

    if (leadId) {
      await logLeadRemark({
        leadId,
        action: 'appointment_booked',
        remark: `Appointment booked for ${appointmentDate} at ${appointmentTime}`,
        newValue: data.date || null,
        actorId: counselorId,
      });
    }

    // Cross-branch handoff: the counselor/BM being asked to cover this
    // appointment is in a different branch and wouldn't otherwise see it in
    // their normal "my leads" queue, so they need an explicit heads-up with
    // a way to confirm they're actually taking it (see the acknowledge route).
    if (crossBranch && counselorId) {
      const leadName = data.leadName || null;
      await notifyUser({
        userId: counselorId,
        type: 'appointment_cross_branch',
        title: 'Cross-branch appointment assigned to you',
        message: `You've been assigned a cross-branch appointment${leadName ? ` for ${leadName}` : ''} on ${appointmentDate} at ${appointmentTime.slice(0, 5)}. Please acknowledge it.`,
        priority: 'high',
        link: '/admin/appointments',
        relatedId: appointment.getDataValue('id'),
        relatedType: 'appointment',
      });
    }

    return NextResponse.json(appointmentWithRelations, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function normalizeNumber(value: unknown): number | null {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null
}

function normalizeTime(value: unknown): string {
  const time = String(value || '09:00').trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return '09:00:00';
}

function getAppointmentStatusCondition(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized === 'completed') return 'a.done = 1'
  if (normalized === 'no-show') return "a.not_done = 1 AND a.meeting_status = 'no_show'"
  if (normalized === 'rescheduled') return "a.meeting_status = 'rescheduled'"
  if (normalized === 'cancelled') return "a.not_done = 1 AND COALESCE(a.meeting_status, '') != 'no_show'"
  if (normalized === 'confirmed' || normalized === 'scheduled' || normalized === 'booked') return 'a.booked = 1 AND COALESCE(a.done, 0) = 0 AND COALESCE(a.not_done, 0) = 0'
  if (normalized === 'pending') return 'COALESCE(a.booked, 0) = 0 AND COALESCE(a.done, 0) = 0 AND COALESCE(a.not_done, 0) = 0'
  return ''
}
