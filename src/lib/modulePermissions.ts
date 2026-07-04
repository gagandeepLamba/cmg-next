export const modulePermissions = {
  adminAccess: 'admin.access',
  salesView: 'sales.view',
  salesCreate: 'sales.create',
  salesUpdate: 'sales.update',
  salesDelete: 'sales.delete',
  operationsView: 'operations.view',
  operationsCreate: 'operations.create',
  operationsUpdate: 'operations.update',
  operationsDelete: 'operations.delete',
  operationsManage: 'operations.manage',
  reportsView: 'reports.view',
  reportsCreate: 'reports.create',
  reportsUpdate: 'reports.update',
  reportsDelete: 'reports.delete',
  leadsView: 'leads.view',
  leadsCreate: 'leads.create',
  leadsUpdate: 'leads.update',
  leadsDelete: 'leads.delete',
  analyticsView: 'analytics.view',
  appointmentsView: 'appointments.view',
  appointmentsManage: 'appointments.manage',
  documentsView: 'documents.view',
  documentsCreate: 'documents.create',
  documentsUpdate: 'documents.update',
  documentsDelete: 'documents.delete',
  paymentsView: 'payments.view',
  paymentsCreate: 'payments.create',
  paymentsUpdate: 'payments.update',
  paymentsDelete: 'payments.delete',
  invoicesView: 'invoices.view',
  invoicesCreate: 'invoices.create',
  invoicesUpdate: 'invoices.update',
  invoicesDelete: 'invoices.delete',
  agreementsView: 'agreements.view',
  agreementsCreate: 'agreements.create',
  agreementsUpdate: 'agreements.update',
  agreementsDelete: 'agreements.delete',
  clientsView: 'clients.view',
  clientsCreate: 'clients.create',
  clientsUpdate: 'clients.update',
  clientsDelete: 'clients.delete',
  counselorsManage: 'counselors.manage',
  employeesManage: 'employees.manage',
  branchesManage: 'branches.manage',
  departmentsManage: 'departments.manage',
  attendanceManage: 'attendance.manage',
  programsManage: 'programs.manage',
  feesManage: 'fees.manage',
  currencyManage: 'currency.manage',
  countriesManage: 'countries.manage',
  rolesManage: 'roles.manage',
  marketingManage: 'marketing.manage',
  campaignsManage: 'campaigns.manage',
  templatesManage: 'templates.manage',
  b2bManage: 'b2b.manage',
  employersManage: 'employers.manage',
  transfersManage: 'transfers.manage',
  recognitionManage: 'recognition.manage',
  monitoringView: 'monitoring.view',
  settingsManage: 'settings.manage',
  hrDashboard: 'hr.dashboard',
  hrView: 'hr.view',
  hrCreate: 'hr.create',
  hrUpdate: 'hr.update',
  hrDelete: 'hr.delete',
  hrConfig: 'hr.config',
  hrPayroll: 'hr.payroll',
  hrEosb: 'hr.eosb',
  hrSelf: 'hr.self',
  hrTeamAttendanceLeave: 'hr.team.attendance_leave',
  proDashboard: 'pro.dashboard',
  proView: 'pro.view',
  proCreate: 'pro.create',
  proUpdate: 'pro.update',
  proDelete: 'pro.delete',
  proConfig: 'pro.config',
  proWpsView: 'pro.wps.view',
  proOwnersRestricted: 'pro.owners.restricted',
  financeView: 'finance.view',
  financeManage: 'finance.manage',
  feesView: 'fees.view',
} as const;

export type ModulePermission = typeof modulePermissions[keyof typeof modulePermissions];

export type ModuleRoleKey =
  | 'super_admin'
  | 'director'
  | 'founder'
  | 'director_of_sales'
  | 'regional_manager'
  | 'sales'
  | 'operations'
  | 'hr'
  | 'pro'
  | 'finance'
  | 'branch_manager'
  | 'receptionist'
  | 'foe'
  | 'employee_self';

