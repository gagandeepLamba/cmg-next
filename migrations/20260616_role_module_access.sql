INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'Operations', 40, 1, 'operations', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'operations');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'Sales', 40, 1, 'sales', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'sales');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'HR', 30, 1, 'hr', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'hr');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'PRO', 30, 1, 'pro', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'pro');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'Branch Manager', 20, 1, 'branch_manager', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'branch manager');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'Director', 10, 1, 'director', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'director');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'Founder', 5, 1, 'founder', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'founder');

INSERT INTO dm_role (name, hierarchy, status, type, department_id)
SELECT 'Super Admin', 1, 1, 'super_admin', 1
WHERE NOT EXISTS (SELECT 1 FROM dm_role WHERE LOWER(name) = 'super admin');
