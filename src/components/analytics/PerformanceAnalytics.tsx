'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Target, Clock, AlertCircle,
  CheckCircle, Calendar, Filter, Download, RefreshCw, Eye, Settings,
  Activity, FileText, Phone, Mail, Zap, Award, TrendingDown as TrendingDownIcon
} from 'lucide-react';

interface CounselorPerformance {
  id: number;
  name: string;
  role: string;
  metrics: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: number;
    avgResponseTime: number;
    avgProcessingTime: number;
    satisfactionScore: number;
    workloadUtilization: number;
    completedTasks: number;
    failedTasks: number;
    totalRevenue: number;
    efficiency: number;
  };
  trends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  activities: {
    leadAssignments: number;
    communications: number;
    conversions: number;
    workflows: number;
  };
  alerts: {
    highWorkload: boolean;
    lowPerformance: boolean;
    overdueTasks: number;
    failedTasks: number;
  };
}

interface PerformanceReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalCounselors: number;
  totalActivities: number;
  totalRevenue: number;
  avgConversionRate: number;
  avgResponseTime: number;
  topPerformers: CounselorPerformance[];
  issues: Array<{
    type: 'performance' | 'workload' | 'efficiency';
    counselor: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export default function PerformanceAnalytics() {
  const [performanceData, setPerformanceData] = useState<CounselorPerformance[]>([]);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    generateMockData();
  }, [selectedPeriod]);

  const generateMockData = () => {
    const counselors: CounselorPerformance[] = [
      {
        id: 1,
        name: 'Sarah Wilson',
        role: 'Counselor',
        metrics: {
          totalLeads: 45,
          convertedLeads: 32,
          conversionRate: 71.1,
          avgResponseTime: 45000,
          avgProcessingTime: 180000,
          satisfactionScore: 4.7,
          workloadUtilization: 85,
          completedTasks: 38,
          failedTasks: 3,
          totalRevenue: 125000,
          efficiency: 92
        },
        trends: {
          daily: [5, 8, 6, 9, 7, 8, 6],
          weekly: [35, 42, 38, 45],
          monthly: [180, 195, 175, 210]
        },
        activities: {
          leadAssignments: 45,
          communications: 89,
          conversions: 32,
          workflows: 28
        },
        alerts: {
          highWorkload: true,
          lowPerformance: false,
          overdueTasks: 2,
          failedTasks: 3
        }
      },
      {
        id: 2,
        name: 'Mike Johnson',
        role: 'Counselor',
        metrics: {
          totalLeads: 38,
          convertedLeads: 25,
          conversionRate: 65.8,
          avgResponseTime: 62000,
          avgProcessingTime: 220000,
          satisfactionScore: 4.3,
          workloadUtilization: 72,
          completedTasks: 30,
          failedTasks: 5,
          totalRevenue: 98000,
          efficiency: 78
        },
        trends: {
          daily: [4, 6, 5, 7, 5, 6, 5],
          weekly: [28, 35, 32, 38],
          monthly: [150, 165, 155, 180]
        },
        activities: {
          leadAssignments: 38,
          communications: 72,
          conversions: 25,
          workflows: 22
        },
        alerts: {
          highWorkload: false,
          lowPerformance: true,
          overdueTasks: 5,
          failedTasks: 5
        }
      },
      {
        id: 3,
        name: 'Emily Chen',
        role: 'Case Officer',
        metrics: {
          totalLeads: 52,
          convertedLeads: 41,
          conversionRate: 78.8,
          avgResponseTime: 38000,
          avgProcessingTime: 150000,
          satisfactionScore: 4.9,
          workloadUtilization: 92,
          completedTasks: 48,
          failedTasks: 2,
          totalRevenue: 145000,
          efficiency: 95
        },
        trends: {
          daily: [7, 9, 8, 10, 8, 9, 7],
          weekly: [42, 52, 48, 55],
          monthly: [220, 235, 225, 250]
        },
        activities: {
          leadAssignments: 52,
          communications: 105,
          conversions: 41,
          workflows: 38
        },
        alerts: {
          highWorkload: true,
          lowPerformance: false,
          overdueTasks: 1,
          failedTasks: 2
        }
      },
      {
        id: 4,
        name: 'David Brown',
        role: 'Case Officer',
        metrics: {
          totalLeads: 35,
          convertedLeads: 22,
          conversionRate: 62.9,
          avgResponseTime: 75000,
          avgProcessingTime: 280000,
          satisfactionScore: 4.1,
          workloadUtilization: 68,
          completedTasks: 25,
          failedTasks: 8,
          totalRevenue: 85000,
          efficiency: 72
        },
        trends: {
          daily: [3, 5, 4, 6, 4, 5, 4],
          weekly: [25, 30, 28, 35],
          monthly: [140, 150, 145, 165]
        },
        activities: {
          leadAssignments: 35,
          communications: 65,
          conversions: 22,
          workflows: 20
        },
        alerts: {
          highWorkload: false,
          lowPerformance: true,
          overdueTasks: 8,
          failedTasks: 8
        }
      }
    ];

    setPerformanceData(counselors);

    // Generate report
    const totalActivities = counselors.reduce((sum, c) => sum + c.metrics.totalLeads, 0);
    const totalRevenue = counselors.reduce((sum, c) => sum + c.metrics.totalRevenue, 0);
    const avgConversionRate = counselors.reduce((sum, c) => sum + c.metrics.conversionRate, 0) / counselors.length;
    const avgResponseTime = counselors.reduce((sum, c) => sum + c.metrics.avgResponseTime, 0) / counselors.length;

    const issues: any[] = [];
    counselors.forEach(counselor => {
      if (counselor.alerts.lowPerformance) {
        issues.push({
          type: 'performance',
          counselor: counselor.name,
          description: `Low conversion rate: ${counselor.metrics.conversionRate.toFixed(1)}%`,
          severity: counselor.metrics.conversionRate < 60 ? 'high' : 'medium'
        });
      }
      if (counselor.alerts.highWorkload) {
        issues.push({
          type: 'workload',
          counselor: counselor.name,
          description: `High workload utilization: ${counselor.metrics.workloadUtilization.toFixed(1)}%`,
          severity: counselor.metrics.workloadUtilization > 90 ? 'high' : 'medium'
        });
      }
      if (counselor.alerts.overdueTasks > 5) {
        issues.push({
          type: 'efficiency',
          counselor: counselor.name,
          description: `${counselor.alerts.overdueTasks} overdue tasks`,
          severity: counselor.alerts.overdueTasks > 10 ? 'high' : 'medium'
        });
      }
    });

    setReport({
      period: selectedPeriod,
      startDate: new Date(Date.now() - (selectedPeriod === 'daily' ? 1 : selectedPeriod === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      totalCounselors: counselors.length,
      totalActivities,
      totalRevenue,
      avgConversionRate,
      avgResponseTime,
      topPerformers: counselors.sort((a, b) => b.metrics.conversionRate - a.metrics.conversionRate).slice(0, 3),
      issues
    });
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPerformanceColor = (value: number, type: 'conversion' | 'efficiency' | 'satisfaction') => {
    const thresholds = {
      conversion: [70, 50],
      efficiency: [80, 60],
      satisfaction: [4.5, 3.5]
    };
    
    const [high, low] = thresholds[type];
    
    if (value >= high) return 'text-green-600 bg-green-100';
    if (value >= low) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getWorkloadColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-100';
    if (utilization >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const exportReport = (format: 'json' | 'csv' | 'pdf') => {
    const data = {
      report,
      performanceData,
      generatedAt: new Date().toISOString(),
      selectedPeriod,
      selectedCounselor
    };

    let content = '';
    let filename = '';
    
    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'csv':
        const headers = ['Counselor', 'Role', 'Total Leads', 'Converted', 'Conversion Rate', 'Response Time', 'Revenue', 'Efficiency'];
        const rows = performanceData.map(counselor => [
          counselor.name,
          counselor.role,
          counselor.metrics.totalLeads,
          counselor.metrics.convertedLeads,
          counselor.metrics.conversionRate.toFixed(1) + '%',
          formatDuration(counselor.metrics.avgResponseTime),
          formatCurrency(counselor.metrics.totalRevenue),
          counselor.metrics.efficiency.toFixed(1) + '%'
        ]);
        content = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
        filename = `performance-report-${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'pdf':
        content = JSON.stringify(data, null, 2);
        filename = `performance-report-${new Date().toISOString().split('T')[0]}.txt`;
        break;
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredData = selectedCounselor 
    ? performanceData.filter(c => c.id === selectedCounselor)
    : performanceData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            <p className="text-gray-600 mt-1">Comprehensive analysis of counselor performance and efficiency</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            
            <select
              value={selectedCounselor || ''}
              onChange={(e) => setSelectedCounselor(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Counselors</option>
              {performanceData.map(counselor => (
                <option key={counselor.id} value={counselor.id}>{counselor.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showDetails ? 'Summary' : 'Details'}
            </button>
            
            <div className="relative">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => exportReport('json')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => exportReport('csv')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportReport('pdf')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Report */}
      {report && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{report.totalActivities}</div>
              <div className="text-sm text-gray-600">Total Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{report.avgConversionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Avg Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatDuration(report.avgResponseTime)}</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(report.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      )}

      {/* Issues and Alerts */}
      {report && report.issues.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Issues</h3>
          <div className="space-y-3">
            {report.issues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    issue.severity === 'high' ? 'bg-red-500' :
                    issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{issue.counselor}</div>
                    <div className="text-sm text-gray-600">{issue.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    issue.type === 'performance' ? 'bg-red-100 text-red-800' :
                    issue.type === 'workload' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Counselor Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counselor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workload</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((counselor) => (
                <tr key={counselor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{counselor.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{counselor.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{counselor.metrics.totalLeads}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPerformanceColor(counselor.metrics.conversionRate, 'conversion')}`}>
                      {counselor.metrics.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(counselor.metrics.avgResponseTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(counselor.metrics.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPerformanceColor(counselor.metrics.efficiency, 'efficiency')}`}>
                      {counselor.metrics.efficiency.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getWorkloadColor(counselor.metrics.workloadUtilization)}`}>
                      {counselor.metrics.workloadUtilization.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {counselor.alerts.highWorkload && (
                        <div className="relative group">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            High workload
                          </div>
                        </div>
                      )}
                      {counselor.alerts.lowPerformance && (
                        <div className="relative group">
                          <TrendingDownIcon className="w-4 h-4 text-red-600" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Low performance
                          </div>
                        </div>
                      )}
                      {counselor.alerts.overdueTasks > 0 && (
                        <div className="relative group">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {counselor.alerts.overdueTasks} overdue tasks
                          </div>
                        </div>
                      )}
                      {counselor.metrics.efficiency >= 90 && (
                        <div className="relative group">
                          <Award className="w-4 h-4 text-green-600" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Top performer
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      {report && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {report.topPerformers.map((counselor, index) => (
              <div key={counselor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : 'bg-orange-100'
                  }`}>
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : 'text-orange-600'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{counselor.name}</div>
                    <div className="text-sm text-gray-600">{counselor.role}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{counselor.metrics.conversionRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(counselor.metrics.totalRevenue)}</div>
                    <div className="text-xs text-gray-600">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{counselor.metrics.efficiency.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Efficiency</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

