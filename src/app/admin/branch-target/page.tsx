'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Building,
  BarChart,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

interface BranchTarget {
  id: number
  branchId: number
  branchName: string
  targetMonth: string
  targetYear: number
  leadsTarget: number
  appointmentsTarget: number
  revenueTarget: number
  conversionsTarget: number
  actualLeads: number
  actualAppointments: number
  actualRevenue: number
  actualConversions: number
  achievedLeads: number
  achievedAppointments: number
  achievedRevenue: number
  achievedConversions: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  managerId: number
  managerName: string
}

export default function BranchTargetPage() {
  const [targets, setTargets] = useState<BranchTarget[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [yearFilter, setYearFilter] = useState('2024')
  const [monthFilter, setMonthFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState('')

  useEffect(() => {
    fetchTargets()
  }, [yearFilter, monthFilter, statusFilter, branchFilter])

  const fetchTargets = async () => {
    setLoading(true)
    try {
      const databaseTargets: BranchTarget[] = []
      // Apply filters
      let filteredTargets: any[] = []

      if (searchTerm) {
        filteredTargets = filteredTargets.filter(target =>
          target.branchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          target.managerName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (yearFilter) {
        filteredTargets = filteredTargets.filter(target => target.targetYear === parseInt(yearFilter))
      }

      if (monthFilter) {
        filteredTargets = filteredTargets.filter(target => target.targetMonth === monthFilter)
      }

      if (statusFilter) {
        filteredTargets = filteredTargets.filter(target => target.status === statusFilter)
      }

      if (branchFilter) {
        filteredTargets = filteredTargets.filter(target => target.branchId === parseInt(branchFilter))
      }

      setTargets(filteredTargets)
    } catch (error) {
      console.error('Error fetching targets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getAchievementColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600'
    if (percentage >= 90) return 'text-blue-600'
    if (percentage >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAchievementIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (percentage >= 90) return <TrendingUp className="h-4 w-4 text-blue-500" />
    if (percentage >= 80) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    return <Clock className="h-4 w-4 text-red-500" />
  }

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.branchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          target.managerName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesYear = !yearFilter || target.targetYear === parseInt(yearFilter)
    const matchesMonth = !monthFilter || target.targetMonth === monthFilter
    const matchesStatus = !statusFilter || target.status === statusFilter
    const matchesBranch = !branchFilter || target.branchId === parseInt(branchFilter)
    
    return matchesSearch && matchesYear && matchesMonth && matchesStatus && matchesBranch
  })

  const overallStats = {
    totalTargets: filteredTargets.length,
    totalLeadsTarget: filteredTargets.reduce((sum, t) => sum + t.leadsTarget, 0),
    totalLeadsActual: filteredTargets.reduce((sum, t) => sum + t.actualLeads, 0),
    totalRevenueTarget: filteredTargets.reduce((sum, t) => sum + t.revenueTarget, 0),
    totalRevenueActual: filteredTargets.reduce((sum, t) => sum + t.actualRevenue, 0),
    totalConversionsTarget: filteredTargets.reduce((sum, t) => sum + t.conversionsTarget, 0),
    totalConversionsActual: filteredTargets.reduce((sum, t) => sum + t.actualConversions, 0),
    overallLeadsAchieved: filteredTargets.length > 0 
      ? (filteredTargets.reduce((sum, t) => sum + t.achievedLeads, 0) / filteredTargets.length)
      : 0,
    overallRevenueAchieved: filteredTargets.length > 0 
      ? (filteredTargets.reduce((sum, t) => sum + t.achievedRevenue, 0) / filteredTargets.length)
      : 0,
    overallConversionsAchieved: filteredTargets.length > 0 
      ? (filteredTargets.reduce((sum, t) => sum + t.achievedConversions, 0) / filteredTargets.length)
      : 0
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
            <h1 className="text-3xl font-bold text-gray-900">Branch Targets</h1>
            <p className="text-gray-600">Manage and track branch performance targets</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Set New Target
          </Button>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Leads Target</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalLeadsTarget}</p>
                  <p className="text-sm text-gray-500">Actual: {overallStats.totalLeadsActual}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Revenue Target</p>
                  <p className="text-2xl font-bold text-gray-900">${overallStats.totalRevenueTarget.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Actual: ${overallStats.totalRevenueActual.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Conversions Target</p>
                  <p className="text-2xl font-bold text-gray-900">{overallStats.totalConversionsTarget}</p>
                  <p className="text-sm text-gray-500">Actual: {overallStats.totalConversionsActual}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-500 rounded-lg p-3">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overall Achievement</p>
                  <p className="text-2xl font-bold text-green-600">{overallStats.overallLeadsAchieved.toFixed(1)}%</p>
                </div>
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
                  placeholder="Search targets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
              <select
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Branches</option>
                <option value="1">Dubai Main</option>
                <option value="2">Abu Dhabi</option>
                <option value="3">Sharjah</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Targets Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTargets.map((target) => (
                    <tr key={target.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {target.branchName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Manager: {target.managerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {target.targetMonth} {target.targetYear}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-900">
                            {target.actualLeads} / {target.leadsTarget}
                          </div>
                          <div className="text-xs text-gray-500">
                            ({target.achievedLeads.toFixed(1)}%)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-900">
                            ${target.actualRevenue.toLocaleString()} / ${target.revenueTarget.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            ({target.achievedRevenue.toFixed(1)}%)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-gray-900">
                            {target.actualConversions} / {target.conversionsTarget}
                          </div>
                          <div className="text-xs text-gray-500">
                            ({target.achievedConversions.toFixed(1)}%)
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(target.status)}
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
              
              {filteredTargets.length === 0 && (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No targets found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}



