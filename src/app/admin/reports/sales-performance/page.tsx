'use client';

import { useCallback, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Target, DollarSign, Award, Filter as FilterIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useAuth } from '@/contexts/AuthContext';
import { useSortableData, SortableTh } from '@/components/ui/sortable-th';

interface MonthlyPoint {
  month: string;
  monthLabel: string;
  leadsCount: number;
  wonCount: number;
  revenueAed: number;
  avgSaleAed: number;
  conversionRate: number;
}

interface EntityRow {
  id: number;
  name: string;
  branchName?: string | null;
  branchManagerName?: string | null;
  leadsCount: number;
  wonCount: number;
  revenueAed: number;
  avgSaleAed: number;
  conversionRate: number;
}

interface BreakdownRow {
  label: string;
  count: number;
  percent: number;
}

interface SourcePerformanceRow {
  source: string;
  leadsCount: number;
  wonCount: number;
  revenueAed: number;
  avgSaleAed: number;
  conversionRate: number;
}

interface MomComparison {
  thisMonth: MonthlyPoint;
  lastMonth: MonthlyPoint;
  salesChangePct: number;
  leadsChangePct: number;
  wonChangePct: number;
  avgSaleChangePct: number;
  conversionChangePts: number;
}

const fmtAed = (v: number) => `AED ${Number(v || 0).toLocaleString('en', { maximumFractionDigits: 0 })}`;

// Fixed categorical order, reused across both trend charts — never cycled.
const SERIES_COLOR = { leads: '#2563eb', won: '#16a34a', revenue: '#2563eb' };

function DeltaBadge({ value, suffix = '%', invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  const negative = invert ? value > 0 : value < 0;
  const Icon = value === 0 ? Minus : positive ? TrendingUp : TrendingDown;
  const color = value === 0 ? 'text-gray-400' : positive ? 'text-green-600' : negative ? 'text-red-600' : 'text-gray-400';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      {value > 0 ? '+' : ''}{value}{suffix} vs last month
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, delta }: { icon: React.ElementType; label: string; value: string; delta?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-gray-500 uppercase">{label}</div>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="text-xl font-bold text-gray-900 mt-1">{value}</div>
      {delta && <div className="mt-1">{delta}</div>}
    </div>
  );
}

