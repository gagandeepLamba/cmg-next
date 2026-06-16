import { DmB2bInvoices } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: DmB2bInvoices,
  entityName: 'invoice',
  searchFields: ['receipt', 'company', 'purpose'],
  filters: {
    region: 'region',
    status: 'status',
  },
  defaults: (body) => ({
    created: body.created || new Date(),
  }),
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
