'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BarChart3, TrendingUp, CheckCircle, XCircle, RefreshCw,
  Search, AlertTriangle, Settings, ArrowRight, Activity, Layers, Clock
} from 'lucide-react';

interface Stats {
  enabled: boolean;
  siteUrl: string | null;
  lastGscSyncAt: string | null;
  lastGtmSyncAt: string | null;
  week: { clicks: number; impressions: number; ctr: number; position: number };
  month: { clicks: number; impressions: number; ctr: number; position: number };
  topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  topPages: Array<{ page_url: string; clicks: number; impressions: number }>;
  coverageCounts: Array<{ index_status: string | null; count: number }>;
  gtmTagCount: number;
  gtmTriggerCount: number;
  lastVersion: { version_id: string; version_name: string | null; last_synced_at: string } | null;
}

interface HealthCheck {
  installed: boolean;
  foundContainerId: string | null;
  expectedContainerId?: string | null;
  error?: string;
}

export default function GoogleConsoleDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingGsc, setSyncingGsc] = useState(false);
  const [syncingGtm, setSyncingGtm] = useState(false);
  const [message, setMessage] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/google-console/stats');
      if (!res.ok) throw new Error('Failed to load stats');
      setStats(await res.json());
    } catch {
      setMessage('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/google-console/health-check');
      if (res.ok) setHealth(await res.json());
    } catch {
      // Non-critical — badge just stays unknown
    }
  }, []);

  useEffect(() => { loadStats(); loadHealth(); }, [loadStats, loadHealth]);

  const syncGsc = async () => {
    setSyncingGsc(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/google-console/sync-gsc', { method: 'POST' });
      const data = await res.json();
      setMessage(res.ok ? 'Search Console data synced.' : `GSC sync failed: ${data.error}`);
      if (res.ok) loadStats();
    } catch { setMessage('GSC sync request failed'); }
    finally { setSyncingGsc(false); }
  };

  const syncGtm = async () => {
    setSyncingGtm(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/google-console/sync-gtm', { method: 'POST' });
      const data = await res.json();
      setMessage(res.ok ? 'Tag Manager data synced.' : `GTM sync failed: ${data.error}`);
      if (res.ok) { loadStats(); loadHealth(); }
    } catch { setMessage('GTM sync request failed'); }
    finally { setSyncingGtm(false); }
  };

  const statCards = [
    { label: 'Clicks (7d)', value: stats?.week.clicks ?? 0, icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Impressions (7d)', value: stats?.week.impressions ?? 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg CTR (7d)', value: `${((stats?.week.ctr ?? 0) * 100).toFixed(1)}%`, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50', isText: true },
    { label: 'Avg Position (7d)', value: (stats?.week.position ?? 0).toFixed(1), icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', isText: true },
    { label: 'GTM Tags', value: stats?.gtmTagCount ?? 0, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'GTM Triggers', value: stats?.gtmTriggerCount ?? 0, icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Search Console &amp; Tag Manager</h1>
            <p className="text-sm text-gray-500">{stats?.siteUrl || 'Not configured yet'}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {health && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${health.installed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {health.installed ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {health.installed ? 'GTM installed' : 'GTM not detected'}
            </span>
          )}
          <button
            onClick={syncGsc}
            disabled={syncingGsc}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${syncingGsc ? 'animate-spin' : ''}`} />
            Sync GSC Now
          </button>
          <button
            onClick={syncGtm}
            disabled={syncingGtm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${syncingGtm ? 'animate-spin' : ''}`} />
            Sync GTM Now
          </button>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${message.includes('failed') || message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {stats && !stats.enabled && (
        <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Integration is not enabled yet — configure the service account and site details in Settings.
        </div>
      )}

      {/* Nav links */}
      <div className="flex flex-wrap gap-2">
        {[
          { href: '/admin/google-console/search-performance', label: 'Search Performance', icon: TrendingUp },
          { href: '/admin/google-console/coverage', label: 'Indexing & Coverage', icon: CheckCircle },
          { href: '/admin/google-console/gtm', label: 'Tag Manager', icon: Layers },
          { href: '/admin/google-console/gtm/versions', label: 'Publish History', icon: Clock },
          { href: '/admin/google-console/settings', label: 'Settings', icon: Settings },
        ].map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map(card => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '—' : card.isText ? card.value : Number(card.value).toLocaleString()}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top queries */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="font-medium text-gray-900">Top Queries (28d)</h2>
            <Link href="/admin/google-console/search-performance" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
            ) : (stats?.topQueries ?? []).length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No search data yet</div>
            ) : (
              (stats?.topQueries ?? []).map(q => (
                <div key={q.query} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="truncate text-sm text-gray-700">{q.query}</span>
                  <span className="shrink-0 text-xs text-gray-500">{q.clicks.toLocaleString()} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top pages */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="font-medium text-gray-900">Top Pages (28d)</h2>
            <Link href="/admin/google-console/search-performance" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
            ) : (stats?.topPages ?? []).length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No search data yet</div>
            ) : (
              (stats?.topPages ?? []).map(p => (
                <div key={p.page_url} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="truncate text-sm text-gray-700">{p.page_url}</span>
                  <span className="shrink-0 text-xs text-gray-500">{p.clicks.toLocaleString()} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coverage summary */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="font-medium text-gray-900">Indexing Status</h2>
            <Link href="/admin/google-console/coverage" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
            ) : (stats?.coverageCounts ?? []).length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No tracked pages yet — add some in Settings</div>
            ) : (
              (stats?.coverageCounts ?? []).map(c => (
                <div key={c.index_status ?? 'unknown'} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm text-gray-700">{c.index_status || 'Unknown'}</span>
                  <span className="ml-2 shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {c.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Last publish */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="font-medium text-gray-900">Latest GTM Publish</h2>
            <Link href="/admin/google-console/gtm/versions" className="text-xs text-blue-600 hover:underline">View history</Link>
          </div>
          <div className="px-4 py-6 text-sm">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : !stats?.lastVersion ? (
              <div className="text-center text-gray-400">No publish history synced yet</div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="truncate font-medium text-gray-900">{stats.lastVersion.version_name || `Version ${stats.lastVersion.version_id}`}</div>
                  <div className="text-xs text-gray-500">Synced {new Date(stats.lastVersion.last_synced_at).toLocaleString()}</div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
