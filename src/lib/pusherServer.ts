import Pusher from 'pusher';

// Real-time transport for the client<->case-officer chat (dm_client_conversations).
// This app deploys as serverless Next.js API routes (no persistent process a
// self-hosted Socket.IO server could attach to), so a managed pub/sub service is
// the only way to get genuine WebSocket push here — see src/lib/websocket-server.ts
// for the dead in-process Socket.IO server this replaces for chat specifically.
//
// Deliberately optional: every call site here works fine with these env vars
// unset — the REST endpoints still persist every message to the database and
// the UI still polls — Pusher only adds the instant push on top. Set
// PUSHER_APP_ID / PUSHER_KEY / PUSHER_SECRET / PUSHER_CLUSTER (and the
// client-visible NEXT_PUBLIC_PUSHER_KEY / NEXT_PUBLIC_PUSHER_CLUSTER, which
// must match PUSHER_KEY / PUSHER_CLUSTER) to turn on live push.
let pusherInstance: Pusher | null | undefined;

function getPusher(): Pusher | null {
  if (pusherInstance !== undefined) return pusherInstance;

  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
    pusherInstance = null;
    return null;
  }

  pusherInstance = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true,
  });
  return pusherInstance;
}

export const isRealtimeChatConfigured = (): boolean => getPusher() !== null;

// Keyed on opportunityId alone (not leadId too) - an opportunity belongs to
// exactly one lead, so it's already a unique case key, and the client-portal
// page only has opportunityId available client-side (leadId lives in its
// server-side session, not exposed to the browser).
export const chatChannelName = (opportunityId: number): string =>
  `private-ops-chat-${opportunityId}`;

export interface ChatPushMessage {
  id: number;
  text: string;
  file: string | null;
  fromClient: boolean;
  created: string;
}

// Fire-and-forget: a Pusher outage must never fail the message send itself,
// since the row is already durably persisted in dm_client_conversations by
// the time this is called — push is purely an enhancement on top of that.
export async function pushChatMessage(opportunityId: number, message: ChatPushMessage): Promise<void> {
  const pusher = getPusher();
  if (!pusher) return;
  try {
    await pusher.trigger(chatChannelName(opportunityId), 'new-message', message);
  } catch (error) {
    console.error('Failed to push chat message via Pusher:', error);
  }
}

export function authorizeChatChannel(
  socketId: string,
  channelName: string,
): Pusher.ChannelAuthResponse | null {
  const pusher = getPusher();
  if (!pusher) return null;
  return pusher.authorizeChannel(socketId, channelName);
}
