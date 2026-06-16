'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, Clock, Users, Plus, Search, Filter,
  Edit, Trash2, Eye, CheckCircle, XCircle,
  MapPin, Phone, Mail, User, Bell, Download
} from 'lucide-react';

interface Appointment {
  id: number;
  leadId: number;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  date: string;
  time: string;
  endTime: string;
  type: 'Consultation' | 'Document Review' | 'Interview Prep' | 'Visa Processing' | 'Follow-up';
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No-show';
  counsilorId: number;
  counsilorName: string;
  branch: string;
  region: string;
  location: string;
  notes: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentSchedulerProps {
  onAppointmentSelect?: (appointment: Appointment) => void;
  showActions?: boolean;
}

interface ApiAppointment {
  id: number;
  leadid: number | null;
  date: string | null;
  appointtime: string;
  counsilorid: number | null;
  booked: number | null;
  done: number | null;
  not_done: number | null;
  region: number | null;
  branch: number | null;
  screenshot?: string | null;
  fname?: string | null;
  lname?: string | null;
  leadEmail?: string | null;
  leadPhone?: string | null;
  leadMobile?: string | null;
  counselorName?: string | null;
  branchName?: string | null;
  regionName?: string | null;
}

interface AppointmentForm {
  leadid: string;
  date: string;
  appointtime: string;
  counsilorid: string;
  branch: string;
  region: string;
  booked: boolean;
}

const emptyAppointmentForm = (): AppointmentForm => ({
  leadid: '',
  date: new Date().toISOString().split('T')[0],
  appointtime: '09:00',
  counsilorid: '',
  branch: '',
  region: '',
  booked: true
});

function mapAppointment(appointment: ApiAppointment): Appointment {
  const status = getAppointmentStatus(appointment);
  const time = String(appointment.appointtime || '00:00').slice(0, 5);
  const clientName = `${appointment.fname || ''} ${appointment.lname || ''}`.trim();

  return {
    id: Number(appointment.id),
    leadId: Number(appointment.leadid || 0),
    leadName: clientName || (appointment.leadid ? `Lead #${appointment.leadid}` : 'Walk-in Client'),
    leadEmail: appointment.leadEmail || '',
    leadPhone: appointment.leadPhone || appointment.leadMobile || '',
    date: appointment.date || '',
    time,
    endTime: time,
    type: 'Consultation',
    status,
    counsilorId: Number(appointment.counsilorid || 0),
    counsilorName: appointment.counselorName || (appointment.counsilorid ? `Counselor #${appointment.counsilorid}` : 'Unassigned'),
    branch: appointment.branchName || (appointment.branch ? `Branch #${appointment.branch}` : 'No branch'),
    region: appointment.regionName || (appointment.region ? `Region #${appointment.region}` : 'No region'),
    location: appointment.branchName || 'Office',
    notes: appointment.screenshot ? `Screenshot: ${appointment.screenshot}` : '',
    reminderSent: Number(appointment.booked || 0) === 1,
    createdAt: '',
    updatedAt: ''
  };
}

function getAppointmentStatus(appointment: ApiAppointment): Appointment['status'] {
  if (Number(appointment.done || 0) === 1) return 'Completed';
  if (Number(appointment.not_done || 0) === 1) return 'Cancelled';
  if (Number(appointment.booked || 0) === 1) return 'Confirmed';
  return 'Scheduled';
}

export default function AppointmentScheduler({ onAppointmentSelect, showActions = true }: AppointmentSchedulerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    type: '',
    counsilor: '',
    branch: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<AppointmentForm>(emptyAppointmentForm);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ page: '1', limit: '100' });
      if (filters.date) params.set('date', filters.date);
      if (filters.status) params.set('status', filters.status);
      if (filters.counsilor) params.set('counselorId', filters.counsilor);

      const response = await fetch(`/api/appointments?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load appointments');
      }

      setAppointments((data.appointments || []).map(mapAppointment));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters.date, filters.status, filters.counsilor]);

  const handleCreateAppointment = async () => {
    if (!formData.date || !formData.appointtime) {
      setError('Date and time are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          booked: formData.booked ? 1 : 0
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create appointment');
      }

      setShowCreateModal(false);
      setFormData(emptyAppointmentForm());
      await fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setSaving(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch =
      appointment.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.counsilorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.leadEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !filters.date || appointment.date === filters.date;
    const matchesStatus = !filters.status || appointment.status === filters.status;
    const matchesType = !filters.type || appointment.type === filters.type;
    const matchesCounsilor = !filters.counsilor || appointment.counsilorId.toString() === filters.counsilor;
    const matchesBranch = !filters.branch || appointment.branch.includes(filters.branch);

    return matchesSearch && matchesDate && matchesStatus && matchesType && matchesCounsilor && matchesBranch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800';
      case 'No-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consultation': return 'bg-indigo-100 text-indigo-800';
      case 'Document Review': return 'bg-teal-100 text-teal-800';
      case 'Interview Prep': return 'bg-orange-100 text-orange-800';
      case 'Visa Processing': return 'bg-pink-100 text-pink-800';
      case 'Follow-up': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();

    if (diffMs < 0) return 'Past';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    return 'Soon';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Scheduler</h1>
          <p className="text-gray-600 mt-2">Manage and schedule client appointments</p>
        </div>

        {showActions && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Appointment
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="No-show">No-show</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Consultation">Consultation</option>
            <option value="Document Review">Document Review</option>
            <option value="Interview Prep">Interview Prep</option>
            <option value="Visa Processing">Visa Processing</option>
            <option value="Follow-up">Follow-up</option>
          </select>

          <select
            value={filters.counsilor}
            onChange={(e) => setFilters({...filters, counsilor: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Counselors</option>
            <option value="1">Sarah Wilson</option>
            <option value="2">Mike Johnson</option>
            <option value="3">Lisa Chen</option>
          </select>

          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'Confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => {
                  const apptDate = new Date(a.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return apptDate >= today && apptDate <= weekFromNow;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reminders Needed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => !a.reminderSent && a.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counselor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {appointment.endTime}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getTimeRemaining(appointment.date, appointment.time)} remaining
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.leadName}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {appointment.leadEmail}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {appointment.leadPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.counsilorName}</div>
                    <div className="text-sm text-gray-500">{appointment.branch}</div>
                    <div className="text-sm text-gray-500">{appointment.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                        {appointment.type}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        {appointment.reminderSent ? (
                          <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1 text-red-500" />
                        )}
                        Reminder {appointment.reminderSent ? 'sent' : 'pending'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {appointment.location}
                    </div>
                    {appointment.notes && (
                      <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                        {appointment.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onAppointmentSelect && onAppointmentSelect(appointment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead ID</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.leadid}
                    onChange={(e) => setFormData({ ...formData, leadid: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Counselor ID</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.counsilorid}
                    onChange={(e) => setFormData({ ...formData, counsilorid: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={formData.appointtime}
                    onChange={(e) => setFormData({ ...formData, appointtime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch ID</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region ID</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>

                <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.booked}
                    onChange={(e) => setFormData({ ...formData, booked: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Mark appointment as booked
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAppointment}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? 'Creating...' : 'Create Appointment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
