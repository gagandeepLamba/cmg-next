'use client';

import { SearchableSelect } from '@/components/ui/searchable-select';
import { useSortableData, SortableTh } from '@/components/ui/sortable-th';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isCeo, isBranchManagerOrCeo } from '@/lib/roleChecks';
import { getDiscountTier, canApproveDiscountTier, discountTierLabel, DEFAULT_DISCOUNT_TIER_THRESHOLDS, type DiscountTierThresholds } from '@/lib/discountApproval';
import {
  CheckCircle, XCircle, Clock, DollarSign, User,
  AlertCircle, Search, RefreshCw, ChevronDown, ChevronUp, Filter
} from 'lucide-react';

interface DiscountApproval {
  id: number;
  leadId: number;
  opportunityId: number | null;
  discountType: string;
  discountAmount: number;
  originalAmount: number;
  discountedAmount: number;
  currency: string;
  reason: string;
  requestedBy: number;
  approvedBy: number | null;
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: string;
  approvedAt: string | null;
  rejectedDate: string | null;
  createdAt: string;
  updatedAt: string;
  // joins
  fname?: string;
  lname?: string;
  email?: string;
  mobile?: string;
  opportunityName?: string;
  estimatedValue?: number;
  requestedEmployeeName?: string;
  approvedEmployeeName?: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const TYPE_COLORS: Record<string, string> = {
  percentage: 'bg-blue-100 text-blue-800',
  fixed:      'bg-purple-100 text-purple-800',
  waiver:     'bg-orange-100 text-orange-800',
};

export default function DiscountApprovalsPage() {
  const { user, token } = useAuth();
  const [approvals, setApprovals] = useState<DiscountApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Approval/rejection modal state
  const [modal, setModal] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  // Tiered policy thresholds, staff-editable (see the Tier Settings panel
  // below, CEO only) rather than fixed in code — fetched once and reused for
  // every row, since a single list can mix requests across all three tiers.
  // The backend enforces this too (see /api/discount-approvals[/id] PUT);
  // this just controls button visibility.
  const [thresholds, setThresholds] = useState<DiscountTierThresholds>(DEFAULT_DISCOUNT_TIER_THRESHOLDS);
  const [thresholdsDraft, setThresholdsDraft] = useState<{ autoMaxPercent: string; bmCeoMaxPercent: string } | null>(null);
  const [savingThresholds, setSavingThresholds] = useState(false);

  const fetchThresholds = useCallback(async () => {
    try {
      const res = await fetch('/api/discount-approvals/tier-config');
      const data = await res.json();
      if (res.ok && data.success) setThresholds(data.data);
    } catch {
      // Keep the default thresholds if this fails — same fallback the
      // backend uses, so button visibility stays consistent with enforcement.
    }
  }, []);

  useEffect(() => { fetchThresholds(); }, [fetchThresholds]);

  const canApprove = (a: DiscountApproval) =>
    canApproveDiscountTier(getDiscountTier(Number(a.discountAmount), Number(a.originalAmount), thresholds), user as any);

  const saveThresholds = async () => {
    if (!thresholdsDraft) return;
    setSavingThresholds(true);
    setError('');
    try {
      const res = await fetch('/api/discount-approvals/tier-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          autoMaxPercent: Number(thresholdsDraft.autoMaxPercent),
          bmCeoMaxPercent: Number(thresholdsDraft.bmCeoMaxPercent),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update thresholds');
      setThresholds(data.data);
      setThresholdsDraft(null);
      setSuccess('Discount approval thresholds updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update thresholds');
    } finally {
      setSavingThresholds(false);
    }
  };

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/discount-approvals?${params}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load');
      setApprovals(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load discount approvals');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);

  const handleAction = async () => {
    if (!modal) return;
    try {
      setActionLoading(modal.id);
      const body: any = {
        status: modal.action === 'approve' ? 'approved' : 'rejected',
        approverRole: 'ceo',
        approvedBy: user?.id || 1,
      };
      if (modal.action === 'approve') {
        body.approvedAt = new Date().toISOString();
      } else {
        body.rejectedDate = new Date().toISOString();
        body.reviewNotes = reviewNotes;
      }

      const res = await fetch(`/api/discount-approvals/${modal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Action failed');

      setSuccess(`Discount ${modal.action === 'approve' ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
      setModal(null);
      setReviewNotes('');
      await fetchApprovals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const pct = (d: DiscountApproval) =>
    d.originalAmount > 0
      ? ((d.discountAmount / d.originalAmount) * 100).toFixed(1)
      : '0';

  const filtered = approvals.filter(a => {
    const name = `${a.fname || ''} ${a.lname || ''}`.toLowerCase();
    const s = searchTerm.toLowerCase();
    return !s || name.includes(s) || (a.email || '').toLowerCase().includes(s) ||
           (a.opportunityName || '').toLowerCase().includes(s) ||
           (a.requestedEmployeeName || '').toLowerCase().includes(s);
  });

  const { sorted: sortedApprovals, sortKey: discountSortKey, sortDirection: discountSortDirection, toggleSort: toggleDiscountSort } = useSortableData(
    filtered,
    {
      id: (a) => a.id,
      client: (a) => `${a.fname || ''} ${a.lname || ''}`,
      discount: (a) => pct(a),
      amount: (a) => a.discountedAmount,
      requestedBy: (a) => a.requestedEmployeeName || a.requestedBy,
      status: (a) => a.status,
      date: (a) => a.createdAt,
    },
  );

  const summary = {
    total:    approvals.length,
    pending:  approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discount Approvals</h1>
          <p className="text-gray-500 mt-1">
            0-{thresholds.autoMaxPercent}% is auto-approved. {thresholds.autoMaxPercent}-{thresholds.bmCeoMaxPercent}% needs Branch Manager or CEO. Above {thresholds.bmCeoMaxPercent}% needs the CEO.
          </p>
        </div>
        <button onClick={fetchApprovals}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {isBranchManagerOrCeo(user as any) && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle className="h-5 w-5 shrink-0" />
          You are logged in as an authorized approver{isCeo(user as any) ? '' : ` for ${thresholds.autoMaxPercent}-${thresholds.bmCeoMaxPercent}% requests`}. Pending requests you're authorized for can be approved or rejected below.
        </div>
      )}

      {isCeo(user as any) && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          {thresholdsDraft ? (
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Auto-approve up to (%)</label>
                <input type="number" min={0} max={100} value={thresholdsDraft.autoMaxPercent}
                  onChange={e => setThresholdsDraft({ ...thresholdsDraft, autoMaxPercent: e.target.value })}
                  className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Branch Manager/CEO up to (%)</label>
                <input type="number" min={0} max={100} value={thresholdsDraft.bmCeoMaxPercent}
                  onChange={e => setThresholdsDraft({ ...thresholdsDraft, bmCeoMaxPercent: e.target.value })}
                  className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm" />
              </div>
              <p className="text-xs text-gray-500">Above this is CEO only.</p>
              <div className="flex gap-2 ml-auto">
                <button onClick={() => setThresholdsDraft(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={saveThresholds} disabled={savingThresholds}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                  {savingThresholds ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Discount approval tiers: auto-approve up to <strong>{thresholds.autoMaxPercent}%</strong>, Branch Manager/CEO up to <strong>{thresholds.bmCeoMaxPercent}%</strong>, CEO only above that.
              </p>
              <button
                onClick={() => setThresholdsDraft({ autoMaxPercent: String(thresholds.autoMaxPercent), bmCeoMaxPercent: String(thresholds.bmCeoMaxPercent) })}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                Edit Thresholds
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: summary.total,    icon: <DollarSign className="w-5 h-5 text-blue-600" />,   bg: 'bg-blue-50',   filter: '' },
          { label: 'Pending',  value: summary.pending,  icon: <Clock className="w-5 h-5 text-yellow-600" />,      bg: 'bg-yellow-50', filter: 'pending' },
          { label: 'Approved', value: summary.approved, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50',  filter: 'approved' },
          { label: 'Rejected', value: summary.rejected, icon: <XCircle className="w-5 h-5 text-red-600" />,       bg: 'bg-red-50',    filter: 'rejected' },
        ].map(({ label, value, icon, bg, filter }) => (
          <button key={label}
            onClick={() => setStatusFilter(filter)}
            className={`${bg} rounded-lg p-4 flex items-center gap-3 text-left w-full transition-all ${statusFilter === filter ? 'ring-2 ring-blue-400' : 'hover:opacity-80'}`}>
            {icon}
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Alerts */}
      {error   && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by client, email, opportunity..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <SearchableSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </SearchableSelect>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableTh label="#" sortKey="id" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <SortableTh label="Client" sortKey="client" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <SortableTh label="Discount" sortKey="discount" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <SortableTh label="Amount" sortKey="amount" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <SortableTh label="Requested By" sortKey="requestedBy" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <SortableTh label="Status" sortKey="status" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <SortableTh label="Date" sortKey="date" activeKey={discountSortKey} direction={discountSortDirection} onSort={toggleDiscountSort} />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedApprovals.map(a => {
                const isExpanded = expandedId === a.id;
                const isPending = a.status === 'pending';
                return (
                  <Fragment key={a.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{a.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {a.fname} {a.lname}
                        </div>
                        <div className="text-xs text-gray-500">{a.email}</div>
                        {a.opportunityName && (
                          <div className="text-xs text-blue-600 mt-0.5">{a.opportunityName}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[a.discountType] || 'bg-gray-100 text-gray-700'}`}>
                          {a.discountType}
                        </span>
                        <div className="text-sm font-semibold text-gray-900 mt-1">{pct(a)}%</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500 line-through">{a.currency} {a.originalAmount?.toLocaleString()}</div>
                        <div className="text-sm font-bold text-green-700">{a.currency} {a.discountedAmount?.toLocaleString()}</div>
                        <div className="text-xs text-red-500">-{a.currency} {a.discountAmount?.toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          {a.requestedEmployeeName || `Emp #${a.requestedBy}`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
                        {a.approvedEmployeeName && (
                          <div className="text-xs text-gray-500 mt-0.5">by {a.approvedEmployeeName}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {isPending && canApprove(a) && (
                            <>
                              <button onClick={() => setModal({ id: a.id, action: 'approve' })}
                                disabled={actionLoading === a.id}
                                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                                <CheckCircle className="w-3 h-3" /> Approve
                              </button>
                              <button onClick={() => setModal({ id: a.id, action: 'reject' })}
                                disabled={actionLoading === a.id}
                                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 disabled:opacity-50">
                                <XCircle className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}
                          {isPending && !canApprove(a) && (
                            <span className="text-xs text-gray-500">
                              Awaiting {discountTierLabel(getDiscountTier(Number(a.discountAmount), Number(a.originalAmount), thresholds), thresholds)}
                            </span>
                          )}
                          <button onClick={() => setExpandedId(isExpanded ? null : a.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Reason
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${a.id}-expanded`} className="bg-blue-50">
                        <td colSpan={8} className="px-6 py-3">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Reason: </span>
                            <span className="text-gray-600">{a.reason || '—'}</span>
                          </div>
                          {a.approvedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              Approved: {new Date(a.approvedAt).toLocaleString()}
                            </div>
                          )}
                          {a.rejectedDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              Rejected: {new Date(a.rejectedDate).toLocaleString()}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <DollarSign className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No discount approvals found</p>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
          Showing {filtered.length} of {approvals.length} requests
        </div>
      </div>

      {/* Approve / Reject Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className={`flex items-center gap-3 mb-4`}>
              {modal.action === 'approve'
                ? <CheckCircle className="w-6 h-6 text-green-600" />
                : <XCircle className="w-6 h-6 text-red-600" />}
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {modal.action} Discount Request #{modal.id}
              </h3>
            </div>

            {modal.action === 'approve' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-800">
                This will approve the discount and update the opportunity value accordingly.
              </div>
            ) : (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
                  Please provide a reason for rejection.
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason *</label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={e => setReviewNotes(e.target.value)}
                    placeholder="Explain why this discount is being rejected..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setModal(null); setReviewNotes(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={modal.action === 'reject' && !reviewNotes.trim() || actionLoading === modal.id}
                className={`px-4 py-2 text-white text-sm rounded-lg disabled:opacity-50 ${
                  modal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}>
                {actionLoading === modal.id ? 'Processing...' : `Confirm ${modal.action === 'approve' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
