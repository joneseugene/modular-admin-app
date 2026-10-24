
-- Seed the initial Modular Admin Lab platform catalogue.
-- Safe to re-run: records are matched by their stable keys/slugs.

BEGIN;

-- 1. Seed platform permissions
INSERT INTO public.permissions (name, key, description)
VALUES
  ('View dashboard', 'dashboard.view', 'Access the platform dashboard.'),
  ('View users', 'users.view', 'View user accounts.'),
  ('Create users', 'users.create', 'Create user accounts.'),
  ('Update users', 'users.update', 'Update user account details.'),
  ('Delete users', 'users.delete', 'Delete user accounts.'),
  ('View roles', 'roles.view', 'View platform roles.'),
  ('Create roles', 'roles.create', 'Create platform roles.'),
  ('Update roles', 'roles.update', 'Update platform roles.'),
  ('Delete roles', 'roles.delete', 'Delete platform roles.'),
  ('Manage role permissions', 'roles.manage_permissions', 'Assign and revoke permissions for roles.'),
  ('View features', 'features.view', 'View configured platform modules.'),
  ('Update features', 'features.update', 'Update module configuration.')
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. Seed the initial system role
INSERT INTO public.roles (name, slug, description, is_system)
VALUES (
  'Super Administrator',
  'super_admin',
  'Full access to the Modular Admin Lab platform.',
  TRUE
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_system = TRUE;

-- 3. Grant all seeded permissions to super_admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles AS r
CROSS JOIN public.permissions AS p
WHERE r.slug = 'super_admin'
  AND p.key IN (
    'dashboard.view',
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'roles.view',
    'roles.create',
    'roles.update',
    'roles.delete',
    'roles.manage_permissions',
    'features.view',
    'features.update'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 4. Seed the initial module catalogue
INSERT INTO public.modules (
  key,
  name,
  description,
  path,
  icon,
  navigation_group,
  sort_order,
  is_enabled,
  show_in_sidebar,
  show_in_header
)
VALUES
  (
    'dashboard',
    'Dashboard',
    'Overview of the platform.',
    '/dashboard',
    'LayoutDashboard',
    'Overview',
    1,
    TRUE,
    TRUE,
    FALSE
  ),
  (
    'users',
    'Users',
    'Manage user accounts and access.',
    '/users',
    'Users',
    'Administration',
    2,
    TRUE,
    TRUE,
    FALSE
  ),
  (
    'roles',
    'Roles',
    'Manage roles and their permissions.',
    '/roles',
    'ShieldCheck',
    'Administration',
    3,
    TRUE,
    TRUE,
    FALSE
  ),
  (
    'features',
    'Features',
    'Configure platform modules and navigation.',
    '/features',
    'Blocks',
    'System',
    4,
    TRUE,
    TRUE,
    FALSE
  )
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  path = EXCLUDED.path,
  icon = EXCLUDED.icon,
  navigation_group = EXCLUDED.navigation_group,
  sort_order = EXCLUDED.sort_order,
  is_enabled = EXCLUDED.is_enabled,
  show_in_sidebar = EXCLUDED.show_in_sidebar,
  show_in_header = EXCLUDED.show_in_header;

-- 5. Grant super_admin access to every seeded module
INSERT INTO public.role_module_access (role_id, module_id, can_access)
SELECT r.id, m.id, TRUE
FROM public.roles AS r
CROSS JOIN public.modules AS m
WHERE r.slug = 'super_admin'
  AND m.key IN ('dashboard', 'users', 'roles', 'features')
ON CONFLICT (role_id, module_id) DO UPDATE SET
  can_access = TRUE;

COMMIT;
