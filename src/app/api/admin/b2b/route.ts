import { DmB2b } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: DmB2b,
  entityName: 'B2B partner',
  searchFields: ['name'],
  filters: { status: 'status' },
  defaults: (body) => ({
    created: body.created || new Date(),
    created_by: body.created_by || 1,
  }),
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
