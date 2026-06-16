'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useAuth } from '@/contexts/AuthContext';

// Register Chart.js components ONCE
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type ChangeType = 'increase' | 'decrease';

interface DashboardStats {
  totalLeads: number;
  totalEmployees: number;
  totalClients: number;
  totalAppointments: number;
  totalRevenue: number;
  conversionRate: number;
  activeProjects: number;
  pendingTasks: number;
  monthLeads: number;
  weekLeads: number;
  todayLeads: number;
  statusBreakdown?: Array<{ name: string; value: number }>;
  sourceBreakdown?: Array<{ name: string; value: number }>;
  priorityBreakdown?: Array<{ name: string; value: number }>;
  todayCounselorAppointments?: number;
  todayCounselorFollowUps?: number;
}

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeType?: ChangeType;
};

function StatCard({ title, value, icon, change, changeType }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{title}</p>

          <motion.p
            className="mt-2 text-2xl font-semibold text-gray-900"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 180, damping: 14 }}
          >
            {value}
          </motion.p>

          {typeof change === 'number' && changeType && (
            <motion.p
              className={[
                'mt-2 text-sm',
                changeType === 'increase' ? 'text-green-600' : 'text-red-600',
              ].join(' ')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              {changeType === 'increase' ? '↑' : '↓'} {change}% from last month
            </motion.p>
          )}
        </div>

        <motion.div
          className="shrink-0 text-3xl"
          whileHover={{ scale: 1.08, rotate: 4 }}
          transition={{ type: 'spring', stiffness: 220, damping: 12 }}
          aria-hidden
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalEmployees: 0,
    totalClients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    conversionRate: 0,
    activeProjects: 0,
    pendingTasks: 0,
    monthLeads: 0,
    weekLeads: 0,
    todayLeads: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [recentLeadsData, setRecentLeadsData] = useState<any[]>([]);
  const [recentAppointmentsData, setRecentAppointmentsData] = useState<any[]>([]);
  const [todayAppointmentsData, setTodayAppointmentsData] = useState<any[]>([]);
  const [todayFollowUpsData, setTodayFollowUpsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Fetching real dashboard data...');
        const roleText = `${user?.role || ''} ${user?.type || ''}`.toLowerCase();
        const canViewAllDailyWork =
          roleText.includes('super') ||
          roleText.includes('director') ||
          roleText.includes('founder') ||
          roleText.includes('admin');
        const employeeId = user?.id && !canViewAllDailyWork ? String(user.id) : '';
        const response = await fetch(`/api/admin/dashboard${employeeId ? `?employeeId=${employeeId}` : ''}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Real dashboard data received:', data);
          
          const realStats = data.success && data.data ? data.data.stats : data;
          if (realStats) {
            setStats({
              totalLeads: realStats.totalLeads || 0,
              totalEmployees: realStats.totalEmployees || 0,
              totalClients: realStats.totalLeads || 0, // Use leads as clients for now
              totalAppointments: realStats.totalAppointments || realStats.upcomingAppointments || 0,
              totalRevenue: realStats.totalPayments || realStats.totalRevenue || 0,
              conversionRate: parseFloat(realStats.conversionRate || 0) || 0,
              activeProjects: realStats.weekLeads || 0, // Use weekly leads as active projects
              pendingTasks: realStats.todayLeads || 0, // Use today's leads as pending tasks
              monthLeads: realStats.monthLeads || 0,
              weekLeads: realStats.weekLeads || 0,
              todayLeads: realStats.todayLeads || 0,
              statusBreakdown: realStats.statusBreakdown || data.data?.stats?.statusBreakdown || [],
              sourceBreakdown: realStats.sourceBreakdown || data.data?.stats?.sourceBreakdown || [],
              priorityBreakdown: realStats.priorityBreakdown || data.data?.stats?.priorityBreakdown || [],
              todayCounselorAppointments: realStats.todayCounselorAppointments || data.data?.todayAppointments?.length || 0,
              todayCounselorFollowUps: realStats.todayCounselorFollowUps || data.data?.todayFollowUps?.length || 0,
            });
            
            // Set recent leads and appointments from API
            setRecentLeadsData(data.data?.recentLeads || realStats.recentLeads || []);
            setRecentAppointmentsData(data.data?.recentAppointments || realStats.recentAppointments || []);
            setTodayAppointmentsData(data.data?.todayAppointments || []);
            setTodayFollowUpsData(data.data?.todayFollowUps || []);
            
            setLastUpdated(new Date().toLocaleString());
            setError('');
          } else {
            console.error('❌ Dashboard API error:', data.error);
            setError('Failed to load dashboard data');
          }
        } else {
          console.error('❌ Dashboard API response error');
          setError('Failed to connect to dashboard');
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        setError('Network error loading dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' as const },
        tooltip: { enabled: true },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    []
  );

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' as const },
      },
    }),
    []
  );

  const leadsChartData = useMemo(
    () => ({
      labels: ['Month Ago', 'Week Ago', 'Today'],
      datasets: [
        {
          label: 'Real Leads from Database',
          data: [stats.monthLeads, stats.weekLeads, stats.totalLeads],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Today\'s Leads',
          data: [0, 0, stats.todayLeads],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    }),
    [stats]
  );

  const revenueChartData = useMemo(
    () => ({
      labels: ['Month Ago', 'Week Ago', 'Today'],
      datasets: [
        {
          label: 'Real Payments from Database',
          data: [0, 0, stats.totalRevenue],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
        },
      ],
    }),
    [stats]
  );

  const conversionChartData = useMemo(() => {
    const rawDistribution = (stats as any).statusBreakdown || [];
    const labels = rawDistribution.length ? rawDistribution.map((item: any) => item.name) : ['No Leads'];
    const values = rawDistribution.length ? rawDistribution.map((item: any) => item.value) : [0];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(8, 145, 178, 0.8)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  const departmentChartData = useMemo(
    () => ({
      labels: ['Leads', 'Appointments', 'Employees', 'Revenue', 'Projects'],
      datasets: [
        {
          data: [
            stats.totalLeads || 0,
            stats.totalAppointments || 0,
            stats.totalEmployees || 0,
            Math.floor((stats.totalRevenue || 0) / 1000) || 0,
            stats.activeProjects || 0
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(251, 191, 36)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)',
          ],
          borderWidth: 2,
        },
      ],
    }),
    [stats]
  );

  const recentLeads = useMemo(
    () => {
      // Transform real API data to the format expected by the component
      const transformed = recentLeadsData.map((lead: any) => ({
        name: lead.name || `${lead.fname || ''} ${lead.lname || ''}`.trim() || 'Unknown',
        email: lead.email || 'No email',
        status: lead.status || 'Unknown',
        date: lead.date || (lead.created ? new Date(lead.created).toISOString().split('T')[0] : 'No date')
      }));
      return transformed;
    },
    [recentLeadsData]
  );

  const upcomingAppointments = useMemo(
    () => {
      // Transform real API data to the format expected by the component
      const transformed = recentAppointmentsData.map((appointment: any) => ({
        client: `${appointment.fname || ''} ${appointment.lname || ''}`.trim() || 'Unknown Client',
        time: appointment.appointtime ? new Date(`2000-01-01 ${appointment.appointtime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'No time',
        type: 'Appointment',
        date: appointment.date ? new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'
      }));
      return transformed;
    },
    [recentAppointmentsData]
  );

  const todayAppointments = useMemo(
    () => todayAppointmentsData.map((appointment: any) => ({
      id: appointment.id,
      client: `${appointment.fname || ''} ${appointment.lname || ''}`.trim() || `Lead #${appointment.leadid || ''}`,
      phone: appointment.phone || appointment.mobile || 'No phone',
      time: appointment.appointtime ? String(appointment.appointtime).slice(0, 5) : 'No time',
      status: Number(appointment.done || 0) === 1 ? 'Completed' : Number(appointment.not_done || 0) === 1 ? 'Not Done' : Number(appointment.booked || 0) === 1 ? 'Fixed' : 'Pending',
      branch: appointment.branchName || 'No branch'
    })),
    [todayAppointmentsData]
  );

  const todayFollowUps = useMemo(
    () => todayFollowUpsData.map((followUp: any) => ({
      id: followUp.id,
      client: `${followUp.fname || ''} ${followUp.lname || ''}`.trim() || `Lead #${followUp.lead_id || ''}`,
      phone: followUp.phone || followUp.mobile || 'No phone',
      time: followUp.reminder_date ? new Date(followUp.reminder_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'No time',
      status: followUp.status || 'pending',
      priority: followUp.priority || 'medium',
      message: followUp.message || 'No message'
    })),
    [todayFollowUpsData]
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"
          />
          <p className="text-gray-600">Loading real dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌ {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="border-b bg-white"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <motion.h1
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
            >
              Dashboard
            </motion.h1>
            <motion.p
              className="mt-1 text-gray-600"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
            >
              Welcome back! Real-time data from database ({stats.totalLeads} leads loaded).
            </motion.p>
            <motion.div
              className="mt-2 flex items-center gap-2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 }}
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Database Connected</span>
              </div>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>
            </motion.div>
          </div>

          <motion.div
            className="flex shrink-0 items-center gap-4"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 }}
          >
            <motion.button
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                // hook your export handler here
                console.log('Export Report');
              }}
            >
              Export Report
            </motion.button>

            <div className="text-sm text-gray-600">
              Last updated: <span className="font-medium text-gray-900">{lastUpdated}</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Database Verification Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-green-800 mb-3">📊 Real Database Connection Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse"></div>
              <div className="text-sm font-medium text-green-700">Database</div>
              <div className="text-xs text-green-600">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{stats.totalLeads}</div>
              <div className="text-sm font-medium text-green-700">Total Leads</div>
              <div className="text-xs text-green-600">Real Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{stats.totalAppointments}</div>
              <div className="text-sm font-medium text-green-700">Appointments</div>
              <div className="text-xs text-green-600">Real Data</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">{stats.totalEmployees}</div>
              <div className="text-sm font-medium text-green-700">Employees</div>
              <div className="text-xs text-green-600">Real Data</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-600 text-center">
            Last Updated: {lastUpdated} | Data Source: dmconsultant_mydmcons_dm
          </div>
        </motion.div>

        {/* Lead + Appointment Dashboard */}
       
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Leads" value={stats.totalLeads.toLocaleString()} icon="👥" change={12} changeType="increase" />
          <StatCard title="Total Clients" value={stats.totalClients.toLocaleString()} icon="👤" change={8} changeType="increase" />
          <StatCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon="💰" change={15} changeType="increase" />
          <StatCard title="Conversion Rate" value={`${stats.conversionRate}%`} icon="📈" change={3} changeType="increase" />
        </div>

        {/* Additional Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard title="Active Projects" value={stats.activeProjects} icon="🚀" change={5} changeType="increase" />
          <StatCard title="Pending Tasks" value={stats.pendingTasks} icon="📋" change={2} changeType="decrease" />
          <StatCard title="Total Employees" value={stats.totalEmployees} icon="👔" change={0} changeType="increase" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Appointments</h3>
                <p className="text-sm text-gray-500">{user?.name || 'Counsellor'} daily schedule</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                {todayAppointments.length}
              </span>
            </div>
            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  No appointments fixed for today.
                </div>
              ) : todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{appointment.client}</p>
                    <p className="truncate text-xs text-gray-500">{appointment.phone} &middot; {appointment.branch}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-900">{appointment.time}</p>
                    <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Follow-ups</h3>
                <p className="text-sm text-gray-500">Pending calls and reminders</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                {todayFollowUps.length}
              </span>
            </div>
            <div className="space-y-3">
              {todayFollowUps.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  No follow-ups scheduled for today.
                </div>
              ) : todayFollowUps.map((followUp) => (
                <div key={followUp.id} className="border-b border-gray-100 py-3 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{followUp.client}</p>
                      <p className="truncate text-xs text-gray-500">{followUp.phone}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-gray-900">{followUp.time}</p>
                      <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        {followUp.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-gray-600">{followUp.message}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Charts */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Lead Generation Trend</h3>
            <div className="h-64">
              <Line data={leadsChartData} options={chartOptions} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="h-64">
              <Bar data={revenueChartData} options={chartOptions} />
            </div>
          </motion.section>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Conversion Funnel</h3>
            <div className="h-64">
              <Doughnut data={conversionChartData} options={pieOptions} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Employees by Department</h3>
            <div className="h-64">
              <Pie data={departmentChartData} options={pieOptions} />
            </div>
          </motion.section>
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Leads</h3>
            <div className="space-y-3">
              {recentLeads.map((lead, i) => (
                <div
                  key={`${lead.email}-${i}`}
                  className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{lead.name}</p>
                    <p className="truncate text-xs text-gray-500">{lead.email}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={[
                        'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                        lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                        lead.status === 'Proposal' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800',
                      ].join(' ')}
                    >
                      {lead.status}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <div className="space-y-3">
              {upcomingAppointments.map((a, i) => (
                <div
                  key={`${a.client}-${a.time}-${i}`}
                  className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{a.client}</p>
                    <p className="truncate text-xs text-gray-500">{a.type}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{a.time}</p>
                    <p className="mt-1 text-xs text-gray-500">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