// Fixed color per breakdown card (identity, not magnitude) — status uses the
// app's existing blue "informational" tone, source uses violet to stay
// visually distinct from every other blue/green series on this page.
function BreakdownCard({ title, rows, barColor }: { title: string; rows: BreakdownRow[]; barColor: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">No data for this period</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700 truncate max-w-[70%]" title={r.label}>{r.label}</span>
                <span className="text-gray-500 tabular-nums">{r.count} &middot; {r.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(2, (r.count / max) * 100)}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PerformanceTable({ title, rows, showBranch, showManager }: { title: string; rows: EntityRow[]; showBranch?: boolean; showManager?: boolean }) {
  const { sorted: sortedRows, sortKey, sortDirection, toggleSort } = useSortableData(
    rows,
    {
      name: (r) => r.name,
      branch: (r) => r.branchName,
      manager: (r) => r.branchManagerName,
      leads: (r) => r.leadsCount,
      won: (r) => r.wonCount,
      conversion: (r) => r.conversionRate,
      revenue: (r) => r.revenueAed,
      avgSale: (r) => r.avgSaleAed,
    },
  );
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableTh label="Name" sortKey="name" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              {showBranch && <SortableTh label="Branch" sortKey="branch" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />}
              {showManager && <SortableTh label="Branch Manager" sortKey="manager" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />}
              <SortableTh label="Leads" sortKey="leads" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableTh label="Won" sortKey="won" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableTh label="Conversion" sortKey="conversion" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableTh label="Revenue (AED)" sortKey="revenue" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
              <SortableTh label="Avg Sale (AED)" sortKey="avgSale" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRows.length === 0 ? (
              <tr><td colSpan={showBranch || showManager ? 7 : 6} className="px-4 py-8 text-center text-gray-400 text-sm">No data for this period</td></tr>
            ) : sortedRows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{r.name}</td>
                {showBranch && <td className="px-4 py-2.5 text-sm text-gray-500">{r.branchName || 'N/A'}</td>}
                {showManager && <td className="px-4 py-2.5 text-sm text-gray-500">{r.branchManagerName || 'Unassigned'}</td>}
                <td className="px-4 py-2.5 text-sm text-gray-600">{r.leadsCount}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{r.wonCount}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.conversionRate >= 20 ? 'bg-green-100 text-green-700' : r.conversionRate > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {r.conversionRate}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-right font-medium text-gray-900">{fmtAed(r.revenueAed)}</td>
                <td className="px-4 py-2.5 text-sm text-right text-gray-600">{fmtAed(r.avgSaleAed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SalesPerformanceReportPage() {
  const { user } = useAuth();
  const [months, setMonths] = useState(3);
  const [branchId, setBranchId] = useState('');
  const [counselorId, setCounselorId] = useState('');
  const [trend, setTrend] = useState<MonthlyPoint[]>([]);
  const [momComparison, setMomComparison] = useState<MomComparison | null>(null);
  const [branchPerformance, setBranchPerformance] = useState<EntityRow[]>([]);
  const [counselorPerformance, setCounselorPerformance] = useState<EntityRow[]>([]);
  const [leadStatusBreakdown, setLeadStatusBreakdown] = useState<BreakdownRow[]>([]);
  const [leadSourceBreakdown, setLeadSourceBreakdown] = useState<BreakdownRow[]>([]);
  const [sourcePerformance, setSourcePerformance] = useState<SourcePerformanceRow[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ branches: { id: number; name: string }[]; counselors: { id: number; name: string }[] }>({ branches: [], counselors: [] });
  const [scope, setScope] = useState<'full' | 'branch' | 'self'>('full');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ months: String(months) });
      if (branchId) params.set('branchId', branchId);
      if (counselorId) params.set('counselorId', counselorId);
      const res = await fetch(`/api/admin/reports/sales-performance?${params.toString()}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to load sales performance report');
      setTrend(result.trend || []);
      setMomComparison(result.momComparison || null);
      setBranchPerformance(result.branchPerformance || []);
      setCounselorPerformance(result.counselorPerformance || []);
      setLeadStatusBreakdown(result.leadStatusBreakdown || []);
      setLeadSourceBreakdown(result.leadSourceBreakdown || []);
      setSourcePerformance(result.sourcePerformance || []);
      setFilterOptions(result.filters || { branches: [], counselors: [] });
      setScope(result.scope || 'full');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sales performance report');
    } finally {
      setLoading(false);
    }
  }, [months, branchId, counselorId]);

  useEffect(() => { load(); }, [load]);

  // Counselor list is branch-scoped server-side — switching branch can drop
  // the currently selected counselor, so reset it rather than filter silently.
  useEffect(() => { setCounselorId(''); }, [branchId]);

  const { sorted: sortedSourcePerformance, sortKey: sourceSortKey, sortDirection: sourceSortDirection, toggleSort: toggleSourceSort } = useSortableData(
    sourcePerformance,
    {
      source: (s) => s.source,
      leads: (s) => s.leadsCount,
      won: (s) => s.wonCount,
      conversion: (s) => s.conversionRate,
      revenue: (s) => s.revenueAed,
      avgSale: (s) => s.avgSaleAed,
    },
  );

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Performance Report</h1>
          <p className="text-gray-600 mt-1">
            {scope === 'full' ? 'Company-wide sales trend and team performance' : scope === 'branch' ? 'Your branch\'s sales trend and team performance' : 'Your own sales trend'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterIcon className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Trend window</span>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>
          {scope === 'full' && (
            <SearchableSelect
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              {filterOptions.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </SearchableSelect>
          )}
          {scope !== 'self' && (
            <SearchableSelect
              value={counselorId}
              onChange={(e) => setCounselorId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Counselors</option>
              {filterOptions.counselors.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SearchableSelect>
          )}
          {(branchId || counselorId || months !== 3) && (
            <button
              onClick={() => { setBranchId(''); setCounselorId(''); setMonths(3); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {/* Month-over-month KPIs */}
          {momComparison && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                icon={DollarSign}
                label="This Month Sales"
                value={fmtAed(momComparison.thisMonth.revenueAed)}
                delta={<DeltaBadge value={momComparison.salesChangePct} />}
              />
              <KpiCard
                icon={Users}
                label="This Month Leads"
                value={String(momComparison.thisMonth.leadsCount)}
                delta={<DeltaBadge value={momComparison.leadsChangePct} />}
              />
              <KpiCard
                icon={Target}
                label="Conversion Rate"
                value={`${momComparison.thisMonth.conversionRate}%`}
                delta={<DeltaBadge value={momComparison.conversionChangePts} suffix=" pts" />}
              />
              <KpiCard
                icon={Award}
                label="Avg Sale Value"
                value={fmtAed(momComparison.thisMonth.avgSaleAed)}
                delta={<DeltaBadge value={momComparison.avgSaleChangePct} />}
              />
            </div>
          )}

          {/* Trend charts — leads vs won share one axis (count); revenue gets
              its own chart since AED is a different scale (never dual-axis). */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Leads vs Conversions ({months}-month trend)</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trend} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leadsCount" name="Leads" fill={SERIES_COLOR.leads} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="wonCount" name="Won" fill={SERIES_COLOR.won} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue Trend, AED ({months}-month)</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trend} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip formatter={(value) => fmtAed(Number(value))} />
                    <Bar dataKey="revenueAed" name="Revenue (AED)" fill={SERIES_COLOR.revenue} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lead pipeline breakdowns — where leads currently sit, and where they came from. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BreakdownCard title="Leads by Status" rows={leadStatusBreakdown} barColor="#2563eb" />
            <BreakdownCard title="Leads by Source" rows={leadSourceBreakdown} barColor="#7c3aed" />
          </div>

          {/* Which channels actually convert, not just which generate volume. */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Lead Conversion by Source ({months}-month)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableTh label="Source" sortKey="source" activeKey={sourceSortKey} direction={sourceSortDirection} onSort={toggleSourceSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    <SortableTh label="Leads" sortKey="leads" activeKey={sourceSortKey} direction={sourceSortDirection} onSort={toggleSourceSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    <SortableTh label="Won" sortKey="won" activeKey={sourceSortKey} direction={sourceSortDirection} onSort={toggleSourceSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    <SortableTh label="Conversion" sortKey="conversion" activeKey={sourceSortKey} direction={sourceSortDirection} onSort={toggleSourceSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    <SortableTh label="Revenue (AED)" sortKey="revenue" activeKey={sourceSortKey} direction={sourceSortDirection} onSort={toggleSourceSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                    <SortableTh label="Avg Sale (AED)" sortKey="avgSale" activeKey={sourceSortKey} direction={sourceSortDirection} onSort={toggleSourceSort} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedSourcePerformance.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No data for this period</td></tr>
                  ) : sortedSourcePerformance.map((s) => (
                    <tr key={s.source} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{s.source}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{s.leadsCount}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{s.wonCount}</td>
                      <td className="px-4 py-2.5 text-sm">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.conversionRate >= 20 ? 'bg-green-100 text-green-700' : s.conversionRate > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.conversionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium text-gray-900">{fmtAed(s.revenueAed)}</td>
                      <td className="px-4 py-2.5 text-sm text-right text-gray-600">{fmtAed(s.avgSaleAed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly detail table — the always-available table view alongside the charts above. */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Monthly Detail</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Month', 'Leads', 'Won', 'Conversion', 'Revenue (AED)', 'Avg Sale (AED)'].map((h) => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trend.map((m) => (
                    <tr key={m.month} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{m.monthLabel}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{m.leadsCount}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{m.wonCount}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600">{m.conversionRate}%</td>
                      <td className="px-4 py-2.5 text-sm text-right font-medium text-gray-900">{fmtAed(m.revenueAed)}</td>
                      <td className="px-4 py-2.5 text-sm text-right text-gray-600">{fmtAed(m.avgSaleAed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance breakdowns */}
          {scope === 'full' && !branchId && (
            <PerformanceTable title="Branch Performance" rows={branchPerformance} showManager />
          )}
          {scope !== 'self' && (
            <PerformanceTable title="Counselor Performance" rows={counselorPerformance} showBranch />
          )}
        </>
      )}
    </div>
  );
}
