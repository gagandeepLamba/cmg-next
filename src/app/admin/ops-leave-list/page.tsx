'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-simple';
import { clientName, operationStatus, paymentDue, searchOperationCases, OperationsSearchRow } from '@/lib/operationsClient';
import { 
  Search, 
  Filter, 
  User, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  TrendingUp,
  Eye,
  Edit,
  Download,
  Upload,
  FileCheck,
  FileX,
  FileQuestion,
  Archive,
  RefreshCw,
  DollarSign,
  Plus,
  Briefcase,
  Users,
  Target,
  BookOpen,
  GraduationCap,
  BriefcaseIcon,
  Plane,
  Hotel,
  ShoppingCart,
  Factory,
  Store,
  Building2,
  Home,
  Car,
  Truck,
  Star,
  Shield,
  Flag,
  Crown,
  Banknote,
  Heart,
  Zap,
  Rocket,
  Building,
  MapPinIcon,
  Lightbulb,
  Brain,
  Cpu,
  Microscope,
  Dna,
  Linkedin,
  Send,
  MessageSquare,
  UserCheck,
  UserX,
  FileText as FileIcon,
  File,
  PenTool,
  CheckSquare,
  Euro,
  Languages,
  Scale,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  MessageCircle,
  PhoneCall,
  Video,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User as UserIcon,
  Headphones,
  Volume2,
  Mic,
  Video as VideoIcon,
  Settings,
  Cog,
  Wrench,
  HardHat,
  Construction,
  Factory as FactoryIcon,
  CalendarDays,
  CalendarRange,
  UserMinus,
  LogOut,
  Pause,
  Play,
  Square,
  CheckSquare2
} from 'lucide-react';

