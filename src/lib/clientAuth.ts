import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface ClientPrincipal {
  principalType: 'client';
  leadId: number;
  email: string;
  name: string;
}

export function generateClientToken(payload: Omit<ClientPrincipal, 'principalType'>): string {
  return jwt.sign({ ...payload, principalType: 'client' }, JWT_SECRET, { expiresIn: '12h' });
}

export function verifyClientToken(token: string): ClientPrincipal | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ClientPrincipal;
    return decoded.principalType === 'client' ? decoded : null;
  } catch {
    return null;
  }
}
