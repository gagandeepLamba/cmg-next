import { NextRequest, NextResponse } from 'next/server';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { requireClientAuth, isClientAuthError } from '@/lib/clientApiAuth';
import { authorizeChatChannel } from '@/lib/pusherServer';

// Pusher's client SDK POSTs here (form-encoded: socket_id, channel_name)
// whenever a browser tries to subscribe to a private-* channel — Pusher
// itself has no idea who our users are, so it calls back here and only
// opens the subscription if we return a signed auth response. Without this,
// "private-ops-chat-{opportunityId}" would either reject everyone or (if left
// public/unauthenticated) let any signed-in client guess another case's
// channel name and read their conversation.
const CHANNEL_PATTERN = /^private-ops-chat-(\d+)$/;

// Any authenticated staff member with operations access may join any case's
// channel — this mirrors the existing GET/POST permission on
// /api/admin/operations/client-chat, which has no per-case ownership check
// either.
async function isStaffAllowed(request: NextRequest): Promise<boolean> {
  const auth = requireAuth(request, ['operations.view', 'operations.manage']);
  return !isAuthError(auth);
}

async function isClientAllowed(request: NextRequest, opportunityId: number): Promise<boolean> {
  const client = requireClientAuth(request);
  if (isClientAuthError(client)) return false;

  const [row] = await sequelize.query<{ id: number }>(
    `SELECT id FROM dmc_opportunities WHERE id = :opportunityId AND leadId = :leadId LIMIT 1`,
    { replacements: { opportunityId, leadId: client.leadId }, type: QueryTypes.SELECT },
  );
  return Boolean(row);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const socketId = String(form.get('socket_id') || '');
  const channelName = String(form.get('channel_name') || '');

  const match = CHANNEL_PATTERN.exec(channelName);
  if (!socketId || !match) {
    return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
  }

  const opportunityId = Number(match[1]);

  const allowed = (await isStaffAllowed(request)) || (await isClientAllowed(request, opportunityId));
  if (!allowed) {
    return NextResponse.json({ error: 'Not authorized for this conversation' }, { status: 403 });
  }

  const authResponse = authorizeChatChannel(socketId, channelName);
  if (!authResponse) {
    return NextResponse.json({ error: 'Realtime chat is not configured' }, { status: 503 });
  }

  return NextResponse.json(authResponse);
}
