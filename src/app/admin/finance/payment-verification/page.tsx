'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, RefreshCw, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, Eye, FileText, ExternalLink
} from 'lucide-react';

interface Payment {
  id: number;
  paymentNumber: string;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
  proofOfPaymentUrl: string;
  status: string;
  accountantStatus: string;
  accountantRemarks: string;
  accountantVerifiedAt: string;
  opportunityId: number;
  opportunityName: string;
  leadId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  createdAt: string;
}

interface Pagination { page: number; limit: number; total: number; pages: number; }

function StatusBadge({ status }: { status: string }) {
  if (status === 'verified') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
      <CheckCircle className="h-3.5 w-3.5" /> Verified
    </span>
  );
  if (status === 'rejected') return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
      <XCircle className="h-3.5 w-3.5" /> Rejected
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
      <Clock className="h-3.5 w-3.5" /> Pending Review
    </span>
  );
}

export default function PaymentVerificationPage() {
  const router = useRouter();
  const [payments, setPayments]   = useState<Payment[]>([]);
  const [pagination, setPag]      = useState<Pagination>({ page: 1, limit: 25, total: 0, pages: 0 });
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('pending');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');
  const [selected, setSelected]   = useState<Payment | null>(null);
  const [remarks, setRemarks]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState('');

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (search)      params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (dateFrom)    params.set('dateFrom', dateFrom);
    if (dateTo)      params.set('dateTo', dateTo);
    try {
      setFetchError('');
      const res = await fetch(`/api/admin/payment-verification?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load payments');
      setPayments(data.data ?? []);
      setPag(data.pagination ?? { page: 1, limit: 25, total: 0, pages: 0 });
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load payments');
    } finally { setLoading(false); }
  }, [search, statusFilter, dateFrom, dateTo]);

  useEffect(() => { load(1); }, [load]);

  const verify = async (status: 'verified' | 'rejected') => {
    if (!selected) return;
    if (status === 'rejected' && !remarks.trim()) {
      setMsg('Please enter remarks explaining why the payment is rejected.'); return;
    }
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/admin/opportunity-payments/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: selected.id, status, remarks }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'Failed to update payment'); return; }
      if (status === 'verified') {
        const agr = data.agreementNumber
          ? ` Agreement number generated: ${data.agreementNumber} — share this with the counsellor to generate the client agreement PDF.`
          : '';
        setMsg(`Payment ${selected.paymentNumber} verified successfully.${agr} The counsellor can now proceed to compliance approval.`);
      } else {
        setMsg(`Payment ${selected.paymentNumber} rejected.`);
      }
      setSelected(null);
      setRemarks('');
      load(pagination.page);
    } finally { setSaving(false); }
  };

  const openDetail = (p: Payment) => { setSelected(p); setRemarks(p.accountantRemarks || ''); setMsg(''); };

  // Summary counts used in header chips
  const pendingCount  = payments.filter(p => p.accountantStatus === 'pending').length;
  const verifiedCount = payments.filter(p => p.accountantStatus === 'verified').length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payment Verification</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and verify client payments before compliance approval can proceed.
            {' '}<span className="text-yellow-600 font-medium">{pendingCount} pending</span>
            {' · '}<span className="text-green-600 font-medium">{verifiedCount} verified</span>
          </p>
        </div>
        <button onClick={() => load(pagination.page)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Fetch error */}
      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      {/* Important note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <strong>Accounts Team: </strong>
        Verify or reject each payment below. Counsellors cannot proceed to compliance approval
        until at least one payment per opportunity is marked <strong>Verified</strong>.
      </div>

      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm ${msg.includes('rejected') || msg.includes('Failed') || msg.includes('Please') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status tabs */}
        {[
          { v: 'pending',  label: `Pending Review` },
          { v: 'verified', label: 'Verified' },
          { v: 'rejected', label: 'Rejected' },
          { v: '',         label: 'All' },
        ].map(({ v, label }) => (
          <button key={v} onClick={() => setStatus(v)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${statusFilter === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search client, payment no..."
            className="h-9 w-56 rounded-lg border border-gray-300 pl-8 pr-3 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="h-9 rounded-lg border border-gray-300 px-2 text-sm focus:ring-2 focus:ring-blue-500" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="h-9 rounded-lg border border-gray-300 px-2 text-sm focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Payment #</th>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-left">Method</th>
              <th className="px-4 py-3 text-left">Proof</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                No payments found{statusFilter === 'pending' ? ' pending review' : ''}.
              </td></tr>
            ) : payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{p.clientName?.trim() || '—'}</div>
                  <div className="text-xs text-gray-400">{p.clientEmail || p.clientPhone || ''}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {p.paymentNumber || `#${p.id}`}
                  {p.transactionId && <div className="text-gray-400">Txn: {p.transactionId}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{p.serviceName || p.opportunityName || '—'}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {p.currency} {Number(p.totalAmount || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-medium text-green-700">
                  {p.currency} {Number(p.paidAmount || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">
                  {(p.paymentMethod || '—').replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3">
                  {p.proofOfPaymentUrl ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <FileText className="h-3.5 w-3.5" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">None</span>
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.accountantStatus} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openDetail(p)}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                      <Eye className="h-3.5 w-3.5" /> Review
                    </button>
                    {p.leadId && (
                      <button onClick={() => router.push(`/admin/leads?leadId=${p.leadId}`)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">
                        <ExternalLink className="h-3.5 w-3.5" /> Lead
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="flex gap-1">
            <button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}
              className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={pagination.page >= pagination.pages} onClick={() => load(pagination.page + 1)}
              className="rounded p-1.5 hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Review Payment</h2>
              <button onClick={() => { setSelected(null); setMsg(''); }}
                className="rounded p-1 text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Payment summary */}
              <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium text-gray-900">{selected.clientName?.trim()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment #</span>
                  <span className="font-mono text-gray-700">{selected.paymentNumber || `#${selected.id}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-medium text-gray-900">{selected.currency} {Number(selected.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-semibold text-green-700">{selected.currency} {Number(selected.paidAmount || 0).toLocaleString()}</span>
                </div>
                {selected.remainingBalance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Balance Due</span>
                    <span className="font-medium text-orange-600">{selected.currency} {Number(selected.remainingBalance).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="capitalize text-gray-700">{(selected.paymentMethod || '—').replace(/_/g, ' ')}</span>
                </div>
                {selected.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono text-gray-700">{selected.transactionId}</span>
                  </div>
                )}
                {selected.paymentDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Date</span>
                    <span className="text-gray-700">{new Date(selected.paymentDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Proof of payment */}
              {selected.proofOfPaymentUrl ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-green-800 font-medium">Proof of Payment uploaded:</span>
                  <span className="truncate text-green-700 text-xs">{selected.proofOfPaymentUrl.split('/').pop()}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2.5 text-sm text-yellow-800">
                  <Clock className="h-4 w-4 shrink-0" />
                  No proof of payment uploaded by counsellor.
                </div>
              )}

              {/* Current status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Current status:</span>
                <StatusBadge status={selected.accountantStatus} />
                {selected.accountantVerifiedAt && (
                  <span className="text-xs text-gray-400">({new Date(selected.accountantVerifiedAt).toLocaleString()})</span>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Remarks {selected.accountantStatus !== 'verified' && <span className="text-red-500">*required for rejection</span>}
                </label>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Add verification notes or reason for rejection..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {msg && (
                <div className={`rounded-lg px-3 py-2 text-sm ${msg.includes('Please') || msg.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {msg}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button onClick={() => { setSelected(null); setMsg(''); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => verify('rejected')} disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
                <XCircle className="h-4 w-4" /> Reject Payment
              </button>
              <button onClick={() => verify('verified')} disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60">
                <CheckCircle className="h-4 w-4" /> Verify Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
