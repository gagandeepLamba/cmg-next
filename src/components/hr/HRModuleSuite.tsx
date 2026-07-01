'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  BadgeCheck,
  Banknote,
  CalendarCheck,
  ClipboardCheck,
  Download,
  FileBadge,
  FileText,
  MessageSquareText,
  Plus,
  Printer,
  Search,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type ModuleKey =
  | 'employee-data-sheet'
  | 'attendance-management'
  | 'leave-management'
  | 'payroll-management'
  | 'eosb'
  | 'payslip-generation'
  | 'exit-checklist'
  | 'letters'
  | 'exit-interview';

type Employee = {
  id: number;
  name: string;
  email?: string | null;
  mobile?: string | null;
  department?: number | null;
  role?: number | null;
  branch?: number | null;
  status: number;
  EID?: string | null;
  doj?: string | null;
  dol?: string | null;
  nationality?: string | null;
  gender?: string | null;
  ppNo?: string | null;
  visaExp?: string | null;
  address?: string | null;
};

type AttendanceRecord = {
  attendance_id: string;
  employee_id: string;
  employee_name?: string | null;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'Leave' | 'Holiday';
  overtime_hours?: number | string | null;
  source: 'Manual' | 'Biometric' | 'Import';
  notes?: string | null;
  approved_by?: string | null;
  approved_by_name?: string | null;
};

type LeaveRecord = {
  leave_id: string;
  employee_id: string;
  employee_name?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days_requested: number | string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  workflow_status?: 'Manager Review' | 'HR Confirmation' | 'Completed' | 'Cancelled';
  reason?: string | null;
  medical_certificate_required?: boolean | number;
  document_url?: string | null;
  applied_at: string;
  manager_status?: 'Pending' | 'Approved' | 'Rejected';
  manager_reviewed_at?: string | null;
  manager_comment?: string | null;
  hr_status?: 'Pending' | 'Confirmed' | 'Overridden';
  reviewed_by?: string | null;
  reviewed_by_name?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
};

type LeaveType =
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Maternity Leave'
  | 'Paternity Leave'
  | 'Hajj Leave'
  | 'Bereavement Leave'
  | 'Unpaid Leave'
  | 'Compensatory Leave';

type LeaveEntitlement = {
  type: LeaveType;
  entitlementDays: number;
  category: string;
  notes: string;
};

type LeaveBalance = {
  balance_id: string;
  employee_id: string;
  leave_type: LeaveType;
  year: number;
  entitlement_days: number | string;
  used_days: number | string;
  pending_days: number | string;
  remaining_days: number | string;
};
type SeparationReason = 'Resignation' | 'Termination' | 'Retirement' | 'Death' | 'Mutual';
type EOSBSettlement = {
  eosb_id?: string;
  employee_id: string;
  employee_name?: string | null;
  joining_date: string;
  last_working_day: string;
  years_of_service: number | string;
  separation_reason: SeparationReason;
  last_basic_salary: number | string;
  eosb_amount: number | string;
  leave_balance_days: number | string;
  leave_encashment: number | string;
  unpaid_salary: number | string;
  total_payable: number | string;
  gratuity_days?: number | string;
  rule_applied?: string;
  approved_by?: string | null;
  approved_by_name?: string | null;
  settlement_date?: string | null;
  notes?: string | null;
};
type EmployeeSummary = {
  total: number;
  active: number;
  inactive: number;
  missingVisaDates: number;
  departments: number;
};
type PayslipRecord = {
  payslip_id: string;
  employee_id: string;
  employee_name?: string | null;
  pay_period: string;
  basic_salary: number | string;
  overtime_hours: number | string;
  overtime_amount: number | string;
  gross_salary: number | string;
  net_salary: number | string;
  bank_name?: string | null;
  masked_iban?: string | null;
  ytd_earnings: number | string;
  signed_url: string;
  signed_url_expires_at: string;
  generated_at: string;
};
type ExitChecklistRecord = {
  checklist_id: string;
  employee_id: string;
  employee_name?: string | null;
  separation_reason?: string | null;
  last_working_day?: string | null;
  status: 'Open' | 'Completed' | 'Cancelled';
  total_items: number | string;
  completed_items: number | string;
  waived_items: number | string;
  pending_items: number | string;
};
type ExitChecklistItem = {
  item_id: string;
  checklist_id: string;
  employee_id: string;
  department: string;
  item_text: string;
  owner_role: string;
  status: 'Pending' | 'Completed' | 'Waived';
  completed_by?: string | null;
  completed_by_name?: string | null;
  completed_at?: string | null;
  notes?: string | null;
  sort_order: number;
};
type LetterRecord = {
  letter_id: string;
  employee_id: string;
  employee_name?: string | null;
  letter_type: 'relieving' | 'experience';
  template_name?: string | null;
  ref_number: string;
  issue_date: string;
  last_working_day: string;
  designation?: string | null;
  department?: string | null;
  signed_url: string;
  signed_url_expires_at: string;
  generated_by_name?: string | null;
  generated_at: string;
};
type LetterTemplate = {
  template_id: string;
  letter_type: 'relieving' | 'experience';
  template_name: string;
  body_template: string;
  is_active: boolean | number;
};
type ExitInterviewRecord = {
  exit_id: string;
  employee_id: string;
  employee_name?: string | null;
  interview_date: string;
  conducted_by: string;
  conducted_by_name?: string | null;
  reason_leaving: ExitReasonLeaving;
  reason_details?: string | null;
  job_satisfaction: number | string;
  mgmt_satisfaction: number | string;
  work_env_rating: number | string;
  compensation_rating: number | string;
  growth_rating: number | string;
  recommend_company: boolean | number;
  rehire_eligible: boolean | number;
  feedback_text?: string | null;
  suggestions?: string | null;
  confidential: boolean | number;
};
type ExitReasonLeaving = 'Better Opportunity' | 'Salary' | 'Relocation' | 'Personal' | 'Termination' | 'Other';
type ExitInterviewAnalytics = {
  total: number;
  reasonBreakdown: Array<{ reason: ExitReasonLeaving; total: number }>;
  averages: {
    jobSatisfaction: number;
    management: number;
    workEnvironment: number;
    compensation: number;
    growth: number;
  };
  recommendPercent: number;
  rehireEligiblePercent: number;
};

const modules: Array<{
  key: ModuleKey;
  number: string;
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { key: 'employee-data-sheet', number: '4.1', title: 'Employee Data Sheet', description: 'Employee profile, joining, visa, contact, and emergency records.', href: '/admin/hr/employee-data-sheet', icon: Users },
  { key: 'attendance-management', number: '4.2', title: 'Attendance Management', description: 'Daily check-ins, total hours, shortfall, and overtime review.', href: '/admin/hr/attendance-management', icon: CalendarCheck },
  { key: 'leave-management', number: '4.3', title: 'Leave Management', description: 'Leave applications, approval status, balances, and history.', href: '/admin/hr/leave-management', icon: ClipboardCheck },
  { key: 'payroll-management', number: '4.4', title: 'Payroll Management', description: 'Salary components, deductions, net pay, and payroll approval.', href: '/admin/hr/payroll-management', icon: Banknote },
  { key: 'eosb', number: '4.5', title: 'End of Service Benefit (EOSB)', description: 'Gratuity estimate, tenure, final settlement, and exit dues.', href: '/admin/hr/eosb', icon: BadgeCheck },
  { key: 'payslip-generation', number: '4.6', title: 'Payslip Generation', description: 'Generate monthly payslips and export printable statements.', href: '/admin/hr/payslip-generation', icon: FileText },
  { key: 'exit-checklist', number: '4.7', title: 'Exit Checklist', description: 'Asset handover, access removal, finance clearance, and approvals.', href: '/admin/hr/exit-checklist', icon: UserCheck },
  { key: 'letters', number: '4.8', title: 'Relieving & Experience Letters', description: 'Draft HR letters with employee, role, tenure, and branch details.', href: '/admin/hr/letters', icon: FileBadge },
  { key: 'exit-interview', number: '4.9', title: 'Exit Interview & Feedback', description: 'Capture reasons, ratings, retention signals, and feedback notes.', href: '/admin/hr/exit-interview', icon: MessageSquareText },
];

