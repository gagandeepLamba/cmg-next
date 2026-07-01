import crypto from 'crypto';
import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';

type CandidateInput = { full_name: string; email: string; phone?: string; applied_position: string; applied_date?: string; source?: string; created_by?: string };
type ExitInput = { employee_id: string; submitted_by: string; reason: string; requested_lwd?: string; notes?: string };
type WorkflowRow = Record<string, string | number | null>;

export class HRJoiningExitService {
  static async ensureTables() {
    await sequelize.query(`CREATE TABLE IF NOT EXISTS dm_hr_recruitment_candidates (
      candidate_id CHAR(36) PRIMARY KEY, full_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(80) NULL, applied_position VARCHAR(180) NOT NULL, applied_date DATE NOT NULL, source VARCHAR(120) NULL,
      interview_date DATETIME NULL, interview_outcome ENUM('Pending','Pass','Fail') NOT NULL DEFAULT 'Pending', status ENUM('Applied','Interviewed','Selected','Rejected','Offer Sent','Accepted','Joined') NOT NULL DEFAULT 'Applied', rejection_reason TEXT NULL,
      offer_salary DECIMAL(12,2) NULL, offer_designation VARCHAR(180) NULL, offer_terms TEXT NULL, offer_letter_url TEXT NULL, offer_sent_at DATETIME NULL, offer_accepted_at DATETIME NULL, joining_date DATE NULL, company_email VARCHAR(255) NULL, crm_id_generated_at DATETIME NULL, employee_id CHAR(36) NULL, dos_approved_by CHAR(36) NULL, dos_approved_at DATETIME NULL, acceptance_token CHAR(36) NULL, created_by CHAR(36) NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_hr_candidate_status (status), INDEX idx_hr_candidate_email (email))`);
    await sequelize.query(`CREATE TABLE IF NOT EXISTS dm_hr_exit_requests (
      exit_request_id CHAR(36) PRIMARY KEY, employee_id CHAR(36) NOT NULL, exit_type ENUM('Resignation','Termination') NOT NULL, submitted_by CHAR(36) NOT NULL, submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, reason TEXT NOT NULL, requested_lwd DATE NULL, approved_lwd DATE NULL, approved_by CHAR(36) NULL, approved_at DATETIME NULL, status ENUM('Pending','Approved','Rejected','Completed') NOT NULL DEFAULT 'Pending', exit_interview_id CHAR(36) NULL, fnf_email_sent_at DATETIME NULL, fnf_email_status ENUM('Pending','Sent','Failed') NOT NULL DEFAULT 'Pending', notes TEXT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_hr_exit_request_employee (employee_id), INDEX idx_hr_exit_request_status (status))`);
    await sequelize.query(`CREATE TABLE IF NOT EXISTS dm_hr_workflow_notifications (notification_id CHAR(36) PRIMARY KEY, workflow_type VARCHAR(80) NOT NULL, entity_id CHAR(36) NOT NULL, recipient VARCHAR(255) NOT NULL, subject VARCHAR(255) NOT NULL, status ENUM('Queued','Sent','Failed') NOT NULL DEFAULT 'Queued', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX idx_hr_workflow_notification_entity (entity_id))`);
  }

  private static async notify(workflowType: string, entityId: string, recipient: string, subject: string) {
    await sequelize.query('INSERT INTO dm_hr_workflow_notifications (notification_id, workflow_type, entity_id, recipient, subject) VALUES (:id,:workflowType,:entityId,:recipient,:subject)', { replacements: { id: crypto.randomUUID(), workflowType, entityId, recipient, subject } });
  }

