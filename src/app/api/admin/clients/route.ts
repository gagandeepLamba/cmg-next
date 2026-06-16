import { DmClients } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: DmClients,
  entityName: 'client',
  searchFields: ['first_name', 'last_name', 'email', 'city', 'nationality'],
  filters: {
    status: 'status',
    verification: 'verify',
  },
  defaults: (body) => ({
    created: body.created || new Date(),
    token_validity:
      body.token_validity || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  }),
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
