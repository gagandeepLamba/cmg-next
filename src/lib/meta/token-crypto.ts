/**
 * AES-256-GCM encryption for the Meta access token at rest in dm_meta_tokens.
 * Key comes from META_TOKEN_ENCRYPTION_KEY (base64 of 32 random bytes, e.g.
 * `openssl rand -base64 32`) — never derived from another secret, so rotating
 * app secrets doesn't invalidate stored tokens.
 */
import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

function getKey(): Buffer {
  const raw = process.env.META_TOKEN_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error('META_TOKEN_ENCRYPTION_KEY is not configured (required to store the Meta token in the database)');
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) {
    throw new Error('META_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes — generate one with `openssl rand -base64 32`');
  }
  return key;
}

/** Returns `iv.authTag.ciphertext`, each base64. */
export function encryptToken(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString('base64'), authTag.toString('base64'), ciphertext.toString('base64')].join('.');
}

export function decryptToken(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Malformed encrypted token payload');
  }
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]);
  return plain.toString('utf8');
}
