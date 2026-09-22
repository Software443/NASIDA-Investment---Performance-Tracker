-- NASIDA Performance & Investment Register -- Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
--
-- Safe to re-run from scratch at any time: tables use `if not exists`, functions
-- use `create or replace`, and every policy is dropped first if it already exists.
--
-- Covers everything the app currently uses: department appraisals, investments
-- (with department attribution and Announced/Actualized status), workforce
-- records, and admin-defined custom KPIs. Every write rule enforced in the
-- frontend is also enforced here via Row Level Security, so it holds even if
-- someone calls the Supabase API directly.

-- ============ EXTENSIONS ============
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ============ PROFILES ============
-- auth.users is Supabase's built-in auth table; we extend it with app-specific
-- fields since auth.users itself shouldn't be modified directly.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('admin', 'staff')),
  department text check (department in ('IPF','PPP','EODB','S&I','ACCOUNT','COMMS','ADMIN')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Helpers used by policies below to check the caller's role/department cheaply.
-- These must be defined before any policy references them. security definer
-- lets them read the profiles table on the caller's behalf without recursing
-- back into the RLS policy currently being evaluated.
create or replace function my_role() returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function my_department() returns text as $$
  select department from profiles where id = auth.uid();
$$ language sql stable security definer;

drop policy if exists "Admins see all profiles; everyone sees their own" on profiles;
create policy "Admins see all profiles; everyone sees their own" on profiles
  for select using (my_role() = 'admin' or id = auth.uid());

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
-- Pass role/department/name in the signup call's `options.data`, e.g.:
--   supabase.auth.signUp({ email, password, options: { data: { name, role, department } } })
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, department)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'staff'),
    nullif(new.raw_user_meta_data->>'department', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============ APPRAISALS ============

create table if not exists appraisals (
  id uuid primary key default gen_random_uuid(),
  department text not null check (department in ('IPF','PPP','EODB','S&I','ACCOUNT','COMMS','ADMIN')),
  period text,
  activity text,
  objective text,
  indicator text,
  outcome text,
  status text check (status in ('Not Started','Ongoing','Completed','Delayed')) default 'Not Started',
  mov text,
  comments text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table appraisals enable row level security;

drop policy if exists "Everyone can view appraisals" on appraisals;
create policy "Everyone can view appraisals" on appraisals
  for select using (auth.role() = 'authenticated');

drop policy if exists "Admin or own department can insert appraisals" on appraisals;
create policy "Admin or own department can insert appraisals" on appraisals
  for insert with check (my_role() = 'admin' or my_department() = department);

drop policy if exists "Admin or own department can update appraisals" on appraisals;
create policy "Admin or own department can update appraisals" on appraisals
  for update using (my_role() = 'admin' or my_department() = department);

drop policy if exists "Admin or own department can delete appraisals" on appraisals;
create policy "Admin or own department can delete appraisals" on appraisals
  for delete using (my_role() = 'admin' or my_department() = department);

-- ============ INVESTMENTS ============
-- amount is stored in USD; the frontend converts for display in other currencies.

create table if not exists investments (
  id uuid primary key default gen_random_uuid(),
  company_investor text not null,
  project_description text,
  sector text,
  lga text,
  amount numeric,
  source text check (source in ('FDI','DDI')),
  status text check (status in ('Announced','Actualized')) default 'Announced',
  department text check (department in ('IPF','PPP','EODB','S&I','ACCOUNT','COMMS','ADMIN')),
  jobs_to_be_created integer,
  date_recorded date,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table investments enable row level security;

drop policy if exists "Everyone can view investments" on investments;
create policy "Everyone can view investments" on investments
  for select using (auth.role() = 'authenticated');

drop policy if exists "Only admin can insert investments" on investments;
create policy "Only admin can insert investments" on investments
  for insert with check (my_role() = 'admin');

drop policy if exists "Only admin can update investments" on investments;
create policy "Only admin can update investments" on investments
  for update using (my_role() = 'admin');

drop policy if exists "Only admin can delete investments" on investments;
create policy "Only admin can delete investments" on investments
  for delete using (my_role() = 'admin');

-- ============ EMPLOYEES (Workforce page) ============
-- department is nullable: agency-wide executive roles (MD/CEO, Chief of Staff)
-- deliberately aren't attached to a single department.

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text check (department in ('IPF','PPP','EODB','S&I','ACCOUNT','COMMS','ADMIN')), -- null = agency-wide/executive
  gender text check (gender in ('Male','Female')),
  job_category text check (job_category in ('Contract','Fulltime','Pool','IT','NYSC')),
  designation text,
  status text check (status in ('Active','Exited')) default 'Active',
  hire_date date,
  exit_date date,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table employees enable row level security;

drop policy if exists "Everyone can view employees" on employees;
create policy "Everyone can view employees" on employees
  for select using (auth.role() = 'authenticated');

drop policy if exists "Only admin can insert employees" on employees;
create policy "Only admin can insert employees" on employees
  for insert with check (my_role() = 'admin');

drop policy if exists "Only admin can update employees" on employees;
create policy "Only admin can update employees" on employees
  for update using (my_role() = 'admin');

drop policy if exists "Only admin can delete employees" on employees;
create policy "Only admin can delete employees" on employees
  for delete using (my_role() = 'admin');

-- ============ CUSTOM KPI DEFINITIONS ============
-- Formulas are evaluated client-side using the safe formula engine in
-- kpiEngine.js -- never as raw SQL -- so storing arbitrary user-written
-- formula text here carries no injection risk.

create table if not exists kpi_definitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  dataset text not null check (dataset in ('appraisals','investments')),
  formula text not null,
  format text not null default 'number' check (format in ('number','currency','percent')),
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table kpi_definitions enable row level security;

drop policy if exists "Everyone can view custom KPIs" on kpi_definitions;
create policy "Everyone can view custom KPIs" on kpi_definitions
  for select using (auth.role() = 'authenticated');

drop policy if exists "Only admin can create custom KPIs" on kpi_definitions;
create policy "Only admin can create custom KPIs" on kpi_definitions
  for insert with check (my_role() = 'admin');

drop policy if exists "Only admin can update custom KPIs" on kpi_definitions;
create policy "Only admin can update custom KPIs" on kpi_definitions
  for update using (my_role() = 'admin');

drop policy if exists "Only admin can delete custom KPIs" on kpi_definitions;
create policy "Only admin can delete custom KPIs" on kpi_definitions
  for delete using (my_role() = 'admin');

-- ============ REALTIME ============
-- Lets every connected dashboard update instantly when anyone adds/edits/deletes
-- a record, with no manual refresh. Wrapped in existence checks so this section
-- really is safe to re-run (a bare ALTER PUBLICATION ... ADD TABLE errors if the
-- table's already a member).

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'appraisals') then
    alter publication supabase_realtime add table appraisals;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'investments') then
    alter publication supabase_realtime add table investments;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'employees') then
    alter publication supabase_realtime add table employees;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'kpi_definitions') then
    alter publication supabase_realtime add table kpi_definitions;
  end if;
end $$;

