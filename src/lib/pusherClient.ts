import PusherClient from 'pusher-js';

// Browser-side counterpart to src/lib/pusherServer.ts. Returns null when the
// public env vars aren't set, so every caller can treat "no realtime" as a
// normal, expected state (they already poll independently) rather than an
// error to handle.
let client: PusherClient | null | undefined;

export function getPusherClient(): PusherClient | null {
  if (client !== undefined) return client;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  if (!key || !cluster) {
    client = null;
    return null;
  }

  client = new PusherClient(key, {
    cluster,
    authEndpoint: '/api/pusher/auth',
    // Same-origin request — the browser already attaches the staff
    // (auth-token) or client-portal (client-auth-token) session cookie
    // automatically, same as every other fetch call in this app.
  });
  return client;
}

// Keyed on opportunityId alone — see src/lib/pusherServer.ts for why.
export const chatChannelName = (opportunityId: number): string =>
  `private-ops-chat-${opportunityId}`;

export interface ChatPushMessage {
  id: number;
  text: string;
  file: string | null;
  fromClient: boolean;
  created: string;
}
