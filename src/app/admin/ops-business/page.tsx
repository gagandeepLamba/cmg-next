'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchParamsWrapper } from '@/components/SearchParamsWrapper'
import DocumentUpload from '@/components/DocumentUpload'
import { baseOperationFields, findOperationCase, OperationsSearchRow } from '@/lib/operationsClient'
import {
  Building,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Edit,
  Save,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface OpsBusiness {
  id: number
  leadId: number
  leadName: string
  agreementNumber: string
  paymentDue: number
  paymentRemarks: string
  paymentDueDate: string
  status: string
  retainerStatus: string
  registrationStatus: string
  preApprovalStatus: string
  finalApplicationStatus: string
  documents: {
    retainer: string[]
    registration: string[]
    preApproval: string[]
    finalApplication: string[]
  }
  createdAt: string
  updatedAt: string
  assignedTo: string
  assignedToId: number
}

const mapBusinessCase = (row: OperationsSearchRow): OpsBusiness => ({
  ...baseOperationFields(row),
  retainerStatus: row.agreementStatus === 'signed' || row.agreementStatus === 'uploaded' ? 'completed' : 'pending',
  registrationStatus: 'pending',
  preApprovalStatus: 'pending',
  finalApplicationStatus: 'pending',
  documents: {
    retainer: [],
    registration: [],
    preApproval: [],
    finalApplication: []
  }
})

// Component that uses useSearchParams
function OpsBusinessContent() {
  const searchParams = useSearchParams()
  const [opsData, setOpsData] = useState<OpsBusiness | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('retainer')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const leadId = searchParams.get('lead')
    const agreementNumber = searchParams.get('agreementNumber') || searchParams.get('agreement')
    if (leadId || agreementNumber) {
      fetchOpsData({ leadId, agreementNumber })
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchOpsData = async ({ leadId, agreementNumber }: { leadId?: string | null; agreementNumber?: string | null }) => {
    setLoading(true)
    try {
      const row = await findOperationCase({ module: 'business', leadId, agreementNumber })
      setOpsData(row ? mapBusinessCase(row) : null)
    } catch (error) {
      console.error('Error fetching ops data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const tabs = [
    { id: 'retainer', name: 'Retainer', icon: FileText },
    { id: 'registration', name: 'Registration with Law Firm/Business Incorporation', icon: Building },
    { id: 'pre_approval', name: 'Pre-Approval Received from Province', icon: CheckCircle },
    { id: 'final_application', name: 'Final Application Submission', icon: FileText }
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!opsData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No operations data found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Operations Business Module</h1>
            <p className="text-gray-600">Manage business operations and documentation</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>

        {/* Client Information Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Client Name</label>
                <p className="text-lg font-semibold text-gray-900">{opsData.leadName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Agreement Number</label>
                <p className="text-lg font-semibold text-gray-900">{opsData.agreementNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Due</label>
                <p className="text-lg font-semibold text-gray-900">${opsData.paymentDue.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Due Date</label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(opsData.paymentDueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Remarks</label>
                <p className="text-sm text-gray-900">{opsData.paymentRemarks}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <p className="text-sm text-gray-900">{opsData.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(opsData.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">
                  {new Date(opsData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2 inline" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'retainer' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Retainer Agreement</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(opsData.retainerStatus)}
                      {getStatusBadge(opsData.retainerStatus)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retainer Documents
                      </label>
                      <div className="space-y-2">
                        {opsData.documents.retainer.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Document
                      </label>
                      <DocumentUpload opportunityId={String(opsData.id)} clientId={String(opsData.leadId)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'registration' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Registration with Law Firm/Business Incorporation</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(opsData.registrationStatus)}
                      {getStatusBadge(opsData.registrationStatus)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Documents
                      </label>
                      <div className="space-y-2">
                        {opsData.documents.registration.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Document
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pre_approval' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Pre-Approval Received from Province</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(opsData.preApprovalStatus)}
                      {getStatusBadge(opsData.preApprovalStatus)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pre-Approval Documents
                      </label>
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p>No documents uploaded yet</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Document
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'final_application' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Final Application Submission</h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(opsData.finalApplicationStatus)}
                      {getStatusBadge(opsData.finalApplicationStatus)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Final Application Documents
                      </label>
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p>No documents uploaded yet</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Document
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

// Main page component that wraps the content in Suspense
export default function OpsBusinessPage() {
  return (
    <SearchParamsWrapper>
      <OpsBusinessContent />
    </SearchParamsWrapper>
  )
}


