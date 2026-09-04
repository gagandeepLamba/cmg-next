'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, RefreshCw, CheckCircle, XCircle, Zap, PlayCircle, PauseCircle } from 'lucide-react';

interface Settings {
  is_enabled: number;
  backfill_days: number;
  backfill_message_cap: number;
  employees_per_sync_tick: number;
  last_cron_run_at: string | null;
}

interface EnvStatus {
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
}

interface AccountRow {
  employee_id: number;
  employee_name: string;
  employee_email: string | null;
  account_id: number | null;
  mailbox_email: string | null;
  is_enabled: number | null;
  last_synced_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
  message_count: number;
  disabled_reason: string | null;
}

export default function GmailAdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [env, setEnv] = useState<EnvStatus | null>(null);
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ is_enabled: 0, backfill_days: 90, backfill_message_cap: 1000, employees_per_sync_tick: 20 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, accountsRes] = await Promise.all([
        fetch('/api/admin/gmail/settings'),
        fetch('/api/admin/gmail/accounts'),
      ]);
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data.settings);
        setEnv(data.envStatus);
        if (data.settings) setForm(data.settings);
      }
      if (accountsRes.ok) {
        const data = await accountsRes.json();
        setAccounts(data.accounts ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/gmail/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    setMsg(res.ok ? 'Settings saved.' : 'Failed to save settings.');
    setSaving(false);
  };

  const syncNow = async () => {
    setSyncing(true); setMsg('');
    const res = await fetch('/api/admin/gmail/sync-now', { method: 'POST' });
    const data = await res.json();
    setMsg(res.ok ? `Sync complete: ${JSON.stringify(data.result)}` : `Sync failed: ${data.error}`);
    setSyncing(false);
    load();
  };

  const toggleAccount = async (employeeId: number, action: 'enable' | 'disable' | 'resync') => {
    await fetch(`/api/admin/gmail/accounts/${employeeId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
    });
    load();
  };

  const testAccount = async (employeeId: number) => {
    const res = await fetch(`/api/admin/gmail/accounts/${employeeId}/test`);
    const data = await res.json();
    setMsg(data.ok ? `Test OK: ${data.message}` : `Test failed: ${data.message}`);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Gmail Sync — Admin Settings</h1>

      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm ${msg.includes('failed') || msg.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 max-w-3xl">
        <h2 className="font-medium text-gray-900">Environment Variables</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {env && Object.entries(env).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {val?.startsWith('✓') ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
              <span className="font-mono text-xs text-gray-500">{key}:</span>
              <span className={`text-xs ${val?.startsWith('✓') ? 'text-green-700' : 'text-red-600'}`}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 max-w-3xl">
        <h2 className="font-medium text-gray-900">Sync Settings</h2>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_enabled" checked={form.is_enabled === 1}
            onChange={e => setForm(p => ({ ...p, is_enabled: e.target.checked ? 1 : 0 }))} className="h-4 w-4 rounded" />
          <label htmlFor="is_enabled" className="text-sm font-medium text-gray-700">Enable Gmail integration module-wide</label>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { key: 'backfill_days', label: 'Initial backfill window (days)' },
            { key: 'backfill_message_cap', label: 'Backfill message cap per mailbox' },
            { key: 'employees_per_sync_tick', label: 'Employees synced per cron tick' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
              <input
                type="number"
                value={(form as Record<string, number>)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Last cron run: {settings?.last_cron_run_at ? new Date(settings.last_cron_run_at).toLocaleString() : 'Never'}</p>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button onClick={syncNow} disabled={syncing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="font-medium text-gray-900">Employee Mailboxes ({accounts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2.5">Employee</th>
                <th className="px-4 py-2.5">Mailbox</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Last Synced</th>
                <th className="px-4 py-2.5 text-right">Messages</th>
                <th className="px-4 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {accounts.map(a => (
                <tr key={a.employee_id}>
                  <td className="px-4 py-2.5 text-gray-900">{a.employee_name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{a.mailbox_email || a.employee_email || '—'}</td>
                  <td className="px-4 py-2.5">
                    {!a.account_id ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Not connected</span>
                    ) : !a.is_enabled ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Disabled{a.disabled_reason ? ` (${a.disabled_reason})` : ''}</span>
                    ) : a.last_sync_status === 'error' ? (
                      <span title={a.last_sync_error ?? ''} className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Error</span>
                    ) : a.last_sync_status === 'ok' ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">OK</span>
                    ) : (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Pending first sync</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{a.last_synced_at ? new Date(a.last_synced_at).toLocaleString() : 'Never'}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{a.message_count}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {a.is_enabled ? (
                        <button onClick={() => toggleAccount(a.employee_id, 'disable')} title="Disable" className="text-gray-400 hover:text-red-600">
                          <PauseCircle className="h-4 w-4" />
                        </button>
                      ) : (
                        <button onClick={() => toggleAccount(a.employee_id, 'enable')} title="Enable" className="text-gray-400 hover:text-green-600">
                          <PlayCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => toggleAccount(a.employee_id, 'resync')} title="Force resync" className="text-gray-400 hover:text-indigo-600">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button onClick={() => testAccount(a.employee_id)} title="Test connection" className="text-gray-400 hover:text-blue-600">
                        <Zap className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
