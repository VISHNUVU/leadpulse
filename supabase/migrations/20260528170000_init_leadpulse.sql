create extension if not exists "pgcrypto";

create type public.organization_type as enum ('agency', 'business');
create type public.workspace_role as enum ('owner', 'admin', 'manager', 'salesperson', 'client_viewer');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost');
create type public.quality_status as enum ('hot', 'warm', 'cold', 'junk');
create type public.followup_status as enum ('pending', 'completed', 'cancelled');

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.organization_type not null default 'agency',
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  industry text,
  timezone text not null default 'Asia/Kolkata',
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.workspace_role not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null default 'Default Pipeline',
  created_at timestamptz not null default now()
);

create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  name text not null,
  color text,
  position integer not null,
  is_won boolean not null default false,
  is_lost boolean not null default false
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  pipeline_stage_id uuid references public.pipeline_stages(id) on delete set null,
  full_name text not null,
  company_name text,
  phone text not null,
  email text,
  city text,
  source text,
  campaign text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status public.lead_status not null default 'new',
  quality_status public.quality_status not null default 'warm',
  lead_score integer not null default 0 check (lead_score between 0 and 100),
  priority text not null default 'medium',
  budget_estimate numeric(12,2),
  first_contact_at timestamptz,
  last_contact_at timestamptz,
  next_followup_at timestamptz,
  won_at timestamptz,
  lost_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  description text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  title text not null,
  due_at timestamptz not null,
  status public.followup_status not null default 'pending',
  channel text not null default 'whatsapp',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_imports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  uploaded_by uuid references public.profiles(id) on delete set null,
  file_name text not null,
  total_rows integer not null default 0,
  imported_rows integer not null default 0,
  failed_rows integer not null default 0,
  error_summary jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null,
  status text not null default 'draft',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_workspace_member(workspace uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = workspace
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.has_workspace_role(workspace uuid, allowed_roles public.workspace_role[])
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = workspace
      and wm.user_id = auth.uid()
      and wm.role = any(allowed_roles)
  );
$$;

alter table public.organizations enable row level security;
alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.notes enable row level security;
alter table public.followups enable row level security;
alter table public.whatsapp_templates enable row level security;
alter table public.lead_imports enable row level security;
alter table public.integrations enable row level security;

create policy "profiles can view self"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles can update self"
on public.profiles
for update
using (auth.uid() = id);

create policy "organization owners can view own org"
on public.organizations
for select
using (owner_user_id = auth.uid());

create policy "workspace members can view workspaces"
on public.workspaces
for select
using (public.is_workspace_member(id));

create policy "owners and admins can manage workspaces"
on public.workspaces
for all
using (public.has_workspace_role(id, array['owner', 'admin']::public.workspace_role[]))
with check (public.has_workspace_role(id, array['owner', 'admin']::public.workspace_role[]));

create policy "workspace members can view memberships"
on public.workspace_members
for select
using (public.is_workspace_member(workspace_id));

create policy "owners and admins can manage memberships"
on public.workspace_members
for all
using (public.has_workspace_role(workspace_id, array['owner', 'admin']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'admin']::public.workspace_role[]));

create policy "workspace members can view leads"
on public.leads
for select
using (
  public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager', 'client_viewer']::public.workspace_role[])
  or assigned_to = auth.uid()
);

create policy "sales roles can create and update leads"
on public.leads
for all
using (
  public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
  or assigned_to = auth.uid()
)
with check (
  public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
  or assigned_to = auth.uid()
);

create policy "workspace members can view lead activities"
on public.lead_activities
for select
using (
  exists (
    select 1 from public.leads l
    where l.id = lead_id and public.is_workspace_member(l.workspace_id)
  )
);

create policy "sales roles can manage lead activities"
on public.lead_activities
for all
using (
  exists (
    select 1 from public.leads l
    where l.id = lead_id
      and (
        public.has_workspace_role(l.workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
        or l.assigned_to = auth.uid()
      )
  )
)
with check (
  exists (
    select 1 from public.leads l
    where l.id = lead_id
      and (
        public.has_workspace_role(l.workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
        or l.assigned_to = auth.uid()
      )
  )
);

create policy "workspace members can view notes"
on public.notes
for select
using (
  exists (
    select 1 from public.leads l
    where l.id = lead_id and public.is_workspace_member(l.workspace_id)
  )
);

create policy "sales roles can manage notes"
on public.notes
for all
using (
  exists (
    select 1 from public.leads l
    where l.id = lead_id
      and (
        public.has_workspace_role(l.workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
        or l.assigned_to = auth.uid()
      )
  )
)
with check (
  exists (
    select 1 from public.leads l
    where l.id = lead_id
      and (
        public.has_workspace_role(l.workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
        or l.assigned_to = auth.uid()
      )
  )
);

create policy "workspace members can view followups"
on public.followups
for select
using (
  public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager', 'client_viewer']::public.workspace_role[])
  or assigned_to = auth.uid()
);

create policy "sales roles can manage followups"
on public.followups
for all
using (
  public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
  or assigned_to = auth.uid()
)
with check (
  public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[])
  or assigned_to = auth.uid()
);

create policy "workspace members can view templates"
on public.whatsapp_templates
for select
using (public.is_workspace_member(workspace_id));

create policy "owners admins managers can manage templates"
on public.whatsapp_templates
for all
using (public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[]));

create policy "owners admins managers can manage imports"
on public.lead_imports
for all
using (public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'admin', 'manager']::public.workspace_role[]));

create policy "workspace members can view integrations"
on public.integrations
for select
using (public.is_workspace_member(workspace_id));

create policy "owners and admins can manage integrations"
on public.integrations
for all
using (public.has_workspace_role(workspace_id, array['owner', 'admin']::public.workspace_role[]))
with check (public.has_workspace_role(workspace_id, array['owner', 'admin']::public.workspace_role[]));
