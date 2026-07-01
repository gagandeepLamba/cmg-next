'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-simple';
import { mapOperationsRowToListItem, searchOperationCases } from '@/lib/operationsClient';
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
  Video as VideoIcon
} from 'lucide-react';

interface ConversationOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  conversationType: string;
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
  conversationDetails: {
    topic: string;
    category: string;
    channel: string;
    duration: string;
    language: string;
    outcome: string;
    satisfaction: number;
    notes: string;
  };
  communicationLog: {
    date: string;
    type: string;
    channel: string;
    duration: string;
    notes: string;
    nextAction: string;
  }[];
  followUpActions: {
    action: string;
    dueDate: string;
    assignedTo: string;
    status: string;
    notes: string;
  }[];
  financials: {
    serviceFee: number;
    consultationFee: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const ConversationOps: React.FC = () => {
  const [conversationOps, setConversationOps] = useState<ConversationOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchConversationOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'conversations', search: searchTerm || null, limit: 100 });
        setConversationOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as ConversationOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setConversationOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversationOps();
  }, [searchTerm]);

  const getConversationTypeIcon = (type: string) => {
    switch (type) {
      case 'Initial Consultation': return <PhoneCall className="h-5 w-5 text-blue-500" />;
      case 'Follow-up Consultation': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'Document Review': return <FileText className="h-5 w-5 text-orange-500" />;
      case 'Case Update': return <Activity className="h-5 w-5 text-purple-500" />;
      case 'Support Call': return <Headphones className="h-5 w-5 text-red-500" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'postponed': return <Badge className="bg-orange-100 text-orange-800">Postponed</Badge>;
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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Phone': return <Phone className="h-4 w-4 text-blue-500" />;
      case 'Video Call': return <Video className="h-4 w-4 text-green-500" />;
      case 'Email': return <MailIcon className="h-4 w-4 text-orange-500" />;
      case 'In-Person': return <UserIcon className="h-4 w-4 text-purple-500" />;
      case 'Chat': return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      default: return <MessageCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSatisfactionStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getActionStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'pending': return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'overdue': return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const filteredConversationOps = conversationOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.conversationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesType = selectedType === 'all' || op.conversationType === selectedType;
    const matchesChannel = selectedChannel === 'all' || op.conversationDetails.channel === selectedChannel;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesType && matchesChannel && matchesPriority;
  });

  const stats = {
    total: conversationOps.length,
    active: conversationOps.filter(op => !['completed', 'cancelled'].includes(op.status)).length,
    completed: conversationOps.filter(op => op.status === 'completed').length,
    highPriority: conversationOps.filter(op => op.priority === 'high').length,
    totalRevenue: conversationOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: conversationOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">Conversation Operations</h1>
            <p className="text-gray-600 mt-2">Manage client consultations and communications</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active conversations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Conversations</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.completed / stats.total) * 100).toFixed(1)}% completion rate
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
                    placeholder="Search by name, type, or ID..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                    <SelectItem value="Follow-up Consultation">Follow-up Consultation</SelectItem>
                    <SelectItem value="Document Review">Document Review</SelectItem>
                    <SelectItem value="Case Update">Case Update</SelectItem>
                    <SelectItem value="Support Call">Support Call</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Video Call">Video Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Chat">Chat</SelectItem>
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

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversationOps.map(convOp => (
            <Card key={convOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getConversationTypeIcon(convOp.conversationType)}
                    <div>
                      <h3 className="text-lg font-semibold">{convOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{convOp.conversationType} • {convOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(convOp.priority)}
                    {getStatusBadge(convOp.status)}
                    <div className="flex items-center space-x-1">
                      {getChannelIcon(convOp.conversationDetails.channel)}
                      <Badge className="bg-blue-100 text-blue-800">{convOp.conversationDetails.channel}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Topic</p>
                    <p className="font-medium">{convOp.conversationDetails.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-medium">{convOp.conversationDetails.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                    <p className="font-medium">{convOp.conversationDetails.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{convOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Communication Log</p>
                    <div className="space-y-1">
                      {convOp.communicationLog.slice(0, 3).map((log, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(log.channel)}
                            <span className="text-sm">{log.type}</span>
                          </div>
                          <span className="text-xs text-gray-500">{log.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Client Info</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Profession</span>
                        <span className="text-sm font-medium">{convOp.personalInfo.profession}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Education</span>
                        <span className="text-sm font-medium">{convOp.personalInfo.education}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Location</span>
                        <span className="text-sm font-medium">{convOp.personalInfo.currentLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Follow-up Actions</p>
                    <div className="space-y-1">
                      {convOp.followUpActions.slice(0, 2).map((action, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm truncate">{action.action}</span>
                          {getActionStatusBadge(action.status)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Outcome & Satisfaction</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Outcome</span>
                        <span className="text-sm font-medium">{convOp.conversationDetails.outcome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Satisfaction</span>
                        <div className="flex items-center space-x-1">
                          {getSatisfactionStars(convOp.conversationDetails.satisfaction)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {convOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {convOp.lastUpdated}</span>
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
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Follow Up
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConversationOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ConversationOps;


