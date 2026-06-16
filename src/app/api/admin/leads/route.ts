import { DmcForumLeads } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: DmcForumLeads,
  entityName: 'lead',
  searchFields: ['fname', 'lname', 'email', 'phone', 'mobile'],
  filters: { status: 'status' },
  attributes: [
    'id', 'fname', 'mname', 'lname', 'email', 'phone', 'mobile', 'nationality',
    'address', 'dob', 'gender', 'id_number', 'id_expiry', 'country_interest',
    'service_interest', 'market_source', 'appointment', 'followup', 'folowuptime',
    'followupstat', 'enquiry', 'convet', 'priority', 'regdate', 'regtime',
    'last_updated', 'last_updtd_time', 'stepComplete', 'payType', 'assignTo',
    'case_officer', 'Counsilor', 'branch', 'region', 'payTotal', 'discount',
    'paidYet', 'payBalance', 'feeAgreeDate', 'demandAmt', 'dueDate', 'demdRemark',
    'agreeDate', 'renDate', 'renExpiryDate', 'renew_type', 'status', 'status_date',
    'type', 'created', 'created_by', 'lead_quality', 'lead_date',
    'opportunity_id', 'opportunity_status', 'conversion_date'
  ],
  defaults: (body) => ({
    created: body.created || new Date(),
    created_by: body.created_by || 1,
    status_date: body.status_date || new Date(),
    lead_date: body.lead_date || new Date(),
  }),
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
