import { QueryTypes } from 'sequelize';
import { sequelize } from '@/lib/sequelize';
import crypto from 'crypto';
import { ModuleNotificationService } from '@/services/module-notification-service';
import { DocumentService } from '@/services/document-service';

type WorkforceRow = {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  onshoreEmployees: number;
  offshoreEmployees: number;
  missingJoiningDate: number;
};
type WorkforceDelta = {
  absolute: number;
  percent: number;
};
type WorkforceKpi = {
  value: number;
  delta: WorkforceDelta;
  href: string;
};
type WorkLocationRow = {
  workLocation: string;
  headcount: number;
};
type DepartmentRow = {
  departmentId: number | null;
  departmentName: string | null;
  total: number;
  active: number;
  offshore: number;
  fullTime: number;
  contract: number;
  freelance: number;
  partTime: number;
};
type PayrollRow = {
  attendanceRecords: number;
  employeesWithAttendance: number;
  totalHours: number | null;
  shortfallHours: number | null;
  overtimeHours: number | null;
};
type ExitRow = {
  exitCount: number;
  activeExitPipeline: number;
  exitsThisMonth: number;
  exitsLastMonth: number;
};
type HiringRow = {
  joinedThisMonth: number;
  joinedPreviousMonth: number;
  joinedLastMonth: number;
  joinedThisYear: number;
};
type CountRow = { total: number };
type HRLeaveType =
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Maternity Leave'
  | 'Paternity Leave'
  | 'Hajj Leave'
  | 'Bereavement Leave'
  | 'Unpaid Leave'
  | 'Compensatory Leave';
type HRLeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
type HRManagerLeaveStatus = 'Pending' | 'Approved' | 'Rejected';
type HRLeaveWorkflowStatus = 'Manager Review' | 'HR Confirmation' | 'Completed' | 'Cancelled';
type HREOSBSeparationReason = 'Resignation' | 'Termination' | 'Retirement' | 'Death' | 'Mutual';
type HRAttendanceInput = {
  attendance_id?: string;
  employee_id: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'Leave' | 'Holiday';
  overtime_hours?: number | null;
  source: 'Manual' | 'Biometric' | 'Import';
  notes?: string | null;
  approved_by?: string | null;
};
type EmployeeCoreInput = {
  id?: number;
  name?: string;
  email?: string | null;
  cemail?: string | null;
  mobile?: string | null;
  cmobile?: string | null;
  paddress?: string | null;
  address?: string | null;
  photo?: string | null;
  dob?: string | Date | null;
  role?: number | null;
  vendor_id?: number | null;
  branch?: number | null;
  region?: number | null;
  username?: string | null;
  password?: string | null;
  status?: number | string | null;
  ppNo?: string | null;
  visaExp?: string | Date | null;
  department?: number | string | null;
  EID?: string | null;
  doj?: string | Date | null;
  nationality?: string | null;
  dol?: string | Date | null;
  remark?: string | null;
  labexp?: string | Date | null;
  bounce?: number | null;
  em_local_name?: string | null;
  em_home_name?: string | null;
  em_local_number?: string | null;
  em_home_number?: string | null;
  religion?: string | null;
  gender?: string | null;
  crea?: number | null;
  wfh?: number | null;
  work_location?: string | null;
  work_country?: string | null;
  work_city?: string | null;
  work_site?: string | null;
  employment_type?: string | null;
};
type HRLeaveInput = {
  leave_id?: string;
  employee_id: string;
  manager_id?: string | null;
  leave_type: HRLeaveType;
  start_date: string;
  end_date: string;
  reason?: string | null;
  document_url?: string | null;
};
type HRLeaveReviewInput = {
  leave_id: string;
  status: Extract<HRLeaveStatus, 'Approved' | 'Rejected' | 'Cancelled'>;
  reviewed_by?: string | null;
  review_notes?: string | null;
};
type HRLeaveManagerReviewInput = {
  leave_id: string;
  manager_status: Extract<HRManagerLeaveStatus, 'Approved' | 'Rejected'>;
  manager_id?: string | null;
  manager_comment?: string | null;
};
type EmployeeRecipientRow = {
  id: number;
  name: string;
  department?: number | null;
  manager_id?: number | null;
  hr_id?: number | null;
};
type EmployeeEOSBRow = {
  id: number;
  name: string;
  doj?: string | null;
};
type EOSBInput = {
  employee_id: string;
  last_working_day: string;
  separation_reason: HREOSBSeparationReason;
  last_basic_salary: number;
  unpaid_salary?: number;
  approved_by: string;
  settlement_date?: string | null;
  notes?: string | null;
};
type PayslipLineItem = { label: string; amount: number };
type PayslipInput = {
  employee_id: string;
  pay_year: number;
  pay_month: number;
  designation?: string | null;
  department?: string | null;
  basic_salary: number;
  allowances?: PayslipLineItem[];
  overtime_hours?: number;
  overtime_amount?: number;
  deductions?: PayslipLineItem[];
  bank_name?: string | null;
  iban?: string | null;
  ytd_earnings?: number;
  authorised_by?: string | null;
};
type ExitChecklistInput = {
  employee_id: string;
  separation_reason?: string | null;
  last_working_day?: string | null;
  assigned_by?: string | null;
};
type ExitChecklistItemUpdate = {
  item_id: string;
  status: 'Pending' | 'Completed' | 'Waived';
  completed_by?: string | null;
  notes?: string | null;
};
type HRLetterType = 'relieving' | 'experience';
type HRLetterInput = {
  employee_id: string;
  letter_type: HRLetterType;
  designation?: string | null;
  department?: string | null;
  last_working_day: string;
  hr_manager_name: string;
  hr_manager_designation?: string | null;
  issue_date?: string | null;
  key_responsibilities?: string | null;
  performance_summary?: string | null;
  recommendation_statement?: string | null;
  generated_by?: string | null;
};
type ExitReasonLeaving = 'Better Opportunity' | 'Salary' | 'Relocation' | 'Personal' | 'Termination' | 'Other';
type ExitInterviewInput = {
  employee_id: string;
  interview_date: string;
  conducted_by: string;
  reason_leaving: ExitReasonLeaving;
  reason_details?: string | null;
  job_satisfaction: number;
  mgmt_satisfaction: number;
  work_env_rating: number;
  compensation_rating: number;
  growth_rating: number;
  recommend_company: boolean;
  rehire_eligible: boolean;
  feedback_text?: string | null;
  suggestions?: string | null;
  confidential?: boolean;
};
type EmployeeLetterRow = {
  id: number;
  name: string;
  EID?: string | null;
  doj?: string | null;
  department?: number | null;
};
type ExitInterviewAnalyticsRow = {
  reason_leaving: ExitReasonLeaving;
  total: number;
};
type ExitInterviewAveragesRow = {
  total: number;
  avg_job: number | string | null;
  avg_mgmt: number | string | null;
  avg_work_env: number | string | null;
  avg_compensation: number | string | null;
  avg_growth: number | string | null;
  recommend_count: number | string | null;
  rehire_count: number | string | null;
};
type EmployeePayslipRow = {
  id: number;
  name: string;
  EID?: string | null;
  department?: number | null;
};

const numberValue = (value: unknown) => Number(value || 0);
const delta = (current: number, previous: number): WorkforceDelta => ({
  absolute: current - previous,
  percent: previous ? Number((((current - previous) / previous) * 100).toFixed(1)) : current ? 100 : 0,
});
const employeeWorkLocations = ['Onshore', 'Offshore', 'Remote-UAE', 'GCC-Branch'] as const;
const employeeEmploymentTypes = ['Full-time', 'Contract', 'Freelance', 'Part-time'] as const;
const dateOrNull = (value: unknown) => {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};
const employeeStatus = (value: unknown, fallback = 1) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (String(value).toLowerCase() === 'active') return 1;
  if (String(value).toLowerCase() === 'inactive') return 0;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const nullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
};
const currentYear = () => new Date().getFullYear();
const leaveEntitlements: Array<{
  type: HRLeaveType;
  entitlementDays: number;
  category: 'Paid' | 'Partial Pay' | 'Unpaid' | 'Earned';
  notes: string;
}> = [
  { type: 'Annual Leave', entitlementDays: 30, category: 'Paid', notes: '30 calendar days per year after 1 year; accrual tracked from day 1.' },
  { type: 'Sick Leave', entitlementDays: 90, category: 'Partial Pay', notes: '15 full pay, 30 half pay, 45 unpaid; medical certificate required after 3 days.' },
  { type: 'Maternity Leave', entitlementDays: 60, category: 'Partial Pay', notes: '45 full pay and 15 half pay; female employees only.' },
  { type: 'Paternity Leave', entitlementDays: 5, category: 'Paid', notes: '5 days to be used within 6 months of birth.' },
  { type: 'Hajj Leave', entitlementDays: 30, category: 'Unpaid', notes: '30 unpaid days once during employment; Muslim employees only.' },
  { type: 'Bereavement Leave', entitlementDays: 5, category: 'Paid', notes: '3 to 5 days based on relationship and company policy.' },
  { type: 'Unpaid Leave', entitlementDays: 0, category: 'Unpaid', notes: 'Manager discretion; salary deducted pro-rata.' },
  { type: 'Compensatory Leave', entitlementDays: 0, category: 'Earned', notes: 'Earned against overtime worked and linked to attendance OT records.' },
];
const leaveTypeNames = leaveEntitlements.map((item) => item.type);

const calculateCalendarDays = (startDate: string, endDate: string) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
};

const eachDate = (startDate: string, endDate: string) => {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const yearsOfServiceBetween = (joiningDate: string | Date, lastWorkingDay: string | Date) => {
  const start = new Date(joiningDate);
  const end = new Date(lastWorkingDay);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Number(((end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(2));
};

const maskIban = (iban?: string | null) => {
  if (!iban) return '';
  const compact = iban.replace(/\s+/g, '');
  if (compact.length <= 8) return compact.replace(/.(?=.{4})/g, '*');
  return `${compact.slice(0, 4)}${'*'.repeat(Math.max(compact.length - 8, 4))}${compact.slice(-4)}`;
};

const jsonString = (value: unknown) => JSON.stringify(value || []);
const departmentLabel = (department?: number | null) => {
  if (department === 1) return 'Sales';
  if (department === 2) return 'Operations';
  if (department === 3) return 'Admin';
  return 'Unassigned';
};
const renderTemplate = (template: string, values: Record<string, string | number | null | undefined>) => (
  template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key: string) => String(values[key] ?? ''))
);
const referenceNumber = (letterType: HRLetterType, employeeId: string) => (
  `DM-${letterType.toUpperCase()}-${employeeId}-${Date.now().toString(36).toUpperCase()}`
);
const ratingValue = (value: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) throw new Error('Ratings must be between 1 and 5');
  return parsed;
};
const exitChecklistTemplates = [
  ['HR', 'Collect employee ID card', 'HR Executive'],
  ['HR', 'Collect access cards/keys', 'HR Executive'],
  ['HR', 'Final attendance reconciliation', 'HR Manager'],
  ['HR', 'Process final payroll', 'Finance Manager'],
  ['HR', 'Calculate & approve EOSB', 'Finance Manager'],
  ['HR', 'Exit interview completed', 'HR Manager'],
  ['IT', 'Revoke system/email access', 'IT Admin'],
  ['IT', 'Return laptop/equipment', 'IT Admin'],
  ['IT', 'Backup employee data', 'IT Admin'],
  ['Finance', 'Clear outstanding loans/advances', 'Finance Manager'],
  ['Finance', 'Final settlement payment processed', 'Finance Manager'],
  ['Finance', 'Expense report cleared', 'Finance Executive'],
  ['PRO', 'Visa cancellation initiated (GDRFA)', 'PRO Officer'],
  ['PRO', 'Labour card cancellation (MOHRE)', 'PRO Officer'],
  ['PRO', 'WPS final salary SIF filed', 'PRO Officer'],
  ['PRO', 'Cancel company-provided insurance', 'PRO Officer'],
  ['Mgmt', 'Relieving letter issued', 'HR Manager'],
  ['Mgmt', 'Experience letter issued', 'HR Manager'],
  ['Mgmt', 'NOC issued (if required)', 'HR Manager'],
] as const;
const defaultLetterTemplates: Array<{
  type: HRLetterType;
  name: string;
  body: string;
}> = [
  {
    type: 'relieving',
    name: 'Default Relieving Letter',
    body: [
      'Date of Issue: {{issue_date}}',
      'Ref: {{ref_number}}',
      '',
      'This is to certify that {{employee_name}}, {{designation}} in the {{department}} department, was employed with {{company_name}} from {{joining_date}} to {{last_working_day}}.',
      '',
      'The employee completed {{years_of_service}} years of service. During the tenure, the employee maintained satisfactory service and completed assigned responsibilities.',
      '',
      'The employee is relieved from duties effective {{last_working_day}}.',
      '',
      'Company Stamp: [STAMP PLACEHOLDER]',
      'Digital Signature: [DIGITAL SIGNATURE PLACEHOLDER]',
      '{{hr_manager_name}}',
      '{{hr_manager_designation}}',
      '{{company_name}}',
    ].join('\n'),
  },
  {
    type: 'experience',
    name: 'Default Experience Letter',
    body: [
      'Date of Issue: {{issue_date}}',
      'Ref: {{ref_number}}',
      '',
      'This letter confirms that {{employee_name}} worked with {{company_name}} as {{designation}} from {{joining_date}} to {{last_working_day}}.',
      '',
      'Key Responsibilities: {{key_responsibilities}}',
      '',
      'Performance Summary: {{performance_summary}}',
      '',
      '{{recommendation_statement}}',
      '',
      'Company Stamp: [STAMP PLACEHOLDER]',
      'Digital Signature: [DIGITAL SIGNATURE PLACEHOLDER]',
      '{{hr_manager_name}}',
      '{{hr_manager_designation}}',
      '{{company_name}}',
      'Verification Ref: {{ref_number}}',
    ].join('\n'),
  },
];

