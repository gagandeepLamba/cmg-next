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
  GraduationCap,
  Briefcase,
  Calculator,
  Star,
  TrendingUp as TrendingUpIcon,
  BookOpen,
  Code,
  Heart,
  Users as UsersIcon,
  Zap
} from 'lucide-react'

interface SkillCanadaPIPOps {
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
  applicationStatus: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
  eoiStatus: 'submitted' | 'invited' | 'accepted' | 'expired'
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

export default function OpsSkillCanadaPIPPage() {
  const [operations, setOperations] = useState<SkillCanadaPIPOps[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [eoiFilter, setEoiFilter] = useState('all')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOperations()
  }, [searchTerm, statusFilter, eoiFilter, scoreFilter])

  const fetchOperations = async () => {
    setLoading(true)
    try {
      const databaseOperations: SkillCanadaPIPOps[] = []
      // Apply filters
      let filteredOperations: any[] = []

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

      if (scoreFilter !== 'all') {
        if (scoreFilter === 'high') {
          filteredOperations = filteredOperations.filter(op => op.crsScore >= 460)
        } else if (scoreFilter === 'medium') {
          filteredOperations = filteredOperations.filter(op => op.crsScore >= 400 && op.crsScore < 460)
        } else if (scoreFilter === 'low') {
          filteredOperations = filteredOperations.filter(op => op.crsScore < 400)
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
    else if (key === 'score') setScoreFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setEoiFilter('all')
    setScoreFilter('all')
  }

  const exportReport = () => {
    alert('Exporting Canada PIP Skill Assessment Operations Report')
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
            <h1 className="text-3xl font-bold text-gray-900">Canada PIP Skill Assessment</h1>
            <p className="text-gray-600">Manage Provincial Immigration Program skill assessments and applications</p>
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
                <Calculator className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Average CRS Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.length > 0 ? Math.round(operations.reduce((sum, op) => sum + op.crsScore, 0) / operations.length) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">ITA Received</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {operations.filter(op => op.eoiStatus === 'invited' || op.eoiStatus === 'accepted').length}
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
                value={eoiFilter}
                onChange={(e) => handleFilterChange('eoi', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All EOI Status</option>
                <option value="submitted">Submitted</option>
                <option value="invited">Invited</option>
                <option value="accepted">Accepted</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={scoreFilter}
                onChange={(e) => handleFilterChange('score', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Scores</option>
                <option value="high">High (460+)</option>
                <option value="medium">Medium (400-459)</option>
                <option value="low">Low (&lt;400)</option>
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
                      <Calculator className="h-5 w-5" />
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Language Proficiency</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>English Test:</strong> {operation.englishTest}</p>
                      <p><strong>Reading:</strong> {operation.englishScores.reading}</p>
                      <p><strong>Writing:</strong> {operation.englishScores.writing}</p>
                      <p><strong>Listening:</strong> {operation.englishScores.listening}</p>
                      <p><strong>Speaking:</strong> {operation.englishScores.speaking}</p>
                      <p><strong>Total:</strong> {operation.englishScores.total.toFixed(3)}</p>
                      {operation.frenchScores && (
                        <p><strong>French Total:</strong> {operation.frenchScores.total.toFixed(1)}</p>
                      )}
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
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Points Breakdown</h4>
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
                      <span className="font-medium">Service Fee:</span> {operation.currency} {operation.serviceFee.toLocaleString()}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Submitted:</span> {new Date(operation.submissionDate).toLocaleDateString()}
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
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No Canada PIP skill assessment applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