const adminPermissions: ModulePermission[] = [
  modulePermissions.adminAccess,
  modulePermissions.salesView,
  modulePermissions.salesCreate,
  modulePermissions.salesUpdate,
  modulePermissions.salesDelete,
  modulePermissions.operationsView,
  modulePermissions.operationsCreate,
  modulePermissions.operationsUpdate,
  modulePermissions.operationsDelete,
  modulePermissions.operationsManage,
  modulePermissions.reportsView,
  modulePermissions.reportsCreate,
  modulePermissions.reportsUpdate,
  modulePermissions.reportsDelete,
  modulePermissions.leadsView,
  modulePermissions.leadsCreate,
  modulePermissions.leadsUpdate,
  modulePermissions.leadsDelete,
  modulePermissions.analyticsView,
  modulePermissions.appointmentsView,
  modulePermissions.appointmentsManage,
  modulePermissions.documentsView,
  modulePermissions.documentsCreate,
  modulePermissions.documentsUpdate,
  modulePermissions.documentsDelete,
  modulePermissions.paymentsView,
  modulePermissions.paymentsCreate,
  modulePermissions.paymentsUpdate,
  modulePermissions.paymentsDelete,
  modulePermissions.invoicesView,
  modulePermissions.invoicesCreate,
  modulePermissions.invoicesUpdate,
  modulePermissions.invoicesDelete,
  modulePermissions.agreementsView,
  modulePermissions.agreementsCreate,
  modulePermissions.agreementsUpdate,
  modulePermissions.agreementsDelete,
  modulePermissions.clientsView,
  modulePermissions.clientsCreate,
  modulePermissions.clientsUpdate,
  modulePermissions.clientsDelete,
  modulePermissions.counselorsManage,
  modulePermissions.employeesManage,
  modulePermissions.branchesManage,
  modulePermissions.departmentsManage,
  modulePermissions.attendanceManage,
  modulePermissions.programsManage,
  modulePermissions.feesManage,
  modulePermissions.currencyManage,
  modulePermissions.countriesManage,
  modulePermissions.rolesManage,
  modulePermissions.marketingManage,
  modulePermissions.campaignsManage,
  modulePermissions.templatesManage,
  modulePermissions.b2bManage,
  modulePermissions.employersManage,
  modulePermissions.transfersManage,
  modulePermissions.recognitionManage,
  modulePermissions.monitoringView,
  modulePermissions.settingsManage,
  modulePermissions.hrDashboard,
  modulePermissions.hrView,
  modulePermissions.hrCreate,
  modulePermissions.hrUpdate,
  modulePermissions.hrDelete,
  modulePermissions.hrConfig,
  modulePermissions.hrPayroll,
  modulePermissions.hrEosb,
  modulePermissions.proDashboard,
  modulePermissions.proView,
  modulePermissions.proCreate,
  modulePermissions.proUpdate,
  modulePermissions.proDelete,
  modulePermissions.proConfig,
  modulePermissions.proWpsView,
  modulePermissions.proOwnersRestricted,
  modulePermissions.hrSelf,
  modulePermissions.hrTeamAttendanceLeave,
  modulePermissions.financeView,
  modulePermissions.financeManage,
];

const salesModulePermissions: ModulePermission[] = [
  modulePermissions.salesView,
  modulePermissions.salesCreate,
  modulePermissions.salesUpdate,
  modulePermissions.leadsView,
  modulePermissions.leadsCreate,
  modulePermissions.leadsUpdate,
  modulePermissions.leadsDelete,
  modulePermissions.clientsView,
  modulePermissions.clientsCreate,
  modulePermissions.clientsUpdate,
  modulePermissions.appointmentsView,
  modulePermissions.appointmentsManage,
  modulePermissions.documentsView,
  modulePermissions.documentsCreate,
  modulePermissions.documentsUpdate,
  modulePermissions.paymentsView,
  modulePermissions.paymentsCreate,
  modulePermissions.invoicesView,
  modulePermissions.invoicesCreate,
  modulePermissions.agreementsView,
  modulePermissions.agreementsCreate,
  modulePermissions.reportsView,
  modulePermissions.feesView,
];

