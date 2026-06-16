'use client';

import { useState, useEffect } from 'react';
import { DmEmployee, DmEmployeeAttributes } from '@/models';

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState<DmEmployeeAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<DmEmployeeAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    department: '',
    status: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, pagination.limit, filters.department, filters.status]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchEmployees();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.department && { department: filters.department }),
        ...(filters.status !== '' && { status: filters.status })
      });

      const response = await fetch(`/api/admin/employees?${params}`);
      const result = await response.json();
      
      if (response.ok) {
        setEmployees(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }));
      } else {
        console.error('Failed to fetch employees:', result.error);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (employee: DmEmployeeAttributes) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/employees?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEmployees(); // Refresh the list
        alert('Employee deleted successfully');
      } else {
        const result = await response.json();
        alert('Failed to delete employee: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleFilterChange = (filterType: 'department' | 'status', value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
    fetchEmployees();
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getWorkModeColor = (wfh: number) => {
    return wfh === 1 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Employees Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all employees</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchEmployees}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add New Employee
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search employees by name, email, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="1">Sales</option>
            <option value="2">Operations</option>
            <option value="3">Admin</option>
          </select>
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {employee.EID}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.department === 1 ? 'Sales' : 
                       employee.department === 2 ? 'Operations' : 'Admin'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWorkModeColor(employee.wfh)}`}>
                      {employee.wfh === 1 ? 'Remote' : 'Office'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewEmployee(employee)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Employee Details Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Employee Details</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Personal Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedEmployee.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedEmployee.mobile}</p>
                    <p><span className="font-medium">Gender:</span> {selectedEmployee.gender}</p>
                    <p><span className="font-medium">Nationality:</span> {selectedEmployee.nationality}</p>
                    {selectedEmployee.dob && (
                      <p><span className="font-medium">DOB:</span> {new Date(selectedEmployee.dob).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Work Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Employee ID:</span> {selectedEmployee.EID}</p>
                    <p><span className="font-medium">Username:</span> {selectedEmployee.username}</p>
                    <p><span className="font-medium">Department:</span> {
                      selectedEmployee.department === 1 ? 'Sales' : 
                      selectedEmployee.department === 2 ? 'Operations' : 'Admin'
                    }</p>
                    <p><span className="font-medium">Status:</span> {selectedEmployee.status === 1 ? 'Active' : 'Inactive'}</p>
                    <p><span className="font-medium">Work Mode:</span> {selectedEmployee.wfh === 1 ? 'Remote' : 'Office'}</p>
                    {selectedEmployee.doj && (
                      <p><span className="font-medium">Date of Joining:</span> {new Date(selectedEmployee.doj).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Additional Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Passport No:</span> {selectedEmployee.ppNo || 'N/A'}</p>
                    {selectedEmployee.visaExp && (
                      <p><span className="font-medium">Visa Expiry:</span> {new Date(selectedEmployee.visaExp).toLocaleDateString()}</p>
                    )}
                    <p><span className="font-medium">Religion:</span> {selectedEmployee.religion}</p>
                    <p><span className="font-medium">Lab Experience:</span> {selectedEmployee.labexp || 'N/A'}</p>
                    <p><span className="font-medium">Emergency Contact:</span> {selectedEmployee.em_local_name}</p>
                    <p><span className="font-medium">Emergency Number:</span> {selectedEmployee.em_local_number}</p>
                  </div>
                </div>
              </div>
              {selectedEmployee.address && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Office Address</h4>
                  <p className="mt-1">{selectedEmployee.address}</p>
                </div>
              )}
              {selectedEmployee.remark && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Remarks</h4>
                  <p className="mt-1">{selectedEmployee.remark}</p>
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
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
