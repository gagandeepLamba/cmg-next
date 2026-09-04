// Shared TypeScript types for the Gmail integration.

export interface GmailMessagePartBody {
  attachmentId?: string;
  size: number;
  data?: string; // base64url
}

export interface GmailMessagePart {
  partId?: string;
  mimeType: string;
  filename?: string;
  headers?: Array<{ name: string; value: string }>;
  body?: GmailMessagePartBody;
  parts?: GmailMessagePart[];
}

export interface GmailMessageResource {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  payload?: GmailMessagePart;
  sizeEstimate?: number;
}

export interface GmailListMessagesResponse {
  messages?: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate?: number;
}

export interface GmailHistoryRecord {
  id: string;
  messagesAdded?: Array<{ message: { id: string; threadId: string } }>;
}

export interface GmailHistoryResponse {
  history?: GmailHistoryRecord[];
  nextPageToken?: string;
  historyId?: string;
}

export interface GmailSendResponse {
  id: string;
  threadId: string;
}

export interface GmailAttachmentResource {
  size: number;
  data: string; // base64url
}

/** Result of walking a GmailMessagePart tree into something the app can store/render. */
export interface ParsedEmail {
  subject: string | null;
  fromEmail: string | null;
  fromName: string | null;
  toEmails: string[];
  ccEmails: string[];
  rfcMessageId: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  attachments: Array<{ attachmentId: string; filename: string; mimeType: string; size: number }>;
}

export interface OutboundAttachment {
  blobUrl: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface GoogleConnectionTestResult {
  ok: boolean;
  message: string;
}
