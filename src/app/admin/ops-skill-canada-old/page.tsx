'use client'

import { useState, useEffect } from 'react'
import { mapOperationsRowToListItem, searchOperationCases } from '@/lib/operationsClient'
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
  GraduationCap,
  Briefcase,
  Calculator,
  Star,
  TrendingUp as TrendingUpIcon,
  BookOpen,
  Code,
  Heart,
  Users as UsersIcon,
  Zap,
  Archive,
  History,
  FileSearch,
  Database,
  AlertTriangle
} from 'lucide-react'

interface SkillCanadaOldOps {
  id: number
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  targetCountry: string
  occupation: string
  nocCode: string
  workExperience: number
  education: string
  englishTest: string
  englishScores: {
    reading: number
    writing: number
    listening: number
    speaking: number
    total: number
  }
  frenchScores?: {
    reading: number
    writing: number
    listening: number
    speaking: number
    total: number
  }
  pointsBreakdown: {
    age: number
    education: number
    language: number
    workExperience: number
    adaptability: number
    skillsTransferability: number
    provincialNomination: number
    jobOffer: number
    total: number
  }
  applicationStatus: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled' | 'archived'
  eoiStatus: 'submitted' | 'invited' | 'accepted' | 'expired' | 'archived'
  submissionDate: string
  invitationDate?: string
  crsScore: number
  cutoffScore: number
  rank: number
  serviceFee: number
  currency: string
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  assignedTo: string
  assignedToId: number
  isLegacy: boolean
  legacySystem: string
  migrationDate?: string
  documents: Array<{
    id: number
    name: string
    type: string
    uploadDate: string
    status: 'pending' | 'approved' | 'rejected' | 'archived'
    url: string
    isLegacy: boolean
  }>
  milestones: Array<{
    id: number
    title: string
    description: string
    dueDate: string
    status: 'pending' | 'in_progress' | 'completed' | 'archived'
    completedDate?: string
    isLegacy: boolean
  }>
  createdAt: string
  updatedAt: string
  archivedDate?: string
}