  static async createCandidate(input: CandidateInput) {
    await this.ensureTables(); const candidate_id = crypto.randomUUID();
    await sequelize.query(`INSERT INTO dm_hr_recruitment_candidates (candidate_id,full_name,email,phone,applied_position,applied_date,source,created_by) VALUES (:candidate_id,:full_name,:email,:phone,:applied_position,:applied_date,:source,:created_by)`, { replacements: { ...input, candidate_id, phone: input.phone || null, source: input.source || null, created_by: input.created_by || null, applied_date: input.applied_date || new Date().toISOString().slice(0, 10) } });
    return this.getCandidate(candidate_id);
  }
  static async listCandidates(filters?: { status?: string; applied_position?: string }) {
    await this.ensureTables();
    let sql = 'SELECT * FROM dm_hr_recruitment_candidates WHERE 1=1';
    const params: Record<string, string> = {};
    if (filters?.status) { sql += ' AND status=:status'; params.status = filters.status; }
    if (filters?.applied_position) { sql += ' AND applied_position LIKE :applied_position'; params.applied_position = `%${filters.applied_position}%`; }
    sql += ' ORDER BY created_at DESC';
    return sequelize.query<WorkflowRow>(sql, { replacements: params, type: QueryTypes.SELECT });
  }
  static async getCandidate(id: string): Promise<WorkflowRow | null> { await this.ensureTables(); const rows = await sequelize.query<WorkflowRow>('SELECT * FROM dm_hr_recruitment_candidates WHERE candidate_id=:id', { replacements: { id }, type: QueryTypes.SELECT }); return rows[0] || null; }
  static async updateCandidateStatus(id: string, input: Record<string, unknown>) {
    await this.ensureTables(); const current = await this.getCandidate(id); if (!current) return null;
    const status = String(input.status || current.status); const outcome = input.interview_outcome ? String(input.interview_outcome) : null;
    if (!['Applied','Interviewed','Selected','Rejected','Offer Sent','Accepted','Joined'].includes(status)) throw new Error('Invalid candidate status');
    if (outcome && !['Pending','Pass','Fail'].includes(outcome)) throw new Error('Invalid interview outcome');
    await sequelize.query(`UPDATE dm_hr_recruitment_candidates SET status=:status, interview_date=COALESCE(:interview_date,interview_date), interview_outcome=COALESCE(:outcome,interview_outcome), rejection_reason=COALESCE(:reason,rejection_reason) WHERE candidate_id=:id`, { replacements: { id, status, interview_date: input.interview_date ? String(input.interview_date) : null, outcome, reason: input.rejection_reason ? String(input.rejection_reason) : null } });
    if (status === 'Rejected') await this.notify('candidate_rejected', id, String(current.email), 'Update on your application');
    return this.getCandidate(id);
  }
  static async submitOffer(id: string, input: Record<string, unknown>) {
    await this.ensureTables(); const candidate = await this.getCandidate(id); if (!candidate) return null;
    const salary = Number(input.offer_salary); const designation = String(input.offer_designation || '').trim(); if (!Number.isFinite(salary) || salary < 0 || !designation) throw new Error('offer_salary and offer_designation are required');
    await sequelize.query('UPDATE dm_hr_recruitment_candidates SET offer_salary=:salary, offer_designation=:designation, offer_terms=:terms, status=\'Selected\' WHERE candidate_id=:id', { replacements: { id, salary, designation, terms: input.offer_terms ? String(input.offer_terms) : null } });
    await this.notify('offer_approval', id, 'Director of Sales', `Offer approval required for ${String(candidate.full_name)}`); return this.getCandidate(id);
  }
  static async approveOffer(id: string, approverId: string) {
    await this.ensureTables(); const candidate = await this.getCandidate(id); if (!candidate) return null; if (!candidate.offer_designation) throw new Error('Submit offer terms before approval');
    const token = crypto.randomUUID(); await sequelize.query(`UPDATE dm_hr_recruitment_candidates SET status='Offer Sent', dos_approved_by=:approverId, dos_approved_at=NOW(), offer_sent_at=NOW(), acceptance_token=:token WHERE candidate_id=:id`, { replacements: { id, approverId, token } });
    await this.notify('offer_sent', id, String(candidate.email), 'Your DM Consultants offer is ready'); return { candidate: await this.getCandidate(id), acceptance_token: token };
  }
  static async acceptOffer(id: string, token: string) { await this.ensureTables(); const candidate = await this.getCandidate(id); if (!candidate || candidate.acceptance_token !== token) return null; await sequelize.query(`UPDATE dm_hr_recruitment_candidates SET status='Accepted', offer_accepted_at=NOW() WHERE candidate_id=:id`, { replacements: { id } }); await this.notify('offer_accepted', id, 'HR', `${String(candidate.full_name)} accepted the offer`); return this.getCandidate(id); }
  static async onboardCandidate(id: string, input: Record<string, unknown>) { await this.ensureTables(); const candidate = await this.getCandidate(id); if (!candidate) return null; if (candidate.status !== 'Accepted') throw new Error('Only accepted candidates can be onboarded'); const companyEmail = String(input.company_email || '').trim(); if (!companyEmail) throw new Error('company_email is required'); const employeeId = String(input.employee_id || crypto.randomUUID()); await sequelize.query(`UPDATE dm_hr_recruitment_candidates SET status='Joined', company_email=:companyEmail, employee_id=:employeeId, joining_date=:joiningDate, crm_id_generated_at=NOW() WHERE candidate_id=:id`, { replacements: { id, companyEmail, employeeId, joiningDate: input.joining_date ? String(input.joining_date) : new Date().toISOString().slice(0, 10) } }); await this.notify('welcome', id, companyEmail, 'Welcome to DM Consultants - your CRM access is ready'); return this.getCandidate(id); }
  static async pipeline() { const candidates = await this.listCandidates(); const stages = ['Applied','Interviewed','Selected','Rejected','Offer Sent','Accepted','Joined']; return { total: candidates.length, stages: stages.map(status => ({ status, total: candidates.filter(x => x.status === status).length })) }; }

