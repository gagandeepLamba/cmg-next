import { CounselorLogger } from './counselorLogger';

export interface DiscountRequest {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  productId: string;
  productName: string;
  originalPrice: number;
  requestedDiscount: number;
  discountPercentage: number;
  finalPrice: number;
  discountType: 'percentage' | 'fixed' | 'package' | 'volume';
  discountReason: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  validityPeriod: number; // in days
  requestedBy: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
  };
  approvedBy?: {
    id: number;
    name: string;
    email: string;
    role: string;
    title: string;
    department: string;
    approvalLevel: 'director' | 'branch_manager';
    approvedAt: string;
    comments?: string;
    conditions?: string[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  requestedAt: string;
  reviewedAt?: string;
  respondedAt?: string;
  expiresAt?: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    referenceNumber: string;
    attachments?: string[];
    estimatedSavings: number;
    competitorPrice?: number;
    marketPrice?: number;
    clientBudget?: number;
    specialConditions?: string[];
  };
  sla: {
    targetResponseTime: number; // in hours
    actualResponseTime?: number; // in hours
    slaStatus: 'on_track' | 'at_risk' | 'breached' | 'met';
    escalationLevel: number;
    lastEscalationAt?: string;
  };
}

export interface ApproverRole {
  id: number;
  name: string;
  email: string;
  title: string;
  role: 'director_of_sales' | 'branch_manager' | 'regional_director' | 'national_director';
  department: string;
  level: number; // 1-5, higher = more authority
  status: 'active' | 'inactive' | 'on_leave';
  permissions: {
    maxDiscountPercentage: number;
    maxDiscountAmount: number;
    canApprovePackageDiscounts: boolean;
    canApproveVolumeDiscounts: boolean;
    canOverrideRules: boolean;
    requiresBoardApproval: boolean;
    approvalThreshold: number;
  };
  workload: {
    pendingRequests: number;
    totalRequests: number;
    averageResponseTime: number;
    approvalRate: number;
    lastLoginAt?: string;
  };
  metadata: {
    joinedAt: string;
    totalApproved: number;
    totalRejected: number;
    averageDiscountApproved: number;
    totalSavingsGenerated: number;
  };
}

export interface DiscountRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    minDiscountPercentage?: number;
    maxDiscountPercentage?: number;
    minDiscountAmount?: number;
    maxDiscountAmount?: number;
    productCategories?: string[];
    clientTypes?: string[];
    leadValues?: { min?: number; max?: number };
    timeRestrictions?: {
      allowedHours?: string[];
      blockedHours?: string[];
      allowedDays?: string[];
      blockedDays?: string[];
    };
    approverRestrictions?: {
      requiredLevel?: number;
      allowedRoles?: string[];
      blockedRoles?: string[];
    };
  };
  actions: {
    autoApprove: boolean;
    requireDirectorApproval: boolean;
    requireManagerApproval: boolean;
    escalateToHigherLevel: boolean;
    notifyStakeholders: boolean;
    createTask: boolean;
    requireJustification: boolean;
  };
  sla: {
    targetResponseTime: number; // in hours
    escalationThreshold: number; // in hours
    maxApprovalTime: number; // in hours
  };
}

export interface DiscountNotification {
  id: string;
  requestId: string;
  type: 'request_created' | 'request_approved' | 'request_rejected' | 'sla_warning' | 'sla_breached' | 'escalation';
  recipientId: number;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  sentAt: string;
  readAt?: string;
  metadata: {
    templateId?: string;
    variables?: Record<string, any>;
    escalationLevel?: number;
  };
}

export class DiscountApprovalSystem {
  private logger: CounselorLogger;
  private discountRequests: DiscountRequest[];
  private approvers: ApproverRole[];
  private discountRules: DiscountRule[];
  private notifications: DiscountNotification[];

  constructor() {
    this.logger = new CounselorLogger();
    this.discountRequests = [];
    this.approvers = [];
    this.discountRules = [];
    this.notifications = [];
    this.initializeDefaultRules();
    this.initializeDiscountRequests();
  }

