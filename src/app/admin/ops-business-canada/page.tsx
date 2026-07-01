'use client'

import { useState, useEffect } from 'react'
import { mapOperationsRowToListItem, searchOperationCases } from '@/lib/operationsClient'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Globe,
  Building,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Target,
  TrendingUp,
  Eye,
  Edit,
  TrendingDown,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart,
  PieChart,
  Briefcase,
  Shield,
  Activity,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Receipt
} from 'lucide-react'

interface CanadaBusinessOps {
  id: number
  clientName: string
  clientEmail: string
  clientPhone: string
  businessType: string
  companyName: string
  registrationNumber: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  incorporationStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  workPermitStatus: 'pending' | 'in_progress' | 'approved' | 'rejected'
  investorVisaStatus: 'pending' | 'in_progress' | 'approved' | 'rejected'
  serviceFee: number
  currency: string
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

export default function OpsBusinessCanadaPage() {
  const [operations, setOperations] = useState<CanadaBusinessOps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'approved' | 'rejected'
  type BusinessTypeFilter = 'all' | 'Technology' | 'Restaurant' | 'Retail' | 'Construction' | 'Healthcare' | 'Education' | 'Manufacturing' | 'Consulting' | 'Other'

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [businessTypeFilter, setBusinessTypeFilter] = useState<BusinessTypeFilter>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOperations()
  }, [searchTerm, statusFilter, businessTypeFilter])

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const databaseOperations = (await searchOperationCases({ module: 'business-canada', search: searchTerm || null, limit: 100 }))
        .map(mapOperationsRowToListItem) as unknown as CanadaBusinessOps[]
      // Apply filters
      let filteredOperations: any[] = databaseOperations

      if (searchTerm) {
        filteredOperations = filteredOperations.filter(op =>
          op.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => {
          // Check incorporation status (cancelled, pending, in_progress, completed)
          if (statusFilter === 'cancelled' || statusFilter === 'completed') {
            return op.incorporationStatus === statusFilter
          }
          // Check work permit and investor visa status (pending, in_progress, approved, rejected)
          if (statusFilter === 'approved' || statusFilter === 'rejected') {
            return op.workPermitStatus === statusFilter || op.investorVisaStatus === statusFilter
          }
          // Check common statuses (pending, in_progress)
          return op.incorporationStatus === statusFilter || 
                 op.workPermitStatus === statusFilter || 
                 op.investorVisaStatus === statusFilter
        })
      }

      if (businessTypeFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.businessType === businessTypeFilter)
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
    
    if (type === 'incorporation') {
      switch (status) {
        case 'completed':
          return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Completed</Badge>
        case 'in_progress':
          return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>
        case 'pending':
          return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
        case 'cancelled':
          return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</Badge>
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
    } else if (type === 'investor_visa') {
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

  const handleFilterChange = (key: string, value: StatusFilter | BusinessTypeFilter) => {
    if (key === 'status') setStatusFilter(value as StatusFilter)
    else if (key === 'businessType') setBusinessTypeFilter(value as BusinessTypeFilter)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setBusinessTypeFilter('all')
  }

  const exportReport = () => {
    alert('Exporting Canada Business Operations Report')
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
            <h1 className="text-3xl font-bold text-gray-900">Canada Business Operations</h1>
            <p className="text-gray-600">Manage Canadian business immigration and incorporation services</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              New Operation
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Operations</p>
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
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.incorporationStatus === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Work Permits</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.workPermitStatus === 'approved').length}
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
                  placeholder="Search operations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value as StatusFilter)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={businessTypeFilter}
                onChange={(e) => handleFilterChange('businessType', e.target.value as BusinessTypeFilter)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Business Types</option>
                <option value="Technology">Technology</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Consulting">Consulting</option>
              </select>

              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operations List */}
        <div className="space-y-4">
          {operations.map((operation) => (
            <Card key={operation.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg text-blue-600">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operation.companyName}</CardTitle>
                      <p className="text-sm text-gray-500">{operation.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">{operation.businessType}</Badge>
                    {getStatusBadge(operation.paymentStatus, 'payment')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Business Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Registration:</strong> {operation.registrationNumber}</p>
                      <p><strong>Address:</strong> {operation.businessAddress}</p>
                      <p><strong>Phone:</strong> {operation.businessPhone}</p>
                      <p><strong>Email:</strong> {operation.businessEmail}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Status Overview</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Incorporation:</span>
                        {getStatusBadge(operation.incorporationStatus, 'incorporation')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Work Permit:</span>
                        {getStatusBadge(operation.workPermitStatus, 'work_permit')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Investor Visa:</span>
                        {getStatusBadge(operation.investorVisaStatus, 'investor_visa')}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Service Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Fee:</strong> ${operation.serviceFee.toLocaleString()} {operation.currency}</p>
                      <p><strong>Start Date:</strong> {new Date(operation.startDate).toLocaleDateString()}</p>
                      <p><strong>Expected:</strong> {new Date(operation.expectedCompletion).toLocaleDateString()}</p>
                      <p><strong>Assigned:</strong> {operation.assignedTo}</p>
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
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-2" />
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
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No Canada business operations found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



