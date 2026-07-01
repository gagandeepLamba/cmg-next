import { Appointments } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';

const handlers = createCrudHandlers({
  model: Appointments,
  entityName: 'appointment',
  searchFields: ['date', 'leadid'],
  attributes: ['id', 'leadid', 'date', 'appointtime', 'counsilorid', 'booked', 'done', 'not_done', 'region', 'branch', 'screenshot'],
  statusFilter: (status) => {
    if (status === 'booked') return { booked: 1 };
    if (status === 'completed') return { done: 1 };
    if (status === 'cancelled') return { not_done: 1 };
    if (status === 'pending') return { booked: 0 };
    return {};
  },
  defaultOrder: [['date', 'DESC']],
  defaults: (body) => ({
    appointtime: normalizeTime(body.appointtime || body.time || '09:00'),
    booked: Number(body.booked ?? 1),
    done: Number(body.done ?? 0),
    not_done: Number(body.not_done ?? 0),
    branch: Number(body.branch ?? 0),
    screenshot: body.screenshot || '',
    second_done: Number(body.second_done ?? 0),
    second_meet_date: body.second_meet_date || body.date || new Date().toISOString().split('T')[0],
  }),
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

function normalizeTime(value: unknown): string {
  const time = String(value || '09:00').trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return '09:00:00';
}