  private initializeDefaultRules(): void {
    this.discountRules = [
      {
        id: 'standard-discount-rule',
        name: 'Standard Discount Rule',
        description: 'Standard discount approval rules',
        enabled: true,
        conditions: {
          minDiscountPercentage: 5,
          maxDiscountPercentage: 15,
          minDiscountAmount: 100,
          maxDiscountAmount: 5000,
          productCategories: ['standard', 'premium'],
          approverRestrictions: {
            requiredLevel: 2,
            allowedRoles: ['branch_manager', 'director_of_sales']
          }
        },
        actions: {
          autoApprove: false,
          requireDirectorApproval: false,
          requireManagerApproval: true,
          escalateToHigherLevel: false,
          notifyStakeholders: true,
          createTask: false,
          requireJustification: true
        },
        sla: {
          targetResponseTime: 24,
          escalationThreshold: 18,
          maxApprovalTime: 48
        }
      },
      {
        id: 'high-value-discount-rule',
        name: 'High Value Discount Rule',
        description: 'Rules for high-value discount approvals',
        enabled: true,
        conditions: {
          minDiscountPercentage: 15,
          maxDiscountPercentage: 30,
          minDiscountAmount: 5000,
          maxDiscountAmount: 50000,
          productCategories: ['premium', 'enterprise'],
          approverRestrictions: {
            requiredLevel: 3,
            allowedRoles: ['director_of_sales', 'regional_director']
          }
        },
        actions: {
          autoApprove: false,
          requireDirectorApproval: true,
          requireManagerApproval: false,
          escalateToHigherLevel: true,
          notifyStakeholders: true,
          createTask: true,
          requireJustification: true
        },
        sla: {
          targetResponseTime: 12,
          escalationThreshold: 8,
          maxApprovalTime: 24
        }
      },
      {
        id: 'critical-discount-rule',
        name: 'Critical Discount Rule',
        description: 'Rules for critical discount approvals',
        enabled: true,
        conditions: {
          minDiscountPercentage: 30,
          maxDiscountPercentage: 50,
          minDiscountAmount: 50000,
          maxDiscountAmount: 200000,
          approverRestrictions: {
            requiredLevel: 4,
            allowedRoles: ['regional_director', 'national_director']
          }
        },
        actions: {
          autoApprove: false,
          requireDirectorApproval: true,
          requireManagerApproval: false,
          escalateToHigherLevel: true,
          notifyStakeholders: true,
          createTask: true,
          requireJustification: true
        },
        sla: {
          targetResponseTime: 6,
          escalationThreshold: 4,
          maxApprovalTime: 12
        }
      }
    ];
  }

