'use client';

import { useState } from 'react';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { uploadFileToBlob } from '@/lib/uploadToBlob';

interface StagedAttachment {
  blobUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  uploading?: boolean;
}

interface ComposeFormProps {
  defaultTo?: string;
  defaultCc?: string;
  defaultSubject?: string;
  quotedHtml?: string;
  inReplyToGmailMessageId?: string;
  gmailThreadId?: string;
  onSent?: () => void;
  compact?: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default function ComposeForm({
  defaultTo = '', defaultCc = '', defaultSubject = '', quotedHtml, inReplyToGmailMessageId,
  gmailThreadId, onSent, compact,
}: ComposeFormProps) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState(defaultCc);
  const [showCc, setShowCc] = useState(!!defaultCc);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<StagedAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const placeholder: StagedAttachment = {
        blobUrl: '', filename: file.name, mimeType: file.type, size: file.size, uploading: true,
      };
      setAttachments(prev => [...prev, placeholder]);
      try {
        const result = await uploadFileToBlob(file, `gmail-attachments/${Date.now()}-${file.name}`);
        setAttachments(prev => prev.map(a => (a.filename === file.name && a.uploading)
          ? { blobUrl: result.url, filename: file.name, mimeType: file.type, size: file.size }
          : a));
      } catch {
        setAttachments(prev => prev.filter(a => !(a.filename === file.name && a.uploading)));
        setMessage(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeAttachment = (filename: string) => {
    setAttachments(prev => prev.filter(a => a.filename !== filename));
  };

  const send = async () => {
    const toList = to.split(',').map(s => s.trim()).filter(Boolean);
    if (!toList.length || !subject.trim() || !body.trim()) {
      setMessage('To, subject, and message body are required');
      return;
    }
    setSending(true);
    setMessage('');
    try {
      const bodyHtml = `<div>${escapeHtml(body).replace(/\n/g, '<br>')}</div>${quotedHtml ? `<br>${quotedHtml}` : ''}`;
      const ccList = cc.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toList,
          cc: ccList.length ? ccList : undefined,
          subject,
          bodyHtml,
          attachments: attachments.filter(a => a.blobUrl).map(({ blobUrl, filename, mimeType, size }) => ({ blobUrl, filename, mimeType, size })),
          inReplyToGmailMessageId,
          gmailThreadId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Sent.');
        setBody('');
        setAttachments([]);
        onSent?.();
      } else {
        setMessage(`Send failed: ${data.error}`);
      }
    } catch {
      setMessage('Send request failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`space-y-3 rounded-xl border border-gray-200 bg-white p-4 ${compact ? '' : 'max-w-2xl'}`}>
      {message && (
        <div className={`rounded-lg px-3 py-2 text-xs ${message.includes('failed') || message.includes('required') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}
      <input
        value={to}
        onChange={e => setTo(e.target.value)}
        placeholder="To (comma-separated)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      {showCc ? (
        <input
          value={cc}
          onChange={e => setCc(e.target.value)}
          placeholder="Cc (comma-separated)"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      ) : (
        <button onClick={() => setShowCc(true)} className="text-xs text-blue-600 hover:underline">Add Cc</button>
      )}
      {!compact ? (
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      ) : null}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Write your message..."
        rows={compact ? 5 : 10}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map(a => (
            <span key={a.filename} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {a.uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Paperclip className="h-3 w-3" />}
              {a.filename}
              <button onClick={() => removeAttachment(a.filename)} className="text-gray-400 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <Paperclip className="h-4 w-4" />
          Attach
          <input type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        </label>
        <button
          onClick={send}
          disabled={sending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
