'use client';

import { useEffect, useState } from 'react';

type PerformanceRow = {
  counselorId: number;
  name: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  rank: number;
};

const emptySummary = { totalActivities: 0, totalCounselors: 0, totalRevenue: 0, avgConversionRate: 0 };
const formatCurrency = (value: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value || 0);

export default function LeadPerformanceReportPage() {
  const [rows, setRows] = useState<PerformanceRow[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const end = new Date();
        const start = new Date(end);
        start.setMonth(start.getMonth() - 6);
        const response = await fetch(`/api/reports/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              name: 'Lead Performance',
              period: 'custom',
              startDate: start.toISOString().split('T')[0],
              endDate: end.toISOString().split('T')[0],
              counselors: [],
              includeCharts: false,
              includeDetails: true,
              includeTrends: true,
              format: 'json',
              sections: { summary: true, performance: true, activities: false, revenue: false, issues: false, trends: false, recommendations: false }
            }
          })
        });
        const data = await response.json();
        setRows(data.data?.performance || []);
        setSummary(data.data?.summary || emptySummary);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading lead performance...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Performance</h1>
        <p className="mt-1 text-gray-600">Counselor lead volume, conversions, and revenue.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat label="Leads" value={summary.totalActivities} />
        <Stat label="Counselors" value={summary.totalCounselors} />
        <Stat label="Revenue" value={formatCurrency(summary.totalRevenue)} />
        <Stat label="Avg conversion" value={`${Number(summary.avgConversionRate || 0).toFixed(1)}%`} />
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Rank', 'Counselor', 'Leads', 'Converted', 'Conversion', 'Revenue'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((row) => (
              <tr key={row.counselorId}>
                <td className="px-6 py-4 text-sm text-gray-700">{row.rank}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.totalLeads}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.convertedLeads}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{Number(row.conversionRate || 0).toFixed(1)}%</td>
                <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(row.totalRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-white p-5 shadow"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{value}</p></div>;
}
