'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Heart,
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
  Home,
  UserPlus,
  Contact as Passport,
  Users as Family,
  Smile as Baby
} from 'lucide-react'

interface FamilySponsorshipOps {
  id: number
  sponsorName: string
  sponsorEmail: string
  sponsorPhone: string
  sponsorDateOfBirth: string
  sponsorNationality: string
  sponsorPassportNumber: string
  sponsorStatus: 'citizen' | 'permanent_resident'
  sponsorIncome: number
  sponsorOccupation: string
  sponsorAddress: string
  targetCountry: string
  relationshipType: 'spouse' | 'parents' | 'children' | 'common_law' | 'conjugal'
  dependentName: string
  dependentEmail: string
  dependentPhone: string
  dependentDateOfBirth: string
  dependentNationality: string
  dependentPassportNumber: string
  applicationStatus: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
  medicalStatus: 'pending' | 'in_progress' | 'completed' | 'cleared' | 'failed'
  backgroundStatus: 'pending' | 'in_progress' | 'completed' | 'cleared' | 'failed'
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

export default function OpsFamilySponsorshipPage() {
  const [operations, setOperations] = useState<FamilySponsorshipOps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [relationshipFilter, setRelationshipFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOperations()
  }, [searchTerm, statusFilter, relationshipFilter, countryFilter])

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const databaseOperations: FamilySponsorshipOps[] = []
      // Apply filters
      let filteredOperations: any[] = []

      if (searchTerm) {
        filteredOperations = filteredOperations.filter(op =>
          op.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.dependentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.sponsorEmail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => {
          if (statusFilter === 'application') return (op.applicationStatus as any) === statusFilter
          if (statusFilter === 'medical') return (op.medicalStatus as any) === statusFilter
          if (statusFilter === 'background') return (op.backgroundStatus as any) === statusFilter
          return true
        })
      }

      if (relationshipFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.relationshipType === relationshipFilter)
      }

      if (countryFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.targetCountry === countryFilter)
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
    } else if (type === 'medical' || type === 'background') {
      switch (status) {
        case 'completed':
        case 'cleared':
          return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Cleared</Badge>
        case 'in_progress':
          return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>
        case 'pending':
          return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
        case 'failed':
          return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Failed</Badge>
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
    } else if (type === 'milestone') {
      switch (status) {
        case 'completed':
          return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Completed</Badge>
        case 'in_progress':
          return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>
        case 'pending':
          return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>
        default:
          return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
      }
    }

    return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
  }

  const getRelationshipBadge = (relationship: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (relationship) {
      case 'spouse':
        return <Badge className={`${baseClasses} bg-pink-100 text-pink-800`}>Spouse</Badge>
      case 'parents':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Parents</Badge>
      case 'children':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Children</Badge>
      case 'common_law':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Common Law</Badge>
      case 'conjugal':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-800`}>Conjugal</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'spouse':
        return <Heart className="h-5 w-5" />
      case 'parents':
        return <Users className="h-5 w-5" />
      case 'children':
        return <Baby className="h-5 w-5" />
      case 'common_law':
        return <Heart className="h-5 w-5" />
      case 'conjugal':
        return <Heart className="h-5 w-5" />
      default:
        return <Family className="h-5 w-5" />
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatusFilter(value)
    else if (key === 'relationship') setRelationshipFilter(value)
    else if (key === 'country') setCountryFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setRelationshipFilter('all')
    setCountryFilter('all')
  }

  const exportReport = () => {
    alert('Exporting Family Sponsorship Operations Report')
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
            <h1 className="text-3xl font-bold text-gray-900">Family Sponsorship Operations</h1>
            <p className="text-gray-600">Manage family sponsorship applications and reunification services</p>
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
                <Family className="h-8 w-8 text-blue-600 mr-3" />
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
                <Heart className="h-8 w-8 text-pink-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Spouse Sponsorships</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.relationshipType === 'spouse').length}
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
                <option value="application">Application</option>
                <option value="medical">Medical</option>
                <option value="background">Background</option>
              </select>

              <select
                value={relationshipFilter}
                onChange={(e) => handleFilterChange('relationship', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Relationships</option>
                <option value="spouse">Spouse</option>
                <option value="parents">Parents</option>
                <option value="children">Children</option>
                <option value="common_law">Common Law</option>
                <option value="conjugal">Conjugal</option>
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
                      {getRelationshipIcon(operation.relationshipType)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operation.sponsorName} sponsoring {operation.dependentName}</CardTitle>
                      <p className="text-sm text-gray-500">{operation.relationshipType} sponsorship for {operation.targetCountry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">{operation.targetCountry}</Badge>
                    {getRelationshipBadge(operation.relationshipType)}
                    {getStatusBadge(operation.paymentStatus, 'payment')}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sponsor Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {operation.sponsorEmail}</p>
                      <p><strong>Phone:</strong> {operation.sponsorPhone}</p>
                      <p><strong>Status:</strong> {operation.sponsorStatus === 'citizen' ? 'Citizen' : 'Permanent Resident'}</p>
                      <p><strong>Income:</strong> {operation.currency} {operation.sponsorIncome.toLocaleString()}</p>
                      <p><strong>Occupation:</strong> {operation.sponsorOccupation}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Dependent Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Email:</strong> {operation.dependentEmail}</p>
                      <p><strong>Phone:</strong> {operation.dependentPhone}</p>
                      <p><strong>Nationality:</strong> {operation.dependentNationality}</p>
                      <p><strong>DOB:</strong> {new Date(operation.dependentDateOfBirth).toLocaleDateString()}</p>
                      <p><strong>Passport:</strong> {operation.dependentPassportNumber}</p>
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
                        <span className="text-sm text-gray-600">Medical:</span>
                        {getStatusBadge(operation.medicalStatus, 'medical')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Background:</span>
                        {getStatusBadge(operation.backgroundStatus, 'background')}
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
              <Family className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No family sponsorship applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