  private initializeDiscountRequests(): void {
    // Mock approvers
    this.approvers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        title: 'Branch Manager',
        role: 'branch_manager',
        department: 'Sales',
        level: 2,
        status: 'active',
        permissions: {
          maxDiscountPercentage: 15,
          maxDiscountAmount: 5000,
          canApprovePackageDiscounts: true,
          canApproveVolumeDiscounts: true,
          canOverrideRules: false,
          requiresBoardApproval: false,
          approvalThreshold: 1000
        },
        workload: {
          pendingRequests: 3,
          totalRequests: 45,
          averageResponseTime: 18.5,
          approvalRate: 78.5,
          lastLoginAt: new Date().toISOString()
        },
        metadata: {
          joinedAt: '2023-01-15T10:00:00Z',
          totalApproved: 35,
          totalRejected: 10,
          averageDiscountApproved: 12.5,
          totalSavingsGenerated: 125000
        }
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        title: 'Director of Sales',
        role: 'director_of_sales',
        department: 'Sales',
        level: 3,
        status: 'active',
        permissions: {
          maxDiscountPercentage: 25,
          maxDiscountAmount: 25000,
          canApprovePackageDiscounts: true,
          canApproveVolumeDiscounts: true,
          canOverrideRules: true,
          requiresBoardApproval: false,
          approvalThreshold: 5000
        },
        workload: {
          pendingRequests: 5,
          totalRequests: 78,
          averageResponseTime: 12.3,
          approvalRate: 85.7,
          lastLoginAt: new Date().toISOString()
        },
        metadata: {
          joinedAt: '2022-06-20T10:00:00Z',
          totalApproved: 67,
          totalRejected: 11,
          averageDiscountApproved: 18.7,
          totalSavingsGenerated: 485000
        }
      },
      {
        id: 3,
        name: 'David Wilson',
        email: 'david.wilson@company.com',
        title: 'Regional Director',
        role: 'regional_director',
        department: 'Sales',
        level: 4,
        status: 'active',
        permissions: {
          maxDiscountPercentage: 35,
          maxDiscountAmount: 75000,
          canApprovePackageDiscounts: true,
          canApproveVolumeDiscounts: true,
          canOverrideRules: true,
          requiresBoardApproval: false,
          approvalThreshold: 25000
        },
        workload: {
          pendingRequests: 2,
          totalRequests: 32,
          averageResponseTime: 8.2,
          approvalRate: 91.2,
          lastLoginAt: new Date().toISOString()
        },
        metadata: {
          joinedAt: '2021-03-10T10:00:00Z',
          totalApproved: 29,
          totalRejected: 3,
          averageDiscountApproved: 28.3,
          totalSavingsGenerated: 875000
        }
      }
    ];

    // Mock discount requests
    this.discountRequests = [];
  }

  public async createDiscountRequest(request: Omit<DiscountRequest, 'id' | 'requestedAt' | 'status' | 'metadata' | 'sla'>): Promise<DiscountRequest> {
    // Validate request
    const validationResult = await this.validateDiscountRequest(request);
    if (!validationResult.isValid) {
      throw new Error(`Invalid discount request: ${validationResult.errors.join(', ')}`);
    }

    // Check discount rules
    const applicableRule = await this.getApplicableDiscountRule(request);
    if (!applicableRule) {
      throw new Error('No applicable discount rule found');
    }

    // Create discount request
    const discountRequest: DiscountRequest = {
      ...request,
      id: `discount-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      expiresAt: new Date(Date.now() + request.validityPeriod * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        ipAddress: '192.168.1.102',
        userAgent: 'Discount System',
        referenceNumber: `DR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        estimatedSavings: request.requestedDiscount,
        specialConditions: []
      },
      sla: {
        targetResponseTime: applicableRule.sla.targetResponseTime,
        slaStatus: 'on_track',
        escalationLevel: 0
      }
    };

    this.discountRequests.push(discountRequest);

    // Log the request
    await this.logger.logSystemEvent('discount_request_created', {
      requestId: discountRequest.id,
      leadId: discountRequest.leadId,
      leadName: discountRequest.leadName,
      productName: discountRequest.productName,
      originalPrice: discountRequest.originalPrice,
      requestedDiscount: discountRequest.requestedDiscount,
      discountPercentage: discountRequest.discountPercentage,
      finalPrice: discountRequest.finalPrice,
      requestedBy: discountRequest.requestedBy.name,
      urgency: discountRequest.urgency,
      targetResponseTime: discountRequest.sla.targetResponseTime
    });

    // Send notifications
    await this.sendDiscountNotifications(discountRequest, 'request_created');

    return discountRequest;
  }

  public async approveDiscountRequest(requestId: string, approverId: number, comments?: string, conditions?: string[]): Promise<DiscountRequest> {
    const request = this.discountRequests.find(r => r.id === requestId);
    if (!request) {
      throw new Error('Discount request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request is not in pending status');
    }

    // Validate approver permissions
    const approver = this.approvers.find(a => a.id === approverId);
    if (!approver) {
      throw new Error('Approver not found');
    }

    if (!this.canApproveDiscount(approver, request)) {
      throw new Error('Approver does not have sufficient permissions for this discount');
    }

    // Update request status
    const now = new Date();
    const responseTime = this.calculateResponseTime(request.requestedAt, now);
    
    request.status = 'approved';
    request.reviewedAt = now.toISOString();
    request.respondedAt = now.toISOString();
    request.approvedBy = {
      id: approver.id,
      name: approver.name,
      email: approver.email,
      role: approver.role,
      title: approver.title,
      department: approver.department,
      approvalLevel: approver.role === 'director_of_sales' ? 'director' : 'branch_manager',
      approvedAt: now.toISOString(),
      comments: comments,
      conditions: conditions
    };
    request.sla.actualResponseTime = responseTime;
    request.sla.slaStatus = responseTime <= request.sla.targetResponseTime ? 'met' : 'breached';

    // Update approver stats
    approver.workload.pendingRequests = Math.max(0, approver.workload.pendingRequests - 1);
    approver.workload.totalRequests += 1;
    approver.metadata.totalApproved += 1;
    approver.metadata.totalSavingsGenerated += request.requestedDiscount;
    approver.metadata.averageDiscountApproved = 
      (approver.metadata.averageDiscountApproved * (approver.metadata.totalApproved - 1) + request.discountPercentage) / 
      approver.metadata.totalApproved;

    // Log the approval
    await this.logger.logSystemEvent('discount_request_approved', {
      requestId: request.id,
      leadId: request.leadId,
      leadName: request.leadName,
      approvedBy: approver.name,
      approverRole: approver.role,
      discountAmount: request.requestedDiscount,
      discountPercentage: request.discountPercentage,
      responseTime: responseTime,
      slaStatus: request.sla.slaStatus
    });

    // Send notifications
    await this.sendDiscountNotifications(request, 'request_approved');

    return request;
  }

  public async rejectDiscountRequest(requestId: string, approverId: number, reason: string): Promise<DiscountRequest> {
    const request = this.discountRequests.find(r => r.id === requestId);
    if (!request) {
      throw new Error('Discount request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request is not in pending status');
    }

    // Validate approver permissions
    const approver = this.approvers.find(a => a.id === approverId);
    if (!approver) {
      throw new Error('Approver not found');
    }

    if (!this.canApproveDiscount(approver, request)) {
      throw new Error('Approver does not have sufficient permissions for this discount');
    }

    // Update request status
    const now = new Date();
    const responseTime = this.calculateResponseTime(request.requestedAt, now);
    
    request.status = 'rejected';
    request.reviewedAt = now.toISOString();
    request.respondedAt = now.toISOString();
    request.approvedBy = {
      id: approver.id,
      name: approver.name,
      email: approver.email,
      role: approver.role,
      title: approver.title,
      department: approver.department,
      approvalLevel: approver.role === 'director_of_sales' ? 'director' : 'branch_manager',
      approvedAt: now.toISOString(),
      comments: reason
    };
    request.sla.actualResponseTime = responseTime;
    request.sla.slaStatus = responseTime <= request.sla.targetResponseTime ? 'met' : 'breached';

    // Update approver stats
    approver.workload.pendingRequests = Math.max(0, approver.workload.pendingRequests - 1);
    approver.workload.totalRequests += 1;
    approver.metadata.totalRejected += 1;

    // Log the rejection
    await this.logger.logSystemEvent('discount_request_rejected', {
      requestId: request.id,
      leadId: request.leadId,
      leadName: request.leadName,
      rejectedBy: approver.name,
      approverRole: approver.role,
      rejectionReason: reason,
      responseTime: responseTime,
      slaStatus: request.sla.slaStatus
    });

    // Send notifications
    await this.sendDiscountNotifications(request, 'request_rejected');

    return request;
  }

  private canApproveDiscount(approver: ApproverRole, request: DiscountRequest): boolean {
    // Check if approver has sufficient level
    if (approver.level < 2) return false; // Only managers and directors can approve

    // Check discount percentage limits
    if (request.discountPercentage > approver.permissions.maxDiscountPercentage) return false;

    // Check discount amount limits
    if (request.requestedDiscount > approver.permissions.maxDiscountAmount) return false;

    // Check discount type permissions
    if (request.discountType === 'package' && !approver.permissions.canApprovePackageDiscounts) return false;
    if (request.discountType === 'volume' && !approver.permissions.canApproveVolumeDiscounts) return false;

    return true;
  }

  private async validateDiscountRequest(request: any): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Validate required fields
    if (!request.leadId) errors.push('Lead ID is required');
    if (!request.leadName) errors.push('Lead name is required');
    if (!request.leadEmail) errors.push('Lead email is required');
    if (!request.productId) errors.push('Product ID is required');
    if (!request.productName) errors.push('Product name is required');
    if (!request.originalPrice) errors.push('Original price is required');
    if (!request.requestedDiscount) errors.push('Requested discount is required');
    if (!request.discountReason) errors.push('Discount reason is required');
    if (!request.requestedBy) errors.push('Requested by information is required');

    // Validate numeric values
    if (request.originalPrice <= 0) errors.push('Original price must be greater than 0');
    if (request.requestedDiscount <= 0) errors.push('Requested discount must be greater than 0');
    if (request.requestedDiscount >= request.originalPrice) errors.push('Discount cannot be equal to or greater than original price');
    if (request.validityPeriod <= 0) errors.push('Validity period must be greater than 0');

    // Validate email format
    if (request.leadEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.leadEmail)) {
      errors.push('Invalid lead email format');
    }

    // Validate discount percentage
    const discountPercentage = (request.requestedDiscount / request.originalPrice) * 100;
    if (discountPercentage > 50) errors.push('Discount percentage cannot exceed 50%');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async getApplicableDiscountRule(request: any): Promise<DiscountRule | null> {
    const enabledRules = this.discountRules.filter(rule => rule.enabled);
    const discountPercentage = (request.requestedDiscount / request.originalPrice) * 100;
    
    for (const rule of enabledRules) {
      // Check discount percentage range
      if (rule.conditions.minDiscountPercentage && discountPercentage < rule.conditions.minDiscountPercentage) {
        continue;
      }
      
      if (rule.conditions.maxDiscountPercentage && discountPercentage > rule.conditions.maxDiscountPercentage) {
        continue;
      }

      // Check discount amount range
      if (rule.conditions.minDiscountAmount && request.requestedDiscount < rule.conditions.minDiscountAmount) {
        continue;
      }
      
      if (rule.conditions.maxDiscountAmount && request.requestedDiscount > rule.conditions.maxDiscountAmount) {
        continue;
      }

      return rule;
    }

    return null;
  }

  private calculateResponseTime(requestedAt: string, respondedAt: Date): number {
    const requested = new Date(requestedAt);
    const diffMs = respondedAt.getTime() - requested.getTime();
    return Math.round(diffMs / (1000 * 60 * 60)); // Convert to hours
  }

  private async sendDiscountNotifications(request: DiscountRequest, notificationType: string): Promise<void> {
    const notifications: DiscountNotification[] = [];

    // Notify appropriate approvers based on discount level
    const eligibleApprovers = this.approvers.filter(approver => 
      approver.status === 'active' && this.canApproveDiscount(approver, request)
    );

    if (notificationType === 'request_created') {
      for (const approver of eligibleApprovers) {
        notifications.push({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          requestId: request.id,
          type: 'request_created',
          recipientId: approver.id,
          recipientEmail: approver.email,
          recipientName: approver.name,
          subject: `Discount Approval Request: ${request.leadName}`,
          message: `A new discount approval request has been submitted for ${request.leadName} (${request.leadEmail}).\n\nProduct: ${request.productName}\nOriginal Price: $${request.originalPrice}\nRequested Discount: $${request.requestedDiscount} (${request.discountPercentage}%)\nFinal Price: $${request.finalPrice}\nReason: ${request.discountReason}\nUrgency: ${request.urgency}\nSLA Target: ${request.sla.targetResponseTime} hours`,
          priority: request.urgency === 'critical' ? 'critical' : request.urgency === 'high' ? 'high' : 'medium',
          sentAt: new Date().toISOString(),
          metadata: {
            variables: {
              leadName: request.leadName,
              productName: request.productName,
              originalPrice: request.originalPrice,
              requestedDiscount: request.requestedDiscount,
              discountPercentage: request.discountPercentage,
              finalPrice: request.finalPrice,
              reason: request.discountReason,
              urgency: request.urgency,
              slaTarget: request.sla.targetResponseTime,
              requestId: request.id
            }
          }
        });
      }
    }

    // Store notifications
    this.notifications.push(...notifications);

    // Log notifications
    for (const notification of notifications) {
      await this.logger.logSystemEvent('discount_notification_sent', {
        notificationId: notification.id,
        requestId: request.id,
        type: notification.type,
        recipient: notification.recipientName,
        subject: notification.subject,
        priority: notification.priority
      });
    }
  }

  // Public methods for external access
  public getDiscountRequests(filters?: {
    status?: string;
    approverId?: number;
    urgency?: string;
    discountType?: string;
    dateRange?: { start: Date; end: Date };
  }): DiscountRequest[] {
    let filteredRequests = this.discountRequests;

    if (filters) {
      if (filters.status) {
        filteredRequests = filteredRequests.filter(r => r.status === filters.status);
      }
      
      if (filters.approverId) {
        filteredRequests = filteredRequests.filter(r => 
          r.approvedBy?.id === filters.approverId
        );
      }
      
      if (filters.urgency) {
        filteredRequests = filteredRequests.filter(r => r.urgency === filters.urgency);
      }
      
      if (filters.discountType) {
        filteredRequests = filteredRequests.filter(r => r.discountType === filters.discountType);
      }
      
      if (filters.dateRange) {
        filteredRequests = filteredRequests.filter(r => 
          new Date(r.requestedAt) >= filters.dateRange!.start && 
          new Date(r.requestedAt) <= filters.dateRange!.end
        );
      }
    }

    return filteredRequests;
  }

  public getApprovers(): ApproverRole[] {
    return this.approvers;
  }

  public getDiscountRules(): DiscountRule[] {
    return this.discountRules;
  }

  public updateDiscountRule(ruleId: string, updates: Partial<DiscountRule>): void {
    const ruleIndex = this.discountRules.findIndex(r => r.id === ruleId);
    if (ruleIndex !== -1) {
      this.discountRules[ruleIndex] = { ...this.discountRules[ruleIndex], ...updates };
    }
  }

  public getNotifications(): DiscountNotification[] {
    return this.notifications;
  }

  public getDiscountStatistics(): {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    expiredRequests: number;
    averageResponseTime: number;
    totalSavings: number;
    averageDiscountPercentage: number;
    requestsByUrgency: Record<string, number>;
    requestsByType: Record<string, number>;
    requestsByApprover: Record<string, number>;
    slaCompliance: {
      metPercentage: number;
      breachedPercentage: number;
      averageResponseTime: number;
      targetResponseTime: number;
    };
  } {
    const totalRequests = this.discountRequests.length;
    const pendingRequests = this.discountRequests.filter(r => r.status === 'pending').length;
    const approvedRequests = this.discountRequests.filter(r => r.status === 'approved').length;
    const rejectedRequests = this.discountRequests.filter(r => r.status === 'rejected').length;
    const expiredRequests = this.discountRequests.filter(r => r.status === 'expired').length;

    // Calculate average response time
    const completedRequests = this.discountRequests.filter(r => r.status === 'approved' || r.status === 'rejected');
    const averageResponseTime = completedRequests.length > 0 ? 
      completedRequests.reduce((sum, r) => sum + (r.sla.actualResponseTime || 0), 0) / completedRequests.length : 0;

    // Calculate total savings
    const totalSavings = this.discountRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.requestedDiscount, 0);

    // Calculate average discount percentage
    const approvedDiscountRequests = this.discountRequests.filter(r => r.status === 'approved');
    const averageDiscountPercentage = approvedDiscountRequests.length > 0 ?
      approvedDiscountRequests.reduce((sum, r) => sum + r.discountPercentage, 0) / approvedDiscountRequests.length : 0;

    // Group by urgency
    const requestsByUrgency = this.discountRequests.reduce((acc, r) => {
      acc[r.urgency] = (acc[r.urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by discount type
    const requestsByType = this.discountRequests.reduce((acc, r) => {
      acc[r.discountType] = (acc[r.discountType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by approver
    const requestsByApprover = this.discountRequests.reduce((acc, r) => {
      if (r.approvedBy) {
        const approverName = r.approvedBy.name;
        acc[approverName] = (acc[approverName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate SLA compliance
    const slaMet = completedRequests.filter(r => r.sla.slaStatus === 'met').length;
    const slaBreached = completedRequests.filter(r => r.sla.slaStatus === 'breached').length;
    const metPercentage = completedRequests.length > 0 ? (slaMet / completedRequests.length) * 100 : 0;
    const breachedPercentage = completedRequests.length > 0 ? (slaBreached / completedRequests.length) * 100 : 0;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      expiredRequests,
      averageResponseTime,
      totalSavings,
      averageDiscountPercentage,
      requestsByUrgency,
      requestsByType,
      requestsByApprover,
      slaCompliance: {
        metPercentage,
        breachedPercentage,
        averageResponseTime,
        targetResponseTime: 18 // Average target across all rules
      }
    };
  }
}

