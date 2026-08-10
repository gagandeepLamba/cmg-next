'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useSortableData, SortableTh } from '@/components/ui/sortable-th';
import { useAuth } from '@/contexts/AuthContext';
import { getOperationsModule } from '@/lib/operationsModules';
import { Users, Search, RefreshCw, ExternalLink } from 'lucide-react';

interface ClientRow {
  leadId: number;
  opportunityId: number;
  fname: string | null;
  lname: string | null;
  email: string | null;
  mobile: string | null;
  phone: string | null;
  leadStatus: string | null;
  opportunityStatus: string | null;
  branch: number | null;
  branchName: string | null;
  counselorName: string | null;
  agreementNumber: string | null;
  retentionDate: string | null;
}

export default function OperationsModuleClientListPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const moduleKey = String(params?.module || '');
  const moduleInfo = getOperationsModule(moduleKey);

  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ module: moduleKey, limit: '500' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/operations/search?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to load clients');
      setRows(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(load, search ? 350 : 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, search]);

  const branchOptions = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach((row) => {
      if (row.branch != null) seen.set(String(row.branch), row.branchName || `Branch ${row.branch}`);
    });
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const statusOptions = useMemo(() => {
    const seen = new Set<string>();
    rows.forEach((row) => {
      const status = row.opportunityStatus || row.leadStatus;
      if (status) seen.add(status);
    });
    return Array.from(seen);
  }, [rows]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    if (branchFilter && String(row.branch || '') !== branchFilter) return false;
    if (statusFilter && (row.opportunityStatus || row.leadStatus) !== statusFilter) return false;
    return true;
  }), [rows, branchFilter, statusFilter]);

  const { sorted: sortedRows, sortKey, sortDirection, toggleSort } = useSortableData(
    filteredRows,
    {
      name: (row: ClientRow) => `${row.fname || ''} ${row.lname || ''}`,
      contact: (row: ClientRow) => row.email || row.mobile || row.phone,
      branch: (row: ClientRow) => row.branchName,
      counselor: (row: ClientRow) => row.counselorName,
      status: (row: ClientRow) => row.opportunityStatus || row.leadStatus,
      agreement: (row: ClientRow) => row.agreementNumber,
      retained: (row: ClientRow) => row.retentionDate,
    },
  );

  const openCase = (row: ClientRow) => {
    if (!moduleInfo) return;
    const clientName = [row.fname, row.lname].filter(Boolean).join(' ').trim() || 'Client';
    const url = new URLSearchParams({
      leadId: String(row.leadId),
      opportunityId: String(row.opportunityId),
      clientName,
    });
    router.push(`${moduleInfo.wizardRoute}?${url.toString()}`);
  };

  if (!moduleInfo) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Unknown operations module: {moduleKey}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" /> {moduleInfo.label} — Clients
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Every won/retained client tagged to this program. Open a client to work their case in the operations wizard.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, agreement number, email, or phone..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <SearchableSelect value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All Branches</option>
          {branchOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </SearchableSelect>
        <SearchableSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All Statuses</option>
          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </SearchableSelect>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableTh label="Client" sortKey="name" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableTh label="Contact" sortKey="contact" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableTh label="Branch" sortKey="branch" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableTh label="Counselor" sortKey="counselor" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableTh label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableTh label="Agreement" sortKey="agreement" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableTh label="Retained" sortKey="retained" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
                </td></tr>
              ) : sortedRows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">No {moduleInfo.label} clients found.</td></tr>
              ) : sortedRows.map((row) => (
                <tr key={`${row.leadId}-${row.opportunityId}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button onClick={() => openCase(row)} className="text-sm font-semibold text-blue-700 hover:underline text-left">
                      {[row.fname, row.lname].filter(Boolean).join(' ') || `Lead ${row.leadId}`}
                    </button>
                    <div className="text-xs text-gray-400">Lead #{row.leadId}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>{row.email || '—'}</div>
                    <div>{row.mobile || row.phone || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.branchName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.counselorName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {row.opportunityStatus || row.leadStatus || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.agreementNumber || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{row.retentionDate ? new Date(row.retentionDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openCase(row)} className="flex items-center gap-1 text-blue-600 hover:text-blue-900 text-sm font-medium">
                      <ExternalLink size={14} /> Open Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
          Showing {sortedRows.length} of {rows.length} {moduleInfo.label} clients
        </div>
      </div>
    </div>
  );
}
