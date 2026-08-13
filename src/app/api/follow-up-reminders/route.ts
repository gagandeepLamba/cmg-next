// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { DmcFollowUpReminders, DmcNotifications } from '@/models';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { logLeadRemark } from '@/lib/leadRemarks';
import { verifyToken } from '@/lib/auth';
import { isCeo, isBranchManagerOrCeo } from '@/lib/roleChecks';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required to view follow-ups' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const conditions: string[] = [];
    const replacements: Record<string, unknown> = {};

    // Visibility: counselors see only their own follow-ups, Branch Manager
    // sees their whole branch, CEO sees everything. Enforced server-side so
    // it can't be bypassed by omitting/changing the employeeId query param.
    if (isCeo(currentUser)) {
      // no restriction
    } else if (isBranchManagerOrCeo(currentUser)) {
      conditions.push('e.branch = :userBranch');
      replacements.userBranch = Number(currentUser.branch || 0);
    } else {
      conditions.push('r.user_id = :currentUserId');
      replacements.currentUserId = Number(currentUser.id);
    }

    if (employeeId) { conditions.push('r.user_id = :employeeId'); replacements.employeeId = Number(employeeId); }
    if (leadId) { conditions.push('r.lead_id = :leadId'); replacements.leadId = Number(leadId); }
    if (status) {
      if (status === 'overdue') {
        conditions.push("r.status = 'pending' AND r.reminder_date < NOW()");
      } else if (status === 'upcoming') {
        conditions.push("r.status = 'pending' AND r.reminder_date >= NOW()");
      } else {
        conditions.push('r.status = :status');
        replacements.status = status;
      }
    }
    if (priority) { conditions.push('r.priority = :priority'); replacements.priority = priority; }
    if (startDate && endDate) {
      conditions.push('r.reminder_date BETWEEN :startDate AND :endDate');
      replacements.startDate = startDate;
      replacements.endDate = endDate;
    } else if (startDate) {
      conditions.push('r.reminder_date >= :startDate');
      replacements.startDate = startDate;
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const reminders = await sequelize.query(`
      SELECT r.*, l.fname, l.lname, l.email, l.phone, l.status AS leadStatus, l.priority AS leadPriority,
             e.name AS employeeName, e.email AS employeeEmail
      FROM dmc_follow_up_reminders r
      LEFT JOIN dmc_forum_leads l ON r.lead_id = l.id
      LEFT JOIN dm_employee e ON r.user_id = e.id
      ${whereSql}
      ORDER BY r.reminder_date ASC
    `, { replacements, type: QueryTypes.SELECT });

    // Get overdue reminders
    const now = new Date();
    const overdueReminders = (reminders as any[]).filter(r => r.status === 'pending' && new Date(r.reminder_date) < now);

    // Get upcoming reminders (next 7 days)
    const nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    const upcomingReminders = (reminders as any[]).filter(r => {
      const date = new Date(r.reminder_date);
      return r.status === 'pending' && date >= now && date <= nextWeek;
    });

    return NextResponse.json({
      reminders,
      summary: {
        total: reminders.length,
        overdue: overdueReminders.length,
        upcoming: upcomingReminders.length,
        completed: (reminders as any[]).filter(r => r.status === 'completed').length,
        pending: (reminders as any[]).filter(r => r.status === 'pending').length
      }
    });

  } catch (error) {
    console.error('Error fetching follow-up reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch follow-up reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required to create a follow-up' }, { status: 401 });
    }

    const body = await request.json();
    const {
      leadId,
      employeeId, 
      userId,
      reminderType, 
      scheduledAt, 
      reminderDate,
      priority, 
      subject, 
      message,
      notes
    } = body;
    const assignedUserId = employeeId || userId;
    const followUpAt = scheduledAt || reminderDate;
    const reminderMessage = message || subject || notes;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }
    if (!assignedUserId) {
      return NextResponse.json({ error: 'employeeId or userId is required' }, { status: 400 });
    }
    if (!followUpAt) {
      return NextResponse.json({ error: 'scheduledAt or reminderDate is required' }, { status: 400 });
    }
    if (!reminderMessage) {
      return NextResponse.json({ error: 'subject or message is required' }, { status: 400 });
    }

    const recentDuplicate = await DmcFollowUpReminders.findOne({
      where: {
        lead_id: parseInt(leadId),
        user_id: parseInt(assignedUserId),
        message: reminderMessage,
        created_at: { [Op.gte]: new Date(Date.now() - 60_000) },
      },
    });
    if (recentDuplicate) {
      return NextResponse.json({ error: 'This follow-up was already created a moment ago.' }, { status: 409 });
    }

    const reminder = await DmcFollowUpReminders.create({
      lead_id: parseInt(leadId),
      user_id: parseInt(assignedUserId),
      reminder_date: new Date(followUpAt),
      message: reminderMessage,
      priority: priority || 'medium',
      status: body.status || 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create notification for the reminder
    await DmcNotifications.create({
      user_id: parseInt(assignedUserId),
      type: 'followup',
      title: `Follow-up Reminder: ${subject || reminderType || 'Lead follow-up'}`,
      message: `You have a follow-up scheduled for ${new Date(followUpAt).toLocaleDateString()}`,
      priority: priority || 'medium',
      created_at: new Date(),
      updated_at: new Date()
    });

    await logLeadRemark({
      leadId: parseInt(leadId),
      action: 'followup_added',
      remark: `Follow-up added for ${new Date(followUpAt).toLocaleDateString()}: ${reminderMessage}`,
      newValue: new Date(followUpAt).toISOString().split('T')[0],
      actorId: parseInt(assignedUserId),
    });

    return NextResponse.json({
      success: true,
      reminder
    });

  } catch (error) {
    console.error('Error creating follow-up reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create follow-up reminder' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const currentUser = token ? verifyToken(token) : null;
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication is required' }, { status: 401 });
    }

    const body = await request.json();
    const { reminderId, action, completedAt, notes, rescheduledAt } = body;

    if (!reminderId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: reminderId, action' },
        { status: 400 }
      );
    }

    // A follow-up can only be completed/rescheduled/cancelled by the
    // counselor it belongs to, or Branch Manager/CEO for their scope.
    const [existing] = await sequelize.query<{ user_id: number; branch: number | null }>(`
      SELECT r.user_id, e.branch FROM dmc_follow_up_reminders r
      LEFT JOIN dm_employee e ON e.id = r.user_id
      WHERE r.id = :reminderId LIMIT 1
    `, { replacements: { reminderId: parseInt(reminderId) }, type: QueryTypes.SELECT });

    if (!existing) {
      return NextResponse.json({ error: 'Follow-up reminder not found' }, { status: 404 });
    }

    const isOwn = Number(existing.user_id) === Number(currentUser.id);
    if (!isOwn) {
      if (isCeo(currentUser)) {
        // unrestricted
      } else if (isBranchManagerOrCeo(currentUser) && Number(existing.branch) === Number(currentUser.branch || 0)) {
        // in-branch manager, allowed
      } else {
        return NextResponse.json({ error: 'You do not have permission to update this follow-up' }, { status: 403 });
      }
    }

    let updateData: any = {};
    // A completion/reschedule/cancel note is a NEW remark about this action,
    // not a replacement for whatever the follow-up's original message said —
    // overwriting it destroyed the original context. Append instead (same
    // pattern as PUT /api/admin/ops-follow-ups).
    const actionLabel = action === 'complete' ? 'Completed' : action === 'reschedule' ? 'Rescheduled' : 'Cancelled';

    switch (action) {
      case 'complete':
        updateData = {
          status: 'completed',
          completed_at: completedAt ? new Date(completedAt) : new Date(),
          updated_at: new Date()
        };
        break;
      case 'reschedule':
        updateData = {
          status: 'rescheduled',
          reminder_date: new Date(rescheduledAt),
          updated_at: new Date()
        };
        break;
      case 'cancel':
        updateData = {
          status: 'cancelled',
          updated_at: new Date()
        };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (notes) {
      await sequelize.query(
        `UPDATE dmc_follow_up_reminders
         SET message = CONCAT(COALESCE(message, ''), '\n--- ', :actionLabel, ' note: ', :notes)
         WHERE id = :reminderId`,
        { replacements: { actionLabel, notes, reminderId: parseInt(reminderId) }, type: QueryTypes.UPDATE }
      );
    }

    const reminder = await DmcFollowUpReminders.update(updateData, {
      where: { id: parseInt(reminderId) }
    });

    return NextResponse.json({
      success: true,
      reminder
    });

  } catch (error) {
    console.error('Error updating follow-up reminder:', error);
    return NextResponse.json(
      { error: 'Failed to update follow-up reminder' },
      { status: 500 }
    );
  }
}
