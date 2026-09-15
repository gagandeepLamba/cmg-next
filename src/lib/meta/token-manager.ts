/**
 * Persistent, auto-refreshing storage for the Meta Page Access Token.
 *
 * The token now lives in dm_meta_tokens (encrypted), not just process.env.
 * On first use after this migration, it is seeded from META_PAGE_ACCESS_TOKEN.
 * A daily cron (/api/cron/meta-token-refresh) calls refreshTokenIfNeeded(),
 * which asks Meta for the token's real expiry via `debug_token` and, when
 * it's within `thresholdDays` of expiring, exchanges it for a fresh one via
 * `fb_exchange_token` — so the integration stops breaking silently when a
 * token lapses between manual rotations.
 *
 * If a long-lived User token is also on file (user_access_token_enc), refresh
 * follows Meta's documented two-step path instead: extend the User token,
 * then re-derive the Page token from it. That's the only officially
 * supported way to renew a Page token; when only the Page token itself is on
 * file, we still attempt to exchange it directly as a best-effort fallback,
 * since many long-lived Page tokens accept that call.
 */
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { encryptToken, decryptToken } from './token-crypto';

function apiVersion(): string {
  return process.env.META_GRAPH_API_VERSION || 'v21.0';
}

const BASE = 'https://graph.facebook.com';

function toMysqlDatetime(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 19).replace('T', ' ') : null;
}

// dm_meta_tokens.expires_at is always written via toMysqlDatetime() above, i.e.
// a UTC wall-clock value with no timezone marker. `new Date('YYYY-MM-DD HH:MM:SS')`
// (space, not 'T') is parsed as LOCAL time by JS, which would silently skew this
// by the server's UTC offset — force UTC interpretation on the way back out.
function fromMysqlDatetime(s: string | null): Date | null {
  return s ? new Date(`${s.replace(' ', 'T')}Z`) : null;
}

interface TokenRow {
  id: number;
  page_access_token_enc: string;
  user_access_token_enc: string | null;
  page_id: string | null;
  token_source: string;
  expires_at: string | null;
  last_refreshed_at: string | null;
  last_refresh_status: string | null;
  last_refresh_error: string | null;
  last_checked_at: string | null;
}

async function getRow(): Promise<TokenRow | undefined> {
  const [row] = await sequelize.query<TokenRow>(
    `SELECT id, page_access_token_enc, user_access_token_enc, page_id, token_source,
            expires_at, last_refreshed_at, last_refresh_status, last_refresh_error, last_checked_at
     FROM dm_meta_tokens WHERE id = 1 LIMIT 1`,
    { type: QueryTypes.SELECT }
  );
  return row;
}

async function seedFromEnv(): Promise<TokenRow> {
  const envToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!envToken) {
    throw new Error('No Meta token in the database and META_PAGE_ACCESS_TOKEN is not set — configure one to bootstrap the integration');
  }
  await sequelize.query(
    `INSERT INTO dm_meta_tokens (id, page_access_token_enc, page_id, token_source)
     VALUES (1, :token, :pageId, 'env_seed')
     ON DUPLICATE KEY UPDATE
       page_access_token_enc = VALUES(page_access_token_enc),
       page_id = COALESCE(VALUES(page_id), page_id)`,
    {
      replacements: { token: encryptToken(envToken), pageId: process.env.META_PAGE_ID || null },
      type: QueryTypes.INSERT,
    }
  );
  const row = await getRow();
  if (!row) throw new Error('Failed to seed Meta token into the database');
  return row;
}

/** Returns the current Page Access Token, seeding the DB from env on first use. */
export async function getActiveAccessToken(): Promise<string> {
  let row = await getRow();
  if (!row || !row.page_access_token_enc) {
    row = await seedFromEnv();
  }
  return decryptToken(row.page_access_token_enc);
}

/**
 * Manually overwrites the stored token — the recovery path when Meta fully
 * invalidates the old one (password change, revoked access) and auto-refresh
 * can no longer renew it. Used by the admin Settings page's emergency form.
 */
export async function setManualToken(opts: { pageToken: string; userToken?: string; pageId?: string }): Promise<TokenStatus> {
  const trimmedPageToken = opts.pageToken.trim();
  if (!trimmedPageToken) throw new Error('Page token is required');

  const info = await debugToken(trimmedPageToken);
  if (!info.isValid) throw new Error('Meta reports this token as invalid — double-check it was copied correctly');

  await sequelize.query(
    `INSERT INTO dm_meta_tokens (id, page_access_token_enc, user_access_token_enc, page_id, token_source, expires_at, last_checked_at)
     VALUES (1, :token, :userToken, :pageId, 'manual', :expiresAt, NOW())
     ON DUPLICATE KEY UPDATE
       page_access_token_enc = VALUES(page_access_token_enc),
       user_access_token_enc = COALESCE(VALUES(user_access_token_enc), user_access_token_enc),
       page_id = COALESCE(VALUES(page_id), page_id),
       token_source = 'manual',
       expires_at = VALUES(expires_at),
       last_checked_at = NOW(),
       last_refresh_status = NULL,
       last_refresh_error = NULL`,
    {
      replacements: {
        token: encryptToken(trimmedPageToken),
        userToken: opts.userToken?.trim() ? encryptToken(opts.userToken.trim()) : null,
        pageId: opts.pageId?.trim() || null,
        expiresAt: toMysqlDatetime(info.expiresAt),
      },
      type: QueryTypes.INSERT,
    }
  );

  return getTokenStatus();
}

