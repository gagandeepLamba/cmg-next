import { getGoogleAccessToken, GTM_READONLY_SCOPE } from './jwt-auth';
import type { GtmTag, GtmTrigger, GtmVersionHeader, GtmVersion, GoogleConnectionTestResult } from './types';

const BASE = 'https://www.googleapis.com/tagmanager/v2';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getGoogleAccessToken([GTM_READONLY_SCOPE]);
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function containerPath(accountId: string, containerId: string): string {
  return `accounts/${accountId}/containers/${containerId}`;
}

/**
 * Fetches the currently LIVE (published) container version — this reflects
 * what's actually running on the site, including its full tag/trigger list,
 * rather than an in-progress workspace draft.
 */
export async function fetchLiveVersion(accountId: string, containerId: string): Promise<GtmVersion> {
  const url = `${BASE}/${containerPath(accountId, containerId)}/versions:live`;
  const res = await fetch(url, { headers: await authHeaders(), signal: AbortSignal.timeout(20_000) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Tag Manager API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GtmVersion>;
}

export async function fetchLiveTags(accountId: string, containerId: string): Promise<GtmTag[]> {
  const version = await fetchLiveVersion(accountId, containerId);
  return version.tag ?? [];
}

export async function fetchLiveTriggers(accountId: string, containerId: string): Promise<GtmTrigger[]> {
  const version = await fetchLiveVersion(accountId, containerId);
  return version.trigger ?? [];
}

/** Lists version headers (publish history) for the container, newest first. */
export async function fetchVersionHeaders(accountId: string, containerId: string): Promise<GtmVersionHeader[]> {
  const url = `${BASE}/${containerPath(accountId, containerId)}/version_headers`;
  const res = await fetch(url, { headers: await authHeaders(), signal: AbortSignal.timeout(20_000) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Tag Manager API error ${res.status}: ${errText}`);
  }
  const data = await res.json() as { containerVersionHeader?: GtmVersionHeader[] };
  return (data.containerVersionHeader ?? []).reverse();
}

/** Fetches full detail (including notes, fingerprint) for one version. */
export async function fetchVersionDetail(accountId: string, containerId: string, versionId: string): Promise<GtmVersion> {
  const url = `${BASE}/${containerPath(accountId, containerId)}/versions/${versionId}`;
  const res = await fetch(url, { headers: await authHeaders(), signal: AbortSignal.timeout(20_000) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Tag Manager API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GtmVersion>;
}

/** Verifies the configured service account can read the configured container. */
export async function testTagManagerConnection(accountId: string, containerId: string): Promise<GoogleConnectionTestResult> {
  try {
    if (!accountId || !containerId) return { ok: false, message: 'No GTM account/container configured' };
    const url = `${BASE}/${containerPath(accountId, containerId)}`;
    const res = await fetch(url, { headers: await authHeaders(), signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { ok: false, message: `API returned ${res.status}: ${body.slice(0, 300)}` };
    }
    const data = await res.json() as { name?: string; publicId?: string };
    return { ok: true, message: `Connected to container: ${data.name ?? containerId} (${data.publicId ?? ''})` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
