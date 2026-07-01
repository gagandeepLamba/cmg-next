'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface DeliveryRow {
  id: number;
  meta_lead_id: number;
  full_name: string;
  status: string;
  response_status: number;
  last_error: string;
  retry_count: number;
  next_retry_at: string;
  delivered_at: string;
  created_at: string;
  updated_at: string;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    retry_scheduled: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function MetaLogsPage() {
  const [rows, setRows]         = useState<DeliveryRow[]>([]);
  const [pagination, setPag]    = useState<Pagination>({ page: 1, limit: 25, total: 0, pages: 0 });
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatus] = useState('');
  const [retrying, setRetrying] = useState<number | null>(null);
  const [msg, setMsg]           = useState('');

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (statusFilter) params.set('status', statusFilter);
    try {
      // Re-use the leads API and pivot to delivery view
      const res = await fetch(`/api/admin/meta-leads?${params}`);
      const data = await res.json();

      // Fetch delivery details for each lead row to build log view
      const deliveries: DeliveryRow[] = [];
      for (const lead of (data.data ?? []).slice(0, 25)) {
        deliveries.push({
          id: lead.id,
          meta_lead_id: lead.id,
          full_name: lead.full_name || '—',
          status: lead.delivery_status,
          response_status: 0,
          last_error: lead.last_error || '',
          retry_count: lead.retry_count || 0,
          next_retry_at: '',
          delivered_at: '',
          created_at: lead.created_at,
          updated_at: lead.created_at,
        });
      }
      setRows(deliveries);
      setPag(data.pagination ?? { page: 1, limit: 25, total: 0, pages: 0 });
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(1); }, [load]);

  const retryOne = async (leadId: number) => {
    setRetrying(leadId); setMsg('');
    const res = await fetch('/api/admin/meta-leads/retry-failed', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setMsg(data.succeeded > 0 ? `${data.succeeded} delivery(s) retried successfully.` : 'No successful retries.');
    setRetrying(null);
    load(pagination.page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Delivery Logs</h1>
        <div className="flex gap-2">
          <button
            onClick={() => retryOne(0)}
            disabled={retrying !== null}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${retrying !== null ? 'animate-spin' : ''}`} />
            Retry All Failed
          </button>
          <button onClick={() => load(pagination.page)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {msg && (
        <div className={`rounded-lg px-4 py-2 text-sm ${msg.includes('No ') || msg.includes('failed') ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>
      )}

      <div className="flex gap-2">
        {['', 'delivered', 'failed', 'retry_scheduled', 'pending', 'no_delivery'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Lead</th>
              <th className="px-4 py-3 text-left">CRM Status</th>
              <th className="px-4 py-3 text-left">Error</th>
              <th className="px-4 py-3 text-right">Retries</th>
              <th className="px-4 py-3 text-left">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No logs found</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 font-medium text-gray-900">{row.full_name}</td>
                <td className="px-4 py-2.5"><StatusBadge status={row.status} /></td>
                <td className="px-4 py-2.5 max-w-xs">
                  {row.last_error ? (
                    <span className="truncate text-xs text-red-600 block max-w-[220px]" title={row.last_error}>{row.last_error}</span>
                  ) : '—'}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-500">{row.retry_count}</td>
                <td className="px-4 py-2.5 text-gray-400 text-xs">{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
          <div className="flex gap-1">
            <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)} className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={pagination.page >= pagination.pages} onClick={() => load(pagination.page + 1)} className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