interface DebugTokenResult {
  isValid: boolean;
  expiresAt: Date | null; // null = never expires
}

async function debugToken(token: string): Promise<DebugTokenResult> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error('META_APP_ID / META_APP_SECRET are not configured');

  const url = `${BASE}/${apiVersion()}/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(`${appId}|${appSecret}`)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`debug_token failed: ${res.status} ${body}`);
  }
  const json = await res.json() as { data?: { is_valid?: boolean; expires_at?: number } };
  const expiresAtSec = json.data?.expires_at ?? 0;
  return {
    isValid: json.data?.is_valid ?? false,
    expiresAt: expiresAtSec > 0 ? new Date(expiresAtSec * 1000) : null,
  };
}

async function exchangeLongLivedToken(token: string): Promise<string> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error('META_APP_ID / META_APP_SECRET are not configured');

  const url = `${BASE}/${apiVersion()}/oauth/access_token?grant_type=fb_exchange_token&client_id=${encodeURIComponent(appId)}&client_secret=${encodeURIComponent(appSecret)}&fb_exchange_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Token exchange failed: ${res.status} ${body}`);
  }
  const json = await res.json() as { access_token?: string };
  if (!json.access_token) throw new Error('Token exchange returned no access_token');
  return json.access_token;
}

/** Re-derives the Page Access Token for `pageId` from a (freshly exchanged) User token. */
async function derivePageToken(userToken: string, pageId: string): Promise<string> {
  const url = `${BASE}/${apiVersion()}/${pageId}?fields=access_token&access_token=${encodeURIComponent(userToken)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Failed to derive Page token from User token: ${res.status} ${body}`);
  }
  const json = await res.json() as { access_token?: string };
  if (!json.access_token) throw new Error('Page token derivation returned no access_token');
  return json.access_token;
}

async function logRefresh(status: string, message: string, before: Date | null, after: Date | null) {
  await sequelize.query(
    `INSERT INTO dm_meta_token_refresh_log (status, message, expires_at_before, expires_at_after)
     VALUES (:status, :message, :before, :after)`,
    {
      replacements: { status, message, before: toMysqlDatetime(before), after: toMysqlDatetime(after) },
      type: QueryTypes.INSERT,
    }
  );
}

export interface RefreshResult {
  status: 'ok' | 'failed' | 'skipped' | 'never_expires';
  message: string;
  expiresAt?: Date | null;
}

/**
 * Checks the stored token's real expiry via Meta's debug_token and refreshes
 * it when within `thresholdDays` of expiring (default 10). Safe to call on
 * every cron tick — it only mutates the token when a refresh is actually due
 * (or `force` is passed), and never discards a still-valid token on failure.
 */
export async function refreshTokenIfNeeded(opts: { thresholdDays?: number; force?: boolean } = {}): Promise<RefreshResult> {
  const thresholdDays = opts.thresholdDays ?? 10;

  let row = await getRow();
  if (!row || !row.page_access_token_enc) row = await seedFromEnv();

  const currentPageToken = decryptToken(row.page_access_token_enc);
  const pageInfo = await debugToken(currentPageToken);

  if (!pageInfo.isValid) {
    const msg = 'Stored Meta Page token is no longer valid (revoked, password change, or expired) — manual re-authentication required';
    await sequelize.query(
      `UPDATE dm_meta_tokens SET last_checked_at = NOW(), expires_at = :expiresAt, last_refresh_status = 'failed', last_refresh_error = :msg WHERE id = 1`,
      { replacements: { expiresAt: toMysqlDatetime(pageInfo.expiresAt), msg }, type: QueryTypes.UPDATE }
    );
    await logRefresh('failed', msg, pageInfo.expiresAt, null);
    return { status: 'failed', message: msg };
  }

  // A Page token derived from a long-lived User token typically reports
  // `expires_at: 0` (never expires) on its own — but it dies the moment the
  // underlying User session lapses. When a User token is on file, that's the
  // real clock to watch; checking only the Page token's (misleadingly empty)
  // expiry would mean auto-refresh never fires until the whole thing breaks.
  let governingExpiresAt = pageInfo.expiresAt;
  let userInfo: DebugTokenResult | null = null;
  if (row.user_access_token_enc) {
    userInfo = await debugToken(decryptToken(row.user_access_token_enc));
    governingExpiresAt = userInfo.expiresAt;
  }

  await sequelize.query(
    `UPDATE dm_meta_tokens SET last_checked_at = NOW(), expires_at = :expiresAt WHERE id = 1`,
    { replacements: { expiresAt: toMysqlDatetime(governingExpiresAt) }, type: QueryTypes.UPDATE }
  );

  if (userInfo && !userInfo.isValid) {
    const msg = 'Stored Meta User token is no longer valid (revoked, password change, or expired) — manual re-authentication required. The derived Page token will stop working once its session is dropped.';
    await sequelize.query(
      `UPDATE dm_meta_tokens SET last_refresh_status = 'failed', last_refresh_error = :msg WHERE id = 1`,
      { replacements: { msg }, type: QueryTypes.UPDATE }
    );
    await logRefresh('failed', msg, governingExpiresAt, null);
    return { status: 'failed', message: msg };
  }

  if (governingExpiresAt === null) {
    await sequelize.query(
      `UPDATE dm_meta_tokens SET last_refresh_status = 'never_expires', last_refresh_error = NULL, last_checked_at = NOW() WHERE id = 1`,
      { type: QueryTypes.UPDATE }
    );
    await logRefresh('never_expires', 'Token does not expire — no action needed', null, null);
    return { status: 'never_expires', message: 'Token does not expire per Meta debug_token' };
  }

  const daysUntilExpiry = (governingExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

  if (!opts.force && daysUntilExpiry > thresholdDays) {
    return {
      status: 'skipped',
      message: `Token valid for ${daysUntilExpiry.toFixed(1)} more days — refresh not yet due (threshold ${thresholdDays}d)`,
      expiresAt: governingExpiresAt,
    };
  }

  try {
    let newPageToken: string;
    let newUserTokenEnc: string | null = null;
    let newGoverningExpiresAt: Date | null;

    if (row.user_access_token_enc) {
      const userToken = decryptToken(row.user_access_token_enc);
      const exchangedUserToken = await exchangeLongLivedToken(userToken);
      const pageId = row.page_id || process.env.META_PAGE_ID;
      if (!pageId) throw new Error('page_id is not configured — cannot derive a Page token from the refreshed User token');
      newPageToken = await derivePageToken(exchangedUserToken, pageId);
      newUserTokenEnc = encryptToken(exchangedUserToken);
      // The governing clock is still the (freshly extended) User token, not
      // the derived Page token — re-check it the same way we did above.
      newGoverningExpiresAt = (await debugToken(exchangedUserToken)).expiresAt;
    } else {
      newPageToken = await exchangeLongLivedToken(currentPageToken);
      newGoverningExpiresAt = (await debugToken(newPageToken)).expiresAt;
    }

    await sequelize.query(
      `UPDATE dm_meta_tokens
       SET page_access_token_enc = :token,
           user_access_token_enc = COALESCE(:userToken, user_access_token_enc),
           expires_at = :expiresAt,
           last_refreshed_at = NOW(),
           last_checked_at = NOW(),
           last_refresh_status = 'ok',
           last_refresh_error = NULL,
           token_source = 'refresh'
       WHERE id = 1`,
      {
        replacements: {
          token: encryptToken(newPageToken),
          userToken: newUserTokenEnc,
          expiresAt: toMysqlDatetime(newGoverningExpiresAt),
        },
        type: QueryTypes.UPDATE,
      }
    );

    const msg = newGoverningExpiresAt
      ? `Refreshed — valid until ${newGoverningExpiresAt.toISOString()}`
      : 'Refreshed — new token does not expire';
    await logRefresh('ok', msg, governingExpiresAt, newGoverningExpiresAt);
    return { status: 'ok', message: msg, expiresAt: newGoverningExpiresAt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await sequelize.query(
      `UPDATE dm_meta_tokens SET last_refresh_status = 'failed', last_refresh_error = :msg, last_checked_at = NOW() WHERE id = 1`,
      { replacements: { msg }, type: QueryTypes.UPDATE }
    );
    await logRefresh('failed', msg, governingExpiresAt, null);
    // Keep the old (still-valid-for-now) token active — do not overwrite it on failure.
    return { status: 'failed', message: msg, expiresAt: governingExpiresAt };
  }
}

export interface TokenStatus {
  hasToken: boolean;
  source: string | null;
  expiresAt: string | null;
  daysRemaining: number | null;
  lastRefreshedAt: string | null;
  lastRefreshStatus: string | null;
  lastRefreshError: string | null;
  lastCheckedAt: string | null;
}

export async function getTokenStatus(): Promise<TokenStatus> {
  const row = await getRow();
  if (!row) {
    return {
      hasToken: false, source: null, expiresAt: null, daysRemaining: null,
      lastRefreshedAt: null, lastRefreshStatus: null, lastRefreshError: null, lastCheckedAt: null,
    };
  }
  const expiresAt = fromMysqlDatetime(row.expires_at);
  return {
    hasToken: true,
    source: row.token_source,
    expiresAt: row.expires_at,
    daysRemaining: expiresAt ? (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24) : null,
    lastRefreshedAt: row.last_refreshed_at,
    lastRefreshStatus: row.last_refresh_status,
    lastRefreshError: row.last_refresh_error,
    lastCheckedAt: row.last_checked_at,
  };
}
