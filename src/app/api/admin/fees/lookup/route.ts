import { NextRequest, NextResponse } from 'next/server';
import { sequelize, connectDB } from '@/lib/sequelize';
import { QueryTypes } from 'sequelize';

let dbInitialized = false;
const ensureDB = async () => {
  if (!dbInitialized) { await connectDB(); dbInitialized = true; }
};

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service');
    const country = searchParams.get('country');
    const branch = searchParams.get('branch');

    if (!service) {
      return NextResponse.json({ error: 'service param is required' }, { status: 400 });
    }

    const conditions: string[] = ['f.status = 1'];
    const replacements: Record<string, any> = {};

    if (service) { conditions.push('f.service = :service'); replacements.service = Number(service); }
    if (country) { conditions.push('f.country = :country'); replacements.country = Number(country); }
    if (branch)  { conditions.push('f.branch = :branch');   replacements.branch  = Number(branch); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await sequelize.query<any>(`
      SELECT
        f.id, f.service, f.country, f.branch, f.currency,
        f.upfront, f.prof_fee,
        f.firstMonth, f.secondMonth, f.thirdMonth, f.prof_fee_month,
        f.firstStage, f.secondStage, f.thirdStage, f.forthStage, f.fifthStage, f.prof_fee_stage,
        c.currency_code AS currencyCode,
        s.name          AS serviceName,
        co.name         AS countryName,
        b.name          AS branchName
      FROM dm_fee f
      LEFT JOIN dm_currency   c ON f.currency = c.id
      LEFT JOIN dm_service    s ON f.service  = s.id
      LEFT JOIN dm_country_proces co ON f.country = co.id
      LEFT JOIN dm_branch     b ON f.branch   = b.id
      ${where}
      ORDER BY f.id DESC
      LIMIT 1
    `, { replacements, type: QueryTypes.SELECT });

    if (!rows.length) {
      return NextResponse.json({ data: null, message: 'No fee found for the selected criteria' });
    }

    return NextResponse.json({ data: rows[0] });
  } catch (error) {
    console.error('Error looking up fee:', error);
    return NextResponse.json({ error: 'Failed to lookup fee' }, { status: 500 });
  }
}
