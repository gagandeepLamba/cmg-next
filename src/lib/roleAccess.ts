import { resolveModuleRoleKey } from './modulePermissions';

type AccessUser = {
  role?: string | number | null;
  type?: string | null;
  permissions?: string[] | null;
};

const normalizePath = (pathname: string) => {
  const path = pathname.split('?')[0] || '/admin';
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
};

export const getUserRoleKey = (user?: AccessUser | null) => {
  if (!user) return 'employee_self';
  return resolveModuleRoleKey({
    roleId: typeof user.role === 'number' ? user.role : Number(user.role) || undefined,
    roleName: user.type,
    roleType: user.type,
  });
};

export const getDefaultAdminPathForUser = (user?: AccessUser | null) => {
  const roleKey = getUserRoleKey(user);

  if (['super_admin', 'director', 'founder'].includes(roleKey)) return '/admin';
  if (['sales', 'branch_manager'].includes(roleKey)) return '/admin/leads';
  if (roleKey === 'operations') return '/admin/operations-management';
  if (roleKey === 'hr') return '/admin/hr';
  if (roleKey === 'pro') return '/admin/pro-works';

  return '/admin';
};

export const canAccessAdminPath = (user: AccessUser | null | undefined, pathname: string) => {
  if (!user) return false;
  if (user.permissions?.includes('all')) return true;

  const path = normalizePath(pathname);
  const roleKey = getUserRoleKey(user);
  const permissions = user.permissions || [];

  const hasAnyPermission = (required: string[]) => required.some((permission) => permissions.includes(permission));

  if (path === '/admin/profile') return true;

  if (['super_admin', 'director', 'founder'].includes(roleKey)) return path === '/admin' || path.startsWith('/admin/');

  const permissionPathRules: Array<{ test: (value: string) => boolean; permissions: string[] }> = [
    { test: (value) => value === '/admin/reports' || value.startsWith('/admin/reports/'), permissions: ['reports.view'] },
    { test: (value) => value === '/admin/analytics', permissions: ['analytics.view'] },
    { test: (value) => value === '/admin/leads' || value.startsWith('/admin/leads/'), permissions: ['leads.view'] },
    { test: (value) => value === '/admin/calendar' || value === '/admin/appointments' || value.startsWith('/admin/appointments/'), permissions: ['appointments.view', 'appointments.manage'] },
    { test: (value) => value === '/admin/documents' || value.startsWith('/admin/documents/'), permissions: ['documents.view'] },
    { test: (value) => value === '/admin/payments' || value.startsWith('/admin/payments/'), permissions: ['payments.view'] },
    { test: (value) => value === '/admin/discount-approvals' || value.startsWith('/admin/discount-approvals/'), permissions: ['sales.update', 'admin.access'] },
    { test: (value) => value === '/admin/invoices' || value.startsWith('/admin/invoices/'), permissions: ['invoices.view'] },
    { test: (value) => value === '/admin/agreements' || value.startsWith('/admin/agreements/'), permissions: ['agreements.view'] },
    { test: (value) => value === '/admin/clients' || value.startsWith('/admin/clients/'), permissions: ['clients.view'] },
    { test: (value) => value === '/admin/counselors' || value.startsWith('/admin/counselors/'), permissions: ['counselors.manage'] },
    { test: (value) => value === '/admin/employees' || value.startsWith('/admin/employees/'), permissions: ['employees.manage'] },
    { test: (value) => value === '/admin/branches' || value.startsWith('/admin/branches/'), permissions: ['branches.manage'] },
    { test: (value) => value === '/admin/departments' || value.startsWith('/admin/departments/'), permissions: ['departments.manage'] },
    { test: (value) => value === '/admin/attendance' || value.startsWith('/admin/attendance/'), permissions: ['attendance.manage'] },
    { test: (value) => value === '/admin/programs' || value === '/admin/fees' || value === '/admin/currency' || value === '/admin/countries', permissions: ['programs.manage', 'fees.manage', 'currency.manage', 'countries.manage'] },
    { test: (value) => value === '/admin/roles' || value.startsWith('/admin/roles/'), permissions: ['roles.manage', 'admin.access'] },
    { test: (value) => value === '/admin/market-sources', permissions: ['marketing.manage'] },
    { test: (value) => value === '/admin/campaigns', permissions: ['campaigns.manage'] },
    { test: (value) => value === '/admin/email-templates', permissions: ['templates.manage'] },
    { test: (value) => value === '/admin/b2b', permissions: ['b2b.manage'] },
    { test: (value) => value === '/admin/employers', permissions: ['employers.manage'] },
    { test: (value) => value === '/admin/lead-transfers', permissions: ['transfers.manage'] },
    { test: (value) => value === '/admin/client-recognition', permissions: ['recognition.manage'] },
    { test: (value) => value === '/admin/monitoring', permissions: ['monitoring.view'] },
    { test: (value) => value === '/admin/operations-management' || value.startsWith('/admin/ops-'), permissions: ['operations.manage'] },
    { test: (value) => value === '/admin/legacy-modules' || value === '/admin/settings', permissions: ['settings.manage'] },
  ];

  if (permissionPathRules.some((rule) => rule.test(path) && hasAnyPermission(rule.permissions))) return true;

  if (path === '/admin') {
    return ['super_admin', 'director', 'founder', 'employee_self'].includes(roleKey);
  }

  if (['sales', 'branch_manager'].includes(roleKey)) {
    return path === '/admin/leads' ||
      path.startsWith('/admin/leads/') ||
      path === '/admin/discount-approvals' ||
      path.startsWith('/admin/discount-approvals/') ||
      path === '/admin/reports' ||
      path.startsWith('/admin/reports/');
  }

  if (roleKey === 'operations') {
    return path === '/admin/operations-management' ||
      path === '/admin/ops-dashboard' ||
      path === '/admin/ops-report' ||
      path.startsWith('/admin/ops-');
  }

  if (roleKey === 'hr') {
    return path === '/admin/hr' || path.startsWith('/admin/hr/');
  }

  if (roleKey === 'pro') {
    return path === '/admin/pro-works' || path.startsWith('/admin/pro-works/');
  }

  return false;
};
