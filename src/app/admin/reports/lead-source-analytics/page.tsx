'use client';

import { useEffect, useState } from 'react';

type SourceRow = {
  source: string;
  count: number;
  convertedCount: number;
  conversionRate: number;
};

export default function LeadSourceAnalyticsPage() {
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [summary, setSummary] = useState({ totalLeads: 0, totalConverted: 0, overallConversionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports/lead-source-analytics?timeRange=6months');
        const data = await response.json();
        setSources(data.sources || []);
        setSummary(data.summary || { totalLeads: 0, totalConverted: 0, overallConversionRate: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading lead source analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Source Analytics</h1>
        <p className="mt-1 text-gray-600">Source quality and conversion performance from live lead data.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat label="Total leads" value={summary.totalLeads} />
        <Stat label="Converted" value={summary.totalConverted} />
        <Stat label="Conversion rate" value={`${Number(summary.overallConversionRate || 0).toFixed(1)}%`} />
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Source', 'Leads', 'Converted', 'Conversion'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sources.map((source) => (
              <tr key={source.source}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{source.source}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{source.count}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{source.convertedCount}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{Number(source.conversionRate || 0).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
