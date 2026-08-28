'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isBranchManagerOrCeo, isCeo, isFoe } from '@/lib/roleChecks';
import { DollarSign, RefreshCw, AlertCircle, CreditCard, Search } from 'lucide-react';
import { useSortableData } from '@/components/ui/sortable-th';
import { RecordCard, RecordList, SortButtonRow } from '@/components/shared/ResponsiveRecordList';

interface BalanceRow {
  opportunityId: number;
  opportunityName: string;
  opportunityStatus: string;
  stage: string;
  leadId: number;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  payTotal: number;
  paidYet: number;
  payBalance: number;
  dueDate: string | null;
  demdRemark: string | null;
  branchId: number | null;
  branchName: string | null;
  assignedEmployeeName: string | null;
  serviceName: string | null;
  agreementNumber: string | null;
}

export default function BalancePaymentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<BalanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const scopeLabel = isCeo(user as any)
    ? 'Showing outstanding balances for every branch.'
    : isBranchManagerOrCeo(user as any) || isFoe(user as any)
      ? 'Showing outstanding balances for your branch.'
      : 'Showing outstanding balances from your own opportunities.';

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/balance-payments');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load balance payments');
      setRows(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load balance payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const fmt = (n: number) => `AED ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filteredRows = rows.filter((row) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const name = `${row.fname || ''} ${row.lname || ''}`.toLowerCase();
    return name.includes(q) || (row.agreementNumber || '').toLowerCase().includes(q);
  });

  const { sorted: sortedRows, sortKey: balanceSortKey, sortDirection: balanceSortDirection, toggleSort: toggleBalanceSort } = useSortableData(
    filteredRows,
    {
      client: (row) => `${row.fname || ''} ${row.lname || ''}`,
      agreementNumber: (row) => row.agreementNumber,
      service: (row) => row.serviceName,
      branch: (row) => row.branchName,
      counselor: (row) => row.assignedEmployeeName,
      total: (row) => row.payTotal,
      paid: (row) => row.paidYet,
      balance: (row) => row.payBalance,
      dueDate: (row) => row.dueDate,
    },
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-7 w-7 text-blue-600" /> Balance Payments
          </h1>
          <p className="mt-1 text-sm text-gray-500">{scopeLabel}</p>
        </div>
        <button
          onClick={fetchRows}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agreement number or client name…"
          className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-3">
          <SortButtonRow
            options={[
              ['client', 'Client'],
              ['agreementNumber', 'Agreement #'],
              ['service', 'Service'],
              ['branch', 'Branch'],
              ['counselor', 'Counselor'],
              ['total', 'Total'],
              ['paid', 'Paid'],
              ['balance', 'Balance'],
              ['dueDate', 'Due Date'],
            ] as const}
            activeKey={balanceSortKey}
            direction={balanceSortDirection}
            onSort={toggleBalanceSort}
          />
          <RecordList
            loading={loading}
            isEmpty={!loading && sortedRows.length === 0}
            emptyIcon={DollarSign}
            emptyTitle="No outstanding balances found"
          >
            {sortedRows.map((row) => (
              <RecordCard
                key={row.opportunityId}
                avatar={<DollarSign className="h-4 w-4" />}
                avatarColorClass="from-blue-600 to-cyan-400"
                title={<span className="min-w-0 break-words text-base font-bold text-gray-950">{row.fname} {row.lname}</span>}
                titleBadges={row.agreementNumber ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{row.agreementNumber}</span> : undefined}
                metaItems={[{ icon: AlertCircle, text: row.email, key: 'email' }]}
                stats={[
                  { label: 'Service', value: row.serviceName || '—' },
                  { label: 'Branch', value: row.branchName || '—' },
                  { label: 'Counselor', value: row.assignedEmployeeName || '—' },
                  { label: 'Total', value: fmt(row.payTotal) },
                  { label: 'Paid', value: <span className="text-green-700">{fmt(row.paidYet)}</span> },
                  { label: 'Balance', value: <span className="font-bold text-red-600">{fmt(row.payBalance)}</span> },
                  { label: 'Due Date', value: row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—' },
                ]}
                actions={[
                  { key: 'pay', icon: CreditCard, label: 'Make Payment', onClick: () => router.push(`/admin/balance-payments/pay?leadId=${row.leadId}&opportunityId=${row.opportunityId}`), colorClass: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                ]}
              />
            ))}
          </RecordList>
        </div>
      </div>
    </div>
  );
}
