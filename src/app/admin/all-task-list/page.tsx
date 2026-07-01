'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Square,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'

interface Task {
  id: number
  title: string
  description: string
  assignedTo: number
  assignedToName: string
  assignedBy: number
  assignedByName: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  dueDate: string
  createdAt: string
  completedAt?: string
  category: string
  leadId?: number
  leadName?: string
}

interface DmTaskRecord {
  id: number
  task: string | null
  dob: string | null
  date_created: string | null
  stage: number
  asignTo: number
  asignBy: number
  status: string
  doc: string | null
  notf: number
  created: string
}

export default function AllTaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [assignedFilter, setAssignedFilter] = useState('')

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/admin/tasks?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const result = await response.json()
      setTasks((result.data || []).map(mapTaskRecord))
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const mapTaskStatus = (status: string): Task['status'] => {
    if (status === '1' || status === 'completed') return 'completed'
    if (status === '2' || status === 'in_progress') return 'in_progress'
    if (status === '3' || status === 'cancelled') return 'cancelled'
    return 'pending'
  }

  const mapTaskRecord = (record: DmTaskRecord): Task => {
    const dueDate = record.dob || record.date_created || record.created || new Date().toISOString()
    const createdAt = record.date_created || record.created || new Date().toISOString()
    return {
      id: record.id,
      title: record.task || `Task #${record.id}`,
      description: record.doc ? `Document: ${record.doc}` : '',
      assignedTo: record.asignTo || 0,
      assignedToName: record.asignTo ? `Employee #${record.asignTo}` : 'Unassigned',
      assignedBy: record.asignBy || 0,
      assignedByName: record.asignBy ? `Employee #${record.asignBy}` : 'System',
      priority: record.notf ? 'high' : 'medium',
      status: mapTaskStatus(record.status),
      dueDate,
      createdAt,
      completedAt: mapTaskStatus(record.status) === 'completed' ? dueDate : undefined,
      category: record.stage ? `Stage ${record.stage}` : 'General',
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'cancelled':
        return <Square className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignedToName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.leadName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    const matchesAssigned = !assignedFilter || 
      (assignedFilter === 'me' && task.assignedToName === 'Current User') ||
      (assignedFilter !== 'me' && task.assignedToName?.toLowerCase().includes(assignedFilter.toLowerCase()))
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned
  })

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  }

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
            <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
            <p className="text-gray-600">View and manage all tasks across the organization</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
                <p className="text-sm text-gray-500">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{taskStats.cancelled}</p>
                <p className="text-sm text-gray-500">Cancelled</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{taskStats.urgent}</p>
                <p className="text-sm text-gray-500">Urgent</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Assigned</option>
                <option value="me">My Tasks</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {task.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {task.description}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {task.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {task.assignedToName}
                        </div>
                        <div className="text-xs text-gray-500">
                          by {task.assignedByName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.completedAt && `Completed: ${new Date(task.completedAt).toLocaleDateString()}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.leadName && (
                          <div>
                            <div className="text-sm text-gray-900">
                              {task.leadName}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {task.leadId}
                            </div>
                          </div>
                        )}
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
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tasks found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
