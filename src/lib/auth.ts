import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { QueryTypes } from 'sequelize'
import { DmEmployee, DmRole } from '../models'
import { sequelize } from './sequelize'
import { getModulePermissionsForRole } from './modulePermissions'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface User {
  id: number
  name: string
  email: string
  cemail: string
  role: number
  branch: number
  region: number
  type: string
  photo?: string
  wfh: number
  permissions: string[]
}

export interface AuthUser extends User {
  token: string
}

type AuthEmployeeRow = {
  id: number
  name: string
  email?: string | null
  role?: number | null
  branch?: number | null
  region?: number | null
  photo?: string | null
  wfh?: number | null
  password?: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      cemail: user.cemail,
      role: user.role,
      branch: user.branch,
      region: user.region,
      type: user.type,
      photo: user.photo,
      wfh: user.wfh,
      permissions: user.permissions
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch {
    return null
  }
}

async function getDatabasePermissionsForRole(roleId: number): Promise<string[] | null> {
  try {
    const rows = await sequelize.query<{ permission_key: string }>(
      `SELECT p.permission_key
       FROM dm_role_permissions rp
       INNER JOIN dm_permissions p ON p.id = rp.permission_id
       WHERE rp.role_id = :roleId
         AND rp.status = 1
         AND p.status = 1
       ORDER BY p.module ASC, p.action ASC`,
      {
        replacements: { roleId },
        type: QueryTypes.SELECT,
      },
    );

    if (!rows.length) return null;
    return Array.from(new Set(rows.map((row) => row.permission_key)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Role permission tables unavailable; using module permission fallback:', message);
    return null;
  }
}

export async function auth(): Promise<AuthUser | null> {
  // This function can be used to get the current authenticated user
  // For now, return null - implement based on your session management
  try {
    // In a real implementation, you would:
    // 1. Get token from request/session
    // 2. Verify the token
    // 3. Return user data

    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    let user: AuthEmployeeRow | null = null;
    let roleType = '';
    let roleName = '';

    // Try DmcEmployee first (original dm_employee table)
    try {
      user = await DmEmployee.findOne({
        where: {
          username: username.toLowerCase(),
          status: 1,
        },
        raw:true
      });
      if (user) {
        roleType = user.role === 1 ? 'Administrator' : 'User';
        const role = user.role
          ? await DmRole.findByPk(user.role, { raw: true }).catch(() => null)
          : null;

        if (role) {
          roleName = role.name || '';
          roleType = role.type || roleType;
        }
      }
    } catch (employeeError: unknown) {
      const message = employeeError instanceof Error ? employeeError.message : employeeError;
      console.warn('DmcEmployee not accessible during authentication:', message);

      // Fallback to direct database query for test_users table
      
    }

    if (!user) {
      return null;
    }

    // Verify password (plain text comparison for now)
    if (user.password !== password) {
      return null;
    }

    const moduleAccess = getModulePermissionsForRole({
      roleId: user.role || 1,
      roleName,
      roleType,
    });

    const permissions = moduleAccess.permissions.includes('all')
      ? Array.from(new Set(['all', ...(await getDatabasePermissionsForRole(user.role || 1) || moduleAccess.permissions)]))
      : Array.from(new Set((await getDatabasePermissionsForRole(user.role || 1)) || moduleAccess.permissions));

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email || '',
      cemail: user.email || '',
      role: user.role || 1,
      branch: user.branch || 0,
      region: user.region || 0,
      type: moduleAccess.roleLabel || roleType,
      photo: user.photo || '',
      wfh: user.wfh || 0,
      permissions
    };

    const token = generateToken(userWithoutPassword);

    return { ...userWithoutPassword, token };
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return null;
  }
}
