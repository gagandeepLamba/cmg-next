'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, Paperclip, Download } from 'lucide-react';
import ComposeForm from '@/components/gmail/ComposeForm';

interface Message {
  id: number;
  gmail_message_id: string;
  gmail_thread_id: string;
  direction: 'inbound' | 'outbound';
  from_email: string | null;
  from_name: string | null;
  to_emails: string[];
  cc_emails: string[];
  subject: string | null;
  snippet: string | null;
  body_html: string | null;
  body_text: string | null;
  has_attachments: number;
  matched_lead_id: number | null;
  message_timestamp: string;
}

interface Attachment {
  message_id: number;
  id: number;
  filename: string;
  mime_type: string;
  size_bytes: number;
  gmail_attachment_id: string;
}

export default function ThreadPage() {
  const params = useParams<{ threadId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gmail/threads/${params.threadId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages ?? []);
        setAttachments(data.attachments ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [params.threadId]);

  useEffect(() => { load(); }, [load]);

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="p-6 space-y-4">
      <button onClick={() => router.push('/admin/mail')} className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Mail
      </button>

      {loading ? (
        <div className="text-center text-sm text-gray-400">Loading...</div>
      ) : (
        <>
          <h1 className="text-xl font-semibold text-gray-900">{messages[0]?.subject || '(no subject)'}</h1>

          <div className="space-y-3">
            {messages.map(m => {
              const msgAttachments = attachments.filter(a => a.message_id === m.id);
              return (
                <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{m.direction === 'outbound' ? 'You' : (m.from_name || m.from_email)}</span>
                      <span className="ml-2 text-xs text-gray-400">to {m.to_emails.join(', ')}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(m.message_timestamp).toLocaleString()}</span>
                  </div>
                  {m.body_html ? (
                    <div
                      className="prose prose-sm max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(m.body_html) }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-gray-800">{m.body_text}</p>
                  )}
                  {msgAttachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      {msgAttachments.map(a => (
                        <a
                          key={a.id}
                          href={`/api/gmail/messages/${m.id}/attachments/${a.gmail_attachment_id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          {a.filename}
                          <Download className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {replying ? (
            <ComposeForm
              defaultTo={lastMessage?.direction === 'outbound' ? lastMessage.to_emails.join(', ') : (lastMessage?.from_email ?? '')}
              defaultSubject={lastMessage?.subject ? (lastMessage.subject.startsWith('Re:') ? lastMessage.subject : `Re: ${lastMessage.subject}`) : ''}
              gmailThreadId={lastMessage?.gmail_thread_id}
              inReplyToGmailMessageId={lastMessage?.gmail_message_id}
              compact
              onSent={() => { setReplying(false); load(); }}
            />
          ) : (
            <button
              onClick={() => setReplying(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Reply
            </button>
          )}
        </>
      )}
    </div>
  );
}
