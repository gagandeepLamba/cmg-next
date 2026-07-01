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
  Building, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  User,
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
  Award,
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
  Flag,
  Banknote
} from 'lucide-react';

interface USABusinessOps {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  businessType: string;
  registrationNumber: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  createdDate: string;
  lastUpdated: string;
  nextFollowUp: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  businessDetails: {
    industry: string;
    employees: number;
    annualRevenue: string;
    investmentAmount: string;
    businessPlan: string;
    marketAnalysis: string;
  };
  registrationStatus: {
    companyRegistration: string;
    federalTaxId: string;
    stateTaxId: string;
    businessLicenses: string;
    permits: string;
  };
  visaRequirements: {
    e2InvestorVisa: string;
    l1IntraCompany: string;
    h1bSpecialty: string;
    greenCard: string;
  };
  documents: {
    businessPlan: string;
    financialStatements: string;
    marketResearch: string;
    registrationDocuments: string;
    visaDocuments: string;
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
    governmentFees: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const USABusinessOps: React.FC = () => {
  const [usaBusinessOps, setUSABusinessOps] = useState<USABusinessOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBusinessType, setSelectedBusinessType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchUSABusinessOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'business-usa', search: searchTerm || null, limit: 100 });
        setUSABusinessOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as USABusinessOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setUSABusinessOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUSABusinessOps();
  }, [searchTerm]);

  const getBusinessIcon = (businessType: string) => {
    switch (businessType) {
      case 'Technology Services': return <Globe className="h-5 w-5 text-blue-500" />;
      case 'Fashion & Retail': return <Store className="h-5 w-5 text-purple-500" />;
      case 'Manufacturing': return <Factory className="h-5 w-5 text-gray-500" />;
      case 'Food & Beverage': return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'Tourism & Hospitality': return <Hotel className="h-5 w-5 text-orange-500" />;
      case 'Real Estate': return <Home className="h-5 w-5 text-indigo-500" />;
      case 'Transportation': return <Truck className="h-5 w-5 text-yellow-500" />;
      case 'Consulting': return <BriefcaseIcon className="h-5 w-5 text-teal-500" />;
      default: return <Building className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_consultation': return <Badge className="bg-blue-100 text-blue-800">Initial Consultation</Badge>;
      case 'business_plan_review': return <Badge className="bg-yellow-100 text-yellow-800">Business Plan Review</Badge>;
      case 'company_registration': return <Badge className="bg-orange-100 text-orange-800">Company Registration</Badge>;
      case 'federal_registration': return <Badge className="bg-purple-100 text-purple-800">Federal Registration</Badge>;
      case 'state_licenses': return <Badge className="bg-green-100 text-green-800">State Licenses</Badge>;
      case 'permit_application': return <Badge className="bg-indigo-100 text-indigo-800">Permit Application</Badge>;
      case 'visa_application': return <Badge className="bg-pink-100 text-pink-800">Visa Application</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'on_hold': return <Badge className="bg-red-100 text-red-800">On Hold</Badge>;
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
      case 'completed': return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <FileQuestion className="h-4 w-4 text-gray-500" />;
      case 'rejected': return <FileX className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRegistrationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'pending': return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'not_applicable': return <Badge className="bg-blue-100 text-blue-800">N/A</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const filteredUSABusinessOps = usaBusinessOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesBusinessType = selectedBusinessType === 'all' || op.businessType === selectedBusinessType;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    const matchesPhase = selectedPhase === 'all' || op.milestones.some(m => m.phase === selectedPhase);
    
    return matchesSearch && matchesStatus && matchesBusinessType && matchesPriority && matchesPhase;
  });

  const stats = {
    total: usaBusinessOps.length,
    active: usaBusinessOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: usaBusinessOps.filter(op => op.status === 'completed').length,
    highPriority: usaBusinessOps.filter(op => op.priority === 'high').length,
    totalRevenue: usaBusinessOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: usaBusinessOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">USA Business Operations</h1>
            <p className="text-gray-600 mt-2">Manage USA business registration and operations</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Business Case
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Business Cases</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active cases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Registrations</CardTitle>
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
              <Banknote className="h-4 w-4 text-muted-foreground" />
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
                    placeholder="Search by client name, company, or ID..."
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
                    <SelectItem value="initial_consultation">Initial Consultation</SelectItem>
                    <SelectItem value="business_plan_review">Business Plan Review</SelectItem>
                    <SelectItem value="company_registration">Company Registration</SelectItem>
                    <SelectItem value="federal_registration">Federal Registration</SelectItem>
                    <SelectItem value="state_licenses">State Licenses</SelectItem>
                    <SelectItem value="permit_application">Permit Application</SelectItem>
                    <SelectItem value="visa_application">Visa Application</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Business Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Technology Services">Technology Services</SelectItem>
                    <SelectItem value="Fashion & Retail">Fashion & Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Tourism & Hospitality">Tourism & Hospitality</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
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

        {/* Business Cases List */}
        <div className="space-y-4">
          {filteredUSABusinessOps.map(usaBusinessOp => (
            <Card key={usaBusinessOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getBusinessIcon(usaBusinessOp.businessType)}
                    <div>
                      <h3 className="text-lg font-semibold">{usaBusinessOp.companyName}</h3>
                      <p className="text-sm text-gray-600">{usaBusinessOp.leadName} • {usaBusinessOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(usaBusinessOp.priority)}
                    {getStatusBadge(usaBusinessOp.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Business Type</p>
                    <p className="font-medium">{usaBusinessOp.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                    <p className="font-medium">{usaBusinessOp.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{usaBusinessOp.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Next Follow-up</p>
                    <p className="font-medium">{usaBusinessOp.nextFollowUp}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Registration Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Company</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.registrationStatus.companyRegistration)}
                          {getRegistrationStatusBadge(usaBusinessOp.registrationStatus.companyRegistration)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Federal Tax ID</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.registrationStatus.federalTaxId)}
                          {getRegistrationStatusBadge(usaBusinessOp.registrationStatus.federalTaxId)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">State Tax ID</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.registrationStatus.stateTaxId)}
                          {getRegistrationStatusBadge(usaBusinessOp.registrationStatus.stateTaxId)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business Licenses</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.registrationStatus.businessLicenses)}
                          {getRegistrationStatusBadge(usaBusinessOp.registrationStatus.businessLicenses)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business Plan</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.documents.businessPlan)}
                          <span className="text-xs capitalize">{usaBusinessOp.documents.businessPlan.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Statements</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.documents.financialStatements)}
                          <span className="text-xs capitalize">{usaBusinessOp.documents.financialStatements}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Market Research</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.documents.marketResearch)}
                          <span className="text-xs capitalize">{usaBusinessOp.documents.marketResearch.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Registration Docs</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(usaBusinessOp.documents.registrationDocuments)}
                          <span className="text-xs capitalize">{usaBusinessOp.documents.registrationDocuments.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Financial Information</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Service Fee</span>
                        <span className="text-sm font-medium">${usaBusinessOp.financials.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Government Fees</span>
                        <span className="text-sm font-medium">${usaBusinessOp.financials.governmentFees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Cost</span>
                        <span className="text-sm font-medium">${usaBusinessOp.financials.totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Status</span>
                        <Badge className={usaBusinessOp.financials.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {usaBusinessOp.financials.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {usaBusinessOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {usaBusinessOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {usaBusinessOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {usaBusinessOp.lastUpdated}</span>
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

        {filteredUSABusinessOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No business cases found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default USABusinessOps;


