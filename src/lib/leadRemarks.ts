import { Transaction } from 'sequelize';
import { DmRemarks } from '@/models/DmRemarks';

export type LeadRemarkAction =
  | 'lead_created'
  | 'lead_assigned'
  | 'status_changed'
  | 'remark_added'
  | 'appointment_booked'
  | 'followup_added'
  | 'duplicate_detected'
  | 'operations_case_transfer'
  | 'operations_case_status_changed'
  | 'operations_task_reassigned'
  | 'email_sent'
  | 'email_received';

interface LogLeadRemarkInput {
  leadId: number;
  action: LeadRemarkAction;
  remark: string;
  previousValue?: string | null;
  newValue?: string | null;
  actorId?: number | null;
  actorRole?: string | null;
  transaction?: Transaction;
}

/**
 * Records a major lead action (assignment, status change, remark, appointment,
 * follow-up) into dm_remarks. Never throws — a failed audit write must not
 * roll back or block the primary action it's logging.
 */
export async function logLeadRemark({
  leadId,
  action,
  remark,
  previousValue = null,
  newValue = null,
  actorId = null,
  actorRole = null,
  transaction,
}: LogLeadRemarkInput): Promise<void> {
  try {
    await DmRemarks.create(
      { leadId, action, remark, previousValue, newValue, actorId, actorRole },
      { transaction }
    );
  } catch (error) {
    console.error('Failed to record lead activity in dm_remarks:', error);
  }
}
