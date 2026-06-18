'use client';

import { useEffect, useState } from 'react';

type LeadRow = { id: number; status?: string; opportunity_status?: string };

export default function LeadConversionFunnelPage() {
  const [stages, setStages] = useState<Array<{ label: string; count: number; rate: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leads?limit=500&page=1');
        const data = await response.json();
        const leads: LeadRow[] = data.leads || [];
        const total = leads.length || 1;
        const contacted = leads.filter((lead) => !['new', 'not_answered'].includes(String(lead.status || '').toLowerCase())).length;
        const qualified = leads.filter((lead) => ['qualified', 'prospect', 'converted', 'retained', 'client'].includes(String(lead.status || '').toLowerCase())).length;
        const converted = leads.filter((lead) => ['converted', 'retained', 'client'].includes(String(lead.status || '').toLowerCase()) || String(lead.opportunity_status || '').toLowerCase() === 'won').length;
        setStages([
          { label: 'Total Leads', count: leads.length, rate: 100 },
          { label: 'Contacted', count: contacted, rate: contacted / total * 100 },
          { label: 'Qualified / Prospect', count: qualified, rate: qualified / total * 100 },
          { label: 'Converted', count: converted, rate: converted / total * 100 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading conversion funnel...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conversion Funnel</h1>
        <p className="mt-1 text-gray-600">Live progression from leads to converted clients.</p>
      </div>
      <div className="space-y-4 rounded-lg bg-white p-6 shadow">
        {stages.map((stage) => (
          <div key={stage.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">{stage.label}</span>
              <span className="text-gray-600">{stage.count} ({stage.rate.toFixed(1)}%)</span>
            </div>
            <div className="h-4 overflow-hidden rounded bg-gray-100">
              <div className="h-full bg-blue-600" style={{ width: `${Math.min(stage.rate, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
