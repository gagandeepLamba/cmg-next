'use client';

import { useEffect, useMemo, useState } from 'react';
import { Database, ExternalLink, RefreshCw } from 'lucide-react';

type LegacyModule = {
  name: string;
  oldFile: string;
  table: string;
  nextPath: string | null;
  apiPath: string | null;
  status: 'migrated' | 'partial' | 'page-only' | 'needed';
  oldFileExists: boolean;
  recordCount: number | null;
};

type LegacyModulesResponse = {
  legacyRoot: string;
  data: LegacyModule[];
  summary: {
    total: number;
    migrated: number;
    partial: number;
    needed: number;
  };
};

const statusClass = {
  migrated: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  'page-only': 'bg-yellow-100 text-yellow-800',
  needed: 'bg-red-100 text-red-800',
};

export default function LegacyModulesPage() {
  const [data, setData] = useState<LegacyModulesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | LegacyModule['status']>('all');

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/legacy-modules');
      const result = await response.json();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const modules = useMemo(() => {
    if (!data) return [];
    if (filter === 'all') return data.data;
    return data.data.filter((module) => module.status === filter);
  }, [data, filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legacy Modules</h1>
          <p className="mt-2 text-gray-600">Database and PHP module migration status from the old DM system.</p>
        </div>
        <button
          onClick={fetchModules}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Tracked Modules</p>
            <p className="text-2xl font-semibold text-gray-900">{data.summary.total}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Migrated</p>
            <p className="text-2xl font-semibold text-green-700">{data.summary.migrated}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Partial</p>
            <p className="text-2xl font-semibold text-yellow-700">{data.summary.partial}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Needed</p>
            <p className="text-2xl font-semibold text-red-700">{data.summary.needed}</p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Database className="mr-2 h-4 w-4" />
            {data?.legacyRoot || 'Legacy path'} 
          </div>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as typeof filter)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All modules</option>
            <option value="migrated">Migrated</option>
            <option value="partial">Partial</option>
            <option value="page-only">Page only</option>
            <option value="needed">Needed</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Rows</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Old PHP</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Next Module</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">Loading modules...</td>
                </tr>
              ) : (
                modules.map((module) => (
                  <tr key={module.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{module.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{module.table}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{module.recordCount ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className={module.oldFileExists ? 'text-green-700' : 'text-red-700'}>{module.oldFile}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClass[module.status]}`}>
                        {module.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {module.nextPath ? (
                        <a className="inline-flex items-center text-blue-600 hover:text-blue-800" href={module.nextPath}>
                          Open
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500">Needs module</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
