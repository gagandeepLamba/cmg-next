'use client'

import { useSortableData, SortableTh } from '@/components/ui/sortable-th'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import {
  Calendar,
  Clock,
  Search,
  ShieldCheck,
  ShieldAlert,
  Globe,
} from 'lucide-react'

interface CrossBranchAppointment {
  id: number
  leadId: number
  leadName: string
  date: string
  time: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'pending'
  counselorId: number
  counselorName: string
  homeBranch: string
  assignedBranch: string
  assignedByName: string
  notes: string
  acknowledged: boolean
}

// Lists every appointment where cross_branch=1 — i.e. a counselor/branch was
// handed an appointment that originated in a different branch and needs an
// explicit heads-up + acknowledgement (see the cross-branch handoff notice
// created in POST /api/appointments). Server-filtered via ?crossBranch=1
// rather than client-side, so this always reflects the true full set, not
// just whatever page of the main appointments list happened to be fetched.
export default function CrossBranchAppointmentsPage() {
  const { token } = useAuth()
  const [appointments, setAppointments] = useState<CrossBranchAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ackFilter, setAckFilter] = useState<'' | 'pending' | 'acknowledged'>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ crossBranch: '1', limit: '500' })
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      const response = await fetch(`/api/appointments?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (response.ok) {
        const data = await response.json()
        const mapped = (data.appointments || []).map((a: any): CrossBranchAppointment => {
          let status: CrossBranchAppointment['status'] = 'scheduled'
          if (Number(a.done) === 1) status = 'completed'
          else if (Number(a.not_done) === 1) status = 'cancelled'
          else if (Number(a.booked) === 1) status = 'confirmed'

          return {
            id: Number(a.id),
            leadId: Number(a.leadid || 0),
            leadName: `${a.fname || ''} ${a.lname || ''}`.trim() || (a.leadid ? `Lead #${a.leadid}` : 'Walk-in'),
            date: a.date || '',
            time: String(a.appointtime || '').slice(0, 5),
            status,
            counselorId: Number(a.counsilorid || 0),
            counselorName: a.counselorName || (a.counsilorid ? `Counselor #${a.counsilorid}` : 'Unassigned'),
            homeBranch: a.branchName || (a.branch ? `Branch #${a.branch}` : ''),
            assignedBranch: a.assignedBranchName || (a.assigned_branch ? `Branch #${a.assigned_branch}` : ''),
            assignedByName: a.assignedByName || '',
            notes: a.notes || '',
            acknowledged: Number(a.acknowledged || 0) === 1,
          }
        })
        setAppointments(mapped)
      }
    } catch (error) {
      console.error('Error fetching cross-branch appointments:', error)
    } finally {
      setLoading(false)
    }
  }, [token, startDate, endDate])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const handleAcknowledge = async (appt: CrossBranchAppointment) => {
    if (acknowledgingId) return
    setAcknowledgingId(appt.id)
    try {
      const res = await fetch(`/api/appointments/${appt.id}/acknowledge`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error || 'Failed to acknowledge') }
      window.toast.success('Appointment acknowledged')
      await fetchAppointments()
    } catch (e) {
      window.toast.error(e instanceof Error ? e.message : 'Failed to acknowledge appointment')
    } finally {
      setAcknowledgingId(null)
    }
  }

  const filtered = appointments.filter((a) => {
    const matchesSearch = !searchTerm
      || a.leadName.toLowerCase().includes(searchTerm.toLowerCase())
      || a.counselorName.toLowerCase().includes(searchTerm.toLowerCase())
      || a.homeBranch.toLowerCase().includes(searchTerm.toLowerCase())
      || a.assignedBranch.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAck = !ackFilter
      || (ackFilter === 'acknowledged' && a.acknowledged)
      || (ackFilter === 'pending' && !a.acknowledged)
    return matchesSearch && matchesAck
  })

  const { sorted, sortKey, sortDirection, toggleSort } = useSortableData(filtered, {
    dateTime: (a) => `${a.date} ${a.time}`,
    lead: (a) => a.leadName,
    counselor: (a) => a.counselorName,
    homeBranch: (a) => a.homeBranch,
    assignedBranch: (a) => a.assignedBranch,
    status: (a) => a.status,
  })

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case 'completed': return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case 'cancelled': return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default: return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="h-7 w-7 text-teal-600" /> Cross-Branch Appointments
        </h1>
        <p className="text-gray-600">Every appointment handed from one branch to a counselor/branch manager in another branch, and whether it's been acknowledged.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lead, counselor, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={ackFilter}
              onChange={(e) => setAckFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="pending">Pending Acknowledgement</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-500">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {(startDate || endDate) && (
                <Button variant="outline" size="sm" onClick={() => { setStartDate(''); setEndDate('') }}>Clear</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableTh label="Date & Time" sortKey="dateTime" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                  <SortableTh label="Lead" sortKey="lead" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                  <SortableTh label="Counselor" sortKey="counselor" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                  <SortableTh label="Home Branch" sortKey="homeBranch" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                  <SortableTh label="Assigned Branch" sortKey="assignedBranch" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                  <SortableTh label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acknowledgement</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorted.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">{a.date ? new Date(a.date).toLocaleDateString() : '—'}</div>
                          <div className="text-sm text-gray-500">{a.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{a.leadName}</div>
                      {a.notes && <div className="text-xs text-gray-500 max-w-[200px] truncate" title={a.notes}>{a.notes}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.counselorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.homeBranch || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{a.assignedBranch || '—'}</div>
                      {a.assignedByName && <div className="text-xs text-gray-500">by {a.assignedByName}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{statusBadge(a.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.acknowledged ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                          <ShieldAlert className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {!a.acknowledged && (
                        <Button size="sm" onClick={() => handleAcknowledge(a)} disabled={acknowledgingId === a.id}>
                          {acknowledgingId === a.id ? 'Acknowledging…' : 'Acknowledge'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cross-branch appointments found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
