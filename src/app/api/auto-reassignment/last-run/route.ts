import { NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';

export async function GET() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dmc_auto_reassignment_runs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        processed INT NOT NULL DEFAULT 0,
        reassigned INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [lastRun] = await sequelize.query<any>(
      'SELECT created_at FROM dmc_auto_reassignment_runs ORDER BY created_at DESC LIMIT 1',
      { type: QueryTypes.SELECT }
    );

    const lastRunDate = lastRun?.created_at ? new Date(lastRun.created_at) : null;
    const nextRunDate = lastRunDate
      ? new Date(lastRunDate.getTime() + 6 * 60 * 60 * 1000)
      : null;

    return NextResponse.json({
      lastRun: lastRunDate?.toISOString() || null,
      nextRun: nextRunDate?.toISOString() || null,
    });
  } catch (error) {
    console.error('Error fetching last run time:', error);
    return NextResponse.json(
      { error: 'Failed to fetch last run time' },
      { status: 500 }
    );
  }
}
