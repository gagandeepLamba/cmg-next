'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface Row {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export default function SearchPerformancePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [groupBy, setGroupBy] = useState<'query' | 'page'>('query');
  const [days, setDays] = useState(28);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/google-console/search-performance?groupBy=${groupBy}&days=${days}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [groupBy, days]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Search Performance</h1>
          <p className="text-sm text-gray-500">Clicks, impressions, CTR &amp; position from Search Console</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {(['query', 'page'] as const).map(g => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${groupBy === g ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              By {g === 'query' ? 'Query' : 'Page'}
            </button>
          ))}
        </div>
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={28}>Last 28 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2.5">{groupBy === 'query' ? 'Query' : 'Page'}</th>
              <th className="px-4 py-2.5 text-right">Clicks</th>
              <th className="px-4 py-2.5 text-right">Impressions</th>
              <th className="px-4 py-2.5 text-right">CTR</th>
              <th className="px-4 py-2.5 text-right">Avg Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No data synced yet</td></tr>
            ) : (
              rows.map(row => (
                <tr key={row.key}>
                  <td className="max-w-md truncate px-4 py-2.5 text-gray-900">{row.key}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{row.clicks.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{row.impressions.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{(row.ctr * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2.5 text-right text-gray-700">{row.position.toFixed(1)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
