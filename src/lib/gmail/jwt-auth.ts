import jwt from 'jsonwebtoken';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

type CachedToken = { accessToken: string; expiresAt: number };
const tokenCache = new Map<string, CachedToken>();

function serviceAccountCredentials(): { email: string; privateKey: string } {
  const email = process.env.GMAIL_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error('GMAIL_SERVICE_ACCOUNT_EMAIL / GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY is not configured');
  }
  const privateKey = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;
  return { email, privateKey };
}

/**
 * Exchanges a signed JWT assertion for a scoped OAuth2 access token that
 * IMPERSONATES a specific Workspace user, via domain-wide delegation
 * (Google's JWT-bearer flow with a `sub` claim). `subject` is required
 * (not optional) — every call site must be explicit about whose mailbox
 * it's acting as, since this is the one mechanism standing between "send
 * as yourself" and "send as anyone in the company."
 */
export async function getGmailAccessToken(scopes: string[], subject: string): Promise<string> {
  if (!subject) {
    throw new Error('getGmailAccessToken: subject (impersonated mailbox) is required');
  }

  const sortedScopes = [...scopes].sort().join(' ');
  const cacheKey = `${sortedScopes}::${subject}`;
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.accessToken;
  }

  const { email, privateKey } = serviceAccountCredentials();
  const now = Math.floor(Date.now() / 1000);

  const assertion = jwt.sign(
    {
      iss: email,
      sub: subject,
      scope: sortedScopes,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    },
    privateKey,
    { algorithm: 'RS256' }
  );

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail token exchange failed for ${subject} ${res.status}: ${errText}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  tokenCache.set(cacheKey, {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });
  return data.access_token;
}

export const GMAIL_SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';
export const GMAIL_MODIFY_SCOPE = 'https://www.googleapis.com/auth/gmail.modify';
