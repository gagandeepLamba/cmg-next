'use client'

import { SearchableSelect } from '@/components/ui/searchable-select';
import { useSortableData } from '@/components/ui/sortable-th';
import { RecordCard, RecordList, SortButtonRow } from '@/components/shared/ResponsiveRecordList';
import { useState, useEffect } from 'react'
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
  crossBranch: boolean
}

export default function AppointmentListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [crossBranchOnly, setCrossBranchOnly] = useState(false)

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
            notes: a.notes || '',
            createdAt: '',
            crossBranch: Number(a.cross_branch || 0) === 1
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
    const matchesCrossBranch = !crossBranchOnly || appointment.crossBranch

    return matchesSearch && matchesStatus && matchesDate && matchesCrossBranch
  })

  const { sorted: sortedAppointments, sortKey: appointmentSortKey, sortDirection: appointmentSortDirection, toggleSort: toggleAppointmentSort } = useSortableData(
    filteredAppointments,
    {
      dateTime: (a) => `${a.date} ${a.time}`,
      lead: (a) => a.leadName,
      counselor: (a) => a.counselorName,
      type: (a) => a.type,
      status: (a) => a.status,
      location: (a) => `${a.branch || ''} ${a.region || ''}`,
    },
  )

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment List</h1>
            <p className="text-gray-600">View and manage all appointments</p>
          </div>
          <Button onClick={() => window.location.href = '/admin/appointments'}>
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
              <SearchableSelect
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
              </SearchableSelect>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                variant={crossBranchOnly ? 'default' : 'outline'}
                onClick={() => setCrossBranchOnly((prev) => !prev)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Cross-Branch Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardContent className="p-3">
            <SortButtonRow
              options={[
                ['dateTime', 'Date & Time'],
                ['lead', 'Lead'],
                ['counselor', 'Counselor'],
                ['type', 'Type'],
                ['status', 'Status'],
                ['location', 'Location'],
              ] as const}
              activeKey={appointmentSortKey}
              direction={appointmentSortDirection}
              onSort={toggleAppointmentSort}
            />

            <RecordList
              isEmpty={sortedAppointments.length === 0}
              emptyIcon={Calendar}
              emptyTitle="No appointments found"
              emptyDescription="Try changing filters or search terms."
            >
              {sortedAppointments.map((appointment) => (
                <RecordCard
                  key={appointment.id}
                  avatar={getStatusIcon(appointment.status)}
                  avatarColorClass="from-blue-600 to-cyan-400"
                  title={<span className="min-w-0 break-words text-base font-bold text-gray-950">{appointment.leadName}</span>}
                  titleBadges={
                    <>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">ID: {appointment.leadId}</span>
                      {getStatusBadge(appointment.status)}
                      {appointment.crossBranch && <Badge className="bg-teal-100 text-teal-800">Cross-Branch</Badge>}
                    </>
                  }
                  metaItems={[
                    { icon: Calendar, text: new Date(appointment.date).toLocaleDateString() },
                    { icon: Clock, text: appointment.time || '—' },
                    { icon: Users, text: `${appointment.counselorName} (ID: ${appointment.counselorId})` },
                  ]}
                  stats={[
                    { label: 'Type', value: appointment.type },
                    { label: 'Location', value: appointment.branch || '—', sub: appointment.region || undefined },
                  ]}
                  actions={[
                    { key: 'edit', icon: Edit, label: 'Edit', colorClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
                    { key: 'delete', icon: Trash2, label: 'Delete', colorClass: 'bg-red-50 text-red-700 hover:bg-red-100' },
                  ]}
                />
              ))}
            </RecordList>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
