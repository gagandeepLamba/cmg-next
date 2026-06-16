'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessAdminPath, getDefaultAdminPathForUser } from '@/lib/roleAccess';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Home,
  TrendingUp,
  Building,
  Calendar,
  Bell,
  Search,
  User,
  ChevronDown,
  Target,
  DollarSign,
  Globe,
  Briefcase,
  UserCheck,
  CreditCard,
  MessageSquare,
  FileCheck,
  UserPlus,
  RefreshCw,
  Shield,
  Database,
  Mail,
  Award,
  Clock
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  permissions?: string[];
  badge?: number;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, hasPermission, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Set sidebar open by default
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (isLoading || !user || canAccessAdminPath(user, pathname)) return;
    router.replace(getDefaultAdminPathForUser(user));
  }, [isLoading, pathname, router, user]);

  const navigationGroups: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'Core',
      items: [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Reports', href: '/admin/reports/panel', icon: BarChart3, permission: 'reports.view' },
        { name: 'Lead Reports', href: '/admin/reports/lead-status', icon: Users, permission: 'reports.view' },
        { name: 'Lead Source Analytics', href: '/admin/reports/lead-source-analytics', icon: TrendingUp, permission: 'reports.view' },
        { name: 'Lead Performance', href: '/admin/reports/lead-performance', icon: Award, permission: 'reports.view' },
        { name: 'Conversion Funnel', href: '/admin/reports/lead-conversion-funnel', icon: Target, permission: 'reports.view' },
        { name: 'Lead Aging', href: '/admin/reports/lead-aging', icon: Clock, permission: 'reports.view' },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp, permission: 'analytics.view' },
        { name: 'Leads', href: '/admin/leads', icon: Users, permission: 'leads.view' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Calendar', href: '/admin/calendar', icon: Calendar, permission: 'appointments.view' },
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar, permission: 'appointments.manage' },
        { name: 'Documents', href: '/admin/documents', icon: FileText, permission: 'documents.view' },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard, permission: 'payments.view' },
        { name: 'Invoices', href: '/admin/invoices', icon: FileText, permission: 'invoices.view' },
        { name: 'Agreements', href: '/admin/agreements', icon: FileCheck, permission: 'agreements.view' },
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Clients', href: '/admin/clients', icon: Users, permission: 'clients.view' },
        { name: 'Counselors', href: '/admin/counselors', icon: UserPlus, permission: 'counselors.manage' },
        { name: 'Employees', href: '/admin/employees', icon: Briefcase, permission: 'employees.manage' },
        { name: 'Branches', href: '/admin/branches', icon: Building, permission: 'branches.manage' },
        { name: 'Departments', href: '/admin/departments', icon: Building, permission: 'departments.manage' },
        { name: 'Attendance', href: '/admin/attendance', icon: UserCheck, permission: 'attendance.manage' },
      ]
    },
    {
      title: 'HR Module',
      items: [
        { name: 'HR Dashboard', href: '/admin/hr', icon: BarChart3, permissions: ['hr.dashboard', 'hr.view', 'hr.payroll', 'hr.eosb', 'hr.self', 'hr.team.attendance_leave'] },
        { name: 'Employee Data Sheet', href: '/admin/hr/employee-data-sheet', icon: Users, permissions: ['hr.view', 'hr.create', 'hr.update', 'hr.self'] },
        { name: 'Attendance Management', href: '/admin/hr/attendance-management', icon: UserCheck, permissions: ['hr.view', 'hr.create', 'hr.update', 'hr.team.attendance_leave'] },
        { name: 'Leave Management', href: '/admin/hr/leave-management', icon: Calendar, permissions: ['hr.view', 'hr.create', 'hr.update', 'hr.team.attendance_leave'] },
        { name: 'Payroll Management', href: '/admin/hr/payroll-management', icon: DollarSign, permissions: ['hr.payroll', 'hr.view'] },
        { name: 'EOSB', href: '/admin/hr/eosb', icon: FileCheck, permissions: ['hr.eosb', 'hr.view'] },
        { name: 'Payslip Generation', href: '/admin/hr/payslip-generation', icon: CreditCard, permissions: ['hr.payroll', 'hr.view'] },
        { name: 'Exit Checklist', href: '/admin/hr/exit-checklist', icon: FileText, permissions: ['hr.view', 'hr.update'] },
        { name: 'Letters', href: '/admin/hr/letters', icon: Mail, permissions: ['hr.view', 'hr.update'] },
        { name: 'Exit Interview', href: '/admin/hr/exit-interview', icon: MessageSquare, permissions: ['hr.view', 'hr.update'] },
      ]
    },
    {
      title: 'PRO Works',
      items: [
        { name: 'PRO Dashboard', href: '/admin/pro-works', icon: BarChart3, permissions: ['pro.dashboard', 'pro.view', 'pro.wps.view', 'pro.owners.restricted'] },
        { name: 'Company Documents', href: '/admin/pro-works/company-documents', icon: FileText, permissions: ['pro.view', 'pro.create', 'pro.update'] },
        { name: 'Employee Labour / Immigration', href: '/admin/pro-works/employee-labour-immigration', icon: UserCheck, permissions: ['pro.view', 'pro.create', 'pro.update'] },
        { name: 'WPS Management', href: '/admin/pro-works/wps-management', icon: CreditCard, permissions: ['pro.wps.view', 'pro.view'] },
        { name: 'Renewal Reminders', href: '/admin/pro-works/renewal-reminders', icon: Bell, permissions: ['pro.dashboard', 'pro.view'] },
        { name: 'Insurance List', href: '/admin/pro-works/insurance-list', icon: Shield, permissions: ['pro.view', 'pro.create', 'pro.update'] },
        { name: 'GCC Branch Documents', href: '/admin/pro-works/gcc-branch-documents', icon: Globe, permissions: ['pro.view', 'pro.create', 'pro.update'] },
        { name: 'Owners Database', href: '/admin/pro-works/owners-document-database', icon: Database, permissions: ['pro.owners.restricted', 'admin.access'] },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { name: 'Programs', href: '/admin/programs', icon: Target, permission: 'programs.manage' },
        { name: 'Fees', href: '/admin/fees', icon: DollarSign, permission: 'fees.manage' },
        { name: 'Currency', href: '/admin/currency', icon: Globe, permission: 'currency.manage' },
        { name: 'Countries', href: '/admin/countries', icon: Globe, permission: 'countries.manage' },
        { name: 'Roles', href: '/admin/roles', icon: UserCheck, permission: 'roles.manage' },
        { name: 'Role Permissions', href: '/admin/roles/permissions', icon: Shield, permission: 'admin.access' },
        { name: 'Market Sources', href: '/admin/market-sources', icon: BarChart3, permission: 'marketing.manage' },
        { name: 'Campaigns', href: '/admin/campaigns', icon: MessageSquare, permission: 'campaigns.manage' },
        { name: 'Email Templates', href: '/admin/email-templates', icon: Mail, permission: 'templates.manage' },
      ]
    },
    {
      title: 'Advanced',
      items: [
        { name: 'B2B', href: '/admin/b2b', icon: Briefcase, permission: 'b2b.manage' },
        { name: 'Employers', href: '/admin/employers', icon: Briefcase, permission: 'employers.manage' },
        { name: 'Lead Transfers', href: '/admin/lead-transfers', icon: RefreshCw, permission: 'transfers.manage' },
        { name: 'Client Recognition', href: '/admin/client-recognition', icon: UserPlus, permission: 'recognition.manage' },
        { name: 'Monitoring', href: '/admin/monitoring', icon: Shield, permission: 'monitoring.view' },
        { name: 'Operations', href: '/admin/operations-management', icon: Database, permission: 'operations.manage' },
        { name: 'Legacy Modules', href: '/admin/legacy-modules', icon: Database, permission: 'settings.manage' },
        { name: 'Settings', href: '/admin/settings', icon: Settings, permission: 'settings.manage' },
      ]
    }
  ];

// Flatten all navigation items for filtering
  const allNavigationItems = navigationGroups.flatMap(group => group.items);

  const filteredNavigation = allNavigationItems.filter(item => {
    if (!canAccessAdminPath(user, item.href)) return false;

    const itemPermissions = item.permissions || (item.permission ? [item.permission] : []);
    const shouldShow = itemPermissions.length === 0 ||
                      user?.permissions?.includes('all') ||
                      itemPermissions.some((permission) => hasPermission(permission));
    return shouldShow;
  });

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Show loading state while user data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render navigation if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex flex-col
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">DM Immigration</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-8">
            {navigationGroups.map((group) => {
              const permittedItems = group.items.filter(item => filteredNavigation.includes(item));
              if (permittedItems.length === 0) return null;

              return (
              <div key={group.title}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {permittedItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        onClick={() => router.push(item.href)}
                        className={`
                          w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          ${isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </div>
        </nav>

        {/* User info in sidebar */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search bar */}
              <div className="hidden md:block ml-4 flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search reports, leads, or anything..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="ml-2 hidden md:block text-gray-700">{user?.name}</span>
                  <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => router.push('/admin/profile')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => router.push('/admin/settings')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
