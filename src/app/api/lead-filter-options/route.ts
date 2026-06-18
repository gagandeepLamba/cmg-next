import { NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDB } from '@/lib/sequelize';

interface RawOption {
  value: string | number | null;
  label?: string | null;
  region?: string | number | null;
}

interface FilterOption {
  value: string;
  label: string;
  region?: string;
}

let dbInitialized = false;

const ensureDBConnection = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

const baseStatuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Closed'];
const basePriorities = ['Hot', 'Warm', 'Cold', 'High', 'Medium', 'Low'];
const baseLeadQualities = ['Hot', 'Warm', 'Cold'];

const addOption = (map: Map<string, FilterOption>, value: unknown, label?: unknown, region?: unknown) => {
  if (value === null || value === undefined || String(value).trim() === '') return;

  const optionValue = String(value).trim();
  const optionLabel = label === null || label === undefined || String(label).trim() === ''
    ? optionValue
    : String(label).trim();

  if (!map.has(optionValue)) {
    map.set(optionValue, {
      value: optionValue,
      label: optionLabel,
      ...(region === null || region === undefined || String(region).trim() === '' ? {} : { region: String(region).trim() })
    });
  }
};

const toOptions = (rows: RawOption[], defaults: string[] = []) => {
  const map = new Map<string, FilterOption>();
  defaults.forEach((value) => addOption(map, value));
  rows.forEach((row) => addOption(map, row.value, row.label, row.region));
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
};

export async function GET() {
  try {
    await ensureDBConnection();

    const [
      statuses,
      priorities,
      leadQualities,
      branches,
      regions,
      countries,
      countryValues,
      programTypes,
      services,
      serviceValues,
      sources,
      sourceValues
    ] = await Promise.all([
      sequelize.query<RawOption>(
        "SELECT DISTINCT status as value FROM dmc_forum_leads WHERE status IS NOT NULL AND status <> ''",
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        "SELECT DISTINCT priority as value FROM dmc_forum_leads WHERE priority IS NOT NULL AND priority <> ''",
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        "SELECT DISTINCT lead_quality as value FROM dmc_forum_leads WHERE lead_quality IS NOT NULL AND lead_quality <> ''",
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        'SELECT id as value, name as label, region FROM dm_branch WHERE status = 1 ORDER BY name ASC',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        'SELECT id as value, name as label FROM dm_region WHERE status = 1 ORDER BY name ASC',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        'SELECT id as value, name as label FROM dm_country_proces WHERE status = 1 ORDER BY name ASC',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        "SELECT DISTINCT country_interest as value FROM dmc_forum_leads WHERE country_interest IS NOT NULL AND country_interest <> ''",
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        'SELECT id as value, type as label FROM dm_program_type WHERE status = 1 ORDER BY type ASC',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        'SELECT id as value, name as label FROM dm_service WHERE status = 1 ORDER BY name ASC',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        "SELECT DISTINCT service_interest as value FROM dmc_forum_leads WHERE service_interest IS NOT NULL AND service_interest <> ''",
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        'SELECT id as value, name as label FROM dm_source WHERE status = 1 ORDER BY name ASC',
        { type: QueryTypes.SELECT }
      ),
      sequelize.query<RawOption>(
        "SELECT DISTINCT market_source as value FROM dmc_forum_leads WHERE market_source IS NOT NULL AND market_source <> ''",
        { type: QueryTypes.SELECT }
      )
    ]);

    const countryMap = new Map<string, FilterOption>();
    countries.forEach((row) => addOption(countryMap, row.value, row.label));
    countryValues.forEach((row) => addOption(countryMap, row.value));

    const serviceMap = new Map<string, FilterOption>();
    programTypes.forEach((row) => addOption(serviceMap, row.value, row.label));
    services.forEach((row) => addOption(serviceMap, row.value, row.label));
    serviceValues.forEach((row) => addOption(serviceMap, row.value));

    const sourceMap = new Map<string, FilterOption>();
    sources.forEach((row) => addOption(sourceMap, row.value, row.label));
    sourceValues.forEach((row) => addOption(sourceMap, row.value));

    return NextResponse.json({
      statuses: toOptions(statuses, baseStatuses),
      priorities: toOptions(priorities, basePriorities),
      branches: toOptions(branches),
      regions: toOptions(regions),
      countries: Array.from(countryMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      services: Array.from(serviceMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      sources: Array.from(sourceMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      leadQualities: toOptions(leadQualities, baseLeadQualities)
    });
  } catch (error) {
    console.error('Error fetching lead filter options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead filter options' },
      { status: 500 }
    );
  }
}