const leaveTypeOptions: LeaveType[] = [
  'Annual Leave',
  'Sick Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Hajj Leave',
  'Bereavement Leave',
  'Unpaid Leave',
  'Compensatory Leave',
];
const separationReasons: SeparationReason[] = ['Resignation', 'Termination', 'Retirement', 'Death', 'Mutual'];
const exitLeavingReasons: ExitReasonLeaving[] = ['Better Opportunity', 'Salary', 'Relocation', 'Personal', 'Termination', 'Other'];

const formatDate = (value?: string | null) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatMoney = (value: number) => (
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value)
);

const yearsBetween = (start?: string | null, end = new Date()) => {
  if (!start) return 0;
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return 0;
  return Math.max(0, (end.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
};

const estimateEOSB = (monthlyBasicSalary: number, yearsOfService: number, separationReason: SeparationReason = 'Termination') => {
  if (yearsOfService < 1) return 0;
  const dailyRate = monthlyBasicSalary / 30;
  let gratuityDays = 0;

  if (separationReason === 'Resignation') {
    if (yearsOfService < 3) gratuityDays = 21 * yearsOfService * (1 / 3);
    else if (yearsOfService < 5) gratuityDays = 21 * yearsOfService * (2 / 3);
    else gratuityDays = 21 * 5 + 30 * (yearsOfService - 5);
  } else if (yearsOfService <= 5) {
    gratuityDays = 21 * yearsOfService;
  } else {
    gratuityDays = 21 * 5 + 30 * (yearsOfService - 5);
  }

  return Math.round(dailyRate * gratuityDays);
};

const departmentName = (department?: number | null) => {
  if (department === 1) return 'Sales';
  if (department === 2) return 'Operations';
  if (department === 3) return 'Admin';
  return 'Unassigned';
};

const statusBadge = (status: string) => {
  const classes: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Manual: 'bg-slate-50 text-slate-700 border-slate-200',
    Biometric: 'bg-blue-50 text-blue-700 border-blue-200',
    Import: 'bg-violet-50 text-violet-700 border-violet-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    'Manager Review': 'bg-amber-50 text-amber-700 border-amber-200',
    'HR Confirmation': 'bg-sky-50 text-sky-700 border-sky-200',
    Late: 'bg-amber-50 text-amber-700 border-amber-200',
    'Half-Day': 'bg-amber-50 text-amber-700 border-amber-200',
    Leave: 'bg-sky-50 text-sky-700 border-sky-200',
    Holiday: 'bg-slate-50 text-slate-700 border-slate-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Overridden: 'bg-violet-50 text-violet-700 border-violet-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    Cancelled: 'bg-slate-50 text-slate-700 border-slate-200',
    Review: 'bg-sky-50 text-sky-700 border-sky-200',
    Draft: 'bg-slate-50 text-slate-700 border-slate-200',
    Complete: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Open: 'bg-sky-50 text-sky-700 border-sky-200',
    Waived: 'bg-violet-50 text-violet-700 border-violet-200',
    'Checked In': 'bg-sky-50 text-sky-700 border-sky-200',
    Absent: 'bg-rose-50 text-rose-700 border-rose-200',
    Inactive: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${classes[status] || classes.Draft}`}>
      {status}
    </span>
  );
};

export default function HRModuleSuite({ activeModule = 'employee-data-sheet' }: { activeModule?: ModuleKey }) {
  const { hasPermission } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [leaveEntitlements, setLeaveEntitlements] = useState<LeaveEntitlement[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [eosbSettlements, setEosbSettlements] = useState<EOSBSettlement[]>([]);
  const [eosbPreview, setEosbPreview] = useState<EOSBSettlement | null>(null);
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [exitChecklists, setExitChecklists] = useState<ExitChecklistRecord[]>([]);
  const [exitChecklistItems, setExitChecklistItems] = useState<ExitChecklistItem[]>([]);
  const [letters, setLetters] = useState<LetterRecord[]>([]);
  const [letterTemplates, setLetterTemplates] = useState<LetterTemplate[]>([]);
  const [exitInterviews, setExitInterviews] = useState<ExitInterviewRecord[]>([]);
  const [exitInterviewAnalytics, setExitInterviewAnalytics] = useState<ExitInterviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '',
    date: new Date().toISOString().slice(0, 10),
    check_in: '',
    check_out: '',
    status: 'Present' as AttendanceRecord['status'],
    overtime_hours: '0',
    source: 'Manual' as AttendanceRecord['source'],
    notes: '',
    approved_by: '',
  });
  const [leaveForm, setLeaveForm] = useState({
    employee_id: '',
    manager_id: '',
    leave_type: 'Annual Leave' as LeaveType,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    reason: '',
    document_url: '',
  });
  const [eosbForm, setEosbForm] = useState({
    employee_id: '',
    last_working_day: new Date().toISOString().slice(0, 10),
    separation_reason: 'Termination' as SeparationReason,
    last_basic_salary: '12000',
    unpaid_salary: '0',
    approved_by: '',
    settlement_date: '',
    notes: '',
  });
  const [payslipForm, setPayslipForm] = useState({
    employee_id: '',
    pay_year: String(new Date().getFullYear()),
    pay_month: String(new Date().getMonth() + 1),
    designation: 'Employee',
    department: '',
    basic_salary: '12000',
    housing_allowance: '1500',
    transport_allowance: '900',
    other_allowance: '0',
    overtime_hours: '0',
    overtime_amount: '0',
    deduction_label: 'Deductions',
    deduction_amount: '750',
    bank_name: '',
    iban: '',
    ytd_earnings: '0',
    authorised_by: '',
  });
  const [exitChecklistForm, setExitChecklistForm] = useState({
    employee_id: '',
    separation_reason: 'Resignation',
    last_working_day: new Date().toISOString().slice(0, 10),
    assigned_by: '',
  });
  const [letterForm, setLetterForm] = useState({
    employee_id: '',
    letter_type: 'experience' as 'relieving' | 'experience',
    designation: 'Employee',
    department: '',
    last_working_day: new Date().toISOString().slice(0, 10),
    hr_manager_name: 'HR Manager',
    hr_manager_designation: 'HR Manager',
    issue_date: new Date().toISOString().slice(0, 10),
    key_responsibilities: 'Handled assigned responsibilities as per role requirements.',
    performance_summary: 'Maintained professional conduct and satisfactory performance.',
    recommendation_statement: 'We wish the employee success in future endeavours.',
    generated_by: '',
  });
  const [exitInterviewForm, setExitInterviewForm] = useState({
    employee_id: '',
    interview_date: new Date().toISOString().slice(0, 10),
    conducted_by: '',
    reason_leaving: 'Better Opportunity' as ExitReasonLeaving,
    reason_details: '',
    job_satisfaction: '3',
    mgmt_satisfaction: '3',
    work_env_rating: '3',
    compensation_rating: '3',
    growth_rating: '3',
    recommend_company: true,
    rehire_eligible: true,
    feedback_text: '',
    suggestions: '',
    confidential: true,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const [employeeResponse, attendanceResponse, leaveResponse, eosbResponse, payslipResponse, exitChecklistResponse, letterResponse, exitInterviewResponse] = await Promise.all([
          fetch('/api/admin/employees?limit=100'),
          fetch('/api/admin/hr/attendance?limit=100'),
          fetch('/api/admin/hr/leave?limit=100'),
          fetch('/api/admin/hr/eosb?limit=100'),
          fetch('/api/admin/hr/payslips?limit=100'),
          fetch('/api/admin/hr/exit-checklist?limit=100'),
          fetch('/api/admin/hr/letters?limit=100'),
          fetch('/api/admin/hr/exit-interviews?limit=100'),
        ]);

        const employeeJson = employeeResponse.ok ? await employeeResponse.json() : null;
        const attendanceJson = attendanceResponse.ok ? await attendanceResponse.json() : null;
        const leaveJson = leaveResponse.ok ? await leaveResponse.json() : null;
        const eosbJson = eosbResponse.ok ? await eosbResponse.json() : null;
        const payslipJson = payslipResponse.ok ? await payslipResponse.json() : null;
        const exitChecklistJson = exitChecklistResponse.ok ? await exitChecklistResponse.json() : null;
        const letterJson = letterResponse.ok ? await letterResponse.json() : null;
        const exitInterviewJson = exitInterviewResponse.ok ? await exitInterviewResponse.json() : null;

        const loadedEmployees = employeeJson?.data || [];
        setEmployees(loadedEmployees);
        setEmployeeSummary(employeeJson?.summary || null);
        setSelectedEmployeeId(loadedEmployees[0]?.id || null);
        setAttendanceForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
        }));
        setLeaveForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
          manager_id: String(loadedEmployees[1]?.id || loadedEmployees[0]?.id || ''),
        }));
        setEosbForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
          approved_by: String(loadedEmployees[0]?.id || ''),
        }));
        setPayslipForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
          department: departmentName(loadedEmployees[0]?.department),
          authorised_by: String(loadedEmployees[0]?.id || ''),
        }));
        setExitChecklistForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
          assigned_by: String(loadedEmployees[0]?.id || ''),
        }));
        setLetterForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
          department: departmentName(loadedEmployees[0]?.department),
          generated_by: String(loadedEmployees[0]?.id || ''),
        }));
        setExitInterviewForm((previous) => ({
          ...previous,
          employee_id: String(loadedEmployees[0]?.id || ''),
          conducted_by: String(loadedEmployees[0]?.id || ''),
        }));
        setAttendance(attendanceJson?.data || []);
        setLeaves(leaveJson?.requests || []);
        setLeaveEntitlements(leaveJson?.entitlements || []);
        setLeaveBalances(leaveJson?.balances || []);
        setEosbSettlements(eosbJson?.settlements || []);
        setPayslips(payslipJson?.payslips || []);
        setExitChecklists(exitChecklistJson?.checklists || []);
        setExitChecklistItems(exitChecklistJson?.items || []);
        setLetters(letterJson?.letters || []);
        setLetterTemplates(letterJson?.templates || []);
        setExitInterviews(exitInterviewJson?.interviews || []);
        setExitInterviewAnalytics(exitInterviewJson?.analytics || null);
      } catch (error) {
        console.error('Failed to load HR module data:', error);
        setEmployees([]);
        setEmployeeSummary(null);
        setLoadError('Unable to load HR records from the database.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredEmployees = useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle) return employees;
    return employees.filter((employee) => (
      employee.name.toLowerCase().includes(needle) ||
      employee.email?.toLowerCase().includes(needle) ||
      employee.EID?.toLowerCase().includes(needle) ||
      employee.mobile?.toLowerCase().includes(needle)
    ));
  }, [employees, query]);

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId) || employees[0] || null;
  const activeMeta = modules.find((item) => item.key === activeModule) || modules[0];
  const averageHours = attendance.length
    ? attendance.reduce((sum, record) => sum + Number(record.overtime_hours || 0), 0) / attendance.length
    : 0;
  const pendingLeaves = leaves.filter((leave) => leave.status === 'Pending').length;
  const monthlyBase = 12000;
  const allowances = 2400;
  const deductions = 750;
  const netPay = monthlyBase + allowances - deductions;
  const eosbYears = yearsBetween(selectedEmployee?.doj);
  const eosbEstimate = estimateEOSB(monthlyBase, eosbYears, eosbForm.separation_reason);
  const canCreate = hasPermission('hr.create');
  const canUpdate = hasPermission('hr.update');
  const canViewCurrentModule = hasPermission('hr.view') ||
    (activeModule === 'payroll-management' && hasPermission('hr.payroll')) ||
    (activeModule === 'eosb' && hasPermission('hr.eosb')) ||
    (['attendance-management', 'leave-management'].includes(activeModule) && hasPermission('hr.team.attendance_leave')) ||
    (activeModule === 'employee-data-sheet' && hasPermission('hr.self'));

  if (!canViewCurrentModule) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-950">HR access required</h1>
        <p className="mt-2 text-sm text-slate-600">Your role does not include access to this HR module.</p>
      </div>
    );
  }

  const renderEmployeeSheet = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ['Active employees', employeeSummary?.active ?? employees.filter((employee) => employee.status === 1).length],
          ['Departments', employeeSummary?.departments ?? new Set(employees.map((employee) => employee.department || 0)).size],
          ['Missing visa dates', employeeSummary?.missingVisaDates ?? employees.filter((employee) => !employee.visaExp).length],
          ['Remote/office records', employeeSummary?.total ?? employees.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Employee', 'Department', 'Joining', 'Contact', 'Visa Expiry', 'Status'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-950">{employee.name}</div>
                  <div className="text-xs text-slate-500">{employee.EID || `#${employee.id}`} · {employee.nationality || 'Nationality not set'}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{departmentName(employee.department)}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(employee.doj)}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{employee.mobile || employee.email || 'Not set'}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{formatDate(employee.visaExp)}</td>
                <td className="px-4 py-3">{statusBadge(employee.status === 1 ? 'Active' : 'Inactive')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="Records" value={attendance.length.toString()} />
        <Metric label="Average overtime" value={averageHours.toFixed(1)} />
        <Metric label="Manager overrides" value={attendance.filter((record) => record.approved_by || record.notes).length.toString()} />
      </div>

      {canCreate && showAddForm && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch('/api/admin/hr/attendance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...attendanceForm,
                overtime_hours: Number(attendanceForm.overtime_hours || 0),
                check_in: attendanceForm.check_in || null,
                check_out: attendanceForm.check_out || null,
                notes: attendanceForm.notes || null,
                approved_by: attendanceForm.approved_by || null,
              }),
            });

            if (response.ok) {
              const refreshed = await fetch('/api/admin/hr/attendance?limit=100');
              const json = await refreshed.json();
              setAttendance(json.data || []);
              setAttendanceForm((previous) => ({
                ...previous,
                check_in: '',
                check_out: '',
                overtime_hours: '0',
                notes: '',
                approved_by: '',
              }));
            }
          }}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <h3 className="text-lg font-semibold text-slate-950">Manual Attendance Entry</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Employee</span>
              <select
                value={attendanceForm.employee_id}
                onChange={(event) => setAttendanceForm({ ...attendanceForm, employee_id: event.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                required
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Date</span>
              <input type="date" value={attendanceForm.date} onChange={(event) => setAttendanceForm({ ...attendanceForm, date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select value={attendanceForm.status} onChange={(event) => setAttendanceForm({ ...attendanceForm, status: event.target.value as AttendanceRecord['status'] })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {['Present', 'Absent', 'Late', 'Half-Day', 'Leave', 'Holiday'].map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Check In</span>
              <input type="time" value={attendanceForm.check_in} onChange={(event) => setAttendanceForm({ ...attendanceForm, check_in: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Check Out</span>
              <input type="time" value={attendanceForm.check_out} onChange={(event) => setAttendanceForm({ ...attendanceForm, check_out: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Overtime Hours</span>
              <input type="number" step="0.25" min="0" value={attendanceForm.overtime_hours} onChange={(event) => setAttendanceForm({ ...attendanceForm, overtime_hours: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Source</span>
              <select value={attendanceForm.source} onChange={(event) => setAttendanceForm({ ...attendanceForm, source: event.target.value as AttendanceRecord['source'] })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {['Manual', 'Biometric', 'Import'].map((source) => <option key={source}>{source}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Approved By</span>
              <select value={attendanceForm.approved_by} onChange={(event) => setAttendanceForm({ ...attendanceForm, approved_by: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="">No override approver</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Manager Override Notes</span>
              <textarea value={attendanceForm.notes} onChange={(event) => setAttendanceForm({ ...attendanceForm, notes: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} placeholder="Reason for manual adjustment or override" />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Save Attendance
            </button>
          </div>
        </form>
      )}

      <DataTable
        headers={['Employee', 'Date', 'Check In', 'Check Out', 'Status', 'Overtime', 'Source', 'Override']}
        rows={attendance.map((record) => [
          record.employee_name || `Employee ${record.employee_id}`,
          formatDate(record.date),
          record.check_in || 'Not set',
          record.check_out || 'Not set',
          statusBadge(record.status),
          String(record.overtime_hours || 0),
          statusBadge(record.source),
          record.approved_by_name || record.notes || 'None',
        ])}
      />
    </div>
  );

  const renderLeaves = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Leave requests" value={leaves.length.toString()} />
        <Metric label="Pending approval" value={pendingLeaves.toString()} />
        <Metric label="Approved" value={leaves.filter((leave) => leave.status === 'Approved').length.toString()} />
        <Metric label="Rejected" value={leaves.filter((leave) => leave.status === 'Rejected').length.toString()} />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-950">UAE Leave Entitlements</h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Type', 'Entitlement', 'Pay Category', 'Notes'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(leaveEntitlements.length ? leaveEntitlements : leaveTypeOptions.map((type) => ({ type, entitlementDays: 0, category: 'Policy', notes: 'Configured by HR policy.' }))).map((entitlement) => (
              <tr key={entitlement.type}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{entitlement.type}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{entitlement.entitlementDays || 'Policy based'} days</td>
                <td className="px-4 py-3 text-sm text-slate-700">{entitlement.category}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{entitlement.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {canCreate && showAddForm && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch('/api/admin/hr/leave', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...leaveForm,
                reason: leaveForm.reason || null,
                document_url: leaveForm.document_url || null,
              }),
            });

            if (response.ok) {
              await refreshLeaveData(leaveForm.employee_id);
              setLeaveForm((previous) => ({
                ...previous,
                reason: '',
                document_url: '',
              }));
            }
          }}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <h3 className="text-lg font-semibold text-slate-950">Apply Leave</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Employee</span>
              <select
                value={leaveForm.employee_id}
                onChange={async (event) => {
                  const employeeId = event.target.value;
                  setLeaveForm({ ...leaveForm, employee_id: employeeId });
                  await refreshLeaveData(employeeId);
                }}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                required
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Direct Manager</span>
              <select
                value={leaveForm.manager_id}
                onChange={(event) => setLeaveForm({ ...leaveForm, manager_id: event.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Auto assign manager</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Leave Type</span>
              <select value={leaveForm.leave_type} onChange={(event) => setLeaveForm({ ...leaveForm, leave_type: event.target.value as LeaveType })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {leaveTypeOptions.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Start Date</span>
              <input type="date" value={leaveForm.start_date} onChange={(event) => setLeaveForm({ ...leaveForm, start_date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">End Date</span>
              <input type="date" value={leaveForm.end_date} onChange={(event) => setLeaveForm({ ...leaveForm, end_date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Document URL</span>
              <input value={leaveForm.document_url} onChange={(event) => setLeaveForm({ ...leaveForm, document_url: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Medical certificate or proof link" />
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Reason</span>
              <textarea value={leaveForm.reason} onChange={(event) => setLeaveForm({ ...leaveForm, reason: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Submit Leave Request
            </button>
          </div>
        </form>
      )}

      <DataTable
        headers={['Leave Type', 'Entitlement', 'Used', 'Pending', 'Remaining']}
        rows={(leaveBalances.length ? leaveBalances : leaveTypeOptions.map((type) => ({
          balance_id: type,
          employee_id: leaveForm.employee_id,
          leave_type: type,
          year: new Date().getFullYear(),
          entitlement_days: 0,
          used_days: 0,
          pending_days: 0,
          remaining_days: 0,
        }))).map((balance) => [
          balance.leave_type,
          String(balance.entitlement_days),
          String(balance.used_days),
          String(balance.pending_days),
          String(balance.remaining_days),
        ])}
      />

      <DataTable
        headers={['Employee', 'Type', 'Dates', 'Days', 'Flow', 'Manager', 'HR', 'Notes', 'Action']}
        rows={leaves.map((leave) => [
          leave.employee_name || `Employee ${leave.employee_id}`,
          leave.leave_type,
          `${formatDate(leave.start_date)} - ${formatDate(leave.end_date)}`,
          String(leave.days_requested),
          <div key={`${leave.leave_id}-flow`} className="space-y-1">
            {statusBadge(leave.workflow_status || 'Manager Review')}
            <div>{statusBadge(leave.status)}</div>
          </div>,
          <div key={`${leave.leave_id}-manager`} className="space-y-1">
            <div>{leave.manager_name || leave.manager_id || 'Auto assign'}</div>
            {statusBadge(leave.manager_status || 'Pending')}
          </div>,
          <div key={`${leave.leave_id}-hr`} className="space-y-1">
            <div>{leave.reviewed_by_name || leave.reviewed_by || 'Pending'}</div>
            {statusBadge(leave.hr_status || 'Pending')}
          </div>,
          [
            leave.reason,
            leave.medical_certificate_required ? 'Medical certificate required' : '',
            leave.manager_comment,
            leave.review_notes,
          ].filter(Boolean).join(' | ') || 'None',
          leave.status === 'Pending' && canUpdate ? (
            <div className="flex flex-wrap gap-2">
              {(leave.workflow_status === 'HR Confirmation' ? ['Approved', 'Rejected'] : [] as string[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={async () => {
                    const response = await fetch('/api/admin/hr/leave', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        leave_id: leave.leave_id,
                        status,
                        reviewed_by: String(selectedEmployeeId || ''),
                        review_notes: status === 'Approved' && leave.manager_status === 'Rejected' ? 'HR override: approved after manager rejection' : `${status} by HR`,
                      }),
                    });
                    if (response.ok) await refreshLeaveData(leaveForm.employee_id);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${status === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
                >
                  HR {status}
                </button>
              ))}
              {(leave.workflow_status !== 'HR Confirmation' ? ['Approved', 'Rejected'] : [] as string[]).map((managerStatus) => (
                <button
                  key={managerStatus}
                  type="button"
                  onClick={async () => {
                    const response = await fetch('/api/admin/hr/leave', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        leave_id: leave.leave_id,
                        stage: 'manager',
                        manager_status: managerStatus,
                        manager_id: leave.manager_id || leaveForm.manager_id || String(selectedEmployeeId || ''),
                        manager_comment: `${managerStatus} by manager`,
                      }),
                    });
                    if (response.ok) await refreshLeaveData(leaveForm.employee_id);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${managerStatus === 'Approved' ? 'bg-sky-600 text-white' : 'bg-amber-600 text-white'}`}
                >
                  Manager {managerStatus}
                </button>
              ))}
            </div>
          ) : 'None',
        ])}
      />
    </div>
  );

  const renderPayroll = () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-950">Payroll Run</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <PayrollBox label="Basic Salary" value={monthlyBase} />
          <PayrollBox label="Allowances" value={allowances} />
          <PayrollBox label="Deductions" value={deductions} tone="danger" />
        </div>
        <div className="mt-5 rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Net payable</span>
            <span className="text-2xl font-semibold text-slate-950">{formatMoney(netPay)}</span>
          </div>
        </div>
      </div>
      <ActionPanel actions={['Validate attendance inputs', 'Review leave without pay', 'Approve payroll batch', 'Export bank transfer file']} />
    </div>
  );

  const renderEosb = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Settlements" value={eosbSettlements.length.toString()} />
        <Metric label="Current service" value={`${eosbYears.toFixed(1)} yrs`} />
        <Metric label="Preview total" value={formatMoney(Number(eosbPreview?.total_payable || eosbEstimate))} />
        <Metric label="Leave encashment" value={formatMoney(Number(eosbPreview?.leave_encashment || 0))} />
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await fetch('/api/admin/hr/eosb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...eosbForm,
              last_basic_salary: Number(eosbForm.last_basic_salary || 0),
              unpaid_salary: Number(eosbForm.unpaid_salary || 0),
              settlement_date: eosbForm.settlement_date || null,
              notes: eosbForm.notes || null,
            }),
          });

          if (response.ok) {
            setEosbPreview(await response.json());
          }
        }}
        className="rounded-lg border border-slate-200 bg-white p-5"
      >
        <h3 className="text-lg font-semibold text-slate-950">EOSB Calculation</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Employee</span>
            <select
              value={eosbForm.employee_id}
              onChange={(event) => {
                const employeeId = event.target.value;
                setEosbForm({ ...eosbForm, employee_id: employeeId });
                setSelectedEmployeeId(Number(employeeId));
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            >
              {employees.map((employee) => (
                <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Last Working Day</span>
            <input type="date" value={eosbForm.last_working_day} onChange={(event) => setEosbForm({ ...eosbForm, last_working_day: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Separation Reason</span>
            <select value={eosbForm.separation_reason} onChange={(event) => setEosbForm({ ...eosbForm, separation_reason: event.target.value as SeparationReason })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
              {separationReasons.map((reason) => <option key={reason}>{reason}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Last Basic Salary</span>
            <input type="number" min="0" step="0.01" value={eosbForm.last_basic_salary} onChange={(event) => setEosbForm({ ...eosbForm, last_basic_salary: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Unpaid Salary</span>
            <input type="number" step="0.01" value={eosbForm.unpaid_salary} onChange={(event) => setEosbForm({ ...eosbForm, unpaid_salary: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Approved By</span>
            <select value={eosbForm.approved_by} onChange={(event) => setEosbForm({ ...eosbForm, approved_by: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
              {employees.map((employee) => (
                <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Settlement Date</span>
            <input type="date" value={eosbForm.settlement_date} onChange={(event) => setEosbForm({ ...eosbForm, settlement_date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notes</span>
            <input value={eosbForm.notes} onChange={(event) => setEosbForm({ ...eosbForm, notes: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Adjustments or settlement remarks" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button type="submit" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Preview EOSB
          </button>
          {canUpdate && (
            <button
              type="button"
              onClick={async () => {
                const response = await fetch('/api/admin/hr/eosb', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    ...eosbForm,
                    last_basic_salary: Number(eosbForm.last_basic_salary || 0),
                    unpaid_salary: Number(eosbForm.unpaid_salary || 0),
                    settlement_date: eosbForm.settlement_date || null,
                    notes: eosbForm.notes || null,
                  }),
                });

                if (response.ok) {
                  const settlement = await response.json();
                  setEosbPreview(settlement);
                  await refreshEOSBData(eosbForm.employee_id);
                }
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Settlement
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-950">Computed Settlement</h3>
          <dl className="mt-5 space-y-4">
            <Detail label="Employee" value={eosbPreview?.employee_name || selectedEmployee?.name || 'No employee selected'} />
            <Detail label="Joining date" value={formatDate(eosbPreview?.joining_date || selectedEmployee?.doj)} />
            <Detail label="Years of service" value={`${Number(eosbPreview?.years_of_service || eosbYears).toFixed(2)} years`} />
            <Detail label="Gratuity days" value={String(eosbPreview?.gratuity_days || 'Preview required')} />
            <Detail label="EOSB amount" value={formatMoney(Number(eosbPreview?.eosb_amount || eosbEstimate))} />
            <Detail label="Annual leave balance" value={`${eosbPreview?.leave_balance_days || 0} days`} />
            <Detail label="Leave encashment" value={formatMoney(Number(eosbPreview?.leave_encashment || 0))} />
            <Detail label="Unpaid salary" value={formatMoney(Number(eosbPreview?.unpaid_salary || 0))} />
            <Detail label="Total payable" value={formatMoney(Number(eosbPreview?.total_payable || eosbEstimate))} strong />
          </dl>
          {eosbPreview?.rule_applied && <p className="mt-4 text-sm text-slate-600">{eosbPreview.rule_applied}</p>}
        </div>

        <ActionPanel actions={[
          '< 1 year: no EOSB entitlement',
          'Resignation: 1/3, 2/3, or full based on service',
          'Termination/retirement/death: 21 days up to 5 years, 30 days thereafter',
          'Total payable includes leave encashment and unpaid salary',
        ]} />
      </div>

      <DataTable
        headers={['Employee', 'Reason', 'Service', 'EOSB', 'Leave Encashment', 'Total', 'Approved By', 'Settlement']}
        rows={(eosbSettlements.length ? eosbSettlements : []).map((settlement) => [
          settlement.employee_name || `Employee ${settlement.employee_id}`,
          settlement.separation_reason,
          `${Number(settlement.years_of_service || 0).toFixed(2)} years`,
          formatMoney(Number(settlement.eosb_amount || 0)),
          formatMoney(Number(settlement.leave_encashment || 0)),
          formatMoney(Number(settlement.total_payable || 0)),
          settlement.approved_by_name || settlement.approved_by || 'Not set',
          formatDate(settlement.settlement_date),
        ])}
      />
    </div>
  );

  const renderPayslip = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Generated payslips" value={payslips.length.toString()} />
        <Metric label="Gross preview" value={formatMoney(Number(payslipForm.basic_salary || 0) + Number(payslipForm.housing_allowance || 0) + Number(payslipForm.transport_allowance || 0) + Number(payslipForm.other_allowance || 0) + Number(payslipForm.overtime_amount || 0))} />
        <Metric label="Deductions" value={formatMoney(Number(payslipForm.deduction_amount || 0))} />
        <Metric label="Net preview" value={formatMoney(Number(payslipForm.basic_salary || 0) + Number(payslipForm.housing_allowance || 0) + Number(payslipForm.transport_allowance || 0) + Number(payslipForm.other_allowance || 0) + Number(payslipForm.overtime_amount || 0) - Number(payslipForm.deduction_amount || 0))} />
      </div>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await fetch('/api/admin/hr/payslips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employee_id: payslipForm.employee_id,
              pay_year: Number(payslipForm.pay_year),
              pay_month: Number(payslipForm.pay_month),
              designation: payslipForm.designation,
              department: payslipForm.department,
              basic_salary: Number(payslipForm.basic_salary || 0),
              allowances: [
                { label: 'Housing Allowance', amount: Number(payslipForm.housing_allowance || 0) },
                { label: 'Transport Allowance', amount: Number(payslipForm.transport_allowance || 0) },
                { label: 'Other Allowance', amount: Number(payslipForm.other_allowance || 0) },
              ].filter((item) => item.amount > 0),
              overtime_hours: Number(payslipForm.overtime_hours || 0),
              overtime_amount: Number(payslipForm.overtime_amount || 0),
              deductions: [
                { label: payslipForm.deduction_label || 'Deductions', amount: Number(payslipForm.deduction_amount || 0) },
              ].filter((item) => item.amount > 0),
              bank_name: payslipForm.bank_name || null,
              iban: payslipForm.iban || null,
              ytd_earnings: Number(payslipForm.ytd_earnings || 0),
              authorised_by: payslipForm.authorised_by || null,
            }),
          });

          if (response.ok) await refreshPayslipData(payslipForm.employee_id);
        }}
        className="rounded-lg border border-slate-200 bg-white p-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950">Generate PDF Payslip</h3>
          <Printer className="h-5 w-5 text-slate-400" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Employee</span>
            <select
              value={payslipForm.employee_id}
              onChange={(event) => {
                const employee = employees.find((item) => String(item.id) === event.target.value);
                setPayslipForm({ ...payslipForm, employee_id: event.target.value, department: departmentName(employee?.department) });
              }}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            >
              {employees.map((employee) => (
                <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Pay Year</span>
            <input type="number" value={payslipForm.pay_year} onChange={(event) => setPayslipForm({ ...payslipForm, pay_year: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Pay Month</span>
            <input type="number" min="1" max="12" value={payslipForm.pay_month} onChange={(event) => setPayslipForm({ ...payslipForm, pay_month: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Designation</span>
            <input value={payslipForm.designation} onChange={(event) => setPayslipForm({ ...payslipForm, designation: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Department</span>
            <input value={payslipForm.department} onChange={(event) => setPayslipForm({ ...payslipForm, department: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Basic Salary</span>
            <input type="number" min="0" step="0.01" value={payslipForm.basic_salary} onChange={(event) => setPayslipForm({ ...payslipForm, basic_salary: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Housing Allowance</span>
            <input type="number" step="0.01" value={payslipForm.housing_allowance} onChange={(event) => setPayslipForm({ ...payslipForm, housing_allowance: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Transport Allowance</span>
            <input type="number" step="0.01" value={payslipForm.transport_allowance} onChange={(event) => setPayslipForm({ ...payslipForm, transport_allowance: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Other Allowance</span>
            <input type="number" step="0.01" value={payslipForm.other_allowance} onChange={(event) => setPayslipForm({ ...payslipForm, other_allowance: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Overtime Hours</span>
            <input type="number" step="0.25" value={payslipForm.overtime_hours} onChange={(event) => setPayslipForm({ ...payslipForm, overtime_hours: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Overtime Amount</span>
            <input type="number" step="0.01" value={payslipForm.overtime_amount} onChange={(event) => setPayslipForm({ ...payslipForm, overtime_amount: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Deduction Amount</span>
            <input type="number" step="0.01" value={payslipForm.deduction_amount} onChange={(event) => setPayslipForm({ ...payslipForm, deduction_amount: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Bank Name</span>
            <input value={payslipForm.bank_name} onChange={(event) => setPayslipForm({ ...payslipForm, bank_name: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">IBAN</span>
            <input value={payslipForm.iban} onChange={(event) => setPayslipForm({ ...payslipForm, iban: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">YTD Earnings</span>
            <input type="number" step="0.01" value={payslipForm.ytd_earnings} onChange={(event) => setPayslipForm({ ...payslipForm, ytd_earnings: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Generate Payslip PDF
          </button>
        </div>
      </form>

      <DataTable
        headers={['Employee', 'Period', 'Gross', 'Net', 'Bank', 'Signed URL', 'Expires']}
        rows={(payslips.length ? payslips : []).map((payslip) => [
          payslip.employee_name || `Employee ${payslip.employee_id}`,
          payslip.pay_period,
          formatMoney(Number(payslip.gross_salary || 0)),
          formatMoney(Number(payslip.net_salary || 0)),
          [payslip.bank_name, payslip.masked_iban].filter(Boolean).join(' | ') || 'Not set',
          <a key={`${payslip.payslip_id}-url`} href={payslip.signed_url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">Open PDF</a>,
          formatDate(payslip.signed_url_expires_at),
        ])}
      />

      <ActionPanel actions={['Generate monthly PDF', 'Store as payslip_empid_YYYY_MM.pdf', 'Expose self-service signed URL', 'Share link valid for 7 days']} />
    </div>
  );

  const renderExitChecklist = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Open checklists" value={exitChecklists.filter((checklist) => checklist.status === 'Open').length.toString()} />
        <Metric label="Total items" value={exitChecklistItems.length.toString()} />
        <Metric label="Completed" value={exitChecklistItems.filter((item) => item.status === 'Completed').length.toString()} />
        <Metric label="Pending" value={exitChecklistItems.filter((item) => item.status === 'Pending').length.toString()} />
      </div>

      {canCreate && showAddForm && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch('/api/admin/hr/exit-checklist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(exitChecklistForm),
            });

            if (response.ok) await refreshExitChecklistData(exitChecklistForm.employee_id);
          }}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <h3 className="text-lg font-semibold text-slate-950">Assign Offboarding Checklist</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Employee</span>
              <select value={exitChecklistForm.employee_id} onChange={(event) => setExitChecklistForm({ ...exitChecklistForm, employee_id: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Separation Reason</span>
              <select value={exitChecklistForm.separation_reason} onChange={(event) => setExitChecklistForm({ ...exitChecklistForm, separation_reason: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {['Resignation', 'Termination', 'Retirement', 'Death', 'Mutual'].map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Last Working Day</span>
              <input type="date" value={exitChecklistForm.last_working_day} onChange={(event) => setExitChecklistForm({ ...exitChecklistForm, last_working_day: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Assigned By</span>
              <select value={exitChecklistForm.assigned_by} onChange={(event) => setExitChecklistForm({ ...exitChecklistForm, assigned_by: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Assign Checklist
            </button>
          </div>
        </form>
      )}

      <DataTable
        headers={['Employee', 'Reason', 'Last Day', 'Status', 'Completed', 'Pending']}
        rows={(exitChecklists.length ? exitChecklists : []).map((checklist) => [
          checklist.employee_name || `Employee ${checklist.employee_id}`,
          checklist.separation_reason || 'Not set',
          formatDate(checklist.last_working_day),
          statusBadge(checklist.status),
          `${checklist.completed_items || 0}/${checklist.total_items || 0}`,
          String(checklist.pending_items || 0),
        ])}
      />

      <DataTable
        headers={['Dept', 'Checklist Item', 'Owner', 'Status', 'Completed By', 'Notes', 'Action']}
        rows={(exitChecklistItems.length ? exitChecklistItems : []).map((item) => [
          item.department,
          item.item_text,
          item.owner_role,
          statusBadge(item.status),
          item.completed_by_name || item.completed_by || 'Not set',
          item.notes || 'None',
          canUpdate ? (
            <div key={`${item.item_id}-actions`} className="flex flex-wrap gap-2">
              {(['Completed', 'Waived', 'Pending'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={async () => {
                    const response = await fetch('/api/admin/hr/exit-checklist', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        item_id: item.item_id,
                        status,
                        completed_by: exitChecklistForm.assigned_by || String(selectedEmployeeId || ''),
                        notes: status === 'Pending' ? 'Reopened' : `${status} by ${item.owner_role}`,
                      }),
                    });
                    if (response.ok) await refreshExitChecklistData(exitChecklistForm.employee_id);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${status === 'Completed' ? 'bg-emerald-600 text-white' : status === 'Waived' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          ) : 'None',
        ])}
      />
    </div>
  );

  const renderLetters = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Generated letters" value={letters.length.toString()} />
        <Metric label="Templates" value={letterTemplates.length.toString()} />
        <Metric label="Relieving" value={letters.filter((letter) => letter.letter_type === 'relieving').length.toString()} />
        <Metric label="Experience" value={letters.filter((letter) => letter.letter_type === 'experience').length.toString()} />
      </div>

      {canCreate && showAddForm && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch('/api/admin/hr/letters', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(letterForm),
            });

            if (response.ok) await refreshLetterData(letterForm.employee_id);
          }}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950">Generate Exit Letter</h3>
            <FileBadge className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Employee</span>
              <select
                value={letterForm.employee_id}
                onChange={(event) => {
                  const employee = employees.find((item) => String(item.id) === event.target.value);
                  setLetterForm({ ...letterForm, employee_id: event.target.value, department: departmentName(employee?.department) });
                  setSelectedEmployeeId(Number(event.target.value));
                }}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                required
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Letter Type</span>
              <select value={letterForm.letter_type} onChange={(event) => setLetterForm({ ...letterForm, letter_type: event.target.value as 'relieving' | 'experience' })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="experience">Experience Letter</option>
                <option value="relieving">Relieving Letter</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Last Working Date</span>
              <input type="date" value={letterForm.last_working_day} onChange={(event) => setLetterForm({ ...letterForm, last_working_day: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Designation</span>
              <input value={letterForm.designation} onChange={(event) => setLetterForm({ ...letterForm, designation: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Department</span>
              <input value={letterForm.department} onChange={(event) => setLetterForm({ ...letterForm, department: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Issue Date</span>
              <input type="date" value={letterForm.issue_date} onChange={(event) => setLetterForm({ ...letterForm, issue_date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">HR Manager</span>
              <input value={letterForm.hr_manager_name} onChange={(event) => setLetterForm({ ...letterForm, hr_manager_name: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">HR Designation</span>
              <input value={letterForm.hr_manager_designation} onChange={(event) => setLetterForm({ ...letterForm, hr_manager_designation: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Generated By</span>
              <select value={letterForm.generated_by} onChange={(event) => setLetterForm({ ...letterForm, generated_by: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Key Responsibilities</span>
              <textarea value={letterForm.key_responsibilities} onChange={(event) => setLetterForm({ ...letterForm, key_responsibilities: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={2} />
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Performance Summary</span>
              <textarea value={letterForm.performance_summary} onChange={(event) => setLetterForm({ ...letterForm, performance_summary: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={2} />
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Recommendation Statement</span>
              <textarea value={letterForm.recommendation_statement} onChange={(event) => setLetterForm({ ...letterForm, recommendation_statement: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={2} />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Generate Letter PDF
            </button>
          </div>
        </form>
      )}

      <DataTable
        headers={['Employee', 'Type', 'Ref', 'Issue Date', 'Last Day', 'Template', 'PDF', 'Expires']}
        rows={(letters.length ? letters : []).map((letter) => [
          letter.employee_name || `Employee ${letter.employee_id}`,
          letter.letter_type === 'experience' ? 'Experience Letter' : 'Relieving Letter',
          letter.ref_number,
          formatDate(letter.issue_date),
          formatDate(letter.last_working_day),
          letter.template_name || 'Default',
          <a key={`${letter.letter_id}-download`} href={letter.signed_url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">Download</a>,
          formatDate(letter.signed_url_expires_at),
        ])}
      />

      <DataTable
        headers={['Template', 'Type', 'Status']}
        rows={(letterTemplates.length ? letterTemplates : []).map((template) => [
          template.template_name,
          template.letter_type === 'experience' ? 'Experience Letter' : 'Relieving Letter',
          statusBadge(template.is_active ? 'Active' : 'Inactive'),
        ])}
      />
    </div>
  );

  const renderExitInterview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Metric label="Interviews" value={String(exitInterviewAnalytics?.total || exitInterviews.length)} />
        <Metric label="Recommend" value={`${exitInterviewAnalytics?.recommendPercent || 0}%`} />
        <Metric label="Rehire eligible" value={`${exitInterviewAnalytics?.rehireEligiblePercent || 0}%`} />
        <Metric label="Avg satisfaction" value={String(exitInterviewAnalytics?.averages.jobSatisfaction || 0)} />
      </div>

      {canCreate && showAddForm && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch('/api/admin/hr/exit-interviews', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...exitInterviewForm,
                job_satisfaction: Number(exitInterviewForm.job_satisfaction),
                mgmt_satisfaction: Number(exitInterviewForm.mgmt_satisfaction),
                work_env_rating: Number(exitInterviewForm.work_env_rating),
                compensation_rating: Number(exitInterviewForm.compensation_rating),
                growth_rating: Number(exitInterviewForm.growth_rating),
                reason_details: exitInterviewForm.reason_details || null,
                feedback_text: exitInterviewForm.feedback_text || null,
                suggestions: exitInterviewForm.suggestions || null,
              }),
            });

            if (response.ok) await refreshExitInterviewData(exitInterviewForm.employee_id);
          }}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <h3 className="text-lg font-semibold text-slate-950">Structured Exit Interview</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Employee</span>
              <select value={exitInterviewForm.employee_id} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, employee_id: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Interview Date</span>
              <input type="date" value={exitInterviewForm.interview_date} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, interview_date: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Conducted By</span>
              <select value={exitInterviewForm.conducted_by} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, conducted_by: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {employees.map((employee) => (
                  <option key={employee.id} value={String(employee.id)}>{employee.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Reason Leaving</span>
              <select value={exitInterviewForm.reason_leaving} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, reason_leaving: event.target.value as ExitReasonLeaving })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required>
                {exitLeavingReasons.map((reason) => <option key={reason}>{reason}</option>)}
              </select>
            </label>
            {[
              ['Job Satisfaction', 'job_satisfaction'],
              ['Management Satisfaction', 'mgmt_satisfaction'],
              ['Work Environment', 'work_env_rating'],
              ['Compensation', 'compensation_rating'],
              ['Growth', 'growth_rating'],
            ].map(([label, key]) => (
              <label key={key} className="block">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <input type="number" min="1" max="5" value={exitInterviewForm[key as keyof typeof exitInterviewForm] as string} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, [key]: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
              </label>
            ))}
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
              <input type="checkbox" checked={exitInterviewForm.recommend_company} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, recommend_company: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
              Recommend company
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
              <input type="checkbox" checked={exitInterviewForm.rehire_eligible} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, rehire_eligible: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
              Rehire eligible
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
              <input type="checkbox" checked={exitInterviewForm.confidential} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, confidential: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
              Confidential
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Reason Details</span>
              <textarea value={exitInterviewForm.reason_details} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, reason_details: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={2} />
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">General Feedback</span>
              <textarea value={exitInterviewForm.feedback_text} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, feedback_text: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} />
            </label>
            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">Suggestions</span>
              <textarea value={exitInterviewForm.suggestions} onChange={(event) => setExitInterviewForm({ ...exitInterviewForm, suggestions: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" rows={3} />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Submit Interview
            </button>
          </div>
        </form>
      )}

      <DataTable
        headers={['Reason', 'Count']}
        rows={(exitInterviewAnalytics?.reasonBreakdown || []).map((item) => [
          item.reason,
          String(item.total),
        ])}
      />

      <DataTable
        headers={['Employee', 'Date', 'Reason', 'Ratings', 'Recommend', 'Rehire', 'Confidential']}
        rows={(exitInterviews.length ? exitInterviews : []).map((interview) => [
          interview.employee_name || `Employee ${interview.employee_id}`,
          formatDate(interview.interview_date),
          interview.reason_leaving,
          `Job ${interview.job_satisfaction} | Mgmt ${interview.mgmt_satisfaction} | Env ${interview.work_env_rating} | Comp ${interview.compensation_rating} | Growth ${interview.growth_rating}`,
          interview.recommend_company ? 'Yes' : 'No',
          interview.rehire_eligible ? 'Yes' : 'No',
          interview.confidential ? 'Yes' : 'No',
        ])}
      />
    </div>
  );

  const renderActiveModule = () => {
    if (activeModule === 'attendance-management') return renderAttendance();
    if (activeModule === 'leave-management') return renderLeaves();
    if (activeModule === 'payroll-management') return renderPayroll();
    if (activeModule === 'eosb') return renderEosb();
    if (activeModule === 'payslip-generation') return renderPayslip();
    if (activeModule === 'exit-checklist') return renderExitChecklist();
    if (activeModule === 'letters') return renderLetters();
    if (activeModule === 'exit-interview') return renderExitInterview();
    return renderEmployeeSheet();
  };

  const refreshLeaveData = async (employeeId = leaveForm.employee_id) => {
    const response = await fetch(`/api/admin/hr/leave?limit=100${employeeId ? `&employee_id=${encodeURIComponent(employeeId)}` : ''}`);
    const json = await response.json();
    setLeaves(json.requests || []);
    setLeaveEntitlements(json.entitlements || []);
    setLeaveBalances(json.balances || []);
  };

  const refreshEOSBData = async (employeeId = eosbForm.employee_id) => {
    const response = await fetch(`/api/admin/hr/eosb?limit=100${employeeId ? `&employee_id=${encodeURIComponent(employeeId)}` : ''}`);
    const json = await response.json();
    setEosbSettlements(json.settlements || []);
  };

  const refreshPayslipData = async (employeeId = payslipForm.employee_id) => {
    const response = await fetch(`/api/admin/hr/payslips?limit=100${employeeId ? `&employee_id=${encodeURIComponent(employeeId)}` : ''}`);
    const json = await response.json();
    setPayslips(json.payslips || []);
  };

  const refreshExitChecklistData = async (employeeId = exitChecklistForm.employee_id) => {
    const response = await fetch(`/api/admin/hr/exit-checklist?limit=100${employeeId ? `&employee_id=${encodeURIComponent(employeeId)}` : ''}`);
    const json = await response.json();
    setExitChecklists(json.checklists || []);
    setExitChecklistItems(json.items || []);
  };

  const refreshLetterData = async (employeeId = letterForm.employee_id) => {
    const response = await fetch(`/api/admin/hr/letters?limit=100${employeeId ? `&employee_id=${encodeURIComponent(employeeId)}` : ''}`);
    const json = await response.json();
    setLetters(json.letters || []);
    setLetterTemplates(json.templates || []);
  };

  const refreshExitInterviewData = async (employeeId = exitInterviewForm.employee_id) => {
    const response = await fetch(`/api/admin/hr/exit-interviews?limit=100${employeeId ? `&employee_id=${encodeURIComponent(employeeId)}` : ''}`);
    const json = await response.json();
    setExitInterviews(json.interviews || []);
    setExitInterviewAnalytics(json.analytics || null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">HR Module</p>
          <h1 className="text-3xl font-bold text-slate-950">{activeMeta.number} {activeMeta.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{activeMeta.description}</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowAddForm(v => !v)}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${showAddForm ? 'bg-slate-600 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            <Plus className={`h-4 w-4 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
            {showAddForm ? 'Close Form' : 'New HR Record'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-9">
        {modules.map((item) => {
          const Icon = item.icon;
          const active = item.key === activeModule;
          return (
            <a
              key={item.key}
              href={item.href}
              className={`rounded-lg border p-3 transition-colors ${active ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{item.number}</span>
              </div>
              <div className="mt-2 text-sm font-medium">{item.title}</div>
            </a>
          );
        })}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search employees by name, email, ID, or mobile"
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-56 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      ) : loadError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
          {loadError}
        </div>
      ) : renderActiveModule()}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: Array<Array<ReactNode>> }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-slate-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PayrollBox({ label, value, tone = 'normal' }: { label: string; value: number; tone?: 'normal' | 'danger' }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-xl font-semibold ${tone === 'danger' ? 'text-rose-700' : 'text-slate-950'}`}>{formatMoney(value)}</p>
    </div>
  );
}

function ActionPanel({ actions }: { actions: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-950">Workflow</h3>
      <div className="mt-4 space-y-3">
        {actions.map((action, index) => (
          <div key={action} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{index + 1}</span>
            <span className="text-sm text-slate-700">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Detail({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className={`text-right text-sm ${strong ? 'text-lg font-semibold text-slate-950' : 'font-medium text-slate-800'}`}>{value}</dd>
    </div>
  );
}
