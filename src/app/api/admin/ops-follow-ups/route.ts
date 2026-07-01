import { NextRequest, NextResponse } from 'next/server';
import { sequelize, connectDB } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';
import { verifyToken } from '@/lib/auth';

let dbInitialized = false;
const ensureDB = async () => {
  if (!dbInitialized) { await connectDB(); dbInitialized = true; }
};

export async function GET(request: NextRequest) {
  try {
    await ensureDB();

    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const search = searchParams.get('search') || '';

    const role = String(currentUser.type || '').toLowerCase().replace(/[\s-]+/g, '_');
    const canViewAll = currentUser.role === 1 || ['admin', 'administrator', 'super_admin', 'director_of_sales', 'director', 'dos'].includes(role);
    const isBranchManager = ['branch_manager', 'bm'].includes(role) && !canViewAll;

    const conditions: string[] = [];
    const replacements: Record<string, any> = {};

    // Role-based filtering
    if (canViewAll) {
      // Super admin, DS, admin: see all follow-ups — no filter
    } else if (isBranchManager) {
      // BM: follow-ups where the assigned employee is in their branch
      conditions.push(`(e.branch = :branch OR e.branch IS NULL)`);
      replacements.branch = currentUser.branch;
    } else {
      // Counselor: only their own follow-ups
      conditions.push(`r.user_id = :userId`);
      replacements.userId = currentUser.id;
    }

    // Status filter
    if (status === 'overdue') {
      conditions.push("r.status = 'pending' AND r.reminder_date < NOW()");
    } else if (status === 'upcoming') {
      conditions.push("r.status = 'pending' AND r.reminder_date >= NOW()");
    } else if (status) {
      conditions.push('r.status = :status');
      replacements.status = status;
    }

    // Priority filter
    if (priority) {
      conditions.push('r.priority = :priority');
      replacements.priority = priority;
    }

    // Search filter
    if (search) {
      conditions.push(`(
        CONCAT_WS(' ', l.fname, l.lname) LIKE :search
        OR l.phone LIKE :search
        OR l.email LIKE :search
        OR e.name LIKE :search
        OR r.message LIKE :search
      )`);
      replacements.search = `%${search}%`;
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const reminders = await sequelize.query<any>(`
      SELECT
        r.id, r.lead_id, r.user_id, r.reminder_date, r.message, r.status, r.priority,
        r.completed_at, r.created_at, r.updated_at,
        l.fname, l.lname, l.phone, l.email, l.mobile,
        l.country_interest, l.service_interest, l.status AS leadStatus,
        COALESCE(cp.name, l.country_interest) AS countryName,
        COALESCE(s.name, l.service_interest) AS serviceName,
        e.name AS employeeName, e.branch AS employeeBranch,
        b.name AS branchName
      FROM dmc_follow_up_reminders r
      LEFT JOIN dmc_forum_leads l ON r.lead_id = l.id
      LEFT JOIN dm_employee e ON r.user_id = e.id
      LEFT JOIN dm_branch b ON e.branch = b.id
      LEFT JOIN dm_country_proces cp ON l.country_interest = cp.id
      LEFT JOIN dm_service s ON l.service_interest = s.id
      ${whereSql}
      ORDER BY
        CASE WHEN r.status = 'pending' AND r.reminder_date < NOW() THEN 0 ELSE 1 END,
        r.reminder_date ASC
      LIMIT 200
    `, { replacements, type: QueryTypes.SELECT });

    const now = new Date();
    const summary = {
      total: reminders.length,
      overdue: reminders.filter(r => r.status === 'pending' && new Date(r.reminder_date) < now).length,
      pending: reminders.filter(r => r.status === 'pending' && new Date(r.reminder_date) >= now).length,
      completed: reminders.filter(r => r.status === 'completed').length,
    };

    return NextResponse.json({ data: reminders, summary });
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDB();

    const authorization = request.headers.get('authorization');
    const token = request.cookies.get('auth-token')?.value || authorization?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, notes, rescheduledAt } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'id and action are required' }, { status: 400 });
    }

    const updates: string[] = [];
    const replacements: Record<string, any> = { id };

    if (action === 'complete') {
      updates.push("status = 'completed'", "completed_at = NOW()");
      if (notes) {
        updates.push("message = CONCAT(COALESCE(message, ''), '\\n--- Completed note: ', :notes)");
        replacements.notes = notes;
      }
    } else if (action === 'reschedule') {
      if (!rescheduledAt) {
        return NextResponse.json({ error: 'rescheduledAt is required for reschedule' }, { status: 400 });
      }
      updates.push("reminder_date = :rescheduledAt", "status = 'pending'");
      replacements.rescheduledAt = rescheduledAt;
    } else if (action === 'cancel') {
      updates.push("status = 'cancelled'");
    } else {
      return NextResponse.json({ error: 'Invalid action. Use: complete, reschedule, cancel' }, { status: 400 });
    }

    await sequelize.query(
      `UPDATE dmc_follow_up_reminders SET ${updates.join(', ')} WHERE id = :id`,
      { replacements, type: QueryTypes.UPDATE }
    );

    return NextResponse.json({ success: true, message: `Follow-up ${action}d` });
  } catch (error) {
    console.error('Error updating follow-up:', error);
    return NextResponse.json({ error: 'Failed to update follow-up' }, { status: 500 });
  }
}