export class HRService {
  static getLeaveEntitlements() {
    return leaveEntitlements;
  }

  static async ensureAttendanceRecordTable() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_attendance_records (
        attendance_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        date DATE NOT NULL,
        check_in TIME NULL,
        check_out TIME NULL,
        status ENUM('Present', 'Absent', 'Late', 'Half-Day', 'Leave', 'Holiday') NOT NULL,
        overtime_hours DECIMAL(5,2) NULL DEFAULT 0,
        source ENUM('Manual', 'Biometric', 'Import') NOT NULL,
        notes TEXT NULL,
        approved_by CHAR(36) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_hr_attendance_employee_date (employee_id, date),
        INDEX idx_hr_attendance_status (status),
        INDEX idx_hr_attendance_source (source)
      )
    `);
  }

  static async listAttendanceRecords(options: {
    employeeId?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    source?: string;
    limit?: number;
  } = {}) {
    await this.ensureAttendanceRecordTable();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit: options.limit || 100 };

    if (options.employeeId) {
      conditions.push('a.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }

    if (options.dateFrom) {
      conditions.push('a.date >= :dateFrom');
      replacements.dateFrom = options.dateFrom;
    }

    if (options.dateTo) {
      conditions.push('a.date <= :dateTo');
      replacements.dateTo = options.dateTo;
    }

    if (options.status) {
      conditions.push('a.status = :status');
      replacements.status = options.status;
    }

    if (options.source) {
      conditions.push('a.source = :source');
      replacements.source = options.source;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    return sequelize.query(
      `
        SELECT
          a.attendance_id,
          a.employee_id,
          e.name AS employee_name,
          a.date,
          a.check_in,
          a.check_out,
          a.status,
          a.overtime_hours,
          a.source,
          a.notes,
          a.approved_by,
          approver.name AS approved_by_name,
          a.created_at,
          a.updated_at
        FROM dm_hr_attendance_records a
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = a.employee_id
        LEFT JOIN dm_employee approver ON CAST(approver.id AS CHAR) = a.approved_by
        ${where}
        ORDER BY a.date DESC, a.created_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );
  }

  static async createAttendanceRecord(input: HRAttendanceInput) {
    await this.ensureAttendanceRecordTable();
    const attendanceId = input.attendance_id || crypto.randomUUID();

    await sequelize.query(
      `
        INSERT INTO dm_hr_attendance_records (
          attendance_id, employee_id, date, check_in, check_out, status,
          overtime_hours, source, notes, approved_by
        ) VALUES (
          :attendanceId, :employeeId, :date, :checkIn, :checkOut, :status,
          :overtimeHours, :source, :notes, :approvedBy
        )
      `,
      {
        replacements: {
          attendanceId,
          employeeId: input.employee_id,
          date: input.date,
          checkIn: input.check_in || null,
          checkOut: input.check_out || null,
          status: input.status,
          overtimeHours: input.overtime_hours || 0,
          source: input.source,
          notes: input.notes || null,
          approvedBy: input.approved_by || null,
        },
      }
    );

    return { attendance_id: attendanceId };
  }

  static async updateAttendanceRecord(input: Partial<HRAttendanceInput> & { attendance_id: string }) {
    await this.ensureAttendanceRecordTable();
    await sequelize.query(
      `
        UPDATE dm_hr_attendance_records
        SET
          employee_id = COALESCE(:employeeId, employee_id),
          date = COALESCE(:date, date),
          check_in = :checkIn,
          check_out = :checkOut,
          status = COALESCE(:status, status),
          overtime_hours = COALESCE(:overtimeHours, overtime_hours),
          source = COALESCE(:source, source),
          notes = :notes,
          approved_by = :approvedBy
        WHERE attendance_id = :attendanceId
      `,
      {
        replacements: {
          attendanceId: input.attendance_id,
          employeeId: input.employee_id || null,
          date: input.date || null,
          checkIn: input.check_in || null,
          checkOut: input.check_out || null,
          status: input.status || null,
          overtimeHours: input.overtime_hours ?? null,
          source: input.source || null,
          notes: input.notes || null,
          approvedBy: input.approved_by || null,
        },
      }
    );

    return { attendance_id: input.attendance_id };
  }

  static async importBiometricAttendance(records: HRAttendanceInput[]) {
    const imported = [];
    for (const record of records) {
      imported.push(await this.createAttendanceRecord({ ...record, source: record.source || 'Biometric' }));
    }
    return imported;
  }

  static async ensureLeaveManagementTables() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_leave_requests (
        leave_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        manager_id CHAR(36) NULL,
        leave_type ENUM('Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Hajj Leave', 'Bereavement Leave', 'Unpaid Leave', 'Compensatory Leave') NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        days_requested DECIMAL(6,2) NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',
        workflow_status ENUM('Manager Review', 'HR Confirmation', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Manager Review',
        reason TEXT NULL,
        medical_certificate_required BOOLEAN NOT NULL DEFAULT false,
        document_url TEXT NULL,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        manager_status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
        manager_reviewed_at DATETIME NULL,
        manager_comment TEXT NULL,
        hr_status ENUM('Pending', 'Confirmed', 'Overridden') NOT NULL DEFAULT 'Pending',
        reviewed_by CHAR(36) NULL,
        reviewed_at DATETIME NULL,
        review_notes TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_hr_leave_employee_year (employee_id, start_date),
        INDEX idx_hr_leave_status (status),
        INDEX idx_hr_leave_type (leave_type)
      )
    `);

    await this.addColumnIfMissing('dm_hr_leave_requests', 'manager_id', 'CHAR(36) NULL AFTER employee_id');
    await this.addColumnIfMissing('dm_hr_leave_requests', 'workflow_status', "ENUM('Manager Review', 'HR Confirmation', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Manager Review' AFTER status");
    await this.addColumnIfMissing('dm_hr_leave_requests', 'manager_status', "ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending' AFTER applied_at");
    await this.addColumnIfMissing('dm_hr_leave_requests', 'manager_reviewed_at', 'DATETIME NULL AFTER manager_status');
    await this.addColumnIfMissing('dm_hr_leave_requests', 'manager_comment', 'TEXT NULL AFTER manager_reviewed_at');
    await this.addColumnIfMissing('dm_hr_leave_requests', 'hr_status', "ENUM('Pending', 'Confirmed', 'Overridden') NOT NULL DEFAULT 'Pending' AFTER manager_comment");

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_leave_balances (
        balance_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        leave_type VARCHAR(80) NOT NULL,
        year INT NOT NULL,
        entitlement_days DECIMAL(6,2) NOT NULL DEFAULT 0,
        used_days DECIMAL(6,2) NOT NULL DEFAULT 0,
        pending_days DECIMAL(6,2) NOT NULL DEFAULT 0,
        remaining_days DECIMAL(6,2) NOT NULL DEFAULT 0,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_hr_leave_balance (employee_id, leave_type, year),
        INDEX idx_hr_leave_balance_employee (employee_id, year)
      )
    `);
  }

  private static async addColumnIfMissing(table: string, column: string, definition: string) {
    try {
      await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
      if (!message.includes('duplicate') && !message.includes('exists')) throw error;
    }
  }

  private static async getLeaveWorkflowRecipients(employeeId: string, managerId?: string | null) {
    const [employee] = await sequelize.query<EmployeeRecipientRow>(
      `
        SELECT id, name, department
        FROM dm_employee
        WHERE CAST(id AS CHAR) = :employeeId
        LIMIT 1
      `,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );

    const [manager] = await sequelize.query<EmployeeRecipientRow>(
      `
        SELECT e.id, e.name, e.department
        FROM dm_employee e
        LEFT JOIN dm_role r ON r.id = e.role
        WHERE e.status = 1
          AND (
            (:managerId IS NOT NULL AND CAST(e.id AS CHAR) = :managerId)
            OR (:managerId IS NULL AND e.department <=> :department AND LOWER(COALESCE(r.name, '')) LIKE '%manager%')
            OR (:managerId IS NULL AND LOWER(COALESCE(r.name, '')) LIKE '%manager%')
          )
        ORDER BY
          CASE WHEN :managerId IS NOT NULL AND CAST(e.id AS CHAR) = :managerId THEN 0 ELSE 1 END,
          CASE WHEN e.department <=> :department THEN 0 ELSE 1 END,
          e.id ASC
        LIMIT 1
      `,
      {
        replacements: {
          employeeId,
          managerId: managerId || null,
          department: employee?.department ?? null,
        },
        type: QueryTypes.SELECT,
      }
    );

    const [hr] = await sequelize.query<EmployeeRecipientRow>(
      `
        SELECT e.id, e.name, e.department
        FROM dm_employee e
        LEFT JOIN dm_role r ON r.id = e.role
        WHERE e.status = 1 AND LOWER(COALESCE(r.name, '')) LIKE '%hr%'
        ORDER BY e.id ASC
        LIMIT 1
      `,
      { type: QueryTypes.SELECT }
    );

    return { employee, manager, hr };
  }

  private static async notifyLeaveUsers(input: {
    userIds: Array<string | number | null | undefined>;
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'normal' | 'high' | 'urgent';
  }) {
    const userIds = input.userIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);

    if (!userIds.length) return null;

    try {
      return await ModuleNotificationService.sendLeaveApproval({
        userIds,
        title: input.title,
        message: input.message,
        priority: input.priority || 'medium',
        channels: ['in_app', 'email', 'sms'],
      });
    } catch (error) {
      console.error('Failed to send leave notification:', error);
      return null;
    }
  }

  static async ensureEOSBSettlementTable() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_eosb_settlements (
        eosb_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        joining_date DATE NOT NULL,
        last_working_day DATE NOT NULL,
        years_of_service DECIMAL(6,2) NOT NULL DEFAULT 0,
        separation_reason ENUM('Resignation', 'Termination', 'Retirement', 'Death', 'Mutual') NOT NULL,
        last_basic_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
        eosb_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        leave_balance_days INT NOT NULL DEFAULT 0,
        leave_encashment DECIMAL(12,2) NOT NULL DEFAULT 0,
        unpaid_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
        total_payable DECIMAL(12,2) NOT NULL DEFAULT 0,
        approved_by CHAR(36) NOT NULL,
        settlement_date DATE NULL,
        notes TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_hr_eosb_employee (employee_id),
        INDEX idx_hr_eosb_reason (separation_reason),
        INDEX idx_hr_eosb_settlement_date (settlement_date)
      )
    `);
  }

  static async ensurePayslipTable() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_payslips (
        payslip_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        pay_year INT NOT NULL,
        pay_month INT NOT NULL,
        pay_period VARCHAR(20) NOT NULL,
        basic_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
        allowances_json JSON NULL,
        overtime_hours DECIMAL(6,2) NOT NULL DEFAULT 0,
        overtime_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        deductions_json JSON NULL,
        gross_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
        net_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
        bank_name VARCHAR(255) NULL,
        masked_iban VARCHAR(80) NULL,
        ytd_earnings DECIMAL(12,2) NOT NULL DEFAULT 0,
        storage_key VARCHAR(500) NOT NULL,
        signed_url TEXT NOT NULL,
        signed_url_expires_at DATETIME NOT NULL,
        generated_by CHAR(36) NULL,
        generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_hr_payslip_employee_period (employee_id, pay_year, pay_month),
        INDEX idx_hr_payslip_employee (employee_id),
        INDEX idx_hr_payslip_period (pay_year, pay_month)
      )
    `);
  }

  private static async getEmployeeForPayslip(employeeId: string) {
    const [employee] = await sequelize.query<EmployeePayslipRow>(
      `
        SELECT id, name, EID, department
        FROM dm_employee
        WHERE CAST(id AS CHAR) = :employeeId
        LIMIT 1
      `,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );

    return employee;
  }

  static async generatePayslip(input: PayslipInput) {
    await this.ensurePayslipTable();
    const employee = await this.getEmployeeForPayslip(input.employee_id);
    if (!employee) throw new Error('Employee not found');

    const allowances = input.allowances || [];
    const deductions = input.deductions || [];
    const allowanceTotal = allowances.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const deductionTotal = deductions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const overtimeHours = Number(input.overtime_hours || 0);
    const overtimeAmount = Number(input.overtime_amount || 0);
    const grossSalary = Number((input.basic_salary + allowanceTotal + overtimeAmount).toFixed(2));
    const netSalary = Number((grossSalary - deductionTotal).toFixed(2));
    const payPeriod = `${input.pay_year}-${String(input.pay_month).padStart(2, '0')}`;
    const fileName = `payslip_${input.employee_id}_${input.pay_year}_${String(input.pay_month).padStart(2, '0')}.pdf`;

    const document = await DocumentService.generatePayslip({
      companyName: process.env.COMPANY_NAME || 'DM CONSULTANTS',
      companyAddress: process.env.COMPANY_ADDRESS || 'DM Consultants, Dubai, UAE',
      employeeName: employee.name,
      employeeId: employee.EID || String(employee.id),
      designation: input.designation || 'Employee',
      department: input.department || departmentLabel(employee.department),
      payPeriod,
      basicSalary: input.basic_salary,
      allowances,
      overtimeHours,
      overtimeAmount,
      deductions,
      grossSalary,
      netSalary,
      bankName: input.bank_name || '',
      maskedIban: maskIban(input.iban),
      ytdEarnings: input.ytd_earnings || netSalary,
      signatureName: input.authorised_by || 'HR / Finance',
      fileName,
    });
    const payslipId = crypto.randomUUID();

    await sequelize.query(
      `
        INSERT INTO dm_hr_payslips (
          payslip_id, employee_id, pay_year, pay_month, pay_period, basic_salary,
          allowances_json, overtime_hours, overtime_amount, deductions_json,
          gross_salary, net_salary, bank_name, masked_iban, ytd_earnings,
          storage_key, signed_url, signed_url_expires_at, generated_by
        ) VALUES (
          :payslipId, :employeeId, :payYear, :payMonth, :payPeriod, :basicSalary,
          :allowances, :overtimeHours, :overtimeAmount, :deductions,
          :grossSalary, :netSalary, :bankName, :maskedIban, :ytdEarnings,
          :storageKey, :signedUrl, :signedUrlExpiresAt, :generatedBy
        )
        ON DUPLICATE KEY UPDATE
          basic_salary = VALUES(basic_salary),
          allowances_json = VALUES(allowances_json),
          overtime_hours = VALUES(overtime_hours),
          overtime_amount = VALUES(overtime_amount),
          deductions_json = VALUES(deductions_json),
          gross_salary = VALUES(gross_salary),
          net_salary = VALUES(net_salary),
          bank_name = VALUES(bank_name),
          masked_iban = VALUES(masked_iban),
          ytd_earnings = VALUES(ytd_earnings),
          storage_key = VALUES(storage_key),
          signed_url = VALUES(signed_url),
          signed_url_expires_at = VALUES(signed_url_expires_at),
          generated_by = VALUES(generated_by),
          generated_at = CURRENT_TIMESTAMP
      `,
      {
        replacements: {
          payslipId,
          employeeId: input.employee_id,
          payYear: input.pay_year,
          payMonth: input.pay_month,
          payPeriod,
          basicSalary: input.basic_salary,
          allowances: jsonString(allowances),
          overtimeHours,
          overtimeAmount,
          deductions: jsonString(deductions),
          grossSalary,
          netSalary,
          bankName: input.bank_name || null,
          maskedIban: maskIban(input.iban) || null,
          ytdEarnings: input.ytd_earnings || netSalary,
          storageKey: document.storageKey,
          signedUrl: document.signedUrl,
          signedUrlExpiresAt: document.expiresAt,
          generatedBy: input.authorised_by || null,
        },
      }
    );

    return {
      payslip_id: payslipId,
      employee_id: input.employee_id,
      employee_name: employee.name,
      pay_period: payPeriod,
      gross_salary: grossSalary,
      net_salary: netSalary,
      storage_key: document.storageKey,
      signed_url: document.signedUrl,
      signed_url_expires_at: document.expiresAt,
    };
  }

  static async listPayslips(options: { employeeId?: string; payYear?: number; payMonth?: number; limit?: number } = {}) {
    await this.ensurePayslipTable();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit: options.limit || 100 };

    if (options.employeeId) {
      conditions.push('p.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }
    if (options.payYear) {
      conditions.push('p.pay_year = :payYear');
      replacements.payYear = options.payYear;
    }
    if (options.payMonth) {
      conditions.push('p.pay_month = :payMonth');
      replacements.payMonth = options.payMonth;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return sequelize.query(
      `
        SELECT
          p.payslip_id,
          p.employee_id,
          e.name AS employee_name,
          p.pay_period,
          p.basic_salary,
          p.overtime_hours,
          p.overtime_amount,
          p.gross_salary,
          p.net_salary,
          p.bank_name,
          p.masked_iban,
          p.ytd_earnings,
          p.storage_key,
          p.signed_url,
          p.signed_url_expires_at,
          p.generated_by,
          p.generated_at
        FROM dm_hr_payslips p
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = p.employee_id
        ${where}
        ORDER BY p.pay_year DESC, p.pay_month DESC, p.generated_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );
  }

  static async ensureExitChecklistTables() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_exit_checklists (
        checklist_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        separation_reason VARCHAR(80) NULL,
        last_working_day DATE NULL,
        status ENUM('Open', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Open',
        assigned_by CHAR(36) NULL,
        assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME NULL,
        INDEX idx_hr_exit_checklist_employee (employee_id),
        INDEX idx_hr_exit_checklist_status (status)
      )
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_exit_checklist_items (
        item_id CHAR(36) PRIMARY KEY,
        checklist_id CHAR(36) NOT NULL,
        employee_id CHAR(36) NOT NULL,
        department VARCHAR(50) NOT NULL,
        item_text VARCHAR(255) NOT NULL,
        owner_role VARCHAR(100) NOT NULL,
        status ENUM('Pending', 'Completed', 'Waived') NOT NULL DEFAULT 'Pending',
        completed_by CHAR(36) NULL,
        completed_at DATETIME NULL,
        notes TEXT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        INDEX idx_hr_exit_item_checklist (checklist_id),
        INDEX idx_hr_exit_item_employee (employee_id),
        INDEX idx_hr_exit_item_department (department),
        INDEX idx_hr_exit_item_status (status)
      )
    `);
  }

  static getExitChecklistTemplate() {
    return exitChecklistTemplates.map(([department, item, owner], index) => ({
      department,
      item,
      owner,
      sort_order: index + 1,
    }));
  }

  static async assignExitChecklist(input: ExitChecklistInput) {
    await this.ensureExitChecklistTables();
    const checklistId = crypto.randomUUID();

    await sequelize.query(
      `
        INSERT INTO dm_hr_exit_checklists (
          checklist_id, employee_id, separation_reason, last_working_day, assigned_by
        ) VALUES (
          :checklistId, :employeeId, :separationReason, :lastWorkingDay, :assignedBy
        )
      `,
      {
        replacements: {
          checklistId,
          employeeId: input.employee_id,
          separationReason: input.separation_reason || null,
          lastWorkingDay: input.last_working_day || null,
          assignedBy: input.assigned_by || null,
        },
      }
    );

    for (const [index, [department, item, owner]] of exitChecklistTemplates.entries()) {
      await sequelize.query(
        `
          INSERT INTO dm_hr_exit_checklist_items (
            item_id, checklist_id, employee_id, department, item_text, owner_role, sort_order
          ) VALUES (
            :itemId, :checklistId, :employeeId, :department, :itemText, :ownerRole, :sortOrder
          )
        `,
        {
          replacements: {
            itemId: crypto.randomUUID(),
            checklistId,
            employeeId: input.employee_id,
            department,
            itemText: item,
            ownerRole: owner,
            sortOrder: index + 1,
          },
        }
      );
    }

    return { checklist_id: checklistId };
  }

  static async listExitChecklists(options: { employeeId?: string; checklistId?: string; limit?: number } = {}) {
    await this.ensureExitChecklistTables();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit: options.limit || 100 };

    if (options.employeeId) {
      conditions.push('c.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }

    if (options.checklistId) {
      conditions.push('c.checklist_id = :checklistId');
      replacements.checklistId = options.checklistId;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const checklists = await sequelize.query(
      `
        SELECT
          c.checklist_id,
          c.employee_id,
          e.name AS employee_name,
          c.separation_reason,
          c.last_working_day,
          c.status,
          c.assigned_by,
          assigner.name AS assigned_by_name,
          c.assigned_at,
          c.completed_at,
          COUNT(i.item_id) AS total_items,
          SUM(CASE WHEN i.status = 'Completed' THEN 1 ELSE 0 END) AS completed_items,
          SUM(CASE WHEN i.status = 'Waived' THEN 1 ELSE 0 END) AS waived_items,
          SUM(CASE WHEN i.status = 'Pending' THEN 1 ELSE 0 END) AS pending_items
        FROM dm_hr_exit_checklists c
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = c.employee_id
        LEFT JOIN dm_employee assigner ON CAST(assigner.id AS CHAR) = c.assigned_by
        LEFT JOIN dm_hr_exit_checklist_items i ON i.checklist_id = c.checklist_id
        ${where}
        GROUP BY c.checklist_id, c.employee_id, e.name, c.separation_reason, c.last_working_day, c.status, c.assigned_by, assigner.name, c.assigned_at, c.completed_at
        ORDER BY c.assigned_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );

    const items = await sequelize.query(
      `
        SELECT
          i.item_id,
          i.checklist_id,
          i.employee_id,
          i.department,
          i.item_text,
          i.owner_role,
          i.status,
          i.completed_by,
          completer.name AS completed_by_name,
          i.completed_at,
          i.notes,
          i.sort_order
        FROM dm_hr_exit_checklist_items i
        LEFT JOIN dm_employee completer ON CAST(completer.id AS CHAR) = i.completed_by
        ${options.employeeId ? 'WHERE i.employee_id = :employeeId' : options.checklistId ? 'WHERE i.checklist_id = :checklistId' : ''}
        ORDER BY i.sort_order ASC
      `,
      { replacements, type: QueryTypes.SELECT }
    );

    return { checklists, items };
  }

  static async updateExitChecklistItem(input: ExitChecklistItemUpdate) {
    await this.ensureExitChecklistTables();
    await sequelize.query(
      `
        UPDATE dm_hr_exit_checklist_items
        SET
          status = :status,
          completed_by = CASE WHEN :status IN ('Completed', 'Waived') THEN :completedBy ELSE NULL END,
          completed_at = CASE WHEN :status IN ('Completed', 'Waived') THEN CURRENT_TIMESTAMP ELSE NULL END,
          notes = :notes
        WHERE item_id = :itemId
      `,
      {
        replacements: {
          itemId: input.item_id,
          status: input.status,
          completedBy: input.completed_by || null,
          notes: input.notes || null,
        },
      }
    );

    const [item] = await sequelize.query<{ checklist_id: string }>(
      'SELECT checklist_id FROM dm_hr_exit_checklist_items WHERE item_id = :itemId LIMIT 1',
      { replacements: { itemId: input.item_id }, type: QueryTypes.SELECT }
    );

    if (item) {
      const [summary] = await sequelize.query<{ pending_items: number | string }>(
        `
          SELECT SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending_items
          FROM dm_hr_exit_checklist_items
          WHERE checklist_id = :checklistId
        `,
        { replacements: { checklistId: item.checklist_id }, type: QueryTypes.SELECT }
      );

      await sequelize.query(
        `
          UPDATE dm_hr_exit_checklists
          SET
            status = CASE WHEN :pendingItems = 0 THEN 'Completed' ELSE 'Open' END,
            completed_at = CASE WHEN :pendingItems = 0 THEN CURRENT_TIMESTAMP ELSE NULL END
          WHERE checklist_id = :checklistId
        `,
        {
          replacements: {
            checklistId: item.checklist_id,
            pendingItems: Number(summary?.pending_items || 0),
          },
        }
      );
    }

    return { item_id: input.item_id, status: input.status };
  }

  static async ensureLetterTables() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_letter_templates (
        template_id CHAR(36) PRIMARY KEY,
        letter_type ENUM('relieving', 'experience') NOT NULL,
        template_name VARCHAR(150) NOT NULL,
        body_template TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_hr_letter_template_type (letter_type, is_active)
      )
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_employee_letters (
        letter_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        letter_type ENUM('relieving', 'experience') NOT NULL,
        template_id CHAR(36) NOT NULL,
        ref_number VARCHAR(80) NOT NULL,
        issue_date DATE NOT NULL,
        last_working_day DATE NOT NULL,
        designation VARCHAR(150) NULL,
        department VARCHAR(150) NULL,
        rendered_body TEXT NOT NULL,
        storage_key VARCHAR(500) NOT NULL,
        signed_url TEXT NOT NULL,
        signed_url_expires_at DATETIME NOT NULL,
        generated_by CHAR(36) NULL,
        generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_hr_letter_ref (ref_number),
        INDEX idx_hr_employee_letter_employee (employee_id),
        INDEX idx_hr_employee_letter_type (letter_type)
      )
    `);

    for (const template of defaultLetterTemplates) {
      const [existing] = await sequelize.query<CountRow>(
        `
          SELECT COUNT(*) AS total
          FROM dm_hr_letter_templates
          WHERE letter_type = :letterType
        `,
        { replacements: { letterType: template.type }, type: QueryTypes.SELECT }
      );

      if (Number(existing?.total || 0) === 0) {
        await sequelize.query(
          `
            INSERT INTO dm_hr_letter_templates (
              template_id, letter_type, template_name, body_template, is_active
            ) VALUES (
              :templateId, :letterType, :templateName, :bodyTemplate, true
            )
          `,
          {
            replacements: {
              templateId: crypto.randomUUID(),
              letterType: template.type,
              templateName: template.name,
              bodyTemplate: template.body,
            },
          }
        );
      }
    }
  }

  static async listLetterTemplates() {
    await this.ensureLetterTables();
    return sequelize.query(
      `
        SELECT template_id, letter_type, template_name, body_template, is_active, updated_at
        FROM dm_hr_letter_templates
        ORDER BY letter_type, template_name
      `,
      { type: QueryTypes.SELECT }
    );
  }

  static async listEmployeeLetters(options: { employeeId?: string; limit?: number } = {}) {
    await this.ensureLetterTables();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit: options.limit || 100 };

    if (options.employeeId) {
      conditions.push('l.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return sequelize.query(
      `
        SELECT
          l.letter_id,
          l.employee_id,
          e.name AS employee_name,
          l.letter_type,
          t.template_name,
          l.ref_number,
          l.issue_date,
          l.last_working_day,
          l.designation,
          l.department,
          l.storage_key,
          l.signed_url,
          l.signed_url_expires_at,
          l.generated_by,
          generator.name AS generated_by_name,
          l.generated_at
        FROM dm_hr_employee_letters l
        LEFT JOIN dm_hr_letter_templates t ON t.template_id = l.template_id
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = l.employee_id
        LEFT JOIN dm_employee generator ON CAST(generator.id AS CHAR) = l.generated_by
        ${where}
        ORDER BY l.generated_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );
  }

  private static async getEmployeeForLetter(employeeId: string) {
    const [employee] = await sequelize.query<EmployeeLetterRow>(
      `
        SELECT id, name, EID, doj, department
        FROM dm_employee
        WHERE CAST(id AS CHAR) = :employeeId
        LIMIT 1
      `,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );

    return employee;
  }

  static async generateEmployeeLetter(input: HRLetterInput) {
    await this.ensureLetterTables();
    const employee = await this.getEmployeeForLetter(input.employee_id);
    if (!employee) throw new Error('Employee not found');
    if (!employee.doj) throw new Error('Employee joining date is required');

    const [template] = await sequelize.query<{ template_id: string; body_template: string; template_name: string }>(
      `
        SELECT template_id, body_template, template_name
        FROM dm_hr_letter_templates
        WHERE letter_type = :letterType AND is_active = true
        ORDER BY updated_at DESC
        LIMIT 1
      `,
      { replacements: { letterType: input.letter_type }, type: QueryTypes.SELECT }
    );
    if (!template) throw new Error('Letter template not found');

    const issueDate = input.issue_date || new Date().toISOString().slice(0, 10);
    const refNumber = referenceNumber(input.letter_type, input.employee_id);
    const yearsOfService = yearsOfServiceBetween(employee.doj, input.last_working_day);
    const companyName = process.env.COMPANY_NAME || 'DM CONSULTANTS';
    const renderedBody = renderTemplate(template.body_template, {
      employee_name: employee.name,
      employee_id: employee.EID || employee.id,
      designation: input.designation || 'Employee',
      department: input.department || departmentLabel(employee.department),
      joining_date: new Date(employee.doj).toISOString().slice(0, 10),
      last_working_day: input.last_working_day,
      years_of_service: yearsOfService.toFixed(2),
      company_name: companyName,
      hr_manager_name: input.hr_manager_name,
      hr_manager_designation: input.hr_manager_designation || 'HR Manager',
      issue_date: issueDate,
      key_responsibilities: input.key_responsibilities || 'Handled assigned responsibilities as per role requirements.',
      performance_summary: input.performance_summary || 'Maintained professional conduct and satisfactory performance.',
      recommendation_statement: input.recommendation_statement || 'We wish the employee success in future endeavours.',
      ref_number: refNumber,
    });
    const documentType = input.letter_type === 'experience' ? 'experience_letter' : 'relieving_letter';
    const document = await DocumentService.generateLetter({
      type: documentType,
      employeeName: employee.name,
      title: input.letter_type === 'experience' ? 'Experience Letter' : 'Relieving Letter',
      body: renderedBody,
      fileName: `${documentType}_${input.employee_id}_${issueDate}.pdf`,
    });
    const letterId = crypto.randomUUID();

    await sequelize.query(
      `
        INSERT INTO dm_hr_employee_letters (
          letter_id, employee_id, letter_type, template_id, ref_number, issue_date,
          last_working_day, designation, department, rendered_body, storage_key,
          signed_url, signed_url_expires_at, generated_by
        ) VALUES (
          :letterId, :employeeId, :letterType, :templateId, :refNumber, :issueDate,
          :lastWorkingDay, :designation, :department, :renderedBody, :storageKey,
          :signedUrl, :signedUrlExpiresAt, :generatedBy
        )
      `,
      {
        replacements: {
          letterId,
          employeeId: input.employee_id,
          letterType: input.letter_type,
          templateId: template.template_id,
          refNumber,
          issueDate,
          lastWorkingDay: input.last_working_day,
          designation: input.designation || 'Employee',
          department: input.department || departmentLabel(employee.department),
          renderedBody,
          storageKey: document.storageKey,
          signedUrl: document.signedUrl,
          signedUrlExpiresAt: document.expiresAt,
          generatedBy: input.generated_by || null,
        },
      }
    );

    return {
      letter_id: letterId,
      employee_id: input.employee_id,
      employee_name: employee.name,
      letter_type: input.letter_type,
      template_name: template.template_name,
      ref_number: refNumber,
      issue_date: issueDate,
      last_working_day: input.last_working_day,
      storage_key: document.storageKey,
      signed_url: document.signedUrl,
      signed_url_expires_at: document.expiresAt,
    };
  }

  static async ensureExitInterviewTable() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_exit_interviews (
        exit_id CHAR(36) PRIMARY KEY,
        employee_id CHAR(36) NOT NULL,
        interview_date DATE NOT NULL,
        conducted_by CHAR(36) NOT NULL,
        reason_leaving ENUM('Better Opportunity', 'Salary', 'Relocation', 'Personal', 'Termination', 'Other') NOT NULL,
        reason_details TEXT NULL,
        job_satisfaction TINYINT NOT NULL,
        mgmt_satisfaction TINYINT NOT NULL,
        work_env_rating TINYINT NOT NULL,
        compensation_rating TINYINT NOT NULL,
        growth_rating TINYINT NOT NULL,
        recommend_company BOOLEAN NOT NULL,
        rehire_eligible BOOLEAN NOT NULL,
        feedback_text TEXT NULL,
        suggestions TEXT NULL,
        confidential BOOLEAN NOT NULL DEFAULT true,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_hr_exit_interview_employee (employee_id),
        INDEX idx_hr_exit_interview_reason (reason_leaving),
        INDEX idx_hr_exit_interview_date (interview_date)
      )
    `);
  }

  static async createExitInterview(input: ExitInterviewInput) {
    await this.ensureExitInterviewTable();
    const exitId = crypto.randomUUID();
    const ratings = {
      jobSatisfaction: ratingValue(input.job_satisfaction),
      mgmtSatisfaction: ratingValue(input.mgmt_satisfaction),
      workEnvRating: ratingValue(input.work_env_rating),
      compensationRating: ratingValue(input.compensation_rating),
      growthRating: ratingValue(input.growth_rating),
    };

    await sequelize.query(
      `
        INSERT INTO dm_hr_exit_interviews (
          exit_id, employee_id, interview_date, conducted_by, reason_leaving,
          reason_details, job_satisfaction, mgmt_satisfaction, work_env_rating,
          compensation_rating, growth_rating, recommend_company, rehire_eligible,
          feedback_text, suggestions, confidential
        ) VALUES (
          :exitId, :employeeId, :interviewDate, :conductedBy, :reasonLeaving,
          :reasonDetails, :jobSatisfaction, :mgmtSatisfaction, :workEnvRating,
          :compensationRating, :growthRating, :recommendCompany, :rehireEligible,
          :feedbackText, :suggestions, :confidential
        )
      `,
      {
        replacements: {
          exitId,
          employeeId: input.employee_id,
          interviewDate: input.interview_date,
          conductedBy: input.conducted_by,
          reasonLeaving: input.reason_leaving,
          reasonDetails: input.reason_details || null,
          jobSatisfaction: ratings.jobSatisfaction,
          mgmtSatisfaction: ratings.mgmtSatisfaction,
          workEnvRating: ratings.workEnvRating,
          compensationRating: ratings.compensationRating,
          growthRating: ratings.growthRating,
          recommendCompany: input.recommend_company,
          rehireEligible: input.rehire_eligible,
          feedbackText: input.feedback_text || null,
          suggestions: input.suggestions || null,
          confidential: input.confidential ?? true,
        },
      }
    );

    return { exit_id: exitId };
  }

  static async listExitInterviews(options: { employeeId?: string; reason?: string; limit?: number } = {}) {
    await this.ensureExitInterviewTable();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit: options.limit || 100 };

    if (options.employeeId) {
      conditions.push('x.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }

    if (options.reason) {
      conditions.push('x.reason_leaving = :reason');
      replacements.reason = options.reason;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return sequelize.query(
      `
        SELECT
          x.exit_id,
          x.employee_id,
          e.name AS employee_name,
          x.interview_date,
          x.conducted_by,
          conductor.name AS conducted_by_name,
          x.reason_leaving,
          x.reason_details,
          x.job_satisfaction,
          x.mgmt_satisfaction,
          x.work_env_rating,
          x.compensation_rating,
          x.growth_rating,
          x.recommend_company,
          x.rehire_eligible,
          x.feedback_text,
          x.suggestions,
          x.confidential,
          x.created_at
        FROM dm_hr_exit_interviews x
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = x.employee_id
        LEFT JOIN dm_employee conductor ON CAST(conductor.id AS CHAR) = x.conducted_by
        ${where}
        ORDER BY x.interview_date DESC, x.created_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );
  }

  static async getExitInterviewAnalytics() {
    await this.ensureExitInterviewTable();
    const reasons = await sequelize.query<ExitInterviewAnalyticsRow>(
      `
        SELECT reason_leaving, COUNT(*) AS total
        FROM dm_hr_exit_interviews
        GROUP BY reason_leaving
        ORDER BY total DESC
      `,
      { type: QueryTypes.SELECT }
    );
    const [averages] = await sequelize.query<ExitInterviewAveragesRow>(
      `
        SELECT
          COUNT(*) AS total,
          AVG(job_satisfaction) AS avg_job,
          AVG(mgmt_satisfaction) AS avg_mgmt,
          AVG(work_env_rating) AS avg_work_env,
          AVG(compensation_rating) AS avg_compensation,
          AVG(growth_rating) AS avg_growth,
          SUM(CASE WHEN recommend_company = true THEN 1 ELSE 0 END) AS recommend_count,
          SUM(CASE WHEN rehire_eligible = true THEN 1 ELSE 0 END) AS rehire_count
        FROM dm_hr_exit_interviews
      `,
      { type: QueryTypes.SELECT }
    );
    const total = Number(averages?.total || 0);

    return {
      total,
      reasonBreakdown: reasons.map((reason) => ({
        reason: reason.reason_leaving,
        total: Number(reason.total || 0),
      })),
      averages: {
        jobSatisfaction: Number(Number(averages?.avg_job || 0).toFixed(1)),
        management: Number(Number(averages?.avg_mgmt || 0).toFixed(1)),
        workEnvironment: Number(Number(averages?.avg_work_env || 0).toFixed(1)),
        compensation: Number(Number(averages?.avg_compensation || 0).toFixed(1)),
        growth: Number(Number(averages?.avg_growth || 0).toFixed(1)),
      },
      recommendPercent: total ? Math.round((Number(averages?.recommend_count || 0) / total) * 100) : 0,
      rehireEligiblePercent: total ? Math.round((Number(averages?.rehire_count || 0) / total) * 100) : 0,
    };
  }

  static calculateEOSB(
    monthlyBasicSalary: number,
    joiningDate: string | Date,
    lastWorkingDay: string | Date = new Date(),
    separationReason: HREOSBSeparationReason = 'Termination'
  ) {
    const yearsOfService = yearsOfServiceBetween(joiningDate, lastWorkingDay);
    const dailyBasicRate = monthlyBasicSalary / 30;
    let gratuityDays = 0;

    if (yearsOfService < 1) {
      gratuityDays = 0;
    } else if (separationReason === 'Resignation') {
      if (yearsOfService < 3) gratuityDays = 21 * yearsOfService * (1 / 3);
      else if (yearsOfService < 5) gratuityDays = 21 * yearsOfService * (2 / 3);
      else gratuityDays = 21 * 5 + 30 * (yearsOfService - 5);
    } else if (yearsOfService <= 5) {
      gratuityDays = 21 * yearsOfService;
    } else {
      gratuityDays = (21 * 5) + (30 * (yearsOfService - 5));
    }

    const eosbAmount = Number((dailyBasicRate * gratuityDays).toFixed(2));

    return {
      yearsOfService,
      dailyBasicRate: Number(dailyBasicRate.toFixed(2)),
      gratuityDays: Number(gratuityDays.toFixed(2)),
      eosbAmount,
      estimatedBenefit: Math.round(eosbAmount),
      ruleApplied: yearsOfService < 1
        ? '< 1 year: no EOSB entitlement'
        : `${separationReason}: ${Number(gratuityDays.toFixed(2))} gratuity days`,
    };
  }

  private static async getEmployeeForEOSB(employeeId: string) {
    const [employee] = await sequelize.query<EmployeeEOSBRow>(
      `
        SELECT id, name, doj
        FROM dm_employee
        WHERE CAST(id AS CHAR) = :employeeId
        LIMIT 1
      `,
      { replacements: { employeeId }, type: QueryTypes.SELECT }
    );

    return employee;
  }

  static async getAnnualLeaveBalanceDays(employeeId: string, year = currentYear()) {
    await this.ensureLeaveManagementTables();
    await this.syncLeaveBalance(employeeId, 'Annual Leave', year);
    const [balance] = await sequelize.query<{ remaining_days: number | string | null }>(
      `
        SELECT remaining_days
        FROM dm_hr_leave_balances
        WHERE employee_id = :employeeId
          AND leave_type = 'Annual Leave'
          AND year = :year
        LIMIT 1
      `,
      { replacements: { employeeId, year }, type: QueryTypes.SELECT }
    );

    return Math.max(0, Math.floor(Number(balance?.remaining_days || 0)));
  }

  static async previewEOSBSettlement(input: Omit<EOSBInput, 'approved_by'> & { approved_by?: string }) {
    await this.ensureEOSBSettlementTable();
    const employee = await this.getEmployeeForEOSB(input.employee_id);
    if (!employee?.doj) throw new Error('Employee joining date is required for EOSB calculation');

    const calculation = this.calculateEOSB(
      input.last_basic_salary,
      employee.doj,
      input.last_working_day,
      input.separation_reason
    );
    const leaveBalanceDays = await this.getAnnualLeaveBalanceDays(input.employee_id, new Date(input.last_working_day).getFullYear());
    const leaveEncashment = Number((leaveBalanceDays * calculation.dailyBasicRate).toFixed(2));
    const unpaidSalary = Number(input.unpaid_salary || 0);
    const totalPayable = Number((calculation.eosbAmount + leaveEncashment + unpaidSalary).toFixed(2));

    return {
      employee_id: input.employee_id,
      employee_name: employee.name,
      joining_date: employee.doj,
      last_working_day: input.last_working_day,
      separation_reason: input.separation_reason,
      last_basic_salary: Number(input.last_basic_salary.toFixed(2)),
      years_of_service: calculation.yearsOfService,
      gratuity_days: calculation.gratuityDays,
      eosb_amount: calculation.eosbAmount,
      leave_balance_days: leaveBalanceDays,
      leave_encashment: leaveEncashment,
      unpaid_salary: unpaidSalary,
      total_payable: totalPayable,
      rule_applied: calculation.ruleApplied,
      approved_by: input.approved_by || '',
      settlement_date: input.settlement_date || null,
      notes: input.notes || null,
    };
  }

  static async createEOSBSettlement(input: EOSBInput) {
    if (!input.approved_by) throw new Error('approved_by is required');
    const preview = await this.previewEOSBSettlement(input);
    const eosbId = crypto.randomUUID();

    await sequelize.query(
      `
        INSERT INTO dm_hr_eosb_settlements (
          eosb_id, employee_id, joining_date, last_working_day, years_of_service,
          separation_reason, last_basic_salary, eosb_amount, leave_balance_days,
          leave_encashment, unpaid_salary, total_payable, approved_by,
          settlement_date, notes
        ) VALUES (
          :eosbId, :employeeId, :joiningDate, :lastWorkingDay, :yearsOfService,
          :separationReason, :lastBasicSalary, :eosbAmount, :leaveBalanceDays,
          :leaveEncashment, :unpaidSalary, :totalPayable, :approvedBy,
          :settlementDate, :notes
        )
      `,
      {
        replacements: {
          eosbId,
          employeeId: preview.employee_id,
          joiningDate: preview.joining_date,
          lastWorkingDay: preview.last_working_day,
          yearsOfService: preview.years_of_service,
          separationReason: preview.separation_reason,
          lastBasicSalary: preview.last_basic_salary,
          eosbAmount: preview.eosb_amount,
          leaveBalanceDays: preview.leave_balance_days,
          leaveEncashment: preview.leave_encashment,
          unpaidSalary: preview.unpaid_salary,
          totalPayable: preview.total_payable,
          approvedBy: input.approved_by,
          settlementDate: input.settlement_date || null,
          notes: input.notes || null,
        },
      }
    );

    return { eosb_id: eosbId, ...preview };
  }

  static async listEOSBSettlements(options: { employeeId?: string; limit?: number } = {}) {
    await this.ensureEOSBSettlementTable();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit: options.limit || 100 };

    if (options.employeeId) {
      conditions.push('s.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return sequelize.query(
      `
        SELECT
          s.eosb_id,
          s.employee_id,
          e.name AS employee_name,
          s.joining_date,
          s.last_working_day,
          s.years_of_service,
          s.separation_reason,
          s.last_basic_salary,
          s.eosb_amount,
          s.leave_balance_days,
          s.leave_encashment,
          s.unpaid_salary,
          s.total_payable,
          s.approved_by,
          approver.name AS approved_by_name,
          s.settlement_date,
          s.notes,
          s.created_at
        FROM dm_hr_eosb_settlements s
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = s.employee_id
        LEFT JOIN dm_employee approver ON CAST(approver.id AS CHAR) = s.approved_by
        ${where}
        ORDER BY s.created_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );
  }

  static async listLeaveManagementRequests(options: {
    employeeId?: string;
    status?: string;
    year?: number;
    limit?: number;
  } = {}) {
    await this.ensureLeaveManagementTables();
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = {
      limit: options.limit || 100,
      year: options.year || currentYear(),
    };

    if (options.employeeId) {
      conditions.push('l.employee_id = :employeeId');
      replacements.employeeId = options.employeeId;
    }

    if (options.status) {
      conditions.push('l.status = :status');
      replacements.status = options.status;
    }

    conditions.push('YEAR(l.start_date) = :year');
    const where = `WHERE ${conditions.join(' AND ')}`;

    return sequelize.query(
      `
        SELECT
          l.leave_id,
          l.employee_id,
          e.name AS employee_name,
          l.manager_id,
          manager.name AS manager_name,
          l.leave_type,
          l.start_date,
          l.end_date,
          l.days_requested,
          l.status,
          l.workflow_status,
          l.reason,
          l.medical_certificate_required,
          l.document_url,
          l.applied_at,
          l.manager_status,
          l.manager_reviewed_at,
          l.manager_comment,
          l.hr_status,
          l.reviewed_by,
          reviewer.name AS reviewed_by_name,
          l.reviewed_at,
          l.review_notes
        FROM dm_hr_leave_requests l
        LEFT JOIN dm_employee e ON CAST(e.id AS CHAR) = l.employee_id
        LEFT JOIN dm_employee manager ON CAST(manager.id AS CHAR) = l.manager_id
        LEFT JOIN dm_employee reviewer ON CAST(reviewer.id AS CHAR) = l.reviewed_by
        ${where}
        ORDER BY l.applied_at DESC
        LIMIT :limit
      `,
      { replacements, type: QueryTypes.SELECT }
    );
  }

  static async getLeaveBalances(employeeId?: string, year = currentYear()) {
    await this.ensureLeaveManagementTables();

    if (!employeeId) {
      return leaveEntitlements.map((entitlement) => ({
        balance_id: '',
        employee_id: '',
        leave_type: entitlement.type,
        year,
        entitlement_days: entitlement.entitlementDays,
        used_days: 0,
        pending_days: 0,
        remaining_days: entitlement.entitlementDays,
      }));
    }

    for (const entitlement of leaveEntitlements) {
      await this.syncLeaveBalance(employeeId, entitlement.type, year);
    }

    return sequelize.query(
      `
        SELECT
          balance_id,
          employee_id,
          leave_type,
          year,
          entitlement_days,
          used_days,
          pending_days,
          remaining_days
        FROM dm_hr_leave_balances
        WHERE employee_id = :employeeId AND year = :year
        ORDER BY FIELD(leave_type, 'Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Hajj Leave', 'Bereavement Leave', 'Unpaid Leave', 'Compensatory Leave')
      `,
      { replacements: { employeeId, year }, type: QueryTypes.SELECT }
    );
  }

  static async syncLeaveBalance(employeeId: string, leaveType: HRLeaveType, year = currentYear()) {
    await this.ensureLeaveManagementTables();
    const entitlement = leaveEntitlements.find((item) => item.type === leaveType);
    const entitlementDays = entitlement?.entitlementDays || 0;
    const [summary] = await sequelize.query<{ used_days: number | string | null; pending_days: number | string | null }>(
      `
        SELECT
          SUM(CASE WHEN status = 'Approved' THEN days_requested ELSE 0 END) AS used_days,
          SUM(CASE WHEN status = 'Pending' THEN days_requested ELSE 0 END) AS pending_days
        FROM dm_hr_leave_requests
        WHERE employee_id = :employeeId
          AND leave_type = :leaveType
          AND YEAR(start_date) = :year
      `,
      { replacements: { employeeId, leaveType, year }, type: QueryTypes.SELECT }
    );
    const usedDays = Number(summary?.used_days || 0);
    const pendingDays = Number(summary?.pending_days || 0);
    const remainingDays = leaveType === 'Unpaid Leave' || leaveType === 'Compensatory Leave'
      ? 0
      : Math.max(entitlementDays - usedDays - pendingDays, 0);

    await sequelize.query(
      `
        INSERT INTO dm_hr_leave_balances (
          balance_id, employee_id, leave_type, year, entitlement_days,
          used_days, pending_days, remaining_days
        ) VALUES (
          :balanceId, :employeeId, :leaveType, :year, :entitlementDays,
          :usedDays, :pendingDays, :remainingDays
        )
        ON DUPLICATE KEY UPDATE
          entitlement_days = VALUES(entitlement_days),
          used_days = VALUES(used_days),
          pending_days = VALUES(pending_days),
          remaining_days = VALUES(remaining_days)
      `,
      {
        replacements: {
          balanceId: crypto.randomUUID(),
          employeeId,
          leaveType,
          year,
          entitlementDays,
          usedDays,
          pendingDays,
          remainingDays,
        },
      }
    );
  }

  static async applyLeave(input: HRLeaveInput) {
    await this.ensureLeaveManagementTables();
    if (!leaveTypeNames.includes(input.leave_type)) {
      throw new Error('Invalid leave type');
    }

    const daysRequested = calculateCalendarDays(input.start_date, input.end_date);
    if (!daysRequested) {
      throw new Error('end_date must be on or after start_date');
    }

    if (input.leave_type === 'Hajj Leave') {
      const [previousHajj] = await sequelize.query<CountRow>(
        `
          SELECT COUNT(*) AS total
          FROM dm_hr_leave_requests
          WHERE employee_id = :employeeId
            AND leave_type = 'Hajj Leave'
            AND status = 'Approved'
        `,
        { replacements: { employeeId: input.employee_id }, type: QueryTypes.SELECT }
      );

      if (Number(previousHajj?.total || 0) > 0) {
        throw new Error('Hajj Leave can be approved only once during employment');
      }
    }

    const leaveId = input.leave_id || crypto.randomUUID();
    const medicalCertificateRequired = input.leave_type === 'Sick Leave' && daysRequested > 3;
    if (medicalCertificateRequired && !input.document_url) {
      throw new Error('Medical certificate is required for sick leave longer than 3 days');
    }

    const recipients = await this.getLeaveWorkflowRecipients(input.employee_id, input.manager_id);
    const managerId = input.manager_id || (recipients.manager?.id ? String(recipients.manager.id) : null);

    await sequelize.query(
      `
        INSERT INTO dm_hr_leave_requests (
          leave_id, employee_id, manager_id, leave_type, start_date, end_date,
          days_requested, status, workflow_status, reason, medical_certificate_required, document_url
        ) VALUES (
          :leaveId, :employeeId, :managerId, :leaveType, :startDate, :endDate,
          :daysRequested, 'Pending', 'Manager Review', :reason, :medicalCertificateRequired, :documentUrl
        )
      `,
      {
        replacements: {
          leaveId,
          employeeId: input.employee_id,
          managerId,
          leaveType: input.leave_type,
          startDate: input.start_date,
          endDate: input.end_date,
          daysRequested,
          reason: input.reason || null,
          medicalCertificateRequired,
          documentUrl: input.document_url || null,
        },
      }
    );

    await this.syncLeaveBalance(input.employee_id, input.leave_type, new Date(input.start_date).getFullYear());
    await this.notifyLeaveUsers({
      userIds: [managerId],
      title: 'Leave request pending manager review',
      message: `${recipients.employee?.name || `Employee ${input.employee_id}`} applied for ${input.leave_type} from ${input.start_date} to ${input.end_date}.`,
      priority: medicalCertificateRequired ? 'high' : 'medium',
    });

    return { leave_id: leaveId, days_requested: daysRequested, medical_certificate_required: medicalCertificateRequired };
  }

  static async reviewLeaveByManager(input: HRLeaveManagerReviewInput) {
    await this.ensureLeaveManagementTables();
    const [leave] = await sequelize.query<{
      employee_id: string;
      manager_id?: string | null;
      leave_type: HRLeaveType;
      start_date: string;
      end_date: string;
    }>(
      `
        SELECT employee_id, manager_id, leave_type, start_date, end_date
        FROM dm_hr_leave_requests
        WHERE leave_id = :leaveId
        LIMIT 1
      `,
      { replacements: { leaveId: input.leave_id }, type: QueryTypes.SELECT }
    );

    if (!leave) throw new Error('Leave request not found');

    const managerId = input.manager_id || leave.manager_id || null;
    await sequelize.query(
      `
        UPDATE dm_hr_leave_requests
        SET
          manager_id = COALESCE(:managerId, manager_id),
          manager_status = :managerStatus,
          manager_reviewed_at = CURRENT_TIMESTAMP,
          manager_comment = :managerComment,
          workflow_status = 'HR Confirmation'
        WHERE leave_id = :leaveId
      `,
      {
        replacements: {
          leaveId: input.leave_id,
          managerId,
          managerStatus: input.manager_status,
          managerComment: input.manager_comment || null,
        },
      }
    );

    const recipients = await this.getLeaveWorkflowRecipients(leave.employee_id, managerId);
    await this.notifyLeaveUsers({
      userIds: [recipients.hr?.id],
      title: 'Leave request pending HR confirmation',
      message: `${recipients.manager?.name || 'Manager'} ${input.manager_status.toLowerCase()} ${leave.leave_type} for ${recipients.employee?.name || `Employee ${leave.employee_id}`}.`,
      priority: input.manager_status === 'Rejected' ? 'high' : 'medium',
    });

    return { leave_id: input.leave_id, manager_status: input.manager_status, workflow_status: 'HR Confirmation' };
  }

  static async reviewLeave(input: HRLeaveReviewInput) {
    await this.ensureLeaveManagementTables();
    const [leave] = await sequelize.query<{
      employee_id: string;
      manager_id?: string | null;
      leave_type: HRLeaveType;
      start_date: string;
      end_date: string;
      manager_status: HRManagerLeaveStatus;
    }>(
      `
        SELECT employee_id, manager_id, leave_type, start_date, end_date, manager_status
        FROM dm_hr_leave_requests
        WHERE leave_id = :leaveId
        LIMIT 1
      `,
      { replacements: { leaveId: input.leave_id }, type: QueryTypes.SELECT }
    );

    if (!leave) throw new Error('Leave request not found');

    const workflowStatus: HRLeaveWorkflowStatus = input.status === 'Cancelled' ? 'Cancelled' : 'Completed';
    const hrStatus = leave.manager_status === 'Rejected' && input.status === 'Approved' ? 'Overridden' : 'Confirmed';

    await sequelize.query(
      `
        UPDATE dm_hr_leave_requests
        SET
          status = :status,
          workflow_status = :workflowStatus,
          hr_status = :hrStatus,
          reviewed_by = :reviewedBy,
          reviewed_at = CURRENT_TIMESTAMP,
          review_notes = :reviewNotes
        WHERE leave_id = :leaveId
      `,
      {
        replacements: {
          leaveId: input.leave_id,
          status: input.status,
          workflowStatus,
          hrStatus,
          reviewedBy: input.reviewed_by || null,
          reviewNotes: input.review_notes || null,
        },
      }
    );

    await this.syncLeaveBalance(leave.employee_id, leave.leave_type, new Date(leave.start_date).getFullYear());
    if (input.status === 'Approved') {
      await this.markAttendanceForApprovedLeave({
        leaveId: input.leave_id,
        employeeId: leave.employee_id,
        startDate: leave.start_date,
        endDate: leave.end_date,
        approvedBy: input.reviewed_by || null,
        leaveType: leave.leave_type,
      });
    }

    const recipients = await this.getLeaveWorkflowRecipients(leave.employee_id, leave.manager_id);
    await this.notifyLeaveUsers({
      userIds: [leave.employee_id],
      title: `Leave request ${input.status.toLowerCase()}`,
      message: `Your ${leave.leave_type} request from ${leave.start_date} to ${leave.end_date} was ${input.status.toLowerCase()} by HR.${hrStatus === 'Overridden' ? ' HR overrode the manager decision.' : ''}`,
      priority: input.status === 'Approved' ? 'medium' : 'high',
    });
    await this.notifyLeaveUsers({
      userIds: [leave.manager_id, recipients.hr?.id],
      title: `Leave workflow ${input.status.toLowerCase()}`,
      message: `${recipients.employee?.name || `Employee ${leave.employee_id}`} leave request is now ${input.status.toLowerCase()} by HR.`,
      priority: 'medium',
    });

    return { leave_id: input.leave_id, status: input.status };
  }

  private static async markAttendanceForApprovedLeave(input: {
    leaveId: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    approvedBy?: string | null;
    leaveType: HRLeaveType;
  }) {
    await this.ensureAttendanceRecordTable();
    for (const date of eachDate(input.startDate, input.endDate)) {
      const [existing] = await sequelize.query<{ attendance_id: string }>(
        `
          SELECT attendance_id
          FROM dm_hr_attendance_records
          WHERE employee_id = :employeeId AND date = :date
          LIMIT 1
        `,
        { replacements: { employeeId: input.employeeId, date }, type: QueryTypes.SELECT }
      );

      if (existing) {
        await sequelize.query(
          `
            UPDATE dm_hr_attendance_records
            SET
              status = 'Leave',
              source = 'Manual',
              notes = :notes,
              approved_by = :approvedBy,
              check_in = NULL,
              check_out = NULL,
              overtime_hours = 0
            WHERE attendance_id = :attendanceId
          `,
          {
            replacements: {
              attendanceId: existing.attendance_id,
              approvedBy: input.approvedBy || null,
              notes: `${input.leaveType} approved via leave request ${input.leaveId}`,
            },
          }
        );
      } else {
        await this.createAttendanceRecord({
          employee_id: input.employeeId,
          date,
          status: 'Leave',
          source: 'Manual',
          notes: `${input.leaveType} approved via leave request ${input.leaveId}`,
          approved_by: input.approvedBy || null,
          overtime_hours: 0,
        });
      }
    }
  }

  static async ensureEmployeeCoreColumns() {
    await this.ensureWorkforceDashboardTables();
  }

  private static employeePayload(input: EmployeeCoreInput, fallbackStatus = 1) {
    const workLocation = employeeWorkLocations.includes(input.work_location as typeof employeeWorkLocations[number])
      ? input.work_location
      : 'Onshore';
    const employmentType = employeeEmploymentTypes.includes(input.employment_type as typeof employeeEmploymentTypes[number])
      ? input.employment_type
      : 'Full-time';

    return {
      name: String(input.name || '').trim(),
      email: input.email || null,
      cemail: input.cemail || null,
      mobile: input.mobile || null,
      cmobile: input.cmobile || null,
      paddress: input.paddress || null,
      address: input.address || null,
      photo: input.photo || null,
      dob: dateOrNull(input.dob),
      role: nullableNumber(input.role),
      vendor_id: nullableNumber(input.vendor_id) || 0,
      branch: nullableNumber(input.branch),
      region: nullableNumber(input.region),
      username: input.username || null,
      password: input.password || null,
      status: employeeStatus(input.status, fallbackStatus),
      ppNo: input.ppNo || null,
      visaExp: dateOrNull(input.visaExp),
      department: nullableNumber(input.department),
      EID: input.EID || null,
      doj: dateOrNull(input.doj) || new Date().toISOString().slice(0, 10),
      nationality: input.nationality || null,
      dol: dateOrNull(input.dol),
      remark: input.remark || null,
      labexp: dateOrNull(input.labexp),
      bounce: nullableNumber(input.bounce),
      em_local_name: input.em_local_name || null,
      em_home_name: input.em_home_name || null,
      em_local_number: input.em_local_number || null,
      em_home_number: input.em_home_number || null,
      religion: input.religion || '',
      gender: input.gender || '',
      crea: nullableNumber(input.crea) || 1,
      wfh: input.wfh ?? (workLocation === 'Onshore' ? 0 : 1),
      work_location: workLocation,
      work_country: input.work_country || (workLocation === 'Onshore' ? 'UAE' : null),
      work_city: input.work_city || null,
      work_site: input.work_site || null,
      employment_type: employmentType,
    };
  }

  static async syncEmployeeGovernmentSummary(employeeId: string | number) {
    await this.ensureEmployeeCoreColumns();
    await sequelize.query(
      `
        UPDATE dm_employee e
        JOIN dm_pro_employee_immigration p ON CAST(p.employee_id AS CHAR) = CAST(e.id AS CHAR)
        SET
          e.visaExp = COALESCE(p.visa_expiry_date, e.visaExp),
          e.labexp = COALESCE(CAST(p.labour_card_expiry AS CHAR), e.labexp),
          e.remark = TRIM(CONCAT(COALESCE(e.remark, ''), CASE WHEN COALESCE(e.remark, '') = '' THEN '' ELSE '\n' END, 'PRO sync: ', p.visa_status, ' visa / labour records updated ', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i')))
        WHERE CAST(e.id AS CHAR) = :employeeId
      `,
      { replacements: { employeeId: String(employeeId) } }
    ).catch((error) => {
      const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
      if (!message.includes('dm_pro_employee_immigration')) throw error;
    });
  }

  static async listEmployees(options: number | {
    limit?: number;
    page?: number;
    search?: string;
    department?: string;
    status?: string;
    workLocation?: string;
    employmentType?: string;
  } = 100) {
    await this.ensureEmployeeCoreColumns();
    const params = typeof options === 'number' ? { limit: options } : options;
    const limit = Math.max(1, Math.min(Number(params.limit || 100), 500));
    const page = Math.max(1, Number(params.page || 1));
    const conditions: string[] = [];
    const replacements: Record<string, string | number> = { limit, offset: (page - 1) * limit };

    if (params.search) {
      conditions.push('(e.name LIKE :search OR e.email LIKE :search OR e.username LIKE :search OR e.EID LIKE :search OR e.mobile LIKE :search)');
      replacements.search = `%${params.search}%`;
    }
    if (params.department) {
      const departmentId = Number.parseInt(params.department, 10);
      if (Number.isFinite(departmentId)) {
        conditions.push('e.department = :departmentId');
        replacements.departmentId = departmentId;
      } else {
        conditions.push('LOWER(COALESCE(d.name, "")) = LOWER(:departmentName)');
        replacements.departmentName = params.department;
      }
    }
    if (params.status !== undefined && params.status !== '') {
      conditions.push('e.status = :status');
      replacements.status = employeeStatus(params.status, 1);
    }
    if (params.workLocation) {
      conditions.push('e.work_location = :workLocation');
      replacements.workLocation = params.workLocation;
    }
    if (params.employmentType) {
      conditions.push('e.employment_type = :employmentType');
      replacements.employmentType = params.employmentType;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [count] = await sequelize.query<{ total: number }>(
      `
        SELECT COUNT(*) AS total
        FROM dm_employee e
        LEFT JOIN dm_department d ON d.id = e.department
        ${where}
      `,
      { replacements, type: QueryTypes.SELECT }
    );
    const [summary] = await sequelize.query<{ total: number; active: number; inactive: number; missingVisaDates: number; departments: number }>(
      `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN e.status = 1 THEN 1 ELSE 0 END) AS active,
          SUM(CASE WHEN e.status <> 1 THEN 1 ELSE 0 END) AS inactive,
          SUM(CASE WHEN e.visaExp IS NULL OR e.visaExp = '' THEN 1 ELSE 0 END) AS missingVisaDates,
          COUNT(DISTINCT COALESCE(e.department, 0)) AS departments
        FROM dm_employee e
        LEFT JOIN dm_department d ON d.id = e.department
        ${where}
      `,
      { replacements, type: QueryTypes.SELECT }
    );
    const data = await sequelize.query(
      `
        SELECT
          e.id, e.name, e.email, e.mobile, e.cemail, e.cmobile, e.department,
          d.name AS departmentName, e.role, e.branch, e.region, e.status,
          e.EID, e.doj, e.dol, e.nationality, e.gender, e.ppNo, e.visaExp,
          e.labexp, e.address, e.paddress, e.wfh, e.work_location, e.work_country,
          e.work_city, e.work_site, e.employment_type,
          p.pro_emp_id AS proEmpId, p.visa_uid AS visaUid, p.visa_type AS visaType,
          p.visa_status AS visaStatus, p.labour_card_no AS labourCardNo,
          p.labour_card_expiry AS labourCardExpiry, p.insurance_expiry AS insuranceExpiry
        FROM dm_employee e
        LEFT JOIN dm_department d ON d.id = e.department
        LEFT JOIN dm_pro_employee_immigration p ON CAST(p.employee_id AS CHAR) = CAST(e.id AS CHAR)
        ${where}
        ORDER BY e.id DESC
        LIMIT :limit OFFSET :offset
      `,
      { replacements, type: QueryTypes.SELECT }
    );

    return {
      data,
      summary: {
        total: numberValue(summary?.total),
        active: numberValue(summary?.active),
        inactive: numberValue(summary?.inactive),
        missingVisaDates: numberValue(summary?.missingVisaDates),
        departments: numberValue(summary?.departments),
      },
      pagination: { page, limit, total: numberValue(count?.total), totalPages: Math.ceil(numberValue(count?.total) / limit) },
    };
  }

  static async createEmployee(input: EmployeeCoreInput) {
    await this.ensureEmployeeCoreColumns();
    const payload = this.employeePayload(input, 1);
    if (!payload.name) throw new Error('Employee name is required');

    const [, metadata] = await sequelize.query(
      `
        INSERT INTO dm_employee (
          name, email, cemail, mobile, cmobile, paddress, address, photo, dob,
          role, vendor_id, branch, region, username, password, status, ppNo,
          visaExp, department, EID, doj, nationality, dol, remark, labexp,
          bounce, em_local_name, em_home_name, em_local_number, em_home_number,
          religion, gender, crea, wfh, work_location, work_country, work_city,
          work_site, employment_type
        ) VALUES (
          :name, :email, :cemail, :mobile, :cmobile, :paddress, :address, :photo, :dob,
          :role, :vendor_id, :branch, :region, :username, :password, :status, :ppNo,
          :visaExp, :department, :EID, :doj, :nationality, :dol, :remark, :labexp,
          :bounce, :em_local_name, :em_home_name, :em_local_number, :em_home_number,
          :religion, :gender, :crea, :wfh, :work_location, :work_country, :work_city,
          :work_site, :employment_type
        )
      `,
      { replacements: payload }
    );

    const employeeId = (metadata as { insertId?: number }).insertId;
    return this.getEmployeeById(employeeId);
  }

  static async updateEmployee(input: EmployeeCoreInput & { id: number }) {
    await this.ensureEmployeeCoreColumns();
    const payload = this.employeePayload(input, employeeStatus(input.status, 1));

    await sequelize.query(
      `
        UPDATE dm_employee
        SET
          name = COALESCE(:name, name),
          email = :email,
          cemail = :cemail,
          mobile = :mobile,
          cmobile = :cmobile,
          paddress = :paddress,
          address = :address,
          photo = :photo,
          dob = :dob,
          role = :role,
          vendor_id = :vendor_id,
          branch = :branch,
          region = :region,
          username = :username,
          password = COALESCE(:password, password),
          status = :status,
          ppNo = :ppNo,
          visaExp = :visaExp,
          department = :department,
          EID = :EID,
          doj = :doj,
          nationality = :nationality,
          dol = :dol,
          remark = :remark,
          labexp = :labexp,
          bounce = :bounce,
          em_local_name = :em_local_name,
          em_home_name = :em_home_name,
          em_local_number = :em_local_number,
          em_home_number = :em_home_number,
          religion = :religion,
          gender = :gender,
          crea = :crea,
          wfh = :wfh,
          work_location = :work_location,
          work_country = :work_country,
          work_city = :work_city,
          work_site = :work_site,
          employment_type = :employment_type
        WHERE id = :id
      `,
      { replacements: { ...payload, id: input.id } }
    );

    await this.syncEmployeeGovernmentSummary(input.id);
    return this.getEmployeeById(input.id);
  }

  static async softDeleteEmployee(id: number) {
    await this.ensureEmployeeCoreColumns();
    await sequelize.query(
      `
        UPDATE dm_employee
        SET status = 0, dol = COALESCE(dol, CURRENT_DATE())
        WHERE id = :id
      `,
      { replacements: { id } }
    );
    return { id, status: 0 };
  }

  static async getEmployeeById(id?: number | null) {
    if (!id) return null;
    await this.ensureEmployeeCoreColumns();
    const [employee] = await sequelize.query(
      `
        SELECT
          e.id, e.name, e.email, e.mobile, e.cemail, e.cmobile, e.department,
          d.name AS departmentName, e.role, e.branch, e.region, e.status,
          e.EID, e.doj, e.dol, e.nationality, e.gender, e.ppNo, e.visaExp,
          e.labexp, e.address, e.paddress, e.wfh, e.work_location, e.work_country,
          e.work_city, e.work_site, e.employment_type,
          p.pro_emp_id AS proEmpId, p.visa_uid AS visaUid, p.visa_type AS visaType,
          p.visa_status AS visaStatus, p.labour_card_no AS labourCardNo,
          p.labour_card_expiry AS labourCardExpiry, p.insurance_expiry AS insuranceExpiry
        FROM dm_employee e
        LEFT JOIN dm_department d ON d.id = e.department
        LEFT JOIN dm_pro_employee_immigration p ON CAST(p.employee_id AS CHAR) = CAST(e.id AS CHAR)
        WHERE e.id = :id
        LIMIT 1
      `,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    return employee || null;
  }

  static async getAttendanceSummary() {
    await this.ensureAttendanceRecordTable();
    const [summary] = await sequelize.query<PayrollRow>(
      `
        SELECT
          COUNT(*) AS attendanceRecords,
          COUNT(DISTINCT employee_id) AS employeesWithAttendance,
          0 AS totalHours,
          SUM(CASE WHEN status IN ('Absent', 'Half-Day') THEN 1 ELSE 0 END) AS shortfallHours,
          SUM(COALESCE(overtime_hours, 0)) AS overtimeHours
        FROM dm_hr_attendance_records
        WHERE date >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      `,
      { type: QueryTypes.SELECT }
    );

    return summary;
  }

  static async listLeaveRequests(limit = 100) {
    return sequelize.query(
      `
        SELECT l.*, e.name AS employeeName
        FROM dm_leave_history l
        LEFT JOIN dm_employee e ON e.id = l.custId
        ORDER BY l.id DESC
        LIMIT :limit
      `,
      { replacements: { limit }, type: QueryTypes.SELECT }
    );
  }

  static async getPayrollStatus() {
    const dashboard = await this.getDashboardData();
    return dashboard.payrollStatus;
  }

  static buildLetter(type: 'experience' | 'relieving', employee: { name: string; department?: string; joiningDate?: string; exitDate?: string }) {
    const title = type === 'experience' ? 'Experience Letter' : 'Relieving Letter';
    return {
      title,
      body: `This is to certify that ${employee.name} was employed with DM Immigration${employee.department ? ` in ${employee.department}` : ''}${employee.joiningDate ? ` from ${employee.joiningDate}` : ''}${employee.exitDate ? ` until ${employee.exitDate}` : ''}.`,
    };
  }

  static async getExitPipeline() {
    const dashboard = await this.getDashboardData();
    return dashboard.exitPipelineAttrition;
  }

  static async ensureWorkforceDashboardTables() {
    await this.addColumnIfMissing('dm_employee', 'work_location', "ENUM('Onshore', 'Offshore', 'Remote-UAE', 'GCC-Branch') NOT NULL DEFAULT 'Onshore'");
    await this.addColumnIfMissing('dm_employee', 'work_country', "VARCHAR(255) NULL DEFAULT 'UAE'");
    await this.addColumnIfMissing('dm_employee', 'work_city', 'VARCHAR(255) NULL');
    await this.addColumnIfMissing('dm_employee', 'work_site', 'VARCHAR(255) NULL');
    await this.addColumnIfMissing('dm_employee', 'employment_type', "ENUM('Full-time', 'Contract', 'Freelance', 'Part-time') NOT NULL DEFAULT 'Full-time'");

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS dm_hr_headcount_snapshots (
        snapshot_id CHAR(36) PRIMARY KEY,
        snapshot_date DATE NOT NULL,
        snapshot_month DATE NOT NULL,
        total INT NOT NULL DEFAULT 0,
        active INT NOT NULL DEFAULT 0,
        inactive INT NOT NULL DEFAULT 0,
        on_leave INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_hr_headcount_snapshot_month (snapshot_month),
        INDEX idx_hr_headcount_snapshot_date (snapshot_date)
      )
    `);
  }

  static async getDashboardData() {
    await this.ensureWorkforceDashboardTables();
    await this.ensureAttendanceRecordTable();
    await this.ensureLeaveManagementTables();
    await this.ensureEOSBSettlementTable();
    const [workforce] = await sequelize.query<WorkforceRow>(
      `
        SELECT
          COUNT(*) AS totalEmployees,
          SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS activeEmployees,
          SUM(CASE WHEN status <> 1 THEN 1 ELSE 0 END) AS inactiveEmployees,
          SUM(CASE WHEN active_leave.leave_id IS NOT NULL THEN 1 ELSE 0 END) AS onLeaveEmployees,
          SUM(CASE WHEN COALESCE(work_location, CASE WHEN COALESCE(wfh, 0) = 1 THEN 'Offshore' ELSE 'Onshore' END) = 'Onshore' THEN 1 ELSE 0 END) AS onshoreEmployees,
          SUM(CASE WHEN COALESCE(work_location, CASE WHEN COALESCE(wfh, 0) = 1 THEN 'Offshore' ELSE 'Onshore' END) <> 'Onshore' THEN 1 ELSE 0 END) AS offshoreEmployees,
          SUM(CASE WHEN doj IS NULL THEN 1 ELSE 0 END) AS missingJoiningDate
        FROM dm_employee
        LEFT JOIN (
          SELECT employee_id, MIN(leave_id) AS leave_id
          FROM dm_hr_leave_requests
          WHERE status = 'Approved'
            AND CURRENT_DATE() BETWEEN start_date AND end_date
          GROUP BY employee_id
        ) active_leave ON CAST(active_leave.employee_id AS CHAR) = CAST(dm_employee.id AS CHAR)
      `,
      { type: QueryTypes.SELECT }
    );

    const activeEmployees = numberValue(workforce?.activeEmployees);
    const inactiveEmployees = numberValue(workforce?.inactiveEmployees);
    const onLeaveEmployees = numberValue(workforce?.onLeaveEmployees);
    const totalEmployees = numberValue(workforce?.totalEmployees);

    await sequelize.query(
      `
        INSERT INTO dm_hr_headcount_snapshots (
          snapshot_id, snapshot_date, snapshot_month, total, active, inactive, on_leave
        ) VALUES (
          UUID(), CURRENT_DATE(), DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01'), :total, :active, :inactive, :onLeave
        )
        ON DUPLICATE KEY UPDATE
          snapshot_date = VALUES(snapshot_date),
          total = VALUES(total),
          active = VALUES(active),
          inactive = VALUES(inactive),
          on_leave = VALUES(on_leave)
      `,
      {
        replacements: {
          total: totalEmployees,
          active: activeEmployees,
          inactive: inactiveEmployees,
          onLeave: onLeaveEmployees,
        },
      }
    );

    const [previousSnapshot] = await sequelize.query<{
      total: number;
      active: number;
      inactive: number;
      on_leave: number;
    }>(
      `
        SELECT total, active, inactive, on_leave
        FROM dm_hr_headcount_snapshots
        WHERE snapshot_month = DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
        LIMIT 1
      `,
      { type: QueryTypes.SELECT }
    );

    const workLocationBreakdown = await sequelize.query<WorkLocationRow>(
      `
        SELECT
          COALESCE(work_location, CASE WHEN COALESCE(wfh, 0) = 1 THEN 'Offshore' ELSE 'Onshore' END) AS workLocation,
          COUNT(*) AS headcount
        FROM dm_employee
        WHERE status = 1
        GROUP BY COALESCE(work_location, CASE WHEN COALESCE(wfh, 0) = 1 THEN 'Offshore' ELSE 'Onshore' END)
        ORDER BY headcount DESC
      `,
      { type: QueryTypes.SELECT }
    );

    const departments = await sequelize.query<DepartmentRow>(
      `
        SELECT
          e.department AS departmentId,
          COALESCE(d.name, 'Unassigned') AS departmentName,
          SUM(CASE WHEN e.status = 1 THEN 1 ELSE 0 END) AS total,
          SUM(CASE WHEN e.status = 1 THEN 1 ELSE 0 END) AS active,
          SUM(CASE WHEN e.status = 1 AND COALESCE(e.work_location, CASE WHEN COALESCE(e.wfh, 0) = 1 THEN 'Offshore' ELSE 'Onshore' END) <> 'Onshore' THEN 1 ELSE 0 END) AS offshore,
          SUM(CASE WHEN e.status = 1 AND COALESCE(e.employment_type, 'Full-time') = 'Full-time' THEN 1 ELSE 0 END) AS fullTime,
          SUM(CASE WHEN e.status = 1 AND COALESCE(e.employment_type, 'Full-time') = 'Contract' THEN 1 ELSE 0 END) AS contract,
          SUM(CASE WHEN e.status = 1 AND COALESCE(e.employment_type, 'Full-time') = 'Freelance' THEN 1 ELSE 0 END) AS freelance,
          SUM(CASE WHEN e.status = 1 AND COALESCE(e.employment_type, 'Full-time') = 'Part-time' THEN 1 ELSE 0 END) AS partTime
        FROM dm_employee e
        LEFT JOIN dm_department d ON d.id = e.department
        GROUP BY e.department, d.name
        ORDER BY total DESC
      `,
      { type: QueryTypes.SELECT }
    );

    const [payroll] = await sequelize.query<PayrollRow>(
      `
        SELECT
          COUNT(*) AS attendanceRecords,
          COUNT(DISTINCT employee_id) AS employeesWithAttendance,
          0 AS totalHours,
          SUM(CASE WHEN status IN ('Absent', 'Half-Day') THEN 1 ELSE 0 END) AS shortfallHours,
          SUM(COALESCE(overtime_hours, 0)) AS overtimeHours
        FROM dm_hr_attendance_records
        WHERE date >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
      `,
      { type: QueryTypes.SELECT }
    );

    const [exits] = await sequelize.query<ExitRow>(
      `
        SELECT
          SUM(CASE WHEN dol IS NOT NULL AND dol <> '' THEN 1 ELSE 0 END) AS exitCount,
          SUM(CASE WHEN status <> 1 THEN 1 ELSE 0 END) AS activeExitPipeline,
          (
            SELECT COUNT(*)
            FROM dm_hr_eosb_settlements
            WHERE last_working_day >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
              AND last_working_day < DATE_ADD(DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
          ) AS exitsThisMonth,
          (
            SELECT COUNT(*)
            FROM dm_hr_eosb_settlements
            WHERE last_working_day >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
              AND last_working_day < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
          ) AS exitsLastMonth
        FROM dm_employee
      `,
      { type: QueryTypes.SELECT }
    );

    const [hiring] = await sequelize.query<HiringRow>(
      `
        SELECT
          SUM(CASE WHEN doj >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01') THEN 1 ELSE 0 END) AS joinedThisMonth,
          SUM(CASE
            WHEN doj >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
             AND doj < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
            THEN 1 ELSE 0 END
          ) AS joinedPreviousMonth,
          SUM(CASE
            WHEN doj >= DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m-01')
             AND doj < DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')
            THEN 1 ELSE 0 END
          ) AS joinedLastMonth,
          SUM(CASE WHEN YEAR(doj) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) AS joinedThisYear
        FROM dm_employee
      `,
      { type: QueryTypes.SELECT }
    );

    const recentJoiners = await sequelize.query(
      `
        SELECT id, name, EID, doj, department, status
        FROM dm_employee
        WHERE doj IS NOT NULL
        ORDER BY doj DESC
        LIMIT 8
      `,
      { type: QueryTypes.SELECT }
    );

    const [leaveCount] = await sequelize.query<CountRow>(
      `
        SELECT COUNT(*) AS total
        FROM dm_hr_leave_requests
        WHERE status = 'Pending'
      `,
      { type: QueryTypes.SELECT }
    );

    const employeesWithAttendance = numberValue(payroll?.employeesWithAttendance);
    const payrollCoverage = activeEmployees ? Math.round((employeesWithAttendance / activeEmployees) * 100) : 0;
    const attritionRate = totalEmployees ? Number(((inactiveEmployees / totalEmployees) * 100).toFixed(1)) : 0;
    const joinedThisMonth = numberValue(hiring?.joinedThisMonth);
    const joinedPreviousMonth = numberValue(hiring?.joinedPreviousMonth ?? hiring?.joinedLastMonth);
    const exitsThisMonth = numberValue(exits?.exitsThisMonth);
    const exitsLastMonth = numberValue(exits?.exitsLastMonth);
    const departmentBreakdown = ['Sales', 'Operations', 'Admin', 'Freelancers', 'Management', 'Other']
      .map((departmentName) => {
        const existing = departments.find((department) => (department.departmentName || '').toLowerCase() === departmentName.toLowerCase());
        return existing || {
          departmentId: null,
          departmentName,
          total: 0,
          active: 0,
          offshore: 0,
          fullTime: 0,
          contract: 0,
          freelance: 0,
          partTime: 0,
        };
      })
      .concat(
        departments.filter((department) => !['Sales', 'Operations', 'Admin', 'Freelancers', 'Management', 'Other']
          .some((departmentName) => (department.departmentName || '').toLowerCase() === departmentName.toLowerCase()))
      );

    return {
      workforceStrength: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        onLeaveEmployees,
        missingJoiningDate: numberValue(workforce?.missingJoiningDate),
        kpis: {
          totalActiveEmployees: {
            value: activeEmployees,
            delta: delta(activeEmployees, numberValue(previousSnapshot?.active)),
            href: '/admin/hr/employee-data-sheet?status=Active',
          } satisfies WorkforceKpi,
          statusBreakdown: {
            active: activeEmployees,
            inactive: inactiveEmployees,
            onLeave: onLeaveEmployees,
            delta: delta(totalEmployees, numberValue(previousSnapshot?.total)),
            href: '/admin/hr/employee-data-sheet',
          },
          newJoinersThisMonth: {
            value: joinedThisMonth,
            delta: delta(joinedThisMonth, joinedPreviousMonth),
            href: '/admin/hr/employee-data-sheet?joining=this-month',
          } satisfies WorkforceKpi,
          exitsThisMonth: {
            value: exitsThisMonth,
            delta: delta(exitsThisMonth, exitsLastMonth),
            href: '/admin/hr/eosb?last_working_day=this-month',
          } satisfies WorkforceKpi,
        },
      },
      onshoreOffshore: {
        onshoreEmployees: numberValue(workforce?.onshoreEmployees),
        offshoreEmployees: numberValue(workforce?.offshoreEmployees),
        total: workLocationBreakdown.reduce((sum, item) => sum + numberValue(item.headcount), 0),
        segments: workLocationBreakdown.map((item) => ({
          workLocation: item.workLocation || 'Onshore',
          headcount: numberValue(item.headcount),
        })),
      },
      departmentBreakdown: departmentBreakdown.map((department) => ({
        departmentId: department.departmentId,
        departmentName: department.departmentName || 'Unassigned',
        total: numberValue(department.total),
        active: numberValue(department.active),
        offshore: numberValue(department.offshore),
        fullTime: numberValue(department.fullTime),
        contract: numberValue(department.contract),
        freelance: numberValue(department.freelance),
        partTime: numberValue(department.partTime),
      })),
      payrollStatus: {
        month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        status: payrollCoverage >= 90 ? 'Ready' : payrollCoverage >= 60 ? 'Review' : 'Pending',
        coveragePercent: payrollCoverage,
        attendanceRecords: numberValue(payroll?.attendanceRecords),
        employeesWithAttendance,
        totalHours: numberValue(payroll?.totalHours),
        shortfallHours: numberValue(payroll?.shortfallHours),
        overtimeHours: numberValue(payroll?.overtimeHours),
      },
      exitPipelineAttrition: {
        exitCount: numberValue(exits?.exitCount),
        activeExitPipeline: numberValue(exits?.activeExitPipeline),
        exitsThisMonth,
        attritionRate,
        pendingLeaveRequests: numberValue(leaveCount?.total),
      },
      hiringDynamics: {
        joinedThisMonth,
        joinedLastMonth: joinedPreviousMonth,
        joinedThisYear: numberValue(hiring?.joinedThisYear),
        recentJoiners,
      },
      apiAndDbQueries: {
        endpoint: '/api/admin/hr/dashboard',
        sourceTables: ['dm_employee', 'dm_department', 'dm_hr_headcount_snapshots', 'dm_hr_attendance_records', 'dm_hr_leave_requests', 'dm_hr_leave_balances', 'dm_hr_eosb_settlements'],
        sections: ['11.1', '11.2', '11.3', '11.4', '11.5', '11.6', '11.7'],
      },
    };
  }
}
