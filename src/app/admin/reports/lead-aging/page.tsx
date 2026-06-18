'use client';

import { useEffect, useState } from 'react';

type LeadRow = { id: number; fname?: string; lname?: string; created?: string; regdate?: string; status?: string; assigned_to_name?: string };

const ageBucket = (days: number) => {
  if (days <= 7) return '0-7 days';
  if (days <= 30) return '8-30 days';
  if (days <= 60) return '31-60 days';
  return '60+ days';
};

export default function LeadAgingReportPage() {
  const [buckets, setBuckets] = useState<Record<string, number>>({});
  const [oldLeads, setOldLeads] = useState<Array<LeadRow & { age: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leads?limit=500&page=1');
        const data = await response.json();
        const now = Date.now();
        const leads = (data.leads || []).map((lead: LeadRow) => {
          const date = new Date(lead.created || lead.regdate || Date.now()).getTime();
          return { ...lead, age: Math.max(0, Math.floor((now - date) / 86400000)) };
        });
        setBuckets(leads.reduce((acc: Record<string, number>, lead: LeadRow & { age: number }) => {
          const bucket = ageBucket(lead.age);
          acc[bucket] = (acc[bucket] || 0) + 1;
          return acc;
        }, {}));
        setOldLeads(leads.sort((a: LeadRow & { age: number }, b: LeadRow & { age: number }) => b.age - a.age).slice(0, 20));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading lead aging...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Aging</h1>
        <p className="mt-1 text-gray-600">Aging buckets and oldest open leads from live CRM data.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {['0-7 days', '8-30 days', '31-60 days', '60+ days'].map((bucket) => (
          <div key={bucket} className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">{bucket}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{buckets[bucket] || 0}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Lead', 'Status', 'Assigned', 'Age'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {oldLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.fname} {lead.lname}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{lead.status || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{lead.assigned_to_name || 'Unassigned'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{lead.age} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