interface LeaveOps {
  id: string;
  leadId: string;
  leadName: string;
  agreementNumber: string;
  email: string;
  phone: string;
  leaveType: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  createdDate: string;
  lastUpdated: string;
  nextFollowUp: string;
  personalInfo: {
    dateOfBirth: string;
    passportNumber: string;
    nationality: string;
    currentLocation: string;
    maritalStatus: string;
    education: string;
    profession: string;
  };
  leaveDetails: {
    category: string;
    subCategory: string;
    startDate: string;
    endDate: string;
    duration: string;
    reason: string;
    emergencyContact: string;
    replacement: string;
    approvalStatus: string;
  };
  applicationStatus: {
    initialRequest: string;
    managerApproval: string;
    hrApproval: string;
    documentation: string;
    finalApproval: string;
    leaveProcessing: string;
    returnProcessing: string;
  };
  documents: {
    leaveApplication: string;
    medicalCertificate: string;
    supportingDocuments: string;
    approvalLetter: string;
    returnDocuments: string;
  };
  milestones: {
    phase: string;
    status: string;
    completedDate?: string;
    dueDate: string;
    notes: string;
  }[];
  financials: {
    serviceFee: number;
    processingFees: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const mapOperationsCaseToLeaveOps = (row: OperationsSearchRow): LeaveOps => ({
  id: String(row.opportunityId),
  leadId: String(row.leadId),
  leadName: clientName(row),
  agreementNumber: row.agreementNumber || row.opportunityNumber || '',
  email: row.email || '',
  phone: row.mobile || row.phone || '',
  leaveType: row.service_interest || row.serviceType || row.agreementType || 'Operations Case',
  status: operationStatus(row),
  priority: 'medium',
  assignedTo: row.case_officer ? `Officer ${row.case_officer}` : '',
  createdDate: row.generatedDate || new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  nextFollowUp: '',
  personalInfo: {
    dateOfBirth: '',
    passportNumber: '',
    nationality: row.nationality || '',
    currentLocation: row.country_interest || '',
    maritalStatus: '',
    education: '',
    profession: row.serviceRequired || ''
  },
  leaveDetails: {
    category: row.agreementType || row.service_interest || 'Operations',
    subCategory: row.agreementTitle || '',
    startDate: '',
    endDate: '',
    duration: '',
    reason: row.opportunityName || '',
    emergencyContact: '',
    replacement: '',
    approvalStatus: row.agreementStatus || 'pending'
  },
  applicationStatus: {
    initialRequest: 'completed',
    managerApproval: 'pending',
    hrApproval: 'pending',
    documentation: row.agreementStatus === 'uploaded' ? 'completed' : 'pending',
    finalApproval: row.agreementStatus === 'signed' ? 'completed' : 'pending',
    leaveProcessing: operationStatus(row),
    returnProcessing: 'pending'
  },
  documents: {
    leaveApplication: row.agreementStatus || 'pending',
    medicalCertificate: 'pending',
    supportingDocuments: 'pending',
    approvalLetter: 'pending',
    returnDocuments: 'pending'
  },
  milestones: [],
  financials: {
    serviceFee: Number(row.totalAmount || row.estimatedValue || 0),
    processingFees: 0,
    totalCost: Number(row.totalAmount || row.estimatedValue || 0),
    paidAmount: Number(row.paidAmount || 0),
    balanceAmount: paymentDue(row),
    paymentStatus: row.paymentStatus || 'pending',
    nextPaymentDue: ''
  },
  notes: []
});

const LeaveOps: React.FC = () => {
  const [leaveOps, setLeaveOps] = useState<LeaveOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchLeaveOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ search: searchTerm || null, limit: 100 });
        setLeaveOps(rows.map(mapOperationsCaseToLeaveOps));
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setLeaveOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveOps();
  }, [searchTerm]);

  const getLeaveTypeIcon = (leaveType: string) => {
    switch (leaveType) {
      case 'Medical Leave': return <Heart className="h-5 w-5 text-red-500" />;
      case 'Maternity Leave': return <UserMinus className="h-5 w-5 text-pink-500" />;
      case 'Personal Leave': return <User className="h-5 w-5 text-blue-500" />;
      case 'Vacation Leave': return <Plane className="h-5 w-5 text-green-500" />;
      case 'Sabbatical Leave': return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'Emergency Leave': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <CalendarDays className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_request': return <Badge className="bg-blue-100 text-blue-800">Initial Request</Badge>;
      case 'documentation': return <Badge className="bg-yellow-100 text-yellow-800">Documentation</Badge>;
      case 'manager_approval': return <Badge className="bg-orange-100 text-orange-800">Manager Approval</Badge>;
      case 'hr_approval': return <Badge className="bg-purple-100 text-purple-800">HR Approval</Badge>;
      case 'final_approval': return <Badge className="bg-green-100 text-green-800">Final Approval</Badge>;
      case 'in_progress': return <Badge className="bg-indigo-100 text-indigo-800">In Progress</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'submitted': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'pending': return <FileQuestion className="h-4 w-4 text-gray-500" />;
      case 'rejected': return <FileX className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'pending': return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const filteredLeaveOps = leaveOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesLeaveType = selectedLeaveType === 'all' || op.leaveType === selectedLeaveType;
    const matchesCategory = selectedCategory === 'all' || op.leaveDetails.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesLeaveType && matchesCategory && matchesPriority;
  });

  const stats = {
    total: leaveOps.length,
    active: leaveOps.filter(op => !['completed', 'rejected'].includes(op.status)).length,
    completed: leaveOps.filter(op => op.status === 'completed').length,
    highPriority: leaveOps.filter(op => op.priority === 'high').length,
    totalRevenue: leaveOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: leaveOps.filter(op => op.financials.paymentStatus === 'partial').length
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leave Management Operations</h1>
            <p className="text-gray-600 mt-2">Manage employee leave requests and approvals</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active requests
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Leaves</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0.0'}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingPayments} pending payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, agreement number, type, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="initial_request">Initial Request</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="manager_approval">Manager Approval</SelectItem>
                    <SelectItem value="hr_approval">HR Approval</SelectItem>
                    <SelectItem value="final_approval">Final Approval</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leave Types</SelectItem>
                    <SelectItem value="Medical Leave">Medical Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                    <SelectItem value="Sabbatical Leave">Sabbatical Leave</SelectItem>
                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Medical Leave">Medical Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Vacation Leave">Vacation Leave</SelectItem>
                    <SelectItem value="Sabbatical Leave">Sabbatical Leave</SelectItem>
                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests List */}
        <div className="space-y-4">
          {filteredLeaveOps.map(leaveOp => (
            <Card key={leaveOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getLeaveTypeIcon(leaveOp.leaveType)}
                    <div>
                      <h3 className="text-lg font-semibold">{leaveOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{leaveOp.leaveType} • {leaveOp.agreementNumber || leaveOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(leaveOp.priority)}
                    {getStatusBadge(leaveOp.status)}
                    <Badge className="bg-blue-100 text-blue-800">{leaveOp.leaveDetails.duration}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Profession</p>
                    <p className="font-medium">{leaveOp.personalInfo.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Leave Period</p>
                    <p className="font-medium">{leaveOp.leaveDetails.startDate} - {leaveOp.leaveDetails.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Reason</p>
                    <p className="font-medium">{leaveOp.leaveDetails.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{leaveOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Request</span>
                        {getApplicationStatusBadge(leaveOp.applicationStatus.initialRequest)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Manager Approval</span>
                        {getApplicationStatusBadge(leaveOp.applicationStatus.managerApproval)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">HR Approval</span>
                        {getApplicationStatusBadge(leaveOp.applicationStatus.hrApproval)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Final Approval</span>
                        {getApplicationStatusBadge(leaveOp.applicationStatus.finalApproval)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Leave Application</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(leaveOp.documents.leaveApplication)}
                          <span className="text-xs capitalize">{leaveOp.documents.leaveApplication}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Medical Certificate</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(leaveOp.documents.medicalCertificate)}
                          <span className="text-xs capitalize">{leaveOp.documents.medicalCertificate}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Supporting Documents</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(leaveOp.documents.supportingDocuments)}
                          <span className="text-xs capitalize">{leaveOp.documents.supportingDocuments}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approval Letter</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(leaveOp.documents.approvalLetter)}
                          <span className="text-xs capitalize">{leaveOp.documents.approvalLetter}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Leave Details</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Emergency Contact</span>
                        <span className="text-sm font-medium">{leaveOp.leaveDetails.emergencyContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Replacement</span>
                        <span className="text-sm font-medium">{leaveOp.leaveDetails.replacement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Approval Status</span>
                        <Badge className={leaveOp.leaveDetails.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {leaveOp.leaveDetails.approvalStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {leaveOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {leaveOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {leaveOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {leaveOp.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLeaveOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default LeaveOps;


