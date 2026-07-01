'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, TrendingUp, Calendar, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface Counselor {
  id: number;
  name: string;
  email: string;
  mobile: string;
  branch: string;
  branchId: number;
  region: string;
  type: string;
  status: number;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  todayAppointments: number;
  pendingFollowups: number;
  photo: string;
}

interface Summary {
  total: number;
  active: number;
  avgConversion: number;
  totalLeads: number;
}

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, active: 0, avgConversion: 0, totalLeads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [branches, setBranches] = useState<Array<{ id: number; name: string }>>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [counselorRes, branchRes] = await Promise.all([
        fetch(`/api/admin/counselors${branchFilter ? `?branch=${branchFilter}` : ''}`),
        fetch('/api/admin/branches?limit=100'),
      ]);
      if (!counselorRes.ok) throw new Error('Failed to load counselors');

      const data = await counselorRes.json();
      const branchData = branchRes.ok ? await branchRes.json() : { branches: [] };

      setCounselors(data.counselors || []);
      setSummary(data.summary || { total: 0, active: 0, avgConversion: 0, totalLeads: 0 });
      setBranches(branchData.branches || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [branchFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = counselors.filter(c =>
    search === '' ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Counselor Management</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage counselors and their performance</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-[#35AE22] text-white rounded-lg hover:bg-[#1C6B10] text-sm font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Counselors', value: summary.total, icon: Users, color: 'blue' },
          { label: 'Active', value: summary.active, icon: CheckCircle, color: 'green' },
          { label: 'Avg Conversion', value: `${summary.avgConversion}%`, icon: TrendingUp, color: 'green' },
          { label: 'Total Leads Assigned', value: summary.totalLeads.toLocaleString(), icon: Calendar, color: 'blue' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${card.color}-50 text-${card.color}-600`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, branch..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-[#35AE22] focus:border-transparent"
          />
        </div>
        {branches.length > 0 && (
          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value)}
            className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-[#35AE22]"
          >
            <option value="">All Branches</option>
            {branches.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
          </select>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin" /> Loading counselors…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <Users className="w-8 h-8" />
            <span>No counselors found</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Counselor</th>
                  <th className="px-5 py-3 text-left">Branch</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-right">Leads</th>
                  <th className="px-5 py-3 text-right">Converted</th>
                  <th className="px-5 py-3 text-right">Conv. Rate</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {c.photo ? (
                          <img src={`/uploads/${c.photo}`} alt={c.name} className="w-8 h-8 rounded-full object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#EAF7E4] flex items-center justify-center text-[#1C6B10] text-sm font-bold shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          <div className="text-xs text-gray-400">{c.email || c.mobile || `ID: ${c.id}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{c.branch || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{c.type}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-right font-medium text-gray-700">{c.totalLeads.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-right text-green-700 font-medium">{c.convertedLeads.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-sm font-semibold ${
                        c.conversionRate >= 40 ? 'text-green-600' :
                        c.conversionRate >= 20 ? 'text-yellow-600' :
                        c.totalLeads > 0 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {c.totalLeads > 0 ? `${c.conversionRate}%` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 1 ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {c.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="text-xs text-gray-400 text-right">
          Showing {filtered.length} of {counselors.length} counselors
        </div>
      )}
    </div>
  );
}
