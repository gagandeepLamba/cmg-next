'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useRouter } from 'next/navigation'
import DocumentUpload from '@/components/DocumentUpload'

interface OpportunityPaymentFormData {
  opportunityId: string
  opportunityName: string
  clientId: string
  clientName: string
  totalAmount: string
  currency: string
  paymentStructure: 'full' | 'installment' | 'milestone' | 'hybrid'
  numberOfInstallments: string
  installmentAmount: string
  firstPaymentDate: string
  paymentFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly'
  milestonePayments: MilestonePayment[]
  notes: string
  assignedTo: string
  branch: string
}

interface MilestonePayment {
  id: string
  name: string
  amount: string
  dueDate: string
  description: string
}

interface FormErrors {
  [key: string]: string
}

export default function CreateOpportunityPayment() {
  const router = useRouter()
  const [formData, setFormData] = useState<OpportunityPaymentFormData>({
    opportunityId: '',
    opportunityName: '',
    clientId: '',
    clientName: '',
    totalAmount: '',
    currency: 'AED',
    paymentStructure: 'full',
    numberOfInstallments: '1',
    installmentAmount: '',
    firstPaymentDate: '',
    paymentFrequency: 'monthly',
    milestonePayments: [],
    notes: '',
    assignedTo: '',
    branch: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const paymentStructures = [
    { value: 'full', label: 'Full Payment', description: 'Single payment due immediately' },
    { value: 'installment', label: 'Installment Plan', description: 'Equal payments over time' },
    { value: 'milestone', label: 'Milestone-Based', description: 'Payments tied to specific milestones' },
    { value: 'hybrid', label: 'Hybrid Model', description: 'Combination of upfront and milestone payments' }
  ]

  const currencies = ['AED', 'USD', 'EUR', 'GBP', 'CAD', 'AUD']
  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ]

  const clients: Array<{ id: string; name: string }> = []
  const opportunities: Array<{ id: string; name: string; clientId: string; amount: string }> = []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-calculate installment amount when structure or total amount changes
    if (name === 'paymentStructure' || name === 'totalAmount' || name === 'numberOfInstallments') {
      calculateInstallmentAmount(name === 'paymentStructure' ? value : formData.paymentStructure, name === 'totalAmount' ? value : formData.totalAmount, name === 'numberOfInstallments' ? value : formData.numberOfInstallments)
    }

    // Set default amount when opportunity is selected
    if (name === 'opportunityId') {
      const opportunity = ([] as any[]).find(o => o.id === value)
      if (opportunity) {
        setFormData(prev => ({
          ...prev,
          opportunityName: opportunity.name,
          totalAmount: opportunity.defaultAmount
        }))
        calculateInstallmentAmount(formData.paymentStructure, opportunity.defaultAmount, formData.numberOfInstallments)
      }
    }

    // Set client name when client is selected
    if (name === 'clientId') {
      const client = ([] as any[]).find(c => c.id === value)
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientName: client.name
        }))
      }
    }

    // Clear error for this field
    if (errors[name as keyof OpportunityPaymentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const calculateInstallmentAmount = (structure: string, totalAmount: string, installments: string) => {
    if (structure === 'installment' && totalAmount && installments) {
      const amount = parseFloat(totalAmount) / parseInt(installments)
      setFormData(prev => ({
        ...prev,
        installmentAmount: amount.toFixed(2)
      }))
    }
  }

  const addMilestone = () => {
    const newMilestone: MilestonePayment = {
      id: Date.now().toString(),
      name: '',
      amount: '',
      dueDate: '',
      description: ''
    }
    setFormData(prev => ({
      ...prev,
      milestonePayments: [...prev.milestonePayments, newMilestone]
    }))
  }

  const updateMilestone = (id: string, field: keyof MilestonePayment, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestonePayments: prev.milestonePayments.map(milestone =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const removeMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestonePayments: prev.milestonePayments.filter(milestone => milestone.id !== id)
    }))
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.opportunityId.trim()) newErrors.opportunityId = 'Opportunity is required'
    if (!formData.clientId.trim()) newErrors.clientId = 'Client is required'
    if (!formData.totalAmount.trim()) newErrors.totalAmount = 'Total amount is required'
    else if (isNaN(parseFloat(formData.totalAmount)) || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Total amount must be a positive number'
    }

    if (formData.paymentStructure === 'installment') {
      if (!formData.numberOfInstallments.trim()) newErrors.numberOfInstallments = 'Number of installments is required'
      else if (isNaN(parseInt(formData.numberOfInstallments)) || parseInt(formData.numberOfInstallments) <= 0) {
        newErrors.numberOfInstallments = 'Number of installments must be a positive number'
      }
      if (!formData.firstPaymentDate.trim()) newErrors.firstPaymentDate = 'First payment date is required'
      if (!formData.paymentFrequency.trim()) newErrors.paymentFrequency = 'Payment frequency is required'
    }

    if (formData.paymentStructure === 'milestone') {
      if (formData.milestonePayments.length === 0) {
        newErrors.milestonePayments = 'At least one milestone is required'
      } else {
        formData.milestonePayments.forEach((milestone, index) => {
          if (!milestone.name.trim()) {
            newErrors[`milestone_${index}_name`] = 'Milestone name is required'
          }
          if (!milestone.amount.trim()) {
            newErrors[`milestone_${index}_amount`] = 'Milestone amount is required'
          }
          if (!milestone.dueDate.trim()) {
            newErrors[`milestone_${index}_dueDate`] = 'Milestone due date is required'
          }
        })
      }
    }

    if (formData.paymentStructure === 'hybrid') {
      if (!formData.installmentAmount.trim()) newErrors.installmentAmount = 'Upfront amount is required'
      if (formData.milestonePayments.length === 0) {
        newErrors.milestonePayments = 'At least one milestone is required for hybrid model'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Opportunity payment created:', formData)
      router.push('/opportunity-payments')
    } catch (error) {
      console.error('Error creating opportunity payment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 sm:pb-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Create Opportunity Payment
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Set up payment structure for a business opportunity
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 pb-6 sm:p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border-t pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="opportunityId" className="block text-sm font-medium text-gray-700">
                      Opportunity *
                    </label>
                    <select
                      id="opportunityId"
                      name="opportunityId"
                      value={formData.opportunityId}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.opportunityId ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select Opportunity</option>
                      {([] as any[]).map(opportunity => (
                        <option key={opportunity.id} value={opportunity.id}>
                          {opportunity.name}
                        </option>
                      ))}
                    </select>
                    {errors.opportunityId && <p className="mt-1 text-sm text-red-600">{errors.opportunityId}</p>}
                  </div>

                  <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                      Client *
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.clientId ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select Client</option>
                      {([] as any[]).map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
                  </div>

                  <div>
                    <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                      Total Amount *
                    </label>
                    <input
                      type="number"
                      id="totalAmount"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      step="0.01"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.totalAmount ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>}
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                      Assigned To
                    </label>
                    <select
                      id="assignedTo"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select Employee</option>
                      <option value="1">Alice Johnson</option>
                      <option value="2">Bob Smith</option>
                      <option value="3">Carol Davis</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                      Branch
                    </label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select Branch</option>
                      <option value="1">Dubai</option>
                      <option value="2">Abu Dhabi</option>
                      <option value="3">Sharjah</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Structure */}
              <div className="border-t pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Payment Structure</h4>
                <div className="space-y-4">
                  {paymentStructures.map(structure => (
                    <div key={structure.value} className="flex items-start">
                      <input
                        type="radio"
                        id={structure.value}
                        name="paymentStructure"
                        value={structure.value}
                        checked={formData.paymentStructure === structure.value}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <label htmlFor={structure.value} className="text-sm font-medium text-gray-900">
                          {structure.label}
                        </label>
                        <p className="text-sm text-gray-500">{structure.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installment Plan Details */}
              {formData.paymentStructure === 'installment' && (
                <div className="border-t pt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Installment Plan Details</h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="numberOfInstallments" className="block text-sm font-medium text-gray-700">
                        Number of Installments *
                      </label>
                      <input
                        type="number"
                        id="numberOfInstallments"
                        name="numberOfInstallments"
                        value={formData.numberOfInstallments}
                        onChange={handleInputChange}
                        min="1"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.numberOfInstallments ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.numberOfInstallments && <p className="mt-1 text-sm text-red-600">{errors.numberOfInstallments}</p>}
                    </div>

                    <div>
                      <label htmlFor="installmentAmount" className="block text-sm font-medium text-gray-700">
                        Installment Amount
                      </label>
                      <input
                        type="text"
                        id="installmentAmount"
                        name="installmentAmount"
                        value={formData.installmentAmount}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                      />
                      <p className="mt-1 text-sm text-gray-500">Calculated automatically</p>
                    </div>

                    <div>
                      <label htmlFor="firstPaymentDate" className="block text-sm font-medium text-gray-700">
                        First Payment Date *
                      </label>
                      <input
                        type="date"
                        id="firstPaymentDate"
                        name="firstPaymentDate"
                        value={formData.firstPaymentDate}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.firstPaymentDate ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.firstPaymentDate && <p className="mt-1 text-sm text-red-600">{errors.firstPaymentDate}</p>}
                    </div>

                    <div>
                      <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700">
                        Payment Frequency *
                      </label>
                      <select
                        id="paymentFrequency"
                        name="paymentFrequency"
                        value={formData.paymentFrequency}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.paymentFrequency ? 'border-red-500' : ''
                        }`}
                      >
                        {frequencies.map(frequency => (
                          <option key={frequency.value} value={frequency.value}>
                            {frequency.label}
                          </option>
                        ))}
                      </select>
                      {errors.paymentFrequency && <p className="mt-1 text-sm text-red-600">{errors.paymentFrequency}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Milestone Payments */}
              {(formData.paymentStructure === 'milestone' || formData.paymentStructure === 'hybrid') && (
                <div className="border-t pt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    {formData.paymentStructure === 'hybrid' ? 'Milestone Payments (after upfront)' : 'Milestone Payments'}
                  </h4>
                  
                  {formData.paymentStructure === 'hybrid' && (
                    <div className="mb-4">
                      <label htmlFor="installmentAmount" className="block text-sm font-medium text-gray-700">
                        Upfront Payment Amount *
                      </label>
                      <input
                        type="number"
                        id="installmentAmount"
                        name="installmentAmount"
                        value={formData.installmentAmount}
                        onChange={handleInputChange}
                        step="0.01"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                          errors.installmentAmount ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.installmentAmount && <p className="mt-1 text-sm text-red-600">{errors.installmentAmount}</p>}
                    </div>
                  )}

                  <div className="space-y-4">
                    {formData.milestonePayments.map((milestone, index) => (
                      <div key={milestone.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Milestone Name *
                            </label>
                            <input
                              type="text"
                              value={milestone.name}
                              onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                errors[`milestone_${index}_name`] ? 'border-red-500' : ''
                              }`}
                              placeholder="e.g., Document Submission"
                            />
                            {errors[`milestone_${index}_name`] && <p className="mt-1 text-sm text-red-600">{errors[`milestone_${index}_name`]}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Amount *
                            </label>
                            <input
                              type="number"
                              value={milestone.amount}
                              onChange={(e) => updateMilestone(milestone.id, 'amount', e.target.value)}
                              step="0.01"
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                errors[`milestone_${index}_amount`] ? 'border-red-500' : ''
                              }`}
                              placeholder="0.00"
                            />
                            {errors[`milestone_${index}_amount`] && <p className="mt-1 text-sm text-red-600">{errors[`milestone_${index}_amount`]}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Due Date *
                            </label>
                            <input
                              type="date"
                              value={milestone.dueDate}
                              onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                errors[`milestone_${index}_dueDate`] ? 'border-red-500' : ''
                              }`}
                            />
                            {errors[`milestone_${index}_dueDate`] && <p className="mt-1 text-sm text-red-600">{errors[`milestone_${index}_dueDate`]}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <input
                              type="text"
                              value={milestone.description}
                              onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Brief description of milestone"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeMilestone(milestone.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove Milestone
                          </button>
                        </div>
                      </div>
                    ))}

                    {errors.milestonePayments && (
                      <p className="text-sm text-red-600">{errors.milestonePayments}</p>
                    )}

                    <button
                      type="button"
                      onClick={addMilestone}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Add Milestone
                    </button>
                  </div>
                </div>
              )}

              {/* Document Upload */}
              <div className="border-t pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Document Upload</h4>
                <DocumentUpload
                  opportunityId={formData.opportunityId}
                  clientId={formData.clientId}
                  showProgress={true}
                  allowMultiple={true}
                />
              </div>

              {/* Notes */}
              <div className="border-t pt-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">Additional Information</h4>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Add any additional notes or special conditions..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/opportunity-payments')}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Opportunity Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

