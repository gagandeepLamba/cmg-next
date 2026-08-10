import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { requireAuth, isAuthError } from '@/lib/apiAuth';
import { isCeo } from '@/lib/roleChecks';
import { connectDB } from '@/lib/sequelize';

type CrudConfig = {
  model: any;
  entityName: string;
  searchFields?: string[];
  filters?: Record<string, string>;
  statusFilter?: (status: string) => Record<string, unknown>;
  defaultOrder?: [string, 'ASC' | 'DESC'][];
  attributes?: string[];
  defaults?: (body: Record<string, unknown>) => Record<string, unknown>;
  before?: () => Promise<void>;
  /** Permissions allowed to call this endpoint; any authenticated user if omitted. */
  requiredPermissions?: string[];
};

const toPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const buildWhere = (request: NextRequest, config: CrudConfig) => {
  const { searchParams } = new URL(request.url);
  const where: any = {};
  const search = searchParams.get('search')?.trim();

  if (search && config.searchFields?.length) {
    where[Op.or] = config.searchFields.map((field) => ({
      [field]: { [Op.like]: `%${search}%` },
    }));
  }

  Object.entries(config.filters || {}).forEach(([param, field]) => {
    const value = searchParams.get(param);
    if (value) {
      where[field] = value;
    }
  });

  const status = searchParams.get('status');
  if (status) {
    Object.assign(where, config.statusFilter ? config.statusFilter(status) : { status });
  }

  return where;
};

let dbReady = false;
const ensureCrudDB = async () => {
  if (!dbReady) {
    await connectDB();
    dbReady = true;
  }
};

const readJsonBody = async (request: NextRequest) => {
  try {
    return { body: await request.json() as Record<string, unknown> };
  } catch {
    return {
      error: NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 }),
    };
  }
};

export const createCrudHandlers = (config: CrudConfig) => ({
  async GET(request: NextRequest) {
    const auth = requireAuth(request, config.requiredPermissions);
    if (isAuthError(auth)) return auth;
    try {
      await ensureCrudDB();
      await config.before?.();
      const { searchParams } = new URL(request.url);
      const page = toPositiveInt(searchParams.get('page'), 1);
      const limit = toPositiveInt(searchParams.get('limit'), 10);
      const where = buildWhere(request, config);

      const { rows, count } = await config.model.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: config.defaultOrder || [['id', 'DESC']],
        ...(config.attributes ? { attributes: config.attributes } : {}),
      });

      return NextResponse.json({
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error(`Failed to fetch ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${config.entityName}` },
        { status: 500 }
      );
    }
  },

  async POST(request: NextRequest) {
    const auth = requireAuth(request, config.requiredPermissions);
    if (isAuthError(auth)) return auth;
    try {
      await ensureCrudDB();
      await config.before?.();
      const parsed = await readJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.body;
      const { id: _id, ...createData } = {
        ...body,
        ...(config.defaults ? config.defaults(body) : {}),
      };

      const record = await config.model.create(createData);
      return NextResponse.json(record, { status: 201 });
    } catch (error) {
      console.error(`Failed to create ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to create ${config.entityName}` },
        { status: 500 }
      );
    }
  },

  async PUT(request: NextRequest) {
    const auth = requireAuth(request, config.requiredPermissions);
    if (isAuthError(auth)) return auth;
    try {
      await ensureCrudDB();
      await config.before?.();
      const parsed = await readJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.body;
      const id = Number.parseInt(String(body.id || ''), 10);
      const { id: _id, ...updateData } = body;

      if (!id) {
        return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 });
      }

      const record = await config.model.findByPk(id);
      if (!record) {
        return NextResponse.json(
          { error: `${config.entityName} not found` },
          { status: 404 }
        );
      }

      await record.update(updateData);
      return NextResponse.json(record);
    } catch (error) {
      console.error(`Failed to update ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to update ${config.entityName}` },
        { status: 500 }
      );
    }
  },

  async DELETE(request: NextRequest) {
    const auth = requireAuth(request, config.requiredPermissions);
    if (isAuthError(auth)) return auth;
    // Deleting is CEO-only across every CRM module, regardless of what
    // requiredPermissions this entity's config otherwise allows for GET/POST/PUT.
    if (!isCeo(auth)) {
      return NextResponse.json({ error: 'Only the CEO can delete records' }, { status: 403 });
    }
    try {
      await ensureCrudDB();
      await config.before?.();
      const { searchParams } = new URL(request.url);
      const id = Number.parseInt(searchParams.get('id') || '', 10);

      if (!id) {
        return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 });
      }

      const deleted = await config.model.destroy({ where: { id } });
      if (!deleted) {
        return NextResponse.json(
          { error: `${config.entityName} not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: `${config.entityName} deleted successfully` });
    } catch (error) {
      console.error(`Failed to delete ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to delete ${config.entityName}` },
        { status: 500 }
      );
    }
  },
});
