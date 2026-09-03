'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

interface Version {
  version_id: string;
  version_name: string | null;
  notes: string | null;
  published_at: string | null;
  last_synced_at: string;
}

export default function GtmVersionsPage() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/google-console/gtm/versions');
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Publish History</h1>
            <p className="text-sm text-gray-500">Container version history</p>
          </div>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : versions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No publish history synced yet</div>
          ) : (
            versions.map(v => (
              <div key={v.version_id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-900">{v.version_name || `Version ${v.version_id}`}</span>
                  <span className="shrink-0 text-xs text-gray-400">Synced {new Date(v.last_synced_at).toLocaleString()}</span>
                </div>
                {v.notes && <p className="mt-1 text-xs text-gray-500">{v.notes}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