// Individual-contributor tier: own leads/meetings/agreements only, read-only
// Operations visibility, and no receipts/invoice access (front-desk/finance
// handle money; the counsellor generates the paperwork, not the payment).
const counsellorPermissions: ModulePermission[] = [
  modulePermissions.salesView,
  modulePermissions.salesCreate,
  modulePermissions.salesUpdate,
  modulePermissions.leadsView,
  modulePermissions.leadsCreate,
  modulePermissions.leadsUpdate,
  modulePermissions.clientsView,
  modulePermissions.clientsCreate,
  modulePermissions.clientsUpdate,
  modulePermissions.appointmentsView,
  modulePermissions.appointmentsManage,
  modulePermissions.documentsView,
  modulePermissions.documentsCreate,
  modulePermissions.documentsUpdate,
  modulePermissions.agreementsView,
  modulePermissions.agreementsCreate,
  modulePermissions.operationsView,
  modulePermissions.reportsView,
  modulePermissions.feesView,
];

// Director of Sales / Assistant Director of Sales: full company-wide sales +
// operations + reporting authority, but no user/role/system administration,
// no fee-plan editing, and no destructive delete/void/refund actions.
const directorOfSalesPermissions: ModulePermission[] = [
  modulePermissions.salesView,
  modulePermissions.salesCreate,
  modulePermissions.salesUpdate,
  modulePermissions.leadsView,
  modulePermissions.leadsCreate,
  modulePermissions.leadsUpdate,
  modulePermissions.clientsView,
  modulePermissions.clientsCreate,
  modulePermissions.clientsUpdate,
  modulePermissions.clientsDelete,
  modulePermissions.appointmentsView,
  modulePermissions.appointmentsManage,
  modulePermissions.documentsView,
  modulePermissions.documentsCreate,
  modulePermissions.documentsUpdate,
  modulePermissions.documentsDelete,
  modulePermissions.paymentsView,
  modulePermissions.paymentsCreate,
  modulePermissions.paymentsUpdate,
  modulePermissions.invoicesView,
  modulePermissions.invoicesCreate,
  modulePermissions.invoicesUpdate,
  modulePermissions.agreementsView,
  modulePermissions.agreementsCreate,
  modulePermissions.agreementsUpdate,
  modulePermissions.reportsView,
  modulePermissions.reportsCreate,
  modulePermissions.analyticsView,
  modulePermissions.operationsView,
  modulePermissions.operationsCreate,
  modulePermissions.operationsUpdate,
  modulePermissions.operationsManage,
  modulePermissions.counselorsManage,
  modulePermissions.transfersManage,
  modulePermissions.recognitionManage,
  modulePermissions.monitoringView,
  modulePermissions.feesView,
];

