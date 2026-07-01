'use client';

import { useState, useEffect } from 'react';
import { DmEmployeeAttendance, DmEmployeeAttendanceAttributes } from '@/models';

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState<DmEmployeeAttendanceAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DmEmployeeAttendanceAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    emp_id: 0,
    ip_address: '',
    device: '',
    agent: '',
    login_time: '',
    logout_time: '',
    total_hours: 0,
    short_fall: 0,
    remarks: '',
    watch_by: 1,
    checkin: 0,
    checkout: 0,
    logout_ip_address: '',
    extra_hours: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const normalizeRecord = (record: any): DmEmployeeAttendanceAttributes => ({
    ...record,
    login_time: record.login_time ? new Date(record.login_time) : new Date(0),
    logout_time: record.logout_time ? new Date(record.logout_time) : new Date(0),
    created: record.created ? new Date(record.created) : new Date(),
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/attendance?limit=100');
      const data = await response.json();
      if (response.ok) {
        setAttendance((data.data || []).map(normalizeRecord));
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAttendance = attendance.filter(record =>
    record.emp_id.toString().includes(searchTerm) ||
    record.ip_address.includes(searchTerm) ||
    record.device.includes(searchTerm)
  );

  const handleViewRecord = (record: DmEmployeeAttendanceAttributes) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleAddRecord = async () => {
    if (newRecord.emp_id && newRecord.login_time) {
      const today = new Date().toISOString().slice(0, 10);
      const response = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecord,
          login_time: new Date(`${today}T${newRecord.login_time}`),
          logout_time: newRecord.logout_time ? new Date(`${today}T${newRecord.logout_time}`) : null,
        }),
      });
      if (!response.ok) return;
      await fetchAttendance();
      setNewRecord({
        emp_id: 0,
        ip_address: '',
        device: '',
        agent: '',
        login_time: '',
        logout_time: '',
        total_hours: 0,
        short_fall: 0,
        remarks: '',
        watch_by: 1,
        checkin: 0,
        checkout: 0,
        logout_ip_address: '',
        extra_hours: 0,
      });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (checkin: number, checkout: number) => {
    if (checkin === 1 && checkout === 1) return 'bg-green-100 text-green-800';
    if (checkin === 1 && checkout === 0) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (checkin: number, checkout: number) => {
    if (checkin === 1 && checkout === 1) return 'Complete';
    if (checkin === 1 && checkout === 0) return 'Checked In';
    return 'Not Checked In';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Track employee attendance and working hours</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Attendance Record
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by employee ID, IP address, or device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="complete">Complete</option>
            <option value="checkedin">Checked In</option>
            <option value="notcheckedin">Not Checked In</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logout Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Fall
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{record.emp_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.ip_address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.device}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.login_time.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.logout_time.toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.total_hours}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.short_fall}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.checkin, record.checkout)}`}>
                      {getStatusText(record.checkin, record.checkout)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewRecord(record)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Details Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Attendance Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Basic Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Employee ID:</span> #{selectedRecord.emp_id}</p>
                    <p><span className="font-medium">IP Address:</span> {selectedRecord.ip_address}</p>
                    <p><span className="font-medium">Device:</span> {selectedRecord.device}</p>
                    <p><span className="font-medium">Status:</span> {getStatusText(selectedRecord.checkin, selectedRecord.checkout)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Time Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Login Time:</span> {selectedRecord.login_time.toLocaleTimeString()}</p>
                    <p><span className="font-medium">Logout Time:</span> {selectedRecord.logout_time.toLocaleTimeString()}</p>
                    <p><span className="font-medium">Total Hours:</span> {selectedRecord.total_hours}</p>
                    <p><span className="font-medium">Short Fall:</span> {selectedRecord.short_fall}</p>
                    <p><span className="font-medium">Extra Hours:</span> {selectedRecord.extra_hours}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Technical Details</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">User Agent:</span> {selectedRecord.agent}</p>
                  <p><span className="font-medium">Logout IP Address:</span> {selectedRecord.logout_ip_address}</p>
                </div>
              </div>
              {selectedRecord.remarks && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Remarks</h4>
                  <p className="mt-1">{selectedRecord.remarks}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Attendance Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Add Attendance Record</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="empId" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    id="empId"
                    value={newRecord.emp_id}
                    onChange={(e) => setNewRecord({ ...newRecord, emp_id: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">
                    IP Address
                  </label>
                  <input
                    type="text"
                    id="ipAddress"
                    value={newRecord.ip_address}
                    onChange={(e) => setNewRecord({ ...newRecord, ip_address: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter IP address"
                  />
                </div>
                <div>
                  <label htmlFor="device" className="block text-sm font-medium text-gray-700">
                    Device
                  </label>
                  <input
                    type="text"
                    id="device"
                    value={newRecord.device}
                    onChange={(e) => setNewRecord({ ...newRecord, device: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter device info"
                  />
                </div>
                <div>
                  <label htmlFor="loginTime" className="block text-sm font-medium text-gray-700">
                    Login Time
                  </label>
                  <input
                    type="time"
                    id="loginTime"
                    value={newRecord.login_time}
                    onChange={(e) => setNewRecord({ ...newRecord, login_time: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="logoutTime" className="block text-sm font-medium text-gray-700">
                    Logout Time
                  </label>
                  <input
                    type="time"
                    id="logoutTime"
                    value={newRecord.logout_time}
                    onChange={(e) => setNewRecord({ ...newRecord, logout_time: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">
                    Total Hours
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    id="totalHours"
                    value={newRecord.total_hours}
                    onChange={(e) => setNewRecord({ ...newRecord, total_hours: parseFloat(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter total hours"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  rows={3}
                  value={newRecord.remarks}
                  onChange={(e) => setNewRecord({ ...newRecord, remarks: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter remarks"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewRecord({
                    emp_id: 0,
                    ip_address: '',
                    device: '',
                    agent: '',
                    login_time: '',
                    logout_time: '',
                    total_hours: 0,
                    short_fall: 0,
                    remarks: '',
                    watch_by: 1,
                    checkin: 0,
                    checkout: 0,
                    logout_ip_address: '',
                    extra_hours: 0,
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddRecord}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
