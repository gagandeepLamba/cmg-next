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
  GraduationCap,
  FileText,
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
  Filter,
  Globe,
  School,
  CreditCard,
  Home,
  User
} from 'lucide-react'

interface StudentVisaApplication {
  id: number
  leadId: number
  leadName: string
  agreementNumber: string
  paymentDue: number
  paymentRemarks: string
  paymentDueDate: string
  status: string
  visaType: string
  country: string
  institution: {
    name: string
    address: string
    program: string
    startDate: string
    endDate: string
    tuitionFee: number
  }
  personalInfo: {
    fullName: string
    dateOfBirth: string
    passportNumber: string
    nationality: string
    email: string
    phone: string
    address: string
  }
  financialInfo: {
    tuitionFeePaid: number
    livingExpenses: number
    gicAmount: number
    bankName: string
    accountNumber: string
    gicStatus: string
  }
  documents: {
    passport: string[]
    letterOfAcceptance: string[]
    tuitionFeeReceipt: string[]
    gicCertificate: string[]
    medicalReport: string[]
    policeCertificate: string[]
    englishProficiency: string[]
    academicTranscripts: string[]
    studyPlan: string[]
  }
  applicationStatus: {
    submitted: boolean
    biometrics: boolean
    medical: boolean
    interview: boolean
    decision: string
    decisionDate?: string
  }
  createdAt: string
  updatedAt: string
  assignedTo: string
  assignedToId: number
}

const mapStudentVisaCase = (row: OperationsSearchRow): StudentVisaApplication => ({
  ...baseOperationFields(row),
  visaType: row.service_interest || row.serviceType || 'Student Visa',
  country: row.country_interest || '',
  institution: {
    name: '',
    address: '',
    program: row.serviceRequired || '',
    startDate: '',
    endDate: '',
    tuitionFee: 0
  },
  personalInfo: {
    fullName: [row.fname, row.lname].filter(Boolean).join(' '),
    dateOfBirth: '',
    passportNumber: '',
    nationality: row.nationality || '',
    email: row.email || '',
    phone: row.mobile || row.phone || '',
    address: ''
  },
  financialInfo: {
    tuitionFeePaid: Number(row.paidAmount || 0),
    livingExpenses: 0,
    gicAmount: 0,
    bankName: '',
    accountNumber: '',
    gicStatus: 'pending'
  },
  documents: {
    passport: [],
    letterOfAcceptance: [],
    tuitionFeeReceipt: [],
    gicCertificate: [],
    medicalReport: [],
    policeCertificate: [],
    englishProficiency: [],
    academicTranscripts: [],
    studyPlan: []
  },
  applicationStatus: {
    submitted: false,
    biometrics: false,
    medical: false,
    interview: false,
    decision: row.agreementStatus || 'pending'
  }
})

// Component that uses useSearchParams
function OpsStudentVisaContent() {
  const searchParams = useSearchParams()
  const [visaData, setVisaData] = useState<StudentVisaApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const leadId = searchParams.get('lead')
    const agreementNumber = searchParams.get('agreementNumber') || searchParams.get('agreement')
    if (leadId || agreementNumber) {
      fetchVisaData({ leadId, agreementNumber })
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchVisaData = async ({ leadId, agreementNumber }: { leadId?: string | null; agreementNumber?: string | null }) => {
    setLoading(true)
    try {
      const row = await findOperationCase({ module: 'student-visa', leadId, agreementNumber })
      setVisaData(row ? mapStudentVisaCase(row) : null)
    } catch (error) {
      console.error('Error fetching visa data:', error)
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
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: User },
    { id: 'institution', name: 'Institution Details', icon: School },
    { id: 'financial', name: 'Financial Information', icon: CreditCard },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'status', name: 'Application Status', icon: CheckCircle }
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

  if (!visaData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No student visa data found</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Student Visa Application</h1>
            <p className="text-gray-600">Manage student visa applications and documentation</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Application
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
                <p className="text-lg font-semibold text-gray-900">{visaData.leadName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Agreement Number</label>
                <p className="text-lg font-semibold text-gray-900">{visaData.agreementNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Visa Type</label>
                <p className="text-lg font-semibold text-gray-900">{visaData.visaType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-lg font-semibold text-gray-900">{visaData.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Due</label>
                <p className="text-lg font-semibold text-gray-900">${visaData.paymentDue.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Due Date</label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(visaData.paymentDueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <p className="text-sm text-gray-900">{visaData.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(visaData.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
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
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.dateOfBirth}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.passportNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.nationality}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="text-sm text-gray-900">{visaData.personalInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'institution' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Institution Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                        <p className="text-sm text-gray-900">{visaData.institution.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Program</label>
                        <p className="text-sm text-gray-900">{visaData.institution.program}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(visaData.institution.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <p className="text-sm text-gray-900">
                          {new Date(visaData.institution.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <p className="text-sm text-gray-900">{visaData.institution.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tuition Fee</label>
                      <p className="text-lg font-semibold text-gray-900">
                        ${visaData.institution.tuitionFee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tuition Fee Paid</label>
                        <p className="text-lg font-semibold text-gray-900">
                          ${visaData.financialInfo.tuitionFeePaid.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Living Expenses</label>
                        <p className="text-lg font-semibold text-gray-900">
                          ${visaData.financialInfo.livingExpenses.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GIC Amount</label>
                        <p className="text-lg font-semibold text-gray-900">
                          ${visaData.financialInfo.gicAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                        <p className="text-sm text-gray-900">{visaData.financialInfo.bankName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Account Number</label>
                        <p className="text-sm text-gray-900">{visaData.financialInfo.accountNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">GIC Status</label>
                        <div className="mt-1">
                          {visaData.financialInfo.gicStatus === 'active' ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                  <div className="space-y-6">
                    {Object.entries(visaData.documents).map(([category, docs]) => (
                      <div key={category}>
                        <h4 className="text-md font-medium text-gray-800 mb-3 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-2">
                          {docs.map((doc, index) => (
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
                    ))}
                  </div>
                  <DocumentUpload opportunityId={String(visaData.id)} clientId={String(visaData.leadId)} />
                </div>
              )}

              {activeTab === 'status' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Application Submitted</p>
                          <p className="text-xs text-gray-500">Initial application submission</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {visaData.applicationStatus.submitted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className={`text-sm ${
                            visaData.applicationStatus.submitted ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {visaData.applicationStatus.submitted ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Biometrics</p>
                          <p className="text-xs text-gray-500">Biometric data collection</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {visaData.applicationStatus.biometrics ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className={`text-sm ${
                            visaData.applicationStatus.biometrics ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {visaData.applicationStatus.biometrics ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Medical Examination</p>
                          <p className="text-xs text-gray-500">Medical test results</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {visaData.applicationStatus.medical ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className={`text-sm ${
                            visaData.applicationStatus.medical ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {visaData.applicationStatus.medical ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Final Decision</p>
                        <p className="text-xs text-gray-500">
                          {visaData.applicationStatus.decisionDate && 
                            `Decision date: ${new Date(visaData.applicationStatus.decisionDate).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(visaData.applicationStatus.decision)}
                        <span className={`text-sm font-medium ${
                          visaData.applicationStatus.decision === 'approved' ? 'text-green-600' :
                          visaData.applicationStatus.decision === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {visaData.applicationStatus.decision === 'approved' ? 'Approved' :
                           visaData.applicationStatus.decision === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
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
export default function OpsStudentVisaPage() {
  return (
    <SearchParamsWrapper>
      <OpsStudentVisaContent />
    </SearchParamsWrapper>
  )
}


