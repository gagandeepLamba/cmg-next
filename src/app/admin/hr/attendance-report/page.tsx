'use client';

import { useEffect, useState } from 'react';
import { useSortableData, SortableTh } from '@/components/ui/sortable-th';
import { RefreshCw, BarChart3 } from 'lucide-react';

interface SummaryRow {
  branch_id: number | null;
  branch_name: string | null;
  department_id: number | null;
  department_name: string | null;
  headcount: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  half_day_count: number;
  leave_count: number;
}

const todayIso = () => new Date().toISOString().slice(0, 10);
const firstOfMonthIso = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
};

export default function AttendanceReportPage() {
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const { sorted: sortedSummary, sortKey: summarySortKey, sortDirection: summarySortDirection, toggleSort: toggleSummarySort } = useSortableData(
    summary,
    {
      branch: (row) => row.branch_name,
      department: (row) => row.department_name,
      headcount: (row) => row.headcount,
      present: (row) => row.present_count,
      absent: (row) => row.absent_count,
      late: (row) => row.late_count,
      halfDay: (row) => row.half_day_count,
      leave: (row) => row.leave_count,
    },
  );
  const [scope, setScope] = useState<'branch' | 'company'>('branch');
  const [dateFrom, setDateFrom] = useState(firstOfMonthIso());
  const [dateTo, setDateTo] = useState(todayIso());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
      const res = await fetch(`/api/admin/hr/attendance-report?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setSummary(json.summary || []);
        setScope(json.scope || 'branch');
      } else {
        setError(json.error || 'Failed to load attendance report');
      }
    } catch {
      setError('Failed to load attendance report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totals = summary.reduce(
    (acc, row) => ({
      headcount: acc.headcount + Number(row.headcount || 0),
      present: acc.present + Number(row.present_count || 0),
      absent: acc.absent + Number(row.absent_count || 0),
      late: acc.late + Number(row.late_count || 0),
      leave: acc.leave + Number(row.leave_count || 0),
    }),
    { headcount: 0, present: 0, absent: 0, late: 0, leave: 0 }
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <BarChart3 className="h-6 w-6 text-blue-600" /> Attendance Reports
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {scope === 'company' ? 'Company-wide attendance, branch and department wise.' : 'Attendance for your branch.'}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <label className="block text-xs font-medium text-slate-700">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Apply
        </button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Headcount</p><p className="text-lg font-semibold text-slate-900">{totals.headcount}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Present</p><p className="text-lg font-semibold text-emerald-600">{totals.present}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Absent</p><p className="text-lg font-semibold text-red-600">{totals.absent}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Late</p><p className="text-lg font-semibold text-amber-600">{totals.late}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">On Leave</p><p className="text-lg font-semibold text-slate-900">{totals.leave}</p></div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <SortableTh label="Branch" sortKey="branch" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Department" sortKey="department" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Headcount" sortKey="headcount" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Present" sortKey="present" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Absent" sortKey="absent" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Late" sortKey="late" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Half-Day" sortKey="halfDay" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
              <SortableTh label="Leave" sortKey="leave" activeKey={summarySortKey} direction={summarySortDirection} onSort={toggleSummarySort} className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400"><RefreshCw className="mr-2 inline h-4 w-4 animate-spin" /> Loading…</td></tr>
            )}
            {!isLoading && sortedSummary.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">No attendance data for this range.</td></tr>
            )}
            {!isLoading && sortedSummary.map((row, index) => (
              <tr key={`${row.branch_id}-${row.department_id}-${index}`} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-700">{row.branch_name || '—'}</td>
                <td className="px-4 py-2 text-slate-700">{row.department_name || '—'}</td>
                <td className="px-4 py-2 text-slate-700">{row.headcount}</td>
                <td className="px-4 py-2 text-emerald-600">{row.present_count}</td>
                <td className="px-4 py-2 text-red-600">{row.absent_count}</td>
                <td className="px-4 py-2 text-amber-600">{row.late_count}</td>
                <td className="px-4 py-2 text-slate-700">{row.half_day_count}</td>
                <td className="px-4 py-2 text-slate-700">{row.leave_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
