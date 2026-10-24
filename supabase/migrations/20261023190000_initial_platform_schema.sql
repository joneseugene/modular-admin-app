
-- ============================================================
-- Modular Admin Lab
-- Initial platform schema
-- ============================================================

begin;

create schema if not exists private;

-- ------------------------------------------------------------
-- 1. Roles
-- ------------------------------------------------------------

create table public.roles (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    is_system boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint roles_name_not_blank
        check (length(trim(name)) > 0),

    constraint roles_slug_format
        check (slug ~ '^[a-z][a-z0-9_]*$')
);

-- ------------------------------------------------------------
-- 2. Permissions
-- ------------------------------------------------------------

create table public.permissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    key text not null unique,
    description text,
    created_at timestamptz not null default now(),

    constraint permissions_name_not_blank
        check (length(trim(name)) > 0),

    constraint permissions_key_format
        check (key ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$')
);

-- ------------------------------------------------------------
-- 3. Role permissions
-- ------------------------------------------------------------

create table public.role_permissions (
    role_id uuid not null
        references public.roles(id) on delete cascade,
    permission_id uuid not null
        references public.permissions(id) on delete cascade,
    created_at timestamptz not null default now(),

    primary key (role_id, permission_id)
);

create index role_permissions_permission_id_idx
    on public.role_permissions(permission_id);

-- ------------------------------------------------------------
-- 4. User profiles
-- ------------------------------------------------------------

create table public.profiles (
    id uuid primary key
        references auth.users(id) on delete cascade,
    display_name text,
    phone text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint profiles_display_name_not_blank
        check (
            display_name is null
            or length(trim(display_name)) > 0
        )
);

create unique index profiles_phone_unique_idx
    on public.profiles(phone)
    where phone is not null;

-- ------------------------------------------------------------
-- 5. User role assignments
-- ------------------------------------------------------------

create table public.user_roles (
    user_id uuid not null
        references public.profiles(id) on delete cascade,
    role_id uuid not null
        references public.roles(id) on delete restrict,
    assigned_by uuid
        references public.profiles(id) on delete set null,
    created_at timestamptz not null default now(),

    primary key (user_id, role_id)
);

create index user_roles_role_id_idx
    on public.user_roles(role_id);

-- ------------------------------------------------------------
-- 6. Modules
-- ------------------------------------------------------------

create table public.modules (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    name text not null,
    description text,
    path text,
    icon text,
    navigation_group text not null default 'Administration',
    sort_order integer not null default 0,
    is_enabled boolean not null default true,
    show_in_sidebar boolean not null default true,
    show_in_header boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint modules_key_format
        check (key ~ '^[a-z][a-z0-9_]*$'),

    constraint modules_name_not_blank
        check (length(trim(name)) > 0),

    constraint modules_path_format
        check (path is null or path like '/%')
);

-- ------------------------------------------------------------
-- 7. Role-to-module access
-- ------------------------------------------------------------

create table public.role_module_access (
    role_id uuid not null
        references public.roles(id) on delete cascade,
    module_id uuid not null
        references public.modules(id) on delete cascade,
    can_access boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    primary key (role_id, module_id)
);

create index role_module_access_module_id_idx
    on public.role_module_access(module_id);

-- ------------------------------------------------------------
-- 8. Updated-at trigger
-- ------------------------------------------------------------

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger roles_set_updated_at
    before update on public.roles
    for each row execute function private.set_updated_at();

create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute function private.set_updated_at();

create trigger modules_set_updated_at
    before update on public.modules
    for each row execute function private.set_updated_at();

create trigger role_module_access_set_updated_at
    before update on public.role_module_access
    for each row execute function private.set_updated_at();

-- ------------------------------------------------------------
-- 9. Create a profile when an Auth user is created
-- ------------------------------------------------------------

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, display_name)
    values (
        new.id,
        nullif(trim(new.raw_user_meta_data ->> 'display_name'), '')
    );

    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function private.handle_new_auth_user();

-- ------------------------------------------------------------
-- 10. Authorization helper
-- ------------------------------------------------------------

