import { DmTask } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: DmTask,
  entityName: 'task',
  searchFields: ['task', 'status', 'doc'],
  filters: {
    status: 'status',
    assignedTo: 'asignTo',
    assignedBy: 'asignBy',
  },
  attributes: [
    'id',
    'task',
    'dob',
    'date_created',
    'stage',
    'asignTo',
    'asignBy',
    'status',
    'doc',
    'notf',
    'created',
  ],
  defaults: (body) => ({
    created: body.created || new Date(),
    date_created: body.date_created || new Date().toISOString().slice(0, 10),
  }),
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
