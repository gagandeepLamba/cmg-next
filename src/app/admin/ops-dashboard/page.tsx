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
  TrendingDown,
  Users,
  Briefcase,
  GraduationCap,
  Building,
  Globe,
  Calendar,
  DollarSign,
  FileText,
  Target,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Receipt,
  User,
  Shield,
  Timer,
  Award,
  Settings,
  Bell,
  AlertTriangle,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react'

interface DashboardStats {
  totalOperations: number
  activeOperations: number
  completedOperations: number
  pendingOperations: number
  totalRevenue: number
  pendingRevenue: number
  totalClients: number
  activeStaff: number
}

interface RecentActivity {
  id: number
  type: 'operation' | 'contract' | 'payment' | 'document'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
  user: string
  operationId?: number
  contractId?: number
}

interface TopPerformer {
  id: number
  name: string
  role: string
  operationsHandled: number
  completionRate: number
  revenueGenerated: number
  avatar?: string
}

interface OperationSummary {
  category: string
  total: number
  active: number
  completed: number
  pending: number
  revenue: number
  icon: React.ReactNode
  color: string
}

export default function OpsDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOperations: 0,
    activeOperations: 0,
    completedOperations: 0,
    pendingOperations: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    totalClients: 0,
    activeStaff: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([])
  const [operationSummaries, setOperationSummaries] = useState<OperationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30days')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange, selectedCategory])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      setStats({
        totalOperations: 0,
        activeOperations: 0,
        completedOperations: 0,
        pendingOperations: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        totalClients: 0,
        activeStaff: 0
      })
      setRecentActivity([])
      setTopPerformers([])
      setOperationSummaries([])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'operation':
        return <Briefcase className="h-4 w-4" />
      case 'contract':
        return <FileText className="h-4 w-4" />
      case 'payment':
        return <CreditCard className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full'
    switch (status) {
      case 'success':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Success</Badge>
      case 'warning':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Warning</Badge>
      case 'error':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Error</Badge>
      case 'info':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Info</Badge>
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return `${Math.floor(diffInHours / 24)} days ago`
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
            <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
            <p className="text-gray-600">Comprehensive overview of all operations and activities</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Operations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOperations}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">12% from last month</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg text-blue-600">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Operations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOperations}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">8% from last month</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg text-green-600">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">15% from last month</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg text-yellow-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">6% from last month</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg text-purple-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operation Summaries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Operation Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationSummaries.map((summary, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 bg-${summary.color}-100 rounded-lg text-${summary.color}-600`}>
                        {summary.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{summary.category}</h3>
                        <p className="text-sm text-gray-500">{summary.total} operations</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(summary.revenue)}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{summary.active} active</span>
                        <span>•</span>
                        <span>{summary.completed} completed</span>
                        <span>•</span>
                        <span>{summary.pending} pending</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border-b border-gray-200 last:border-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-600">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">by {activity.user}</span>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPerformers.map((performer) => (
                <div key={performer.id} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium text-gray-900">{performer.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{performer.role}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Operations:</span>
                      <span className="font-medium">{performer.operationsHandled}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Completion:</span>
                      <span className="font-medium">{performer.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Revenue:</span>
                      <span className="font-medium">{formatCurrency(performer.revenueGenerated)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Briefcase className="h-6 w-6 mb-2" />
                <span>New Operation</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                <span>Generate Contract</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Add Client</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Download className="h-6 w-6 mb-2" />
                <span>Export Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

