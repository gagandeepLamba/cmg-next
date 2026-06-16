'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Appointment {
  id: number
  leadId: number
  leadName: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | 'pending'
  counselorId: number
  counselorName: string
  branch: string
  region: string
  notes: string
  createdAt: string
}

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments?limit=200')
      if (response.ok) {
        const data = await response.json()
        const mapped = (data.appointments || []).map((a: any): Appointment => {
          let status: Appointment['status'] = 'scheduled'
          if (Number(a.done) === 1) status = 'completed'
          else if (Number(a.not_done) === 1) status = 'cancelled'
          else if (Number(a.booked) === 1) status = 'confirmed'

          return {
            id: Number(a.id),
            leadId: Number(a.leadid || 0),
            leadName: `${a.fname || ''} ${a.lname || ''}`.trim() || (a.leadid ? `Lead #${a.leadid}` : 'Walk-in'),
            date: a.date || '',
            time: String(a.appointtime || '').slice(0, 5),
            type: 'Consultation',
            status,
            counselorId: Number(a.counsilorid || 0),
            counselorName: a.counselorName || (a.counsilorid ? `Counselor #${a.counsilorid}` : 'Unassigned'),
            branch: a.branchName || (a.branch ? `Branch #${a.branch}` : ''),
            region: a.regionName || (a.region ? `Region #${a.region}` : ''),
            notes: a.screenshot || '',
            createdAt: ''
          }
        })
        setAppointments(mapped)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case 'rescheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Rescheduled</Badge>
      case 'pending':
        return <Badge className="bg-purple-100 text-purple-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.leadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.counselorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || appointment.status === statusFilter
    const matchesDate = !dateFilter || appointment.date.startsWith(dateFilter)
    
    return matchesSearch && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment List</h1>
            <p className="text-gray-600">View and manage all appointments</p>
          </div>
          <Button onClick={() => window.location.href = '/appointments'}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="pending">Pending</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Counselor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appointment.status)}
                          <div>
                            <div className="text-sm text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.leadName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {appointment.leadId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.counselorName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {appointment.counselorId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.branch}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.region}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