create or replace function private.has_permission(
    required_permission text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.user_roles ur
        join public.role_permissions rp
            on rp.role_id = ur.role_id
        join public.permissions p
            on p.id = rp.permission_id
        join public.profiles pr
            on pr.id = ur.user_id
        join auth.users au
            on au.id = pr.id
        where ur.user_id = (select auth.uid())
          and pr.is_active = true
          and coalesce(au.is_anonymous, false) = false
          and p.key = required_permission
    );
$$;

-- ------------------------------------------------------------
-- 11. Enable row-level security
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.modules enable row level security;
alter table public.role_module_access enable row level security;

-- ------------------------------------------------------------
-- 12. Profile policies
-- ------------------------------------------------------------

create policy "Users can read their own profile"
    on public.profiles
    for select
    to authenticated
    using (
        id = (select auth.uid())
        or (select private.has_permission('users.view'))
    );

create policy "Users can update their own profile"
    on public.profiles
    for update
    to authenticated
    using (id = (select auth.uid()))
    with check (id = (select auth.uid()));

-- ------------------------------------------------------------
-- 13. Role and permission policies
-- ------------------------------------------------------------

create policy "Authorized users can view roles"
    on public.roles
    for select
    to authenticated
    using (
        (select private.has_permission('roles.view'))
    );

create policy "Authorized users can manage roles"
    on public.roles
    for all
    to authenticated
    using (
        (select private.has_permission('roles.update'))
    )
    with check (
        (select private.has_permission('roles.update'))
    );

create policy "Authorized users can view permissions"
    on public.permissions
    for select
    to authenticated
    using (
        (select private.has_permission('roles.view'))
    );

create policy "Authorized users can manage permissions"
    on public.permissions
    for all
    to authenticated
    using (
        (select private.has_permission('roles.manage_permissions'))
    )
    with check (
        (select private.has_permission('roles.manage_permissions'))
    );

create policy "Authorized users can view role permissions"
    on public.role_permissions
    for select
    to authenticated
    using (
        (select private.has_permission('roles.view'))
    );

create policy "Authorized users can manage role permissions"
    on public.role_permissions
    for all
    to authenticated
    using (
        (select private.has_permission('roles.manage_permissions'))
    )
    with check (
        (select private.has_permission('roles.manage_permissions'))
    );

-- ------------------------------------------------------------
-- 14. User-role assignment policies
-- ------------------------------------------------------------

create policy "Authorized users can view user roles"
    on public.user_roles
    for select
    to authenticated
    using (
        user_id = (select auth.uid())
        or (select private.has_permission('users.view'))
        or (select private.has_permission('roles.view'))
    );

create policy "Authorized users can assign roles"
    on public.user_roles
    for insert
    to authenticated
    with check (
        (select private.has_permission('users.update'))
        or (select private.has_permission('roles.update'))
    );

create policy "Authorized users can remove role assignments"
    on public.user_roles
    for delete
    to authenticated
    using (
        (select private.has_permission('users.update'))
        or (select private.has_permission('roles.update'))
    );

-- ------------------------------------------------------------
-- 15. Module policies
-- ------------------------------------------------------------

create policy "Users can view enabled modules they can access"
    on public.modules
    for select
    to authenticated
    using (
        is_enabled = true
        and exists (
            select 1
            from public.user_roles ur
            join public.role_module_access rma
                on rma.role_id = ur.role_id
            where ur.user_id = (select auth.uid())
              and rma.module_id = modules.id
              and rma.can_access = true
        )
        or (select private.has_permission('features.view'))
    );

create policy "Authorized users can manage modules"
    on public.modules
    for all
    to authenticated
    using (
        (select private.has_permission('features.update'))
    )
    with check (
        (select private.has_permission('features.update'))
    );

create policy "Users can view their role module access"
    on public.role_module_access
    for select
    to authenticated
    using (
        role_id in (
            select ur.role_id
            from public.user_roles ur
            where ur.user_id = (select auth.uid())
        )
        or (select private.has_permission('features.view'))
        or (select private.has_permission('roles.view'))
    );

create policy "Authorized users can manage role module access"
    on public.role_module_access
    for all
    to authenticated
    using (
        (select private.has_permission('features.update'))
    )
    with check (
        (select private.has_permission('features.update'))
    );

-- ------------------------------------------------------------
-- 16. Restrict direct access to internal helper functions
-- ------------------------------------------------------------

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;
revoke all on function private.has_permission(text) from public, anon;
grant execute on function private.has_permission(text) to authenticated;

commit;
