'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, Search, RefreshCw, ChevronLeft, ChevronRight,
  ArrowRight, X, CheckSquare, Filter, UserCheck,
} from 'lucide-react';

interface Lead {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
  nationality: string;
  serviceInterest: string;
  marketSource: string;
  branch: number;
  branchName: string;
  assignTo: number | null;
  assigneeName: string;
  counsellorName: string;
  created: string;
}

interface Branch { id: number; name: string; }

interface Counsellor {
  id: number;
  name: string;
  branchName: string;
}

interface PoolData {
  leads: Lead[];
  total: number;
  counsellors: Counsellor[];
  branches: Branch[];
  roleCategory: string;
  userBranch: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  'follow up': 'bg-yellow-100 text-yellow-800',
  'not interested': 'bg-red-100 text-red-800',
  converted: 'bg-green-100 text-green-800',
  client: 'bg-green-100 text-green-800',
  pending: 'bg-orange-100 text-orange-800',
};

function statusBadge(s: string) {
  const key = s.toLowerCase();
  return STATUS_COLORS[key] || 'bg-slate-100 text-slate-700';
}

function fmtDate(d: string) {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d.slice(0, 10);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const LIMIT = 50;

export default function LeadPool() {
  const [data, setData]               = useState<PoolData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');

  // Filters
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatus]       = useState('');
  const [assignedFilter, setAssigned]   = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');
  const [priorityFilter, setPriority]   = useState('');
  const [branchFilter, setBranch]       = useState('');
  const [nationalityFilter, setNationality] = useState('');
  const [serviceFilter, setService]     = useState('');
  const [marketFilter, setMarket]       = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [page, setPage]                 = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectAllDb, setSelectAllDb] = useState(false); // "select all X in DB"

  // Transfer
  const [counsellorId, setCounsellorId]       = useState('');
  const [transferring, setTransferring]       = useState(false);
  const [confirmVisible, setConfirmVisible]   = useState(false);

  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(LIMIT),
        ...(search          && { search }),
        ...(statusFilter    && { status: statusFilter }),
        ...(assignedFilter  && { assigned: assignedFilter }),
        ...(dateFrom        && { dateFrom }),
        ...(dateTo          && { dateTo }),
        ...(priorityFilter  && { priority: priorityFilter }),
        ...(branchFilter    && { branch: branchFilter }),
        ...(nationalityFilter && { nationality: nationalityFilter }),
        ...(serviceFilter   && { serviceInterest: serviceFilter }),
        ...(marketFilter    && { marketSource: marketFilter }),
      });
      const res = await fetch(`/api/admin/lead-pool?${params}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      setData(await res.json());
      setSelectedIds(new Set());
      setSelectAllDb(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, assignedFilter, dateFrom, dateTo, priorityFilter, branchFilter, nationalityFilter, serviceFilter, marketFilter]);

  // Initial load
  useEffect(() => { load(1); setPage(1); }, [load]);

  // Debounce search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(searchRef.current);
  };

  // Page leads
  const pageLeads = data?.leads ?? [];
  const total     = data?.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;
  const allOnPageSelected = pageLeads.length > 0 && pageLeads.every(l => selectedIds.has(l.id));

  const togglePageAll = () => {
    if (allOnPageSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageLeads.forEach(l => next.delete(l.id));
        return next;
      });
      setSelectAllDb(false);
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        pageLeads.forEach(l => next.add(l.id));
        return next;
      });
    }
  };

  const toggleLead = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSelectAllDb(false);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectAllDb(false);
    setConfirmVisible(false);
  };

  const handleTransfer = async () => {
    if (!counsellorId) { setError('Please select a counsellor'); return; }
    const ids = selectAllDb
      ? 'all'
      : Array.from(selectedIds);

    setTransferring(true);
    setError('');
    try {
      const res = await fetch('/api/admin/lead-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: ids === 'all' ? pageLeads.map(l => l.id) : ids, counsellorId: Number(counsellorId), selectAll: ids === 'all' }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Transfer failed');
      setSuccess(`${j.transferred} lead${j.transferred !== 1 ? 's' : ''} transferred to ${j.counsellorName}`);
      clearSelection();
      setCounsellorId('');
      setConfirmVisible(false);
      load(page);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Transfer failed');
    } finally {
      setTransferring(false);
    }
  };

  const goPage = (p: number) => {
    setPage(p);
    load(p);
  };

  const applyFilters = () => {
    setPage(1);
    load(1);
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setAssigned('');
    setDateFrom('');
    setDateTo('');
    setPriority('');
    setBranch('');
    setNationality('');
    setService('');
    setMarket('');
    setPage(1);
  };

  const selectedCount = selectAllDb ? total : selectedIds.size;

  return (
    <div className="space-y-4 pb-32">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cmg-ink)]">Lead Pool</h1>
          <p className="text-sm text-[var(--cmg-muted)] mt-1">
            {data?.roleCategory === 'branch_manager'
              ? 'Showing leads from your branch — select and transfer to a counsellor'
              : 'All leads across all branches — select and bulk-transfer to a counsellor'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--cmg-muted)]">
          <Users className="w-4 h-4" />
          <span>{total.toLocaleString()} total leads</span>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-800 text-sm">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm">
          <span>{error}</span>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-[var(--cmg-border)] rounded-xl p-4 space-y-3">
        {/* Row 1: main filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cmg-muted)]" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--cmg-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatus(e.target.value)}
            className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Converted">Converted</option>
            <option value="Client">Client</option>
            <option value="Pending">Pending</option>
            <option value="No Response">No Response</option>
          </select>
          <select value={priorityFilter} onChange={e => setPriority(e.target.value)}
            className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]">
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={assignedFilter} onChange={e => setAssigned(e.target.value)}
            className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]">
            <option value="">All Leads</option>
            <option value="unassigned">Unassigned Only</option>
            <option value="assigned">Assigned Only</option>
          </select>
          <button onClick={() => setShowMoreFilters(v => !v)}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-[var(--cmg-border)] text-[var(--cmg-muted)] hover:bg-[#f3f6fb]">
            <Filter className="w-4 h-4" />
            {showMoreFilters ? 'Less Filters' : 'More Filters'}
            {(nationalityFilter || serviceFilter || marketFilter || branchFilter || dateFrom || dateTo) && (
              <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full inline-block" />
            )}
          </button>
          <button onClick={applyFilters}
            className="flex items-center gap-2 bg-[var(--cmg-blue)] text-white text-sm px-4 py-2 rounded-lg hover:opacity-90">
            <Filter className="w-4 h-4" />Filter
          </button>
          <button onClick={resetFilters}
            className="flex items-center gap-2 text-[var(--cmg-muted)] text-sm px-4 py-2 rounded-lg border border-[var(--cmg-border)] hover:bg-[#f3f6fb]">
            <RefreshCw className="w-4 h-4" />Reset
          </button>
        </div>

        {/* Row 2: expanded filters */}
        {showMoreFilters && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--cmg-border)]">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--cmg-muted)] whitespace-nowrap">From</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]" />
              <span className="text-xs text-[var(--cmg-muted)]">To</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]" />
            </div>
            {/* Branch filter (admin only) */}
            {data?.roleCategory !== 'branch_manager' && data?.branches && data.branches.length > 0 && (
              <select value={branchFilter} onChange={e => setBranch(e.target.value)}
                className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]">
                <option value="">All Branches</option>
                {(data.branches as Branch[]).map(b => (
                  <option key={b.id} value={String(b.id)}>{b.name}</option>
                ))}
              </select>
            )}
            {/* Nationality */}
            <input type="text" placeholder="Nationality..." value={nationalityFilter}
              onChange={e => setNationality(e.target.value)}
              className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]" />
            {/* Service Interest */}
            <select value={serviceFilter} onChange={e => setService(e.target.value)}
              className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]">
              <option value="">All Services</option>
              <option value="1">Visit Visa</option>
              <option value="2">Student Visa</option>
              <option value="3">Work Permit</option>
              <option value="4">Business Immigration</option>
              <option value="5">Family Sponsorship</option>
              <option value="6">Permanent Residency</option>
              <option value="7">Citizenship</option>
              <option value="8">Tourist Visa</option>
            </select>
            {/* Market Source */}
            <select value={marketFilter} onChange={e => setMarket(e.target.value)}
              className="text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]">
              <option value="">All Sources</option>
              <option value="1">Walk-in</option>
              <option value="2">Referral</option>
              <option value="3">Facebook</option>
              <option value="4">Instagram</option>
              <option value="5">Website</option>
              <option value="6">Google</option>
              <option value="7">WhatsApp</option>
              <option value="8">Email</option>
            </select>
          </div>
        )}
      </div>

      {/* Select all DB banner */}
      {allOnPageSelected && !selectAllDb && total > pageLeads.length && (
        <div className="bg-[var(--cmg-blue-soft)] border border-[var(--cmg-blue)] rounded-lg px-4 py-2 flex items-center justify-between text-sm">
          <span className="text-[var(--cmg-blue)]">
            All {pageLeads.length} leads on this page are selected.
          </span>
          <button
            onClick={() => setSelectAllDb(true)}
            className="font-semibold text-[var(--cmg-blue)] underline ml-2"
          >
            Select all {total.toLocaleString()} leads
          </button>
        </div>
      )}
      {selectAllDb && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-2 flex items-center justify-between text-sm">
          <span className="text-amber-800">
            All {total.toLocaleString()} leads are selected across all pages.
          </span>
          <button onClick={clearSelection} className="font-semibold text-amber-800 underline ml-2">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[var(--cmg-border)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--cmg-blue)]" />
          </div>
        ) : pageLeads.length === 0 ? (
          <div className="text-center py-16 text-[var(--cmg-muted)]">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f3f6fb] border-b border-[var(--cmg-border)]">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={togglePageAll}
                      className="rounded border-slate-300 text-[var(--cmg-blue)] focus:ring-[var(--cmg-blue)]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--cmg-ink)]">Lead</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--cmg-ink)]">Contact</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--cmg-ink)]">Status</th>
                  {data?.roleCategory === 'admin' && (
                    <th className="px-4 py-3 text-left font-semibold text-[var(--cmg-ink)]">Branch</th>
                  )}
                  <th className="px-4 py-3 text-left font-semibold text-[var(--cmg-ink)]">Assigned To</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--cmg-ink)]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cmg-border)]">
                {pageLeads.map(lead => {
                  const isChecked = selectAllDb || selectedIds.has(lead.id);
                  const name = `${lead.fname} ${lead.lname}`.trim() || `Lead #${lead.id}`;
                  const assignee = lead.assigneeName || lead.counsellorName || '';
                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors cursor-pointer ${isChecked ? 'bg-[var(--cmg-blue-soft)]' : 'hover:bg-[#f9fafb]'}`}
                      onClick={() => toggleLead(lead.id)}
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleLead(lead.id)}
                          className="rounded border-slate-300 text-[var(--cmg-blue)] focus:ring-[var(--cmg-blue)]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--cmg-ink)]">{name}</div>
                        {lead.email && <div className="text-xs text-[var(--cmg-muted)] truncate max-w-48">{lead.email}</div>}
                      </td>
                      <td className="px-4 py-3 text-[var(--cmg-muted)]">
                        {lead.phone || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      {data?.roleCategory === 'admin' && (
                        <td className="px-4 py-3 text-[var(--cmg-muted)] text-xs">{lead.branchName}</td>
                      )}
                      <td className="px-4 py-3">
                        {assignee ? (
                          <span className="flex items-center gap-1 text-[var(--cmg-ink)]">
                            <UserCheck className="w-3.5 h-3.5 text-green-500" />
                            {assignee}
                          </span>
                        ) : (
                          <span className="text-[var(--cmg-muted)] italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--cmg-muted)] text-xs whitespace-nowrap">
                        {fmtDate(lead.created)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--cmg-border)] bg-[#f9fafb]">
            <span className="text-sm text-[var(--cmg-muted)]">
              Page {page} of {totalPages} &middot; {total.toLocaleString()} leads
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-md border border-[var(--cmg-border)] text-[var(--cmg-muted)] hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    className={`w-8 h-8 text-sm rounded-md ${p === page ? 'bg-[var(--cmg-blue)] text-white' : 'border border-[var(--cmg-border)] text-[var(--cmg-muted)] hover:bg-white'}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-md border border-[var(--cmg-border)] text-[var(--cmg-muted)] hover:bg-white disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky transfer bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[var(--cmg-blue)] shadow-2xl px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[var(--cmg-blue)]" />
              <span className="font-semibold text-[var(--cmg-ink)]">
                {selectedCount.toLocaleString()} lead{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex-1 flex items-center gap-3 flex-wrap">
              <select
                value={counsellorId}
                onChange={e => setCounsellorId(e.target.value)}
                className="flex-1 min-w-52 text-sm border border-[var(--cmg-border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--cmg-blue)] text-[var(--cmg-ink)]"
              >
                <option value="">— Select counsellor —</option>
                {(data?.counsellors ?? []).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}{data?.roleCategory === 'admin' && c.branchName ? ` (${c.branchName})` : ''}
                  </option>
                ))}
              </select>

              {!confirmVisible ? (
                <button
                  onClick={() => {
                    if (!counsellorId) { setError('Please select a counsellor first'); return; }
                    setConfirmVisible(true);
                  }}
                  disabled={!counsellorId}
                  className="flex items-center gap-2 bg-[#35AE22] hover:bg-[#1C6B10] disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                >
                  Transfer
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--cmg-muted)]">
                    Transfer {selectedCount} lead{selectedCount !== 1 ? 's' : ''} to{' '}
                    <strong>{data?.counsellors.find(c => String(c.id) === counsellorId)?.name}</strong>?
                  </span>
                  <button
                    onClick={handleTransfer}
                    disabled={transferring}
                    className="flex items-center gap-2 bg-[#35AE22] hover:bg-[#1C6B10] disabled:opacity-70 text-white text-sm font-medium px-4 py-2 rounded-lg"
                  >
                    {transferring ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transferring…
                      </span>
                    ) : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setConfirmVisible(false)}
                    className="text-sm text-[var(--cmg-muted)] px-3 py-2 rounded-lg border border-[var(--cmg-border)] hover:bg-[#f3f6fb]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={clearSelection}
              className="text-[var(--cmg-muted)] hover:text-[var(--cmg-ink)] p-2 rounded-lg hover:bg-[#f3f6fb]"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