export const rolePermissionMatrix: Array<{
  key: ModuleRoleKey;
  role: string;
  salesModule: string;
  operationsModule: string;
  hrModule: string;
  proModule: string;
  admin: string;
  permissions: ModulePermission[];
}> = [
  {
    key: 'super_admin',
    role: 'Super Admin',
    salesModule: 'Full CRUD',
    operationsModule: 'Full CRUD',
    hrModule: 'Full CRUD + Config',
    proModule: 'Full CRUD + Config',
    admin: 'Yes',
    permissions: adminPermissions,
  },
  {
    key: 'director',
    role: 'Director',
    salesModule: 'Full CRUD',
    operationsModule: 'Full CRUD',
    hrModule: 'Full CRUD + Config',
    proModule: 'Full CRUD + Config',
    admin: 'Yes',
    permissions: adminPermissions,
  },
  {
    key: 'founder',
    role: 'Founder',
    salesModule: 'Full CRUD',
    operationsModule: 'Full CRUD',
    hrModule: 'Full CRUD + Config',
    proModule: 'Full CRUD + Config',
    admin: 'Yes',
    permissions: adminPermissions,
  },
  {
    key: 'director_of_sales',
    role: 'Director of Sales / Assistant Director of Sales',
    salesModule: 'Full CRUD (company-wide)',
    operationsModule: 'Full CRUD (company-wide)',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: directorOfSalesPermissions,
  },
  {
    key: 'regional_manager',
    role: 'Regional Manager',
    salesModule: 'Full CRUD (own region)',
    operationsModule: 'No Access',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      ...salesModulePermissions,
      modulePermissions.salesDelete,
      modulePermissions.counselorsManage,
    ],
  },
  {
    key: 'sales',
    role: 'Sales / Counsellor',
    salesModule: 'Own leads only',
    operationsModule: 'Read Only',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: counsellorPermissions,
  },
  {
    key: 'branch_manager',
    role: 'Branch Manager',
    salesModule: 'Full CRUD (own branch)',
    operationsModule: 'No Access',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      ...salesModulePermissions,
      modulePermissions.salesDelete,
      modulePermissions.counselorsManage,
    ],
  },
  {
    key: 'receptionist',
    role: 'Receptionist',
    salesModule: 'Leads Add/Assign Only',
    operationsModule: 'No Access',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      modulePermissions.leadsView,
      modulePermissions.leadsCreate,
      modulePermissions.leadsUpdate,
    ],
  },
  {
    key: 'foe',
    role: 'FOE (Front Office Executive)',
    salesModule: 'Leads Assign + Receipts + Meetings',
    operationsModule: 'No Access',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      modulePermissions.leadsView,
      modulePermissions.leadsCreate,
      modulePermissions.leadsUpdate,
      modulePermissions.paymentsView,
      modulePermissions.paymentsCreate,
      modulePermissions.appointmentsView,
      modulePermissions.appointmentsManage,
    ],
  },
  {
    key: 'operations',
    role: 'Operations',
    salesModule: 'No Access',
    operationsModule: 'Add/Edit',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      modulePermissions.operationsView,
      modulePermissions.operationsCreate,
      modulePermissions.operationsUpdate,
      modulePermissions.operationsManage,
    ],
  },
  {
    key: 'hr',
    role: 'HR',
    salesModule: 'No Access',
    operationsModule: 'No Access',
    hrModule: 'Full CRUD',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      modulePermissions.hrDashboard,
      modulePermissions.hrView,
      modulePermissions.hrCreate,
      modulePermissions.hrUpdate,
      modulePermissions.hrDelete,
      modulePermissions.hrConfig,
      modulePermissions.hrPayroll,
      modulePermissions.hrEosb,
    ],
  },
  {
    key: 'pro',
    role: 'PRO',
    salesModule: 'No Access',
    operationsModule: 'No Access',
    hrModule: 'No Access',
    proModule: 'Full CRUD',
    admin: 'No',
    permissions: [
      modulePermissions.proDashboard,
      modulePermissions.proView,
      modulePermissions.proCreate,
      modulePermissions.proUpdate,
      modulePermissions.proDelete,
      modulePermissions.proConfig,
      modulePermissions.proWpsView,
      modulePermissions.proOwnersRestricted,
    ],
  },
  {
    key: 'finance',
    role: 'Accountant / Finance',
    salesModule: 'Full CRUD (own leads)',
    operationsModule: 'No Access',
    hrModule: 'No Access',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      ...salesModulePermissions,
      modulePermissions.financeView,
      modulePermissions.financeManage,
    ],
  },
  {
    key: 'employee_self',
    role: 'Employee (Self)',
    salesModule: 'No Access',
    operationsModule: 'No Access',
    hrModule: 'View own record',
    proModule: 'No Access',
    admin: 'No',
    permissions: [
      modulePermissions.hrSelf,
    ],
  },
];

const normalize = (value?: string | number | null) => String(value || '')
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

