import { getGmailAccessToken, GMAIL_SEND_SCOPE, GMAIL_MODIFY_SCOPE } from './jwt-auth';
import type {
  GmailListMessagesResponse, GmailMessageResource, GmailHistoryResponse,
  GmailSendResponse, GmailAttachmentResource, GoogleConnectionTestResult,
} from './types';

const BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

// gmail.modify is a superset of gmail.readonly — used for all read calls too,
// so only one scope needs to be authorized in Workspace domain-wide delegation.
async function readHeaders(subject: string): Promise<Record<string, string>> {
  const token = await getGmailAccessToken([GMAIL_MODIFY_SCOPE], subject);
  return { Authorization: `Bearer ${token}` };
}

async function sendHeaders(subject: string): Promise<Record<string, string>> {
  const token = await getGmailAccessToken([GMAIL_SEND_SCOPE], subject);
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

/** Lists message ids matching an optional query (e.g. `after:2026/01/01`), paginated. */
export async function listMessages(
  subject: string,
  opts: { query?: string; pageToken?: string; maxResults?: number } = {},
): Promise<GmailListMessagesResponse> {
  const params = new URLSearchParams();
  if (opts.query) params.set('q', opts.query);
  if (opts.pageToken) params.set('pageToken', opts.pageToken);
  params.set('maxResults', String(opts.maxResults ?? 50));

  const res = await fetch(`${BASE}/messages?${params.toString()}`, {
    headers: await readHeaders(subject),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GmailListMessagesResponse>;
}

/** Fetches a single message with full payload (headers + body parts). */
export async function getMessage(subject: string, messageId: string): Promise<GmailMessageResource> {
  const res = await fetch(`${BASE}/messages/${messageId}?format=full`, {
    headers: await readHeaders(subject),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GmailMessageResource>;
}

/** Incremental sync: lists changes since a stored historyId. Throws with status 404 embedded in the message if the historyId has aged out — callers should fall back to a bounded re-list. */
export async function listHistory(
  subject: string,
  startHistoryId: string,
  pageToken?: string,
): Promise<GmailHistoryResponse> {
  const params = new URLSearchParams({ startHistoryId, historyTypes: 'messageAdded' });
  if (pageToken) params.set('pageToken', pageToken);

  const res = await fetch(`${BASE}/history?${params.toString()}`, {
    headers: await readHeaders(subject),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GmailHistoryResponse>;
}

/** Sends a raw RFC 2822 message (base64url-encoded), optionally continuing an existing thread. */
export async function sendRawMessage(subject: string, raw: string, threadId?: string): Promise<GmailSendResponse> {
  const res = await fetch(`${BASE}/messages/send`, {
    method: 'POST',
    headers: await sendHeaders(subject),
    body: JSON.stringify(threadId ? { raw, threadId } : { raw }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail send error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GmailSendResponse>;
}

/** Fetches a single attachment's content on demand — never persisted for inbound mail. */
export async function getAttachment(subject: string, messageId: string, attachmentId: string): Promise<GmailAttachmentResource> {
  const res = await fetch(`${BASE}/messages/${messageId}/attachments/${attachmentId}`, {
    headers: await readHeaders(subject),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GmailAttachmentResource>;
}

interface GmailProfile {
  emailAddress?: string;
  messagesTotal?: number;
  threadsTotal?: number;
  historyId?: string;
}

/** Returns the mailbox profile, including the CURRENT historyId cursor. */
export async function getProfile(subject: string): Promise<GmailProfile> {
  const res = await fetch(`${BASE}/profile`, { headers: await readHeaders(subject), signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gmail API error ${res.status}: ${errText}`);
  }
  return res.json() as Promise<GmailProfile>;
}

/** Verifies domain-wide delegation is correctly authorized for this mailbox. */
export async function testGmailConnection(subject: string): Promise<GoogleConnectionTestResult> {
  try {
    if (!subject) return { ok: false, message: 'No mailbox address provided' };
    const data = await getProfile(subject);
    return { ok: true, message: `Connected as ${data.emailAddress ?? subject} (${data.messagesTotal ?? 0} messages)` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