export default function OpsSkillCanadaOldPage() {
  const [operations, setOperations] = useState<SkillCanadaOldOps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [eoiFilter, setEoiFilter] = useState('all')
  const [legacyFilter, setLegacyFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOperations()
  }, [searchTerm, statusFilter, eoiFilter, legacyFilter])

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const databaseOperations = (await searchOperationCases({ module: 'skill-canada', search: searchTerm || null, limit: 100 }))
        .map(mapOperationsRowToListItem) as unknown as SkillCanadaOldOps[]
      // Apply filters
      let filteredOperations: any[] = databaseOperations

      if (searchTerm) {
        filteredOperations = filteredOperations.filter(op =>
          op.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          op.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.applicationStatus === statusFilter)
      }

      if (eoiFilter !== 'all') {
        filteredOperations = filteredOperations.filter(op => op.eoiStatus === eoiFilter)
      }

      if (legacyFilter !== 'all') {
        if (legacyFilter === 'legacy') {
          filteredOperations = filteredOperations.filter(op => op.isLegacy)
        } else if (legacyFilter === 'migrated') {
          filteredOperations = filteredOperations.filter(op => op.migrationDate)
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
      case 'archived':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Archived</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getEOIBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'submitted':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Submitted</Badge>
      case 'invited':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Invited</Badge>
      case 'accepted':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Accepted</Badge>
      case 'expired':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Expired</Badge>
      case 'archived':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Archived</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getScoreBadge = (score: number) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    if (score >= 460) {
      return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>{score}</Badge>
    } else if (score >= 400) {
      return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{score}</Badge>
    } else {
      return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>{score}</Badge>
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatusFilter(value)
    else if (key === 'eoi') setEoiFilter(value)
    else if (key === 'legacy') setLegacyFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setEoiFilter('all')
    setLegacyFilter('all')
  }

  const exportReport = () => {
    alert('Exporting Canada Old Skill Assessment Operations Report')
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
            <h1 className="text-3xl font-bold text-gray-900">Canada Old Skill Assessment</h1>
            <p className="text-gray-600">Manage archived and legacy Canadian skill assessment applications</p>
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
                <Archive className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Archived</p>
                  <p className="text-2xl font-bold text-gray-900">{operations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <History className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Legacy Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.isLegacy).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Migrated Data</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.migrationDate).length}
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
                  <p className="text-sm text-gray-500">Historical Revenue</p>
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
                  placeholder="Search archived applications..."
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
                <option value="archived">Archived</option>
              </select>

              <select
                value={eoiFilter}
                onChange={(e) => handleFilterChange('eoi', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All EOI Status</option>
                <option value="submitted">Submitted</option>
                <option value="invited">Invited</option>
                <option value="accepted">Accepted</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={legacyFilter}
                onChange={(e) => handleFilterChange('legacy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="legacy">Legacy Only</option>
                <option value="migrated">Migrated Only</option>
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
            <Card key={operation.id} className="hover:shadow-lg transition-shadow duration-200 opacity-75">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg text-gray-600">
                      <Archive className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{operation.applicantName}</CardTitle>
                      <p className="text-sm text-gray-500">{operation.occupation} (NOC {operation.nocCode})</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">{operation.targetCountry}</Badge>
                    {getScoreBadge(operation.crsScore)}
                    {getStatusBadge(operation.applicationStatus)}
                    {getEOIBadge(operation.eoiStatus)}
                    {operation.isLegacy && (
                      <Badge className="bg-gray-100 text-gray-800">
                        <History className="h-3 w-3 mr-1" />
                        Legacy
                      </Badge>
                    )}
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
                      <p><strong>Education:</strong> {operation.education}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Legacy Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>System:</strong> {operation.legacySystem}</p>
                      <p><strong>Submitted:</strong> {new Date(operation.submissionDate).toLocaleDateString()}</p>
                      <p><strong>Archived:</strong> {operation.archivedDate && new Date(operation.archivedDate).toLocaleDateString()}</p>
                      <p><strong>Migrated:</strong> {operation.migrationDate && new Date(operation.migrationDate).toLocaleDateString()}</p>
                      <p><strong>Assigned:</strong> {operation.assignedTo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Application Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Application:</span>
                        {getStatusBadge(operation.applicationStatus)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">EOI Status:</span>
                        {getEOIBadge(operation.eoiStatus)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">CRS Score:</span>
                        {getScoreBadge(operation.crsScore)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rank:</span>
                        <span className="text-sm text-gray-900">#{operation.rank.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Work Exp:</span>
                        <span className="text-sm text-gray-900">{operation.workExperience} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Historical Points Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{operation.pointsBreakdown.age}</div>
                      <div className="text-xs text-gray-500">Age</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{operation.pointsBreakdown.education}</div>
                      <div className="text-xs text-gray-500">Education</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{operation.pointsBreakdown.language}</div>
                      <div className="text-xs text-gray-500">Language</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{operation.pointsBreakdown.workExperience}</div>
                      <div className="text-xs text-gray-500">Work Exp</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{operation.pointsBreakdown.adaptability}</div>
                      <div className="text-xs text-gray-500">Adaptability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{operation.pointsBreakdown.skillsTransferability}</div>
                      <div className="text-xs text-gray-500">Skills Transfer</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">{operation.pointsBreakdown.provincialNomination}</div>
                      <div className="text-xs text-gray-500">Provincial</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{operation.pointsBreakdown.total}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Archived Milestones</h4>
                  <div className="space-y-2">
                    {operation.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded opacity-75">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{milestone.title}</div>
                          <div className="text-xs text-gray-500">{milestone.description}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                          {milestone.isLegacy && <History className="h-3 w-3 text-gray-500" />}
                          {getStatusBadge(milestone.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Documents:</span> {operation.documents.length} archived
                      <span className="mx-2">•</span>
                      <span className="font-medium">Service Fee:</span> {operation.currency} {operation.serviceFee.toLocaleString()}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Archived:</span> {operation.archivedDate && new Date(operation.archivedDate).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Legacy:</span> {operation.legacySystem}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileSearch className="h-4 w-4 mr-2" />
                        View Archive
                      </Button>
                      <Button variant="outline" size="sm">
                        <Database className="h-4 w-4 mr-2" />
                        Export Data
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
              <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No archived skill assessment applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



