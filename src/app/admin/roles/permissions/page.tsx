import { rolePermissionMatrix } from '@/lib/modulePermissions';

const badgeClass = (value: string) => {
  if (value === 'Yes' || value.includes('Full CRUD')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (value.includes('View') || value.includes('Payroll') || value.includes('Team') || value.includes('Add/Edit')) return 'bg-sky-50 text-sky-700 border-sky-200';
  if (value === 'No' || value.includes('No Access')) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

export default function ModulePermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">User Roles & Permissions</p>
        <h1 className="text-3xl font-bold text-slate-950">Role Access Matrix</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          These permissions are applied during login and control Sales, Operations, HR, PRO, and admin module access.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Role', 'Sales Module', 'Operations Module', 'HR Module', 'PRO Module', 'Admin', 'Permission Keys'].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rolePermissionMatrix.map((row) => (
              <tr key={row.key} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm font-medium text-slate-950">{row.role}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${badgeClass(row.salesModule)}`}>
                    {row.salesModule}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${badgeClass(row.operationsModule)}`}>
                    {row.operationsModule}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${badgeClass(row.hrModule)}`}>
                    {row.hrModule}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${badgeClass(row.proModule)}`}>
                    {row.proModule}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${badgeClass(row.admin)}`}>
                    {row.admin}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex max-w-2xl flex-wrap gap-2">
                    {row.permissions.map((permission) => (
                      <span key={permission} className="rounded-full bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
