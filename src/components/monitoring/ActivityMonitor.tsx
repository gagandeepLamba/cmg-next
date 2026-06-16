'use client';

import { useState, useEffect } from 'react';
import {
  Activity, Bell, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Clock, Users, Target, FileText, Phone, Mail, RefreshCw, Filter,
  Download, Eye, Settings, BarChart3, Calendar, Search
} from 'lucide-react';

interface Activity {
  id: string;
  timestamp: Date;
  counselorName: string;
  action: string;
  details: string;
  outcome: 'success' | 'failure' | 'pending';
  duration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface CounselorMetric {
  name: string;
  totalActivities: number;
  successRate: number;
  avgResponseTime: number;
  workload: number;
  status: 'active' | 'busy' | 'offline';
}

export default function ActivityMonitor() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState<CounselorMetric[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');
  const [timeRange, setTimeRange] = useState('1h');
  const [alerts, setAlerts] = useState(0);

  const counselors: string[] = [];

  useEffect(() => {
    if (!isLive) setAlerts(0);
  }, [isLive]);

  // Update metrics
  useEffect(() => {
    const counselorMetrics = counselors.map(name => {
      const counselorActivities = activities.filter(a => a.counselorName === name);
      const successful = counselorActivities.filter(a => a.outcome === 'success').length;
      const total = counselorActivities.length;
      
      return {
        name,
        totalActivities: total,
        successRate: total > 0 ? (successful / total) * 100 : 0,
        avgResponseTime: 0,
        workload: Math.min(100, (total / 50) * 100),
        status: total > 40 ? 'busy' : total > 0 ? 'active' : 'offline' as 'active' | 'busy' | 'offline'
      };
    });
    
    setMetrics(counselorMetrics);
  }, [activities]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'lead_assigned': return <Users className="w-4 h-4 text-blue-600" />;
      case 'communication_email': return <Mail className="w-4 h-4 text-purple-600" />;
      case 'workflow_started': return <Activity className="w-4 h-4 text-green-600" />;
      case 'lead_converted': return <Target className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failure': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatActionName = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFilteredActivities = () => {
    let filtered = [...activities];
    
    if (selectedCounselor) {
      filtered = filtered.filter(a => a.counselorName === selectedCounselor);
    }
    
    // Apply time range filter
    const now = new Date();
    const cutoffTime = new Date();
    
    switch (timeRange) {
      case '1h':
        cutoffTime.setHours(now.getHours() - 1);
        break;
      case '6h':
        cutoffTime.setHours(now.getHours() - 6);
        break;
      case '24h':
        cutoffTime.setDate(now.getDate() - 1);
        break;
      case '7d':
        cutoffTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffTime.setDate(now.getDate() - 30);
        break;
    }
    
    filtered = filtered.filter(a => a.timestamp >= cutoffTime);
    
    return filtered;
  };

  const exportReport = (format: 'json' | 'csv') => {
    const filtered = getFilteredActivities();
    
    if (format === 'json') {
      const data = JSON.stringify({
        activities: filtered,
        metrics,
        generatedAt: new Date().toISOString(),
        timeRange,
        selectedCounselor
      }, null, 2);
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['Timestamp', 'Counselor', 'Action', 'Details', 'Outcome', 'Duration', 'Priority'];
      const rows = filtered.map(activity => [
        activity.timestamp.toISOString(),
        activity.counselorName,
        formatActionName(activity.action),
        activity.details,
        activity.outcome,
        formatDuration(activity.duration),
        activity.priority
      ]);
      
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Real-Time Activity Monitor</h2>
            <p className="text-gray-600 mt-1">Live monitoring of counselor activities and performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">{isLive ? 'Live' : 'Paused'}</span>
            </div>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isLive 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <Activity className="w-4 h-4 mr-2" />
              {isLive ? 'Live' : 'Paused'}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-yellow-600" />
                Active Alerts ({alerts})
              </h3>
              <button
                onClick={() => setAlerts(0)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
              <div className={`w-2 h-2 rounded-full ${
                metric.status === 'active' ? 'bg-green-500' : 
                metric.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Activities</span>
                <span className="text-sm font-medium text-gray-900">{metric.totalActivities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="text-sm font-medium text-gray-900">{metric.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium text-gray-900">{formatDuration(metric.avgResponseTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Workload</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="h-2 rounded-full bg-blue-600" 
                      style={{ width: `${metric.workload}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{metric.workload.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Counselor</label>
            <select
              value={selectedCounselor}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Counselors</option>
              {counselors.map(counselor => (
                <option key={counselor} value={counselor}>{counselor}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{getFilteredActivities().length}</div>
                <div className="text-xs text-gray-600">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {getFilteredActivities().filter(a => a.outcome === 'success').length}
                </div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {getFilteredActivities().filter(a => a.outcome === 'failure').length}
                </div>
                <div className="text-xs text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Activity Feed</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {getFilteredActivities().length} activities
              </span>
              <span className="text-sm text-gray-500">
                {isLive ? 'Live' : 'Paused'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {getFilteredActivities().map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${
                index === 0 ? 'border-t-0' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{activity.counselorName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      {formatActionName(activity.action)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activity.details}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getOutcomeIcon(activity.outcome)}
                    <span className="text-sm text-gray-900">
                      {activity.outcome}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