  static async createExit(input: ExitInput, exitType: 'Resignation' | 'Termination') { await this.ensureTables(); const exit_request_id = crypto.randomUUID(); await sequelize.query(`INSERT INTO dm_hr_exit_requests (exit_request_id,employee_id,exit_type,submitted_by,reason,requested_lwd,notes) VALUES (:id,:employee_id,:exitType,:submitted_by,:reason,:requested_lwd,:notes)`, { replacements: { ...input, id: exit_request_id, exitType, requested_lwd: input.requested_lwd || null, notes: input.notes || null } }); await this.notify('exit_approval', exit_request_id, 'Branch Manager / Director of Sales', `${exitType} approval required`); return this.getExit(exit_request_id); }
  static async listExits(filters?: { status?: string; exit_type?: string }) {
    await this.ensureTables();
    let sql = `SELECT x.*, e.name AS employee_name FROM dm_hr_exit_requests x LEFT JOIN dm_employee e ON CAST(e.id AS CHAR)=x.employee_id WHERE 1=1`;
    const params: Record<string, string> = {};
    if (filters?.status) { sql += ' AND x.status=:status'; params.status = filters.status; }
    if (filters?.exit_type) { sql += ' AND x.exit_type=:exit_type'; params.exit_type = filters.exit_type; }
    sql += ' ORDER BY x.submitted_at DESC';
    return sequelize.query<WorkflowRow>(sql, { replacements: params, type: QueryTypes.SELECT });
  }
  static async getExit(id: string): Promise<WorkflowRow | null> { await this.ensureTables(); const rows = await sequelize.query<WorkflowRow>(`SELECT x.*, e.name AS employee_name FROM dm_hr_exit_requests x LEFT JOIN dm_employee e ON CAST(e.id AS CHAR)=x.employee_id WHERE x.exit_request_id=:id`, { replacements: { id }, type: QueryTypes.SELECT }); return rows[0] || null; }
  static async reviewExit(id: string, approved: boolean, userId: string, lwd?: string, notes?: string) { await this.ensureTables(); const request = await this.getExit(id); if (!request) return null; await sequelize.query(`UPDATE dm_hr_exit_requests SET status=:status, approved_by=:userId, approved_at=NOW(), approved_lwd=:lwd, notes=COALESCE(:notes,notes) WHERE exit_request_id=:id`, { replacements: { id, userId, status: approved ? 'Approved' : 'Rejected', lwd: lwd || null, notes: notes || null } }); if (approved) await this.notify('exit_approved', id, 'HR', `Exit request approved for ${String(request.employee_name || request.employee_id)}`); return this.getExit(id); }
  static async completeExit(id: string, interviewId?: string) { await this.ensureTables(); const request = await this.getExit(id); if (!request) return null; await sequelize.query(`UPDATE dm_hr_exit_requests SET status='Completed', exit_interview_id=:interviewId, fnf_email_status='Sent', fnf_email_sent_at=NOW() WHERE exit_request_id=:id`, { replacements: { id, interviewId: interviewId || null } }); await this.notify('fnf', id, String(request.employee_name || request.employee_id), 'Full and final settlement process initiated'); return this.getExit(id); }

  static async getFnfSummary(employeeId: string) {
    await this.ensureTables();
    const employees = await sequelize.query<WorkflowRow>(
      `SELECT id, name, doj, email FROM dm_employee WHERE CAST(id AS CHAR)=:employeeId OR id=:employeeIdNum`,
      { replacements: { employeeId, employeeIdNum: parseInt(employeeId) || 0 }, type: QueryTypes.SELECT }
    );
    if (!employees.length) return null;
    const emp = employees[0];
    const eosb = await sequelize.query<WorkflowRow>(
      `SELECT * FROM dm_hr_eosb_settlements WHERE employee_id=:employeeId ORDER BY created_at DESC LIMIT 1`,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );
    const latestExit = await sequelize.query<WorkflowRow>(
      `SELECT * FROM dm_hr_exit_requests WHERE employee_id=:employeeId ORDER BY submitted_at DESC LIMIT 1`,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );
    return {
      employee: { id: emp.id, name: emp.name, email: emp.email, doj: emp.doj },
      eosbSettlement: eosb[0] || null,
      exitRequest: latestExit[0] || null,
      summary: eosb[0] ? {
        finalSalary: eosb[0].unpaid_salary || 0,
        eosbAmount: eosb[0].eosb_amount || 0,
        leaveEncashment: eosb[0].leave_encashment || 0,
        deductions: 0,
        totalPayable: eosb[0].total_payable || 0,
      } : null,
    };
  }
}
