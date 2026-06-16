'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Globe,
  Users,
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
  BookUser,
  Languages,
  Building2,
  FileCheck,
  Timer
} from 'lucide-react'

interface WorkPermitOps {
  id: number
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  targetCountry: string
  employerName: string
  employerAddress: string
  employerPhone: string
  employerEmail: string
  jobTitle: string
  jobCategory: string
  workLocation: string
  salary: number
  currency: string
  permitType: 'open' | 'employer_specific' | 'post_graduation' | 'intra_company'
  applicationStatus: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
  lmiastatus: 'pending' | 'approved' | 'rejected' | 'not_required'
  workPermitStatus: 'pending' | 'in_progress' | 'approved' | 'rejected'
  serviceFee: number
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  startDate: string
  expectedCompletion: string
  assignedTo: string
  assignedToId: number
  documents: Array<{
    id: number
    name: string
    type: string
    uploadDate: string
    status: 'pending' | 'approved' | 'rejected'
    url: string
  }>
  milestones: Array<{
    id: number
    title: string
    description: string
    dueDate: string
    status: 'pending' | 'in_progress' | 'completed'
    completedDate?: string
  }>
  createdAt: string
  updatedAt: string
}

export default function OpsWorkPermitPage() {
  const [operations, setOperations] = useState<WorkPermitOps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [permitTypeFilter, setPermitTypeFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOperations()
  }, [searchTerm, statusFilter, countryFilter, permitTypeFilter])

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const databaseOperations: WorkPermitOps[] = []
      // Apply filters
      let filteredOperations: any[] = []

      if (searchTerm) {
        filteredOperations = filteredOperations.filter(op =>
          op.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => {
          // Filter by specific status values
          if (statusFilter === 'pending') return op.applicationStatus === 'pending' || op.lmiastatus === 'pending' || op.workPermitStatus === 'pending'
          if (statusFilter === 'in_progress') return op.applicationStatus === 'in_progress' || op.workPermitStatus === 'in_progress'
          if (statusFilter === 'approved') return op.applicationStatus === 'approved' || op.lmiastatus === 'approved' || op.workPermitStatus === 'approved'
          if (statusFilter === 'rejected') return op.applicationStatus === 'rejected' || op.lmiastatus === 'rejected' || op.workPermitStatus === 'rejected'
          if (statusFilter === 'cancelled') return op.applicationStatus === 'cancelled'
          if (statusFilter === 'not_required') return op.lmiastatus === 'not_required'
          return true
        })
      }

      if (countryFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.targetCountry === countryFilter)
      }

      if (permitTypeFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.permitType === permitTypeFilter)
      }

      setOperations(filteredOperations)
    } catch (error) {
      console.error('Error fetching operations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'

    if (type === 'application') {
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
    } else if (type === 'lmia') {
      switch (status) {
        case 'approved':
          return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Approved</Badge>
        case 'in_progress':
          return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>
        case 'pending':
          return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
        case 'rejected':
          return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</Badge>
        case 'not_required':
          return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Not Required</Badge>
        default:
          return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
      }
    } else if (type === 'work_permit') {
      switch (status) {
        case 'approved':
          return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Approved</Badge>
        case 'in_progress':
          return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>
        case 'pending':
          return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
        case 'rejected':
          return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</Badge>
        default:
          return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
      }
    } else if (type === 'payment') {
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

    return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
  }

  const getPermitTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (type) {
      case 'open':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Open Work Permit</Badge>
      case 'employer_specific':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Employer Specific</Badge>
      case 'post_graduation':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Post Graduation</Badge>
      case 'intra_company':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-800`}>Intra Company</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatusFilter(value)
    else if (key === 'country') setCountryFilter(value)
    else if (key === 'permitType') setPermitTypeFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setCountryFilter('all')
    setPermitTypeFilter('all')
  }

  const exportReport = () => {
    alert('Exporting Work Permit Operations Report')
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
            <h1 className="text-3xl font-bold text-gray-900">Work Permit Operations</h1>
            <p className="text-gray-600">Manage work permit applications and employer sponsorships</p>
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
                <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
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
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.applicationStatus === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Employer Specific</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.permitType === 'employer_specific').length}
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
                <option value="not_required">Not Required</option>
              </select>

              <select
                value={countryFilter}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Countries</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UK">United Kingdom</option>
                <option value="USA">United States</option>
              </select>

              <select
                value={permitTypeFilter}
                onChange={(e) => handleFilterChange('permitType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Permit Types</option>
                <option value="open">Open Work Permit</option>
                <option value="employer_specific">Employer Specific</option>
                <option value="post_graduation">Post Graduation</option>
                <option value="intra_company">Intra Company</option>
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
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operation.applicantName}</CardTitle>
                      <p className="text-sm text-gray-500">{operation.jobTitle} at {operation.employerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">{operation.targetCountry}</Badge>
                    {getPermitTypeBadge(operation.permitType)}
                    {getStatusBadge(operation.paymentStatus, 'payment')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Applicant Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {operation.applicantEmail}</p>
                      <p><strong>Phone:</strong> {operation.applicantPhone}</p>
                      <p><strong>DOB:</strong> {new Date(operation.dateOfBirth).toLocaleDateString()}</p>
                      <p><strong>Nationality:</strong> {operation.nationality}</p>
                      <p><strong>Passport:</strong> {operation.passportNumber}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Employment Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Employer:</strong> {operation.employerName}</p>
                      <p><strong>Job Title:</strong> {operation.jobTitle}</p>
                      <p><strong>Category:</strong> {operation.jobCategory}</p>
                      <p><strong>Location:</strong> {operation.workLocation}</p>
                      <p><strong>Salary:</strong> {operation.currency} {operation.salary.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Status Overview</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Application:</span>
                        {getStatusBadge(operation.applicationStatus, 'application')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">LMIA:</span>
                        {getStatusBadge(operation.lmiastatus, 'lmia')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Work Permit:</span>
                        {getStatusBadge(operation.workPermitStatus, 'work_permit')}
                      </div>
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
                          {getStatusBadge(milestone.status, 'milestone')}
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
                      <span className="font-medium">Service Fee:</span> {operation.currency} {operation.serviceFee.toLocaleString()}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Assigned:</span> {operation.assignedTo}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        Edit
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
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No work permit applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



