'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Plus, Trash2, RefreshCw } from 'lucide-react';

interface TrackedPage {
  id: number;
  page_url: string;
  label: string | null;
  added_at: string;
  index_status: string | null;
  coverage_state: string | null;
  last_crawl_time: string | null;
  checked_at: string | null;
}

interface Sitemap {
  sitemap_path: string;
  is_pending: number;
  last_submitted: string | null;
  last_downloaded: string | null;
  warnings: number;
  errors: number;
  submitted_url_count: number;
}

const STATUS_STYLES: Record<string, string> = {
  PASS: 'bg-green-100 text-green-800',
  FAIL: 'bg-red-100 text-red-800',
  NEUTRAL: 'bg-gray-100 text-gray-600',
  PARTIAL: 'bg-yellow-100 text-yellow-800',
};

export default function CoveragePage() {
  const [trackedPages, setTrackedPages] = useState<TrackedPage[]>([]);
  const [sitemaps, setSitemaps] = useState<Sitemap[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/google-console/coverage');
      if (res.ok) {
        const data = await res.json();
        setTrackedPages(data.trackedPages ?? []);
        setSitemaps(data.sitemaps ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addPage = async () => {
    if (!newUrl.trim()) return;
    setAdding(true);
    try {
      const res = await fetch('/api/admin/google-console/settings/tracked-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_url: newUrl.trim(), label: newLabel.trim() || undefined }),
      });
      if (res.ok) {
        setNewUrl('');
        setNewLabel('');
        load();
      }
    } finally {
      setAdding(false);
    }
  };

  const removePage = async (id: number) => {
    await fetch(`/api/admin/google-console/settings/tracked-pages?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <CheckCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Indexing &amp; Coverage</h1>
          <p className="text-sm text-gray-500">A curated list of pages, since Google has no bulk coverage API</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 font-medium text-gray-900">Tracked Pages</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://cmgone.org/..."
            className="min-w-[240px] flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          />
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="Label (optional)"
            className="w-40 rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          />
          <button
            onClick={addPage}
            disabled={adding || !newUrl.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-2 py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : trackedPages.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-gray-400">No pages tracked yet — add one above</div>
          ) : (
            trackedPages.map(page => (
              <div key={page.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">{page.label || page.page_url}</div>
                  <div className="truncate text-xs text-gray-500">{page.page_url}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {page.index_status ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[page.index_status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {page.index_status}
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">Not checked</span>
                  )}
                  <button onClick={() => removePage(page.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="font-medium text-gray-900">Sitemaps</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : sitemaps.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No sitemaps synced yet</div>
          ) : (
            sitemaps.map(sm => (
              <div key={sm.sitemap_path} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="truncate text-sm text-gray-700">{sm.sitemap_path}</span>
                <div className="flex shrink-0 items-center gap-3 text-xs text-gray-500">
                  <span>{sm.submitted_url_count} URLs</span>
                  {sm.errors > 0 && <span className="flex items-center gap-1 text-red-600"><XCircle className="h-3.5 w-3.5" />{sm.errors} errors</span>}
                  {sm.warnings > 0 && <span className="text-yellow-600">{sm.warnings} warnings</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
