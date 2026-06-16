'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  PieChart,
  TrendingUp,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Globe,
  MapPin,
  Building,
  Award,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Printer,
  Share,
  RefreshCw,
  Database,
  Archive,
  FileSearch,
  AlertTriangle,
  Flag,
  History
} from 'lucide-react'

interface AusOldReport {
  id: number
  reportName: string
  reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom' | 'legacy'
  reportCategory: 'operations' | 'finance' | 'clients' | 'performance' | 'compliance' | 'migration'
  generatedDate: string
  periodStart: string
  periodEnd: string
  status: 'active' | 'archived' | 'deprecated' | 'legacy'
  dataPoints: number
  fileSize: string
  format: 'pdf' | 'excel' | 'csv' | 'json'
  generatedBy: string
  description: string
  metrics: {
    totalApplications: number
    approvedApplications: number
    rejectedApplications: number
    pendingApplications: number
    totalRevenue: number
    averageProcessingTime: number
    clientSatisfactionScore: number
    visaGrantRate: number
    averagePointsScore: number
    stateDistribution: Record<string, number>
    occupationDistribution: Record<string, number>
  }
  states: string[]
  isLegacy: boolean
  legacySystem: string
  migrationDate?: string
  lastAccessed?: string
  accessCount: number
  archivedDate?: string
}

export default function OpsReportAusOldPage() {
  const [reports, setReports] = useState<AusOldReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [searchTerm, typeFilter, categoryFilter, statusFilter])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const databaseReports: AusOldReport[] = []
      // Apply filters
      let filteredReports: any[] = []

      if (searchTerm) {
        filteredReports = filteredReports.filter(report =>
          report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (typeFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.reportType === typeFilter)
      }

      if (categoryFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.reportCategory === categoryFilter)
      }

      if (statusFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === statusFilter)
      }

      setReports(filteredReports)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'active':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Active</Badge>
      case 'archived':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Archived</Badge>
      case 'deprecated':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-800`}>Deprecated</Badge>
      case 'legacy':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Legacy</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (type) {
      case 'monthly':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Monthly</Badge>
      case 'quarterly':
        return <Badge className={`${baseClasses} bg-indigo-100 text-indigo-800`}>Quarterly</Badge>
      case 'yearly':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Yearly</Badge>
      case 'custom':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Custom</Badge>
      case 'legacy':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Legacy</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (category) {
      case 'operations':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Operations</Badge>
      case 'finance':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Finance</Badge>
      case 'clients':
        return <Badge className={`${baseClasses} bg-purple-100 text-purple-800`}>Clients</Badge>
      case 'performance':
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-800`}>Performance</Badge>
      case 'compliance':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Compliance</Badge>
      case 'migration':
        return <Badge className={`${baseClasses} bg-teal-100 text-teal-800`}>Migration</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'excel':
        return <BarChart className="h-4 w-4 text-green-500" />
      case 'csv':
        return <Database className="h-4 w-4 text-blue-500" />
      case 'json':
        return <FileSearch className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'type') setTypeFilter(value)
    else if (key === 'category') setCategoryFilter(value)
    else if (key === 'status') setStatusFilter(value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setStatusFilter('all')
  }

  const exportReport = (reportId: number) => {
    alert(`Exporting Australia report ${reportId}`)
  }

  const printReport = (reportId: number) => {
    alert(`Printing Australia report ${reportId}`)
  }

  const shareReport = (reportId: number) => {
    alert(`Sharing Australia report ${reportId}`)
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
            <h1 className="text-3xl font-bold text-gray-900">Australia Old Reports</h1>
            <p className="text-gray-600">Access and manage historical Australian migration reports and legacy data</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Generate New Report
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
                  <p className="text-sm text-gray-500">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.reduce((sum, report) => sum + report.dataPoints, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Flag className="h-8 w-8 text-teal-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Migration Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(report => report.reportCategory === 'migration').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Accesses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.reduce((sum, report) => sum + report.accessCount, 0)}
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
                  placeholder="Search Australia reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
                <option value="legacy">Legacy</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="operations">Operations</option>
                <option value="finance">Finance</option>
                <option value="clients">Clients</option>
                <option value="performance">Performance</option>
                <option value="compliance">Compliance</option>
                <option value="migration">Migration</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="deprecated">Deprecated</option>
                <option value="legacy">Legacy</option>
              </select>

              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200 opacity-75">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-teal-100 rounded-lg text-teal-600">
                      <Flag className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.reportName}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(report.reportType)}
                    {getCategoryBadge(report.reportCategory)}
                    {getStatusBadge(report.status)}
                    {report.isLegacy && (
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Report Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Generated:</strong> {new Date(report.generatedDate).toLocaleDateString()}</p>
                      <p><strong>Generated By:</strong> {report.generatedBy}</p>
                      <p><strong>File Size:</strong> {report.fileSize}</p>
                      <p><strong>Format:</strong> {report.format.toUpperCase()}</p>
                      <p><strong>Data Points:</strong> {report.dataPoints.toLocaleString()}</p>
                      <p><strong>Legacy System:</strong> {report.legacySystem}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Migration Metrics</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Total Applications:</strong> {report.metrics.totalApplications}</p>
                      <p><strong>Approved:</strong> {report.metrics.approvedApplications}</p>
                      <p><strong>Rejected:</strong> {report.metrics.rejectedApplications}</p>
                      <p><strong>Pending:</strong> {report.metrics.pendingApplications}</p>
                      <p><strong>Grant Rate:</strong> {report.metrics.visaGrantRate.toFixed(1)}%</p>
                      <p><strong>Avg Points:</strong> {report.metrics.averagePointsScore}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Access Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Access Count:</strong> {report.accessCount}</p>
                      <p><strong>Last Accessed:</strong> {report.lastAccessed ? new Date(report.lastAccessed).toLocaleDateString() : 'Never'}</p>
                      <p><strong>States Covered:</strong> {report.states.join(', ')}</p>
                      <p><strong>Archived:</strong> {report.archivedDate && new Date(report.archivedDate).toLocaleDateString()}</p>
                      <p><strong>Migrated:</strong> {report.migrationDate && new Date(report.migrationDate).toLocaleDateString()}</p>
                      <p><strong>Processing Time:</strong> {report.metrics.averageProcessingTime} months</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">State Distribution</h4>
                      <div className="space-y-1">
                        {Object.entries(report.metrics.stateDistribution).map(([state, count]) => (
                          <div key={state} className="flex justify-between text-sm">
                            <span className="text-gray-600">{state}:</span>
                            <span className="text-gray-900 font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Top Occupations</h4>
                      <div className="space-y-1">
                        {Object.entries(report.metrics.occupationDistribution).slice(0, 5).map(([occupation, count]) => (
                          <div key={occupation} className="flex justify-between text-sm">
                            <span className="text-gray-600">{occupation}:</span>
                            <span className="text-gray-900 font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Revenue:</span> ${report.metrics.totalRevenue.toLocaleString()}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Satisfaction:</span> {report.metrics.clientSatisfactionScore}/5.0
                      <span className="mx-2">•</span>
                      <span className="font-medium">Status:</span> {report.status}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => exportReport(report.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => printReport(report.id)}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => shareReport(report.id)}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No Australia old reports found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}



