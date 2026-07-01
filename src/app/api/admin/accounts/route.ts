import { DmAccounts } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: DmAccounts,
  entityName: 'account',
  searchFields: ['account_no', 'bank_name', 'bank_beneficiary', 'iban'],
  filters: { bank: 'bank_name' },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
