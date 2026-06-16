import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';

let dbInitialized = false;

const ensureDBConnection = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

const numberValue = (value: unknown) => Number(value || 0);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDBConnection();
    const { id } = await params;
    const leadId = Number(id);

    if (!leadId) {
      return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
    }

    const appointments = await sequelize.query<any>(`
      SELECT
        a.id,
        a.leadid,
        a.date,
        a.appointtime,
        a.counsilorid,
        a.booked,
        a.done,
        a.not_done,
        a.screenshot,
        e.name AS counselorName,
        b.name AS branchName,
        r.name AS regionName
      FROM appointments a
      LEFT JOIN dm_employee e ON e.id = a.counsilorid
      LEFT JOIN dm_branch b ON b.id = a.branch
      LEFT JOIN dm_region r ON r.id = a.region
      WHERE a.leadid = :leadId
      ORDER BY a.date DESC, a.appointtime DESC
      LIMIT 20
    `, {
      replacements: { leadId },
      type: QueryTypes.SELECT
    });

    const followUps = await sequelize.query<any>(`
      SELECT
        r.id,
        r.lead_id,
        r.user_id,
        r.reminder_date,
        r.message,
        r.status,
        r.priority,
        r.completed_at,
        e.name AS employeeName
      FROM dmc_follow_up_reminders r
      LEFT JOIN dm_employee e ON e.id = r.user_id
      WHERE r.lead_id = :leadId
      ORDER BY r.reminder_date DESC
      LIMIT 20
    `, {
      replacements: { leadId },
      type: QueryTypes.SELECT
    });

    const remarks = await sequelize.query<any>(`
      SELECT
        rm.id,
        rm.\`lead\`,
        rm.\`date\`,
        rm.created,
        rm.remark,
        rm.emp,
        rm.\`status\`,
        e.name AS employeeName
      FROM dmc_forum_leads_remarks rm
      LEFT JOIN dm_employee e ON e.id = rm.emp
      WHERE rm.\`lead\` = :leadId
      ORDER BY rm.\`date\` DESC, rm.created DESC, rm.id DESC
      LIMIT 30
    `, {
      replacements: { leadId },
      type: QueryTypes.SELECT
    });

    return NextResponse.json({
      appointments,
      followUps,
      remarks,
      summary: {
        appointments: appointments.length,
        fixedAppointments: appointments.filter((item) => numberValue(item.booked) === 1 && numberValue(item.done) === 0 && numberValue(item.not_done) === 0).length,
        completedAppointments: appointments.filter((item) => numberValue(item.done) === 1).length,
        followUps: followUps.length,
        pendingFollowUps: followUps.filter((item) => String(item.status || '').toLowerCase() === 'pending').length,
        remarks: remarks.length
      }
    });
  } catch (error) {
    console.error('Error fetching lead activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead activity' },
      { status: 500 }
    );
  }
}