export const resolveModuleRoleKey = (input: {
  roleId?: number | null;
  roleName?: string | null;
  roleType?: string | null;
}): ModuleRoleKey => {
  const text = normalize(`${input.roleName || ''} ${input.roleType || ''}`);
  const typeCode = String(input.roleType || '').toUpperCase().trim();

  // Superadmin — role 1 or explicit markers
  if (input.roleId === 1 || text.includes('super admin') || text.includes('superadmin') || text === 'admin' || text.includes('administrator')) {
    return 'super_admin';
  }

  // Finance / Accountant roles by legacy ID or type code
  const financeRoleIds = [9, 22, 40, 58, 59, 60];
  const financeTypeCodes = ['AC', 'FO', 'GFO', 'FMP'];
  if (financeRoleIds.includes(input.roleId as number) || financeTypeCodes.includes(typeCode)) return 'finance';

  // Counselor / Sales roles by legacy ID or type code
  const counselorRoleIds = [4, 10, 23, 31, 38];
  const counselorTypeCodes = ['IC', 'SIC', 'TC', 'MC', 'SC'];
  if (counselorRoleIds.includes(input.roleId as number) || counselorTypeCodes.includes(typeCode)) return 'sales';

  // HR roles by legacy ID or type code
  const hrRoleIds = [15, 36, 41, 57];
  const hrTypeCodes = ['HR', 'GHR', 'GHHA'];
  if (hrRoleIds.includes(input.roleId as number) || hrTypeCodes.includes(typeCode)) return 'hr';

  // Text-based matching (covers department_id=1 roles and any name-based roles)
  if (text.includes('founder')) return 'founder';
  if (text.includes('ceo') || text.includes('chief executive')) return 'director';
  // Must be checked before the generic 'director' match below, since
  // "director of operations" contains the substring "director".
  if (text.includes('director of operations') || text.includes('operations director')) return 'operations';
  // Director of Sales / Assistant Director of Sales: narrower than full
  // 'director' — must be checked before the generic 'director' match below.
  if (
    text.includes('director of sales')
    || text.includes('director sales')
    || text.includes('assistant director of sales')
    || text.includes('asst director of sales')
    || text.split(' ').includes('ados')
    || text.split(' ').includes('dos')
  ) return 'director_of_sales';
  if (text.includes('director') || text.split(' ').includes('ds')) return 'director';
  if (text.includes('regional manager') || text.split(' ').includes('rm')) return 'regional_manager';
  if (text.includes('branch manager') || text === 'bm') return 'branch_manager';
  if (text.includes('receptionist') || text.includes('front desk')) return 'receptionist';
  if (text.includes('foe') || text.includes('front office executive')) return 'foe';
  // Must be checked before the generic 'pro' match below, since
  // "process coordinator" contains the substring "pro".
  if (text.includes('process coordinator') || text.includes('case officer')) return 'operations';
  if (text.includes('sales') || text.includes('counsellor') || text.includes('counselor')) return 'sales';
  if (text.includes('operations') || text === 'ops' || text === 'op') return 'operations';
  if (text.includes('hr') || text.includes('human resources')) return 'hr';
  if (text.includes('pro') || text.includes('public relations officer')) return 'pro';
  if (text.includes('finance') || text.includes('accountant') || text.includes('accounting') || text.includes('accounts') || text.includes('account') || text.includes('cfo') || text.includes('accts')) return 'finance';

  return 'employee_self';
};

export const getModulePermissionsForRole = (input: {
  roleId?: number | null;
  roleName?: string | null;
  roleType?: string | null;
}) => {
  const roleKey = resolveModuleRoleKey(input);
  const row = rolePermissionMatrix.find((item) => item.key === roleKey)
    || rolePermissionMatrix.find((item) => item.key === 'employee_self')!;
  return {
    roleKey,
    roleLabel: row.role,
    permissions: ['super_admin', 'director', 'founder'].includes(row.key)
      ? ['all', ...adminPermissions]
      : row.permissions,
  };
};
