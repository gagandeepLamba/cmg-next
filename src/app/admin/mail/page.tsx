'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Mail, RefreshCw, PenSquare, CheckCircle, AlertTriangle } from 'lucide-react';

interface Thread {
  gmail_thread_id: string;
  subject: string | null;
  snippet: string | null;
  from_email: string | null;
  from_name: string | null;
  direction: 'inbound' | 'outbound';
  matched_lead_id: number | null;
  message_timestamp: string;
  message_count: number;
}

interface AccountState {
  id: number;
  mailbox_email: string;
  is_enabled: number;
  last_synced_at: string | null;
  last_sync_status: string;
  initial_backfill_completed_at: string | null;
  backfill_message_count: number;
}

export default function MailInboxPage() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [mailboxEmail, setMailboxEmail] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const loadAccount = useCallback(async () => {
    const res = await fetch('/api/gmail/accounts/me');
    if (res.ok) {
      const data = await res.json();
      setAccount(data.account);
      setMailboxEmail(data.mailboxEmail || '');
    }
  }, []);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gmail/threads');
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAccount(); loadThreads(); }, [loadAccount, loadThreads]);

  const connect = async () => {
    setConnecting(true);
    try {
      await fetch('/api/gmail/accounts/me', { method: 'POST' });
      await loadAccount();
    } finally {
      setConnecting(false);
    }
  };

  if (!loading && !account?.is_enabled) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <Mail className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Connect your mailbox</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect <span className="font-medium">{mailboxEmail || 'your Workspace email'}</span> to send, receive,
            and automatically log correspondence against matching leads.
          </p>
          <button
            onClick={connect}
            disabled={connecting || !mailboxEmail}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {connecting ? 'Connecting...' : 'Connect Gmail'}
          </button>
          {!mailboxEmail && (
            <p className="mt-2 text-xs text-red-600">No email address on file for your account — contact an admin.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mail</h1>
            <p className="text-sm text-gray-500">{account?.mailbox_email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/mail/compose"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <PenSquare className="h-4 w-4" />
            Compose
          </Link>
          <button
            onClick={loadThreads}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {account && !account.initial_backfill_completed_at && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Initial mailbox sync in progress ({account.backfill_message_count} messages so far) — this can take a few sync cycles for large mailboxes.
        </div>
      )}
      {account?.last_sync_status === 'error' && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Last sync failed — an admin can check details in Gmail Sync Settings.
        </div>
      )}

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
        ) : threads.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">No mail synced yet</div>
        ) : (
          threads.map(t => (
            <Link
              key={t.gmail_thread_id}
              href={`/admin/mail/${t.gmail_thread_id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {t.direction === 'outbound' ? `To: ${t.from_name || t.from_email}` : (t.from_name || t.from_email || 'Unknown')}
                  </span>
                  {t.message_count > 1 && <span className="shrink-0 text-xs text-gray-400">({t.message_count})</span>}
                  {t.matched_lead_id && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                      <CheckCircle className="h-2.5 w-2.5" /> Lead
                    </span>
                  )}
                </div>
                <div className="truncate text-sm text-gray-700">{t.subject || '(no subject)'}</div>
                <div className="truncate text-xs text-gray-400">{t.snippet}</div>
              </div>
              <span className="shrink-0 text-xs text-gray-400">{new Date(t.message_timestamp).toLocaleDateString()}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
