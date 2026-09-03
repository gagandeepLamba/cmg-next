'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle, Zap, Layers } from 'lucide-react';

interface Settings {
  id: number;
  is_enabled: number;
  site_url: string | null;
  gtm_account_id: string | null;
  gtm_container_id: string | null;
  gtm_container_public_id: string | null;
  last_gsc_sync_at: string | null;
  last_gtm_sync_at: string | null;
  updated_at: string;
}

interface EnvStatus {
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
}

export default function GoogleConsoleSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [env, setEnv] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingGsc, setTestingGsc] = useState(false);
  const [testingGtm, setTestingGtm] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    is_enabled: 0,
    site_url: '',
    gtm_account_id: '',
    gtm_container_id: '',
    gtm_container_public_id: '',
  });

  useEffect(() => {
    fetch('/api/admin/google-console/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data.settings);
        setEnv(data.envStatus);
        if (data.settings) {
          setForm({
            is_enabled: data.settings.is_enabled,
            site_url: data.settings.site_url || '',
            gtm_account_id: data.settings.gtm_account_id || '',
            gtm_container_id: data.settings.gtm_container_id || '',
            gtm_container_public_id: data.settings.gtm_container_public_id || '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    const res = await fetch('/api/admin/google-console/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setMsg(res.ok ? 'Settings saved.' : 'Failed to save settings.');
    setSaving(false);
  };

  const testGsc = async () => {
    setTestingGsc(true); setMsg('');
    const res = await fetch('/api/admin/google-console/test-connection?target=gsc');
    const data = await res.json();
    setMsg(data.ok ? `Search Console: ${data.message}` : `Search Console error: ${data.message}`);
    setTestingGsc(false);
  };

  const testGtm = async () => {
    setTestingGtm(true); setMsg('');
    const res = await fetch('/api/admin/google-console/test-connection?target=gtm');
    const data = await res.json();
    setMsg(data.ok ? `Tag Manager: ${data.message}` : `Tag Manager error: ${data.message}`);
    setTestingGtm(false);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading settings...</div>;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-xl font-semibold text-gray-900">Search Console &amp; Tag Manager — Settings</h1>

      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm ${msg.includes('failed') || msg.includes('error') || msg.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {/* Env Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h2 className="font-medium text-gray-900">Environment Variables</h2>
        <p className="text-xs text-gray-500">The service account key is only shown as set/missing — never exposed.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {env && Object.entries(env).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {val?.startsWith('✓') ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 shrink-0" />
              )}
              <span className="font-mono text-xs text-gray-500">{key}:</span>
              <span className={`text-xs ${val?.startsWith('✓') ? 'text-green-700' : 'text-red-600'}`}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sync status */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
        <h2 className="font-medium text-gray-900">Sync Status</h2>
        <p className="text-xs text-gray-500">
          Last GSC sync: {settings?.last_gsc_sync_at ? new Date(settings.last_gsc_sync_at).toLocaleString() : 'Never'}
        </p>
        <p className="text-xs text-gray-500">
          Last GTM sync: {settings?.last_gtm_sync_at ? new Date(settings.last_gtm_sync_at).toLocaleString() : 'Never'}
        </p>
      </div>

      {/* Settings Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h2 className="font-medium text-gray-900">Integration Settings</h2>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_enabled" checked={form.is_enabled === 1}
            onChange={e => setForm(p => ({ ...p, is_enabled: e.target.checked ? 1 : 0 }))}
            className="h-4 w-4 rounded" />
          <label htmlFor="is_enabled" className="text-sm font-medium text-gray-700">Enable Search Console / Tag Manager Integration</label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { key: 'site_url', label: 'GSC Site URL (e.g. sc-domain:cmgone.org or https://cmgone.org/)' },
            { key: 'gtm_account_id', label: 'GTM Account ID' },
            { key: 'gtm_container_id', label: 'GTM Container ID' },
            { key: 'gtm_container_public_id', label: 'GTM Public Container ID (GTM-XXXXXXX)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
              <input
                value={(form as Record<string, unknown>)[key] as string || ''}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>

        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Test Connections */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <h2 className="font-medium text-gray-900">Connection Tests</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={testGsc} disabled={testingGsc}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60">
            <Zap className={`h-4 w-4 ${testingGsc ? 'animate-spin' : ''}`} />
            Test Search Console Connection
          </button>
          <button onClick={testGtm} disabled={testingGtm}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-60">
            <Layers className={`h-4 w-4 ${testingGtm ? 'animate-spin' : ''}`} />
            Test Tag Manager Connection
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Requires the service account&apos;s email to be added as a user in both Search Console (property → Users and permissions)
          and Tag Manager (account → User Management) first.
        </p>
      </div>
    </div>
  );
}
