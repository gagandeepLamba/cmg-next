'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, XCircle, Clock, FileCheck, User,
  Search, RefreshCw, ChevronDown, ChevronUp,
  ExternalLink, AlertCircle, ShieldCheck
} from 'lucide-react';

interface ComplianceApproval {
  id: number;
  leadId: number;
  opportunityId: number | null;
  signedAgreementUrl: string;
  clientSignature: string | null;
  signatureDate: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedBy: number | null;
  reviewedBy: string | null;
  reviewerRole: string | null;
  reviewNotes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:      'bg-yellow-100 text-yellow-800',
  approved:     'bg-green-100 text-green-800',
  rejected:     'bg-red-100 text-red-800',
  under_review: 'bg-blue-100 text-blue-800',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending:      <Clock className="w-4 h-4 text-yellow-500" />,
  approved:     <CheckCircle className="w-4 h-4 text-green-500" />,
  rejected:     <XCircle className="w-4 h-4 text-red-500" />,
  under_review: <AlertCircle className="w-4 h-4 text-blue-500" />,
};

export default function ComplianceApprovalsPage() {
  const [approvals, setApprovals] = useState<ComplianceApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Modal state
  const [modal, setModal] = useState<{
    id: number;
    action: 'approve' | 'reject' | 'under_review';
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/opportunity-compliance-approvals?${params}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to load');
      setApprovals(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load compliance approvals');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchApprovals(); }, [fetchApprovals]);

  const handleAction = async () => {
    if (!modal) return;
    try {
      setActionLoading(modal.id);

      const statusMap = {
        approve:      'approved',
        reject:       'rejected',
        under_review: 'under_review',
      } as const;

      const body: any = {
        status:       statusMap[modal.action],
        reviewedBy:   reviewerName || 'Compliance Officer',
        reviewerRole: 'compliance_officer',
        reviewNotes:  reviewNotes || null,
        reviewedAt:   new Date().toISOString(),
      };

      const res = await fetch(`/api/opportunity-compliance-approvals?id=${modal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Action failed');

      const msgs: Record<string, string> = {
        approve:      'Compliance approved — agreement is now active',
        reject:       'Compliance rejected — counselor will be notified',
        under_review: 'Marked as under review',
      };
      setSuccess(msgs[modal.action]);
      setTimeout(() => setSuccess(''), 4000);
      setModal(null);
      setReviewNotes('');
      setReviewerName('');
      await fetchApprovals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const summary = {
    total:        approvals.length,
    pending:      approvals.filter(a => a.status === 'pending').length,
    under_review: approvals.filter(a => a.status === 'under_review').length,
    approved:     approvals.filter(a => a.status === 'approved').length,
    rejected:     approvals.filter(a => a.status === 'rejected').length,
  };

  const filtered = approvals.filter(a => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return String(a.leadId).includes(s) ||
           String(a.opportunityId || '').includes(s) ||
           (a.reviewedBy || '').toLowerCase().includes(s) ||
           (a.reviewNotes || '').toLowerCase().includes(s);
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Compliance Approvals</h1>
          <p className="text-gray-500 mt-1">Review signed agreements submitted after lead-to-opportunity conversion</p>
        </div>
        <button onClick={fetchApprovals}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>Compliance workflow:</strong> After a lead is converted to an opportunity and the client signs the agreement,
          counselors submit the signed agreement here for compliance review. Only a compliance officer can approve or reject.
          Approved agreements unlock the full operations module for the client.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total',        value: summary.total,        icon: <FileCheck className="w-5 h-5 text-gray-600" />,    bg: 'bg-gray-50',    filter: '' },
          { label: 'Pending',      value: summary.pending,      icon: <Clock className="w-5 h-5 text-yellow-600" />,      bg: 'bg-yellow-50',  filter: 'pending' },
          { label: 'Under Review', value: summary.under_review, icon: <AlertCircle className="w-5 h-5 text-blue-600" />,  bg: 'bg-blue-50',    filter: 'under_review' },
          { label: 'Approved',     value: summary.approved,     icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50',   filter: 'approved' },
          { label: 'Rejected',     value: summary.rejected,     icon: <XCircle className="w-5 h-5 text-red-600" />,       bg: 'bg-red-50',     filter: 'rejected' },
        ].map(({ label, value, icon, bg, filter }) => (
          <button key={label}
            onClick={() => setStatusFilter(filter)}
            className={`${bg} rounded-lg p-3 flex items-center gap-3 text-left w-full transition-all ${statusFilter === filter ? 'ring-2 ring-blue-400' : 'hover:opacity-80'}`}>
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
          <input type="text" placeholder="Search by lead ID, reviewer, notes..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Lead / Opportunity', 'Signed Agreement', 'Submitted', 'Status', 'Reviewer', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(a => {
                const isExpanded = expandedId === a.id;
                const isPending = a.status === 'pending' || a.status === 'under_review';
                return (
                  <>
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">{a.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">Lead #{a.leadId}</div>
                        {a.opportunityId && (
                          <div className="text-xs text-blue-600">Opp #{a.opportunityId}</div>
                        )}
                        {a.signatureDate && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            Signed: {new Date(a.signatureDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {a.signedAgreementUrl ? (
                          <a href={a.signedAgreementUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
                            <ExternalLink className="w-3 h-3" /> View Agreement
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs italic">No file</span>
                        )}
                        {a.clientSignature && (
                          <div className="text-xs text-gray-500 mt-0.5">Sig: {a.clientSignature}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(a.submittedAt).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{new Date(a.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        {a.submittedBy && (
                          <div className="text-xs text-gray-500 flex items-center gap-0.5 mt-0.5">
                            <User className="w-3 h-3" /> #{a.submittedBy}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {STATUS_ICONS[a.status]}
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-700'}`}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {a.reviewedBy ? (
                          <div>
                            <div className="text-sm text-gray-900">{a.reviewedBy}</div>
                            <div className="text-xs text-gray-400">{a.reviewerRole}</div>
                            {a.reviewedAt && (
                              <div className="text-xs text-gray-400">{new Date(a.reviewedAt).toLocaleDateString()}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Not reviewed</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {isPending && (
                            <>
                              <button onClick={() => setModal({ id: a.id, action: 'approve' })}
                                disabled={actionLoading === a.id}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50">
                                <CheckCircle className="w-3 h-3" /> Approve
                              </button>
                              {a.status === 'pending' && (
                                <button onClick={() => setModal({ id: a.id, action: 'under_review' })}
                                  disabled={actionLoading === a.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50">
                                  <AlertCircle className="w-3 h-3" /> Review
                                </button>
                              )}
                              <button onClick={() => setModal({ id: a.id, action: 'reject' })}
                                disabled={actionLoading === a.id}
                                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50">
                                <XCircle className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}
                          {a.reviewNotes && (
                            <button onClick={() => setExpandedId(isExpanded ? null : a.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              Notes
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && a.reviewNotes && (
                      <tr key={`${a.id}-notes`} className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-3">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Review Notes: </span>
                            <span className="text-gray-600">{a.reviewNotes}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <ShieldCheck className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No compliance approvals found</p>
            <p className="text-gray-400 text-xs mt-1">
              Compliance submissions appear here after counselors submit signed agreements
            </p>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
          Showing {filtered.length} of {approvals.length} submissions
        </div>
      </div>

      {/* Action Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              {modal.action === 'approve'
                ? <CheckCircle className="w-6 h-6 text-green-600" />
                : modal.action === 'under_review'
                  ? <AlertCircle className="w-6 h-6 text-blue-600" />
                  : <XCircle className="w-6 h-6 text-red-600" />}
              <h3 className="text-lg font-semibold text-gray-900">
                {modal.action === 'approve' ? 'Approve Compliance' :
                 modal.action === 'under_review' ? 'Mark Under Review' :
                 'Reject Compliance'}
              </h3>
            </div>

            {/* Context */}
            {modal.action === 'approve' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-800">
                Approving this agreement confirms the client has signed and the compliance check passed.
                The case will be unlocked for the operations team.
              </div>
            )}
            {modal.action === 'under_review' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                Mark this submission as under review. Add notes to inform the counselor of what is being checked.
              </div>
            )}
            {modal.action === 'reject' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
                Rejecting will notify the counselor that the signed agreement is not acceptable. Provide a clear reason.
              </div>
            )}

            {/* Reviewer name */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (Reviewer)</label>
              <input type="text" value={reviewerName} onChange={e => setReviewerName(e.target.value)}
                placeholder="Compliance officer name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {modal.action === 'reject' ? 'Rejection Reason *' : 'Notes (optional)'}
              </label>
              <textarea rows={3} value={reviewNotes} onChange={e => setReviewNotes(e.target.value)}
                placeholder={
                  modal.action === 'approve' ? 'Any compliance notes for the record...' :
                  modal.action === 'under_review' ? 'What is being reviewed...' :
                  'Why is this agreement being rejected?'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setModal(null); setReviewNotes(''); setReviewerName(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAction}
                disabled={
                  (modal.action === 'reject' && !reviewNotes.trim()) ||
                  actionLoading === modal.id
                }
                className={`px-4 py-2 text-white text-sm rounded-lg disabled:opacity-50 ${
                  modal.action === 'approve'      ? 'bg-green-600 hover:bg-green-700' :
                  modal.action === 'under_review' ? 'bg-blue-600 hover:bg-blue-700' :
                                                    'bg-red-600 hover:bg-red-700'
                }`}>
                {actionLoading === modal.id ? 'Processing...' :
                  modal.action === 'approve'      ? 'Confirm Approval' :
                  modal.action === 'under_review' ? 'Mark Under Review' :
                                                    'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
