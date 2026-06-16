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

  if (path === '/admin/profile') return true;

  if (path === '/admin') {
    return ['super_admin', 'director', 'founder', 'employee_self'].includes(roleKey);
  }

  if (['sales', 'branch_manager'].includes(roleKey)) {
    return path === '/admin/leads' ||
      path.startsWith('/admin/leads/') ||
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
