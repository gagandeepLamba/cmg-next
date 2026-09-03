import { getGoogleAccessToken, GSC_READONLY_SCOPE } from './jwt-auth';
import type {
  SearchAnalyticsRow, SitemapEntry, UrlInspectionResult, GoogleConnectionTestResult,
} from './types';

const WEBMASTERS_BASE = 'https://searchconsole.googleapis.com/webmasters/v3';
const SEARCHCONSOLE_BASE = 'https://searchconsole.googleapis.com/v1';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getGoogleAccessToken([GSC_READONLY_SCOPE]);
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

/** Fetches Search Analytics rows for the given date range and dimensions. */
export async function fetchSearchAnalytics(
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit = 5000,
): Promise<SearchAnalyticsRow[]> {
  const url = `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Search Console API error ${res.status}: ${errText}`);
  }
  const data = await res.json() as { rows?: SearchAnalyticsRow[] };
  return data.rows ?? [];
}

/** Lists sitemaps submitted for the property. */
export async function fetchSitemaps(siteUrl: string): Promise<SitemapEntry[]> {
  const url = `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}/sitemaps`;
  const res = await fetch(url, {
    headers: await authHeaders(),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Search Console API error ${res.status}: ${errText}`);
  }
  const data = await res.json() as { sitemap?: SitemapEntry[] };
  return data.sitemap ?? [];
}

/** Inspects a single URL's indexing status. Rate-limited by Google — call sparingly. */
export async function inspectUrl(siteUrl: string, pageUrl: string): Promise<UrlInspectionResult> {
  const url = `${SEARCHCONSOLE_BASE}/urlInspection/index:inspect`;
  const res = await fetch(url, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ inspectionUrl: pageUrl, siteUrl }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`URL Inspection API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<UrlInspectionResult>;
}

/** Verifies the configured service account can read the configured property. */
export async function testSearchConsoleConnection(siteUrl: string): Promise<GoogleConnectionTestResult> {
  try {
    if (!siteUrl) return { ok: false, message: 'No site URL configured' };
    const url = `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}`;
    const res = await fetch(url, { headers: await authHeaders(), signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, message: `API returned ${res.status}: ${body.slice(0, 300)}` };
    }
    const data = await res.json() as { siteUrl?: string; permissionLevel?: string };
    return { ok: true, message: `Connected to ${data.siteUrl ?? siteUrl} (permission: ${data.permissionLevel ?? 'unknown'})` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
