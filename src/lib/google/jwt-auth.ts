import jwt from 'jsonwebtoken';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

type CachedToken = { accessToken: string; expiresAt: number };
const tokenCache = new Map<string, CachedToken>();

function serviceAccountCredentials(): { email: string; privateKey: string } {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not configured');
  }
  // Env vars store the key with literal "\n" sequences instead of real newlines.
  const privateKey = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;
  return { email, privateKey };
}

/**
 * Exchanges a signed JWT assertion for a scoped OAuth2 access token using
 * Google's service-account JWT-bearer flow (RFC 7523). Tokens are cached
 * in-memory per scope-set until ~1 minute before expiry.
 */
export async function getGoogleAccessToken(scopes: string[]): Promise<string> {
  const cacheKey = [...scopes].sort().join(' ');
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.accessToken;
  }

  const { email, privateKey } = serviceAccountCredentials();
  const now = Math.floor(Date.now() / 1000);

  const assertion = jwt.sign(
    {
      iss: email,
      scope: cacheKey,
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
    throw new Error(`Google token exchange failed ${res.status}: ${errText}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  tokenCache.set(cacheKey, {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });
  return data.access_token;
}

export const GSC_READONLY_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
export const GTM_READONLY_SCOPE = 'https://www.googleapis.com/auth/tagmanager.readonly';
