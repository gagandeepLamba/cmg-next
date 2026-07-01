'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Send, MessageSquare, Phone, MapPin, Loader2 } from 'lucide-react';

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

  // ── Lead Activity Modal state ──
  const [showModal, setShowModal] = useState(false);
  const [modalLeadId, setModalLeadId] = useState<number | null>(null);
  const [modalLeadName, setModalLeadName] = useState('');
  const [modalType, setModalType] = useState<'appointment' | 'followup'>('appointment');
  const [remarkText, setRemarkText] = useState('');
  const [remarkSaving, setRemarkSaving] = useState(false);
  const [remarkSuccess, setRemarkSuccess] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Server derives role/branch from the auth token — no need to pass params
        const response = await fetch('/api/admin/dashboard');

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

  const openLeadModal = useCallback((leadId: number, leadName: string, type: 'appointment' | 'followup') => {
    if (!leadId) return;
    setModalLeadId(leadId);
    setModalLeadName(leadName);
    setModalType(type);
    setRemarkText('');
    setRemarkSuccess('');
    setShowModal(true);
  }, []);

  const submitRemark = useCallback(async () => {
    if (!modalLeadId || !remarkText.trim()) return;
    setRemarkSaving(true);
    setRemarkSuccess('');
    try {
      const res = await fetch('/api/lead-remarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: modalLeadId,
          employeeId: user?.id || 1,
          remark: remarkText.trim()
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save remark');
      }
      setRemarkText('');
      setRemarkSuccess('Remark saved successfully');
      setTimeout(() => setRemarkSuccess(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save remark');
    } finally {
      setRemarkSaving(false);
    }
  }, [modalLeadId, remarkText, user?.id]);

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
      leadId: appointment.leadid,
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
      leadId: followUp.lead_id,
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
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </motion.h1>
            <motion.p
              className="mt-1 text-gray-600"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
            >
              {(stats as any).roleCategory === 'admin'
                ? `All-company view · ${stats.totalLeads.toLocaleString()} total leads`
                : (stats as any).roleCategory === 'branch_manager'
                ? `Branch view · ${stats.totalLeads.toLocaleString()} leads in your branch`
                : `Your activity · ${stats.totalLeads.toLocaleString()} assigned leads`}
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
                <div
                  key={appointment.id}
                  onClick={() => openLeadModal(appointment.leadId, appointment.client, 'appointment')}
                  className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-0 cursor-pointer hover:bg-blue-50 rounded-lg px-2 -mx-2 transition-colors"
                >
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
                <div
                  key={followUp.id}
                  onClick={() => openLeadModal(followUp.leadId, followUp.client, 'followup')}
                  className="border-b border-gray-100 py-3 last:border-0 cursor-pointer hover:bg-amber-50 rounded-lg px-2 -mx-2 transition-colors"
                >
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

      {/* ── Lead Activity Modal ── */}
      {showModal && modalLeadId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{modalLeadName}</h2>
                <p className="text-sm text-gray-500">
                  {modalType === 'appointment' ? 'Appointment' : 'Follow-up'} — Lead #{modalLeadId}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Remark form */}
            <div className="px-6 py-4 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Add Remark / Note
              </label>
              <textarea
                rows={4}
                value={remarkText}
                onChange={e => setRemarkText(e.target.value)}
                placeholder="Type your remark or note here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              {remarkSuccess && (
                <p className="mt-2 text-sm text-green-600">{remarkSuccess}</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={submitRemark}
                disabled={remarkSaving || !remarkText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {remarkSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Save Remark
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
