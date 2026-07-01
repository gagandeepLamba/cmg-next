'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Search, Filter, Calendar, User, Phone, Mail,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react';

interface FollowUp {
  id: number;
  lead_id: number;
  user_id: number;
  reminder_date: string;
  message: string;
  status: string;
  priority: string;
  completed_at?: string;
  created_at: string;
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  leadStatus?: string;
  employeeName?: string;
  employeeEmail?: string;
}

interface Summary {
  total: number;
  overdue: number;
  upcoming: number;
  completed: number;
  pending: number;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
  rescheduled: 'bg-purple-100 text-purple-800',
  overdue: 'bg-red-100 text-red-800',
};

export default function FollowUpsPage() {
  const router = useRouter();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [summary, setSummary] = useState<Summary>({ total: 0, overdue: 0, upcoming: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchFollowUps = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      const res = await fetch(`/api/follow-up-reminders?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load follow-ups');
      setFollowUps(data.reminders || []);
      setSummary(data.summary || { total: 0, overdue: 0, upcoming: 0, completed: 0, pending: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => { fetchFollowUps(); }, [fetchFollowUps]);

  const handleAction = async (reminderId: number, action: 'complete' | 'cancel', rescheduledAt?: string) => {
    try {
      setActionLoading(reminderId);
      const body: any = { reminderId, action };
      if (action === 'cancel') body.action = 'cancel';
      if (rescheduledAt) { body.action = 'reschedule'; body.rescheduledAt = rescheduledAt; }

      const res = await fetch('/api/follow-up-reminders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Action failed');
      setRescheduleId(null);
      setRescheduleDate('');
      await fetchFollowUps();
    } catch {
      alert('Failed to update follow-up. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getDisplayStatus = (fu: FollowUp): string => {
    if (fu.status !== 'pending') return fu.status;
    if (new Date(fu.reminder_date) < new Date()) return 'overdue';
    return 'pending';
  };

  const filtered = followUps.filter(fu => {
    const leadName = `${fu.fname || ''} ${fu.lname || ''}`.trim().toLowerCase();
    const matchesSearch =
      leadName.includes(searchTerm.toLowerCase()) ||
      (fu.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fu.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const displayStatus = getDisplayStatus(fu);
    const matchesStatus = !statusFilter || displayStatus === statusFilter || fu.status === statusFilter;
    const matchesPriority = !priorityFilter || fu.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-ups</h1>
          <p className="text-gray-600 mt-1">Track and manage lead follow-up reminders</p>
        </div>
        <button
          onClick={fetchFollowUps}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: summary.total, icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Pending', value: summary.pending, icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-50' },
          { label: 'Overdue', value: summary.overdue, icon: <AlertCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' },
          { label: 'Upcoming', value: summary.upcoming, icon: <RefreshCw className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Completed', value: summary.completed, icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className={`${bg} rounded-lg p-4 flex items-center space-x-3`}>
            <div>{icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by lead, counselor, or message..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Lead', 'Counselor', 'Due Date', 'Priority', 'Status', 'Message', 'Actions', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(fu => {
                const leadName = `${fu.fname || ''} ${fu.lname || ''}`.trim() || `Lead #${fu.lead_id}`;
                const displayStatus = getDisplayStatus(fu);
                const isExpanded = expandedId === fu.id;
                const isPending = fu.status === 'pending';
                const dueDate = new Date(fu.reminder_date);
                const isOverdue = displayStatus === 'overdue';

                return (
                  <tr key={fu.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{leadName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        {fu.email && <><Mail className="w-3 h-3" />{fu.email}</>}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        {fu.phone && <><Phone className="w-3 h-3" />{fu.phone}</>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        {fu.employeeName || `Employee #${fu.user_id}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {dueDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[fu.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {fu.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[displayStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className={`text-sm text-gray-700 ${isExpanded ? '' : 'truncate'}`}>
                        {fu.message}
                      </div>
                      {fu.message && fu.message.length > 60 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : fu.id)}
                          className="text-xs text-blue-600 hover:underline mt-0.5 flex items-center gap-0.5"
                        >
                          {isExpanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />More</>}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {fu.lead_id ? (
                        <button
                          onClick={() => router.push(`/admin/leads/${fu.lead_id}`)}
                          title="View lead"
                          className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          View Lead
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 min-w-max">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleAction(fu.id, 'complete')}
                              disabled={actionLoading === fu.id}
                              className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Complete
                            </button>
                            {rescheduleId === fu.id ? (
                              <div className="flex flex-col gap-1">
                                <input
                                  type="datetime-local"
                                  value={rescheduleDate}
                                  onChange={e => setRescheduleDate(e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-xs"
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => rescheduleDate && handleAction(fu.id, 'complete', rescheduleDate)}
                                    disabled={!rescheduleDate || actionLoading === fu.id}
                                    className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => { setRescheduleId(null); setRescheduleDate(''); }}
                                    className="flex-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setRescheduleId(fu.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Reschedule
                              </button>
                            )}
                            <button
                              onClick={() => handleAction(fu.id, 'cancel')}
                              disabled={actionLoading === fu.id}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" />
                              Cancel
                            </button>
                          </>
                        )}
                        {!isPending && (
                          <span className="text-xs text-gray-400 italic">
                            {fu.completed_at ? `Done ${new Date(fu.completed_at).toLocaleDateString()}` : fu.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Clock className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No follow-ups found</p>
          </div>
        )}

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Showing {filtered.length} of {followUps.length} follow-ups
        </div>
      </div>
    </div>
  );
}
