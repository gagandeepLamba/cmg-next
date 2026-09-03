'use client';

import { useState, useEffect, useCallback } from 'react';
import { Layers, RefreshCw } from 'lucide-react';

interface Tag {
  tag_id: string;
  name: string | null;
  type: string | null;
  status: string | null;
  last_synced_at: string;
}

interface Trigger {
  trigger_id: string;
  name: string | null;
  type: string | null;
  last_synced_at: string;
}

export default function GtmPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/google-console/gtm');
      if (res.ok) {
        const data = await res.json();
        setTags(data.tags ?? []);
        setTriggers(data.triggers ?? []);
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
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Tag Manager</h1>
            <p className="text-sm text-gray-500">Live (published) tags &amp; triggers</p>
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
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="font-medium text-gray-900">Tags ({tags.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : tags.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No tags synced yet</div>
          ) : (
            tags.map(tag => (
              <div key={tag.tag_id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">{tag.name || tag.tag_id}</div>
                  <div className="truncate text-xs text-gray-500">{tag.type}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${tag.status === 'paused' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}`}>
                  {tag.status || 'live'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="font-medium text-gray-900">Triggers ({triggers.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">Loading...</div>
          ) : triggers.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No triggers synced yet</div>
          ) : (
            triggers.map(trigger => (
              <div key={trigger.trigger_id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="truncate text-sm font-medium text-gray-900">{trigger.name || trigger.trigger_id}</span>
                <span className="shrink-0 text-xs text-gray-500">{trigger.type}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
