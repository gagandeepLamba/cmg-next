import { DmEmployer } from '@/models';
import { createCrudHandlers } from '@/lib/apiCrud';
import { sequelize } from '@/lib/sequelize';

const ensureEmployerTable = () =>
  sequelize.query(`
    CREATE TABLE IF NOT EXISTS dm_employer (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      mobile VARCHAR(50) NULL,
      paddress TEXT NULL,
      vendor_id INT NOT NULL DEFAULT 0,
      status INT NOT NULL DEFAULT 1,
      website VARCHAR(255) NULL,
      company_name VARCHAR(255) NULL,
      created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_by INT NOT NULL DEFAULT 1
    )
  `).then(() => undefined);

const handlers = createCrudHandlers({
  model: DmEmployer,
  entityName: 'employer',
  searchFields: ['name', 'email', 'company_name', 'mobile'],
  filters: { vendor: 'vendor_id', status: 'status' },
  defaults: (body) => ({
    created: body.created || new Date(),
    created_by: body.created_by || 1,
  }),
  before: ensureEmployerTable,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
