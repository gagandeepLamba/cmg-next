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
  CheckSquare2,
  Database,
  Server,
  Cloud,
  Wifi,
  Smartphone,
  Tablet,
  Monitor,
  Keyboard,
  Mouse,
  Printer,
  Scan,
  QrCode,
  Barcode,
  Fingerprint,
  Lock,
  Unlock,
  Key,
  Shield as ShieldIcon,
  UserPlus,
  UserMinus as UserMinusIcon,
  Users as UsersIcon,
  Building as BuildingIcon,
  Home as HomeIcon,
  MapPin as MapPinIcon2,
  Phone as PhoneIcon,
  Mail as MailIcon2,
  Globe as GlobeIcon,
  Calendar as CalendarIcon2,
  DollarSign as DollarSignIcon,
  CreditCard as CreditCardIcon,
  FileText as FileTextIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Clock as ClockIcon2,
  TrendingUp as TrendingUpIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Eye as EyeIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw as RefreshCwIcon,
  Archive as ArchiveIcon,
  XCircle as XCircleIcon
} from 'lucide-react';

interface CRMEntryOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  entryType: string;
  source: string;
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
  crmDetails: {
    category: string;
    subCategory: string;
    service: string;
    budget: string;
    timeline: string;
    requirements: string[];
    expectations: string;
    urgency: string;
  };
  applicationStatus: {
    initialContact: string;
    qualification: string;
    consultation: string;
    proposal: string;
    agreement: string;
    onboarding: string;
    completion: string;
  };
  documents: {
    idProof: string;
    addressProof: string;
    educationalCertificates: string;
    professionalCertificates: string;
    financialDocuments: string;
    agreement: string;
    paymentReceipt: string;
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
    consultationFee: number;
    processingFees: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const CRMEntryOps: React.FC = () => {
  const [crmEntryOps, setCRMEntryOps] = useState<CRMEntryOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEntryType, setSelectedEntryType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCRMEntryOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'crm-entry', search: searchTerm || null, limit: 100 });
        setCRMEntryOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as CRMEntryOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setCRMEntryOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCRMEntryOps();
  }, [searchTerm]);

  const getEntryTypeIcon = (entryType: string) => {
    switch (entryType) {
      case 'Direct Inquiry': return <PhoneIcon className="h-5 w-5 text-blue-500" />;
      case 'Referral': return <UsersIcon className="h-5 w-5 text-green-500" />;
      case 'Cold Call': return <PhoneCall className="h-5 w-5 text-orange-500" />;
      case 'Email Campaign': return <MailIcon2 className="h-5 w-5 text-purple-500" />;
      case 'Social Media': return <GlobeIcon className="h-5 w-5 text-pink-500" />;
      case 'Event': return <CalendarIcon2 className="h-5 w-5 text-indigo-500" />;
      default: return <UserPlus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_contact': return <Badge className="bg-blue-100 text-blue-800">Initial Contact</Badge>;
      case 'qualification': return <Badge className="bg-yellow-100 text-yellow-800">Qualification</Badge>;
      case 'consultation': return <Badge className="bg-orange-100 text-orange-800">Consultation</Badge>;
      case 'proposal': return <Badge className="bg-purple-100 text-purple-800">Proposal</Badge>;
      case 'agreement': return <Badge className="bg-green-100 text-green-800">Agreement</Badge>;
      case 'onboarding': return <Badge className="bg-indigo-100 text-indigo-800">Onboarding</Badge>;
      case 'completion': return <Badge className="bg-teal-100 text-teal-800">Completion</Badge>;
      case 'lost': return <Badge className="bg-red-100 text-red-800">Lost</Badge>;
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

  const filteredCRMEntryOps = crmEntryOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.entryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesEntryType = selectedEntryType === 'all' || op.entryType === selectedEntryType;
    const matchesSource = selectedSource === 'all' || op.source === selectedSource;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesEntryType && matchesSource && matchesPriority;
  });

  const stats = {
    total: crmEntryOps.length,
    active: crmEntryOps.filter(op => !['completion', 'lost'].includes(op.status)).length,
    completed: crmEntryOps.filter(op => op.status === 'completion').length,
    highPriority: crmEntryOps.filter(op => op.priority === 'high').length,
    totalRevenue: crmEntryOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: crmEntryOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">CRM Entry Operations</h1>
            <p className="text-gray-600 mt-2">Manage client acquisition and CRM entries</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active entries
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
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
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
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
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, entry type, or ID..."
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
                    <SelectItem value="initial_contact">Initial Contact</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="agreement">Agreement</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedEntryType} onValueChange={setSelectedEntryType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Entry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entry Types</SelectItem>
                    <SelectItem value="Direct Inquiry">Direct Inquiry</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                    <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Existing Client">Existing Client</SelectItem>
                    <SelectItem value="Telemarketing">Telemarketing</SelectItem>
                    <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Trade Show">Trade Show</SelectItem>
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
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CRM Entries List */}
        <div className="space-y-4">
          {filteredCRMEntryOps.map(crmOp => (
            <Card key={crmOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getEntryTypeIcon(crmOp.entryType)}
                    <div>
                      <h3 className="text-lg font-semibold">{crmOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{crmOp.entryType} • {crmOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(crmOp.priority)}
                    {getStatusBadge(crmOp.status)}
                    <Badge className="bg-blue-100 text-blue-800">{crmOp.source}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Service</p>
                    <p className="font-medium">{crmOp.crmDetails.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Budget</p>
                    <p className="font-medium">{crmOp.crmDetails.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Timeline</p>
                    <p className="font-medium">{crmOp.crmDetails.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{crmOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Contact</span>
                        {getApplicationStatusBadge(crmOp.applicationStatus.initialContact)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Qualification</span>
                        {getApplicationStatusBadge(crmOp.applicationStatus.qualification)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Consultation</span>
                        {getApplicationStatusBadge(crmOp.applicationStatus.consultation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Proposal</span>
                        {getApplicationStatusBadge(crmOp.applicationStatus.proposal)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ID Proof</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(crmOp.documents.idProof)}
                          <span className="text-xs capitalize">{crmOp.documents.idProof}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Educational Certificates</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(crmOp.documents.educationalCertificates)}
                          <span className="text-xs capitalize">{crmOp.documents.educationalCertificates}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Documents</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(crmOp.documents.financialDocuments)}
                          <span className="text-xs capitalize">{crmOp.documents.financialDocuments}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Agreement</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(crmOp.documents.agreement)}
                          <span className="text-xs capitalize">{crmOp.documents.agreement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">CRM Details</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Category</span>
                        <span className="text-sm font-medium">{crmOp.crmDetails.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sub-Category</span>
                        <span className="text-sm font-medium">{crmOp.crmDetails.subCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Urgency</span>
                        <span className="text-sm font-medium">{crmOp.crmDetails.urgency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Requirements</span>
                        <div className="flex flex-wrap gap-1">
                          {crmOp.crmDetails.requirements.slice(0, 2).map(req => (
                            <Badge key={req} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {crmOp.crmDetails.requirements.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{crmOp.crmDetails.requirements.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {crmOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {crmOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {crmOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {crmOp.lastUpdated}</span>
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

        {filteredCRMEntryOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No CRM entries found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default CRMEntryOps;


