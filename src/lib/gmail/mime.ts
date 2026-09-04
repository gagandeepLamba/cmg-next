import crypto from 'crypto';
import type { GmailMessagePart, GmailMessageResource, ParsedEmail, OutboundAttachment } from './types';

// ── Receiving: walk Gmail's already-parsed payload tree ────────────────────────
// Gmail's API parses MIME server-side into this JSON tree — no raw RFC 2822
// parsing needed here, just extraction.

function decodeBase64Url(data: string): string {
  return Buffer.from(data, 'base64url').toString('utf-8');
}

function headerValue(headers: Array<{ name: string; value: string }> | undefined, name: string): string | null {
  const h = headers?.find(x => x.name.toLowerCase() === name.toLowerCase());
  return h?.value ?? null;
}

function parseAddressList(value: string | null): string[] {
  if (!value) return [];
  // Simple split on commas outside of quoted display names — good enough for
  // typical "Name <email>, Name2 <email2>" header values.
  return value
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map(part => {
      const match = part.match(/<([^>]+)>/);
      return (match ? match[1] : part).trim().toLowerCase();
    })
    .filter(Boolean);
}

function parseFromHeader(value: string | null): { email: string | null; name: string | null } {
  if (!value) return { email: null, name: null };
  const match = value.match(/^(.*?)<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^"|"$/g, '') || null, email: match[2].trim().toLowerCase() };
  }
  return { email: value.trim().toLowerCase(), name: null };
}

function walkParts(
  part: GmailMessagePart,
  acc: { text: string | null; html: string | null; attachments: ParsedEmail['attachments'] },
): void {
  const filename = part.filename;
  const attachmentId = part.body?.attachmentId;

  if (filename && attachmentId) {
    acc.attachments.push({
      attachmentId,
      filename,
      mimeType: part.mimeType || 'application/octet-stream',
      size: part.body?.size ?? 0,
    });
    return;
  }

  if (part.mimeType === 'text/plain' && part.body?.data && !acc.text) {
    acc.text = decodeBase64Url(part.body.data);
  } else if (part.mimeType === 'text/html' && part.body?.data && !acc.html) {
    acc.html = decodeBase64Url(part.body.data);
  }

  for (const child of part.parts ?? []) {
    walkParts(child, acc);
  }
}

/** Extracts subject/from/to/cc/body/attachments from a full-format Gmail message resource. */
export function parseMessage(resource: GmailMessageResource): ParsedEmail {
  const headers = resource.payload?.headers;
  const from = parseFromHeader(headerValue(headers, 'From'));
  const acc: { text: string | null; html: string | null; attachments: ParsedEmail['attachments'] } = {
    text: null, html: null, attachments: [],
  };
  if (resource.payload) walkParts(resource.payload, acc);

  return {
    subject: headerValue(headers, 'Subject'),
    fromEmail: from.email,
    fromName: from.name,
    toEmails: parseAddressList(headerValue(headers, 'To')),
    ccEmails: parseAddressList(headerValue(headers, 'Cc')),
    rfcMessageId: headerValue(headers, 'Message-ID'),
    bodyText: acc.text,
    bodyHtml: acc.html,
    attachments: acc.attachments,
  };
}

// ── Sending: hand-build an RFC 2822 message, base64url-encode for Gmail's `raw` ──

function encodeHeaderValue(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, 'utf-8').toString('base64')}?=`;
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function boundary(): string {
  return `----=_Part_${crypto.randomBytes(16).toString('hex')}`;
}

export interface BuildRawMessageOptions {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  bodyHtml: string;
  attachments?: OutboundAttachment[];
  inReplyToRfcMessageId?: string | null;
  referencesRfcMessageIds?: string[];
}

/** Fetches an outbound attachment's bytes from its staged Vercel Blob URL. */
async function fetchAttachmentBytes(url: string): Promise<Buffer> {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`Failed to fetch staged attachment ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Builds a base64url-encoded RFC 2822 message ready for Gmail API's messages.send `raw` field. */
export async function buildRawMessage(opts: BuildRawMessageOptions): Promise<string> {
  const bodyText = htmlToPlainText(opts.bodyHtml);
  const altBoundary = boundary();
  const mixedBoundary = boundary();
  const attachments = opts.attachments ?? [];

  const headerLines = [
    `From: ${opts.from}`,
    `To: ${opts.to.join(', ')}`,
    ...(opts.cc?.length ? [`Cc: ${opts.cc.join(', ')}`] : []),
    `Subject: ${encodeHeaderValue(opts.subject)}`,
    'MIME-Version: 1.0',
    ...(opts.inReplyToRfcMessageId ? [`In-Reply-To: ${opts.inReplyToRfcMessageId}`] : []),
    ...(opts.referencesRfcMessageIds?.length ? [`References: ${opts.referencesRfcMessageIds.join(' ')}`] : []),
  ];

  const alternativePart = [
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    '',
    `--${altBoundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(bodyText, 'utf-8').toString('base64'),
    `--${altBoundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(opts.bodyHtml, 'utf-8').toString('base64'),
    `--${altBoundary}--`,
  ].join('\r\n');

  let raw: string;

  if (attachments.length === 0) {
    raw = [...headerLines, ...alternativePart.split('\r\n')].join('\r\n');
  } else {
    const attachmentParts = await Promise.all(attachments.map(async (att) => {
      const bytes = await fetchAttachmentBytes(att.blobUrl);
      return [
        `--${mixedBoundary}`,
        `Content-Type: ${att.mimeType || 'application/octet-stream'}; name="${att.filename}"`,
        `Content-Disposition: attachment; filename="${att.filename}"`,
        'Content-Transfer-Encoding: base64',
        '',
        bytes.toString('base64').replace(/(.{76})/g, '$1\r\n'),
      ].join('\r\n');
    }));

    raw = [
      ...headerLines,
      `Content-Type: multipart/mixed; boundary="${mixedBoundary}"`,
      '',
      `--${mixedBoundary}`,
      alternativePart,
      ...attachmentParts,
      `--${mixedBoundary}--`,
    ].join('\r\n');
  }

  return Buffer.from(raw, 'utf-8').toString('base64url');
}
