'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Globe,
  Calendar,
  DollarSign,
  FileText,
  Target,
  TrendingUp,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart,
  PieChart,
  Building,
  Award,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Receipt,
  User,
  Shield,
  Activity,
  Plane,
  Languages,
  Lock,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  Ban
} from 'lucide-react'

interface CanadaUneditOps {
  id: number
  clientName: string
  clientEmail: string
  clientPhone: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  applicationType: 'student_visa' | 'work_permit' | 'family_sponsorship' | 'business_immigration' | 'permanent_residency'
  applicationNumber: string
  submissionDate: string
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  serviceFee: number
  currency: string
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  assignedTo: string
  assignedToId: number
  isLocked: boolean
  lockReason?: string
  lockedBy?: string
  lockedDate?: string
  documents: Array<{
    id: number
    name: string
    type: string
    uploadDate: string
    status: 'pending' | 'approved' | 'rejected'
    url: string
    isLocked: boolean
  }>
  milestones: Array<{
    id: number
    title: string
    description: string
    dueDate: string
    status: 'pending' | 'in_progress' | 'completed'
    completedDate?: string
    isLocked: boolean
  }>
  createdAt: string
  updatedAt: string
}

export default function OpsCanadaUneditPage() {
  const [operations, setOperations] = useState<CanadaUneditOps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [lockFilter, setLockFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOperations()
  }, [searchTerm, statusFilter, typeFilter, lockFilter])

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const databaseOperations: CanadaUneditOps[] = []
      // Apply filters
      let filteredOperations: any[] = []

      if (searchTerm) {
        filteredOperations = filteredOperations.filter(op =>
          op.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.status === statusFilter)
      }

      if (typeFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.applicationType === typeFilter)
      }

      if (lockFilter !== 'all') {
        if (lockFilter === 'locked') {
          filteredOperations = filteredOperations.filter(op => op.isLocked)
        } else if (lockFilter === 'unlocked') {
          filteredOperations = filteredOperations.filter(op => !op.isLocked)
        }
      }

      setOperations(filteredOperations)
    } catch (error) {
      console.error('Error fetching operations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'approved':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Approved</Badge>
      case 'in_progress':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
      case 'rejected':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</Badge>
      case 'cancelled':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Cancelled</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (priority) {
      case 'urgent':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Urgent</Badge>
      case 'high':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-800`}>High</Badge>
      case 'medium':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Medium</Badge>
      case 'low':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Low</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getApplicationTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (type) {
      case 'student_visa':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Student Visa</Badge>
      case 'work_permit':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Work Permit</Badge>
      case 'family_sponsorship':
        return <Badge className={`${baseClasses} bg-pink-100 text-pink-800`}>Family Sponsorship</Badge>
      case 'business_immigration':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Business Immigration</Badge>
      case 'permanent_residency':
        return <Badge className={`${baseClasses} bg-indigo-100 text-indigo-800`}>Permanent Residency</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'paid':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Paid</Badge>
      case 'partial':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Partial</Badge>
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
      case 'overdue':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Overdue</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatusFilter(value)
    else if (key === 'type') setTypeFilter(value)
    else if (key === 'lock') setLockFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setLockFilter('all')
  }

  const exportReport = () => {
    alert('Exporting Canada Unedit Operations Report')
  }

  const toggleLock = (id: number) => {
    setOperations(operations.map(op => 
      op.id === id ? { ...op, isLocked: !op.isLocked } : op
    ))
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
            <h1 className="text-3xl font-bold text-gray-900">Canada Unedit Operations</h1>
            <p className="text-gray-600">Manage locked and uneditable Canadian immigration applications</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{operations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Lock className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Locked Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.isLocked).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${operations.reduce((sum, op) => sum + op.serviceFee, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="student_visa">Student Visa</option>
                <option value="work_permit">Work Permit</option>
                <option value="family_sponsorship">Family Sponsorship</option>
                <option value="business_immigration">Business Immigration</option>
                <option value="permanent_residency">Permanent Residency</option>
              </select>

              <select
                value={lockFilter}
                onChange={(e) => handleFilterChange('lock', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Lock Status</option>
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
              </select>

              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {operations.map((operation) => (
            <Card key={operation.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg text-blue-600">
                      {operation.isLocked ? <Lock className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operation.clientName}</CardTitle>
                      <p className="text-sm text-gray-500">{operation.applicationNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getApplicationTypeBadge(operation.applicationType)}
                    {getStatusBadge(operation.status)}
                    {getPriorityBadge(operation.priority)}
                    {operation.isLocked && (
                      <Badge className="bg-red-100 text-red-800">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Client Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {operation.clientEmail}</p>
                      <p><strong>Phone:</strong> {operation.clientPhone}</p>
                      <p><strong>DOB:</strong> {new Date(operation.dateOfBirth).toLocaleDateString()}</p>
                      <p><strong>Nationality:</strong> {operation.nationality}</p>
                      <p><strong>Passport:</strong> {operation.passportNumber}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Application Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Type:</strong> {operation.applicationType.replace('_', ' ').toUpperCase()}</p>
                      <p><strong>Submitted:</strong> {new Date(operation.submissionDate).toLocaleDateString()}</p>
                      <p><strong>Priority:</strong> {operation.priority.toUpperCase()}</p>
                      <p><strong>Service Fee:</strong> {operation.currency} {operation.serviceFee.toLocaleString()}</p>
                      <p><strong>Assigned:</strong> {operation.assignedTo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Lock Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge className={operation.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {operation.isLocked ? 'Locked' : 'Editable'}
                        </Badge>
                      </div>
                      {operation.isLocked && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Reason:</span>
                            <span className="text-sm text-gray-900">{operation.lockReason}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Locked By:</span>
                            <span className="text-sm text-gray-900">{operation.lockedBy}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Locked Date:</span>
                            <span className="text-sm text-gray-900">
                              {operation.lockedDate && new Date(operation.lockedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Progress Milestones</h4>
                  <div className="space-y-2">
                    {operation.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                          <div className="text-xs text-gray-500">{milestone.description}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                          {milestone.isLocked && <Lock className="h-3 w-3 text-red-500" />}
                          {getStatusBadge(milestone.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Documents:</span> {operation.documents.length} uploaded
                      <span className="mx-2">•</span>
                      <span className="font-medium">Payment:</span>
                      {getPaymentStatusBadge(operation.paymentStatus)}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Locked Docs:</span> {operation.documents.filter(doc => doc.isLocked).length}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {!operation.isLocked && (
                        <Button size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleLock(operation.id)}
                      >
                        {operation.isLocked ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unlock
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Lock
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {operations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No Canada unedit applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



