'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  User,
  Building,
  MapPin,
  Shield,
  Crown,
  Eye,
  Lock,
  Briefcase
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  cemail: string
  role: number
  branch: number
  region: number
  type: string
  photo: string
  wfh: number
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // Check if user has admin privileges
      if (parsedUser.role >= 1) { // Allow all logged-in users (role 1+)
        setUser(parsedUser)
      } else {
        router.push('/admin')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Crown },
    { name: 'Admin Leads', href: '/admin/leads', icon: Users },
    { name: 'Lead Creation', href: '/admin/leads/create', icon: Users },
    { name: 'All Employees', href: '/admin/employees', icon: Users },
    { name: 'Branch Management', href: '/admin/branches', icon: Building },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ]

  const mainNavigation = [
    { name: 'Main Dashboard', href: '/admin', icon: Home },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Payments', href: '/payments', icon: DollarSign },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Reports', href: '/reports', icon: FileText },
  ]

  const operationsNavigation = [
    { name: 'Operations Hub', href: '/operations', icon: Settings },
    { name: 'Business Operations', href: '/ops-business', icon: Building },
    { name: 'Skill Assessment', href: '/ops-skill-canada', icon: FileText },
    { name: 'Student Visas', href: '/ops-student-visa', icon: Users },
    { name: 'Work Permits', href: '/ops-work-permit', icon: Briefcase },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600">Verifying admin privileges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-white mr-2" />
            <h1 className="text-xl font-bold text-white">DM Admin</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 px-4 space-y-6">
          {/* Admin Section */}
          <div>
            <div className="flex items-center mb-2">
              <Crown className="w-4 h-4 text-yellow-600 mr-2" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Admin Panel
              </p>
            </div>
            <div className="space-y-1">
              {adminNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <div className="flex items-center mb-2">
              <Home className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Main Navigation
              </p>
            </div>
            <div className="space-y-1">
              {mainNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Operations Section */}
          <div>
            <div className="flex items-center mb-2">
              <Settings className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Operations
              </p>
            </div>
            <div className="space-y-1">
              {operationsNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search admin panel..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Admin Badge */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">Admin</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      </div>
                    </div>
                    <a
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Profile
                    </a>
                    <a
                      href="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Settings
                    </a>
                    <div className="border-t my-1"></div>
                    <a
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      User View
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Admin Alert Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Admin privileges active - You have elevated access to system controls</span>
            </div>
            <Lock className="w-4 h-4" />
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
