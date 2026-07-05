create extension if not exists "pgcrypto";

create type public.app_role as enum ('owner', 'cleaner');
create type public.membership_status as enum ('active', 'revoked');
create type public.inventory_status as enum ('ready', 'low_stock', 'missing', 'needs_attention');
create type public.cleaning_job_status as enum ('scheduled', 'in_progress', 'submitted', 'reviewed', 'blocked');
create type public.checklist_run_status as enum ('pending', 'in_progress', 'completed', 'blocked');
create type public.checklist_response_status as enum (
  'pending',
  'cleaned',
  'restocked',
  'needs_attention',
  'item_missing',
  'damage_found'
);
create type public.note_audience as enum ('owner', 'cleaner', 'shared');
create type public.note_type as enum ('general', 'instruction', 'turnover', 'issue');
create type public.issue_category as enum ('repair', 'maintenance', 'replace');
create type public.issue_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.issue_status as enum ('open', 'reviewing', 'resolved');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text unique,
  display_name text,
  phone text,
  role public.app_role not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.houses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  created_at timestamptz not null default timezone('utc', now())
);

create table public.house_members (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  member_user_id uuid not null references public.profiles(id) on delete cascade,
  invited_by_user_id uuid not null references public.profiles(id) on delete cascade,
  status public.membership_status not null default 'active',
  can_manage_access boolean not null default false,
  invite_code text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (house_id, member_user_id)
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  name text not null,
  room_type text not null,
  icon_key text,
  instructions text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit_type text not null,
  tracks_quantity boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.room_inventory_items (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  minimum_quantity integer not null default 0,
  current_quantity integer,
  status public.inventory_status not null default 'ready',
  display_order integer not null default 0,
  required_for_ready boolean not null default true,
  storage_location_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (room_id, inventory_item_id)
);

create table public.cleaning_jobs (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  assigned_user_id uuid references public.profiles(id) on delete set null,
  scheduled_for timestamptz not null,
  status public.cleaning_job_status not null default 'scheduled',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  owner_note text,
  cleaner_note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  room_type text not null,
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.checklist_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.checklist_templates(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  required_photo boolean not null default false
);

create table public.checklist_runs (
  id uuid primary key default gen_random_uuid(),
  cleaning_job_id uuid not null references public.cleaning_jobs(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  status public.checklist_run_status not null default 'pending',
  completed_at timestamptz
);

create table public.checklist_run_items (
  id uuid primary key default gen_random_uuid(),
  checklist_run_id uuid not null references public.checklist_runs(id) on delete cascade,
  template_item_id uuid not null references public.checklist_template_items(id) on delete cascade,
  response_status public.checklist_response_status default 'pending',
  note text,
  photo_required boolean not null default false,
  photo_count integer not null default 0,
  completed_at timestamptz
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references public.houses(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete cascade,
  cleaning_job_id uuid references public.cleaning_jobs(id) on delete cascade,
  issue_id uuid,
  author_user_id uuid not null references public.profiles(id) on delete cascade,
  audience public.note_audience not null default 'shared',
  note_type public.note_type not null default 'general',
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.issues (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  cleaning_job_id uuid references public.cleaning_jobs(id) on delete set null,
  category public.issue_category not null,
  title text not null,
  description text not null,
  priority public.issue_priority not null default 'medium',
  status public.issue_status not null default 'open',
  requires_owner_review boolean not null default true,
  reported_by_user_id uuid not null references public.profiles(id) on delete cascade,
  resolution_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);

alter table public.notes
  add constraint notes_issue_id_fkey
  foreign key (issue_id) references public.issues(id) on delete cascade;

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  house_id uuid references public.houses(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete cascade,
  note_id uuid references public.notes(id) on delete cascade,
  issue_id uuid references public.issues(id) on delete cascade,
  uploaded_by_user_id uuid not null references public.profiles(id) on delete cascade,
  file_path text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.house_playbooks (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references public.houses(id) on delete cascade,
  section text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index houses_owner_user_id_idx on public.houses (owner_user_id);
create index rooms_house_id_idx on public.rooms (house_id);
create index house_members_member_user_id_idx on public.house_members (member_user_id);
create index room_inventory_items_room_id_idx on public.room_inventory_items (room_id);
create index cleaning_jobs_house_id_idx on public.cleaning_jobs (house_id);
create index cleaning_jobs_assigned_user_id_idx on public.cleaning_jobs (assigned_user_id);
create index checklist_runs_cleaning_job_id_idx on public.checklist_runs (cleaning_job_id);
create index notes_house_id_idx on public.notes (house_id);
create index issues_house_id_idx on public.issues (house_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, display_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'owner')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.user_owns_house(target_house_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.houses
    where id = target_house_id
      and owner_user_id = auth.uid()
  )
$$;

create or replace function public.user_can_access_house(target_house_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.user_owns_house(target_house_id)
    or exists (
      select 1
      from public.house_members
      where house_id = target_house_id
        and member_user_id = auth.uid()
        and status = 'active'
    )
$$;

alter table public.profiles enable row level security;
alter table public.houses enable row level security;
alter table public.house_members enable row level security;
alter table public.rooms enable row level security;
alter table public.inventory_items enable row level security;
alter table public.room_inventory_items enable row level security;
alter table public.cleaning_jobs enable row level security;
alter table public.checklist_templates enable row level security;
alter table public.checklist_template_items enable row level security;
alter table public.checklist_runs enable row level security;
alter table public.checklist_run_items enable row level security;
alter table public.notes enable row level security;
alter table public.issues enable row level security;
alter table public.attachments enable row level security;
alter table public.house_playbooks enable row level security;

create policy "profiles are readable by signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "owners and assigned cleaners read houses"
  on public.houses for select
  to authenticated
  using (public.user_can_access_house(id));

create policy "owners create houses"
  on public.houses for insert
  to authenticated
  with check (owner_user_id = auth.uid() and public.current_app_role() = 'owner');

create policy "owners update houses"
  on public.houses for update
  to authenticated
  using (public.user_owns_house(id))
  with check (public.user_owns_house(id));

create policy "owners and assigned cleaners read house members"
  on public.house_members for select
  to authenticated
  using (public.user_can_access_house(house_id));

create policy "owners manage house members"
  on public.house_members for all
  to authenticated
  using (public.user_owns_house(house_id))
  with check (public.user_owns_house(house_id));

create policy "owners and assigned cleaners read rooms"
  on public.rooms for select
  to authenticated
  using (public.user_can_access_house(house_id));

create policy "owners manage rooms"
  on public.rooms for all
  to authenticated
  using (public.user_owns_house(house_id))
  with check (public.user_owns_house(house_id));

create policy "signed-in users read inventory catalog"
  on public.inventory_items for select
  to authenticated
  using (true);

create policy "owners manage inventory catalog"
  on public.inventory_items for all
  to authenticated
  using (public.current_app_role() = 'owner')
  with check (public.current_app_role() = 'owner');

create policy "owners and assigned cleaners read room inventory"
  on public.room_inventory_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.rooms
      where rooms.id = room_inventory_items.room_id
        and public.user_can_access_house(rooms.house_id)
    )
  );

create policy "owners and assigned cleaners update room inventory"
  on public.room_inventory_items for all
  to authenticated
  using (
    exists (
      select 1
      from public.rooms
      where rooms.id = room_inventory_items.room_id
        and public.user_can_access_house(rooms.house_id)
    )
  )
  with check (
    exists (
      select 1
      from public.rooms
      where rooms.id = room_inventory_items.room_id
        and public.user_can_access_house(rooms.house_id)
    )
  );

create policy "owners and assigned cleaners access cleaning jobs"
  on public.cleaning_jobs for select
  to authenticated
  using (public.user_can_access_house(house_id));

create policy "owners manage cleaning jobs"
  on public.cleaning_jobs for insert
  to authenticated
  with check (public.user_owns_house(house_id));

create policy "owners and assigned cleaners update cleaning jobs"
  on public.cleaning_jobs for update
  to authenticated
  using (public.user_can_access_house(house_id))
  with check (public.user_can_access_house(house_id));

create policy "owners and assigned cleaners access checklist templates"
  on public.checklist_templates for select
  to authenticated
  using (public.user_can_access_house(house_id));

create policy "owners manage checklist templates"
  on public.checklist_templates for all
  to authenticated
  using (public.user_owns_house(house_id))
  with check (public.user_owns_house(house_id));

create policy "owners and assigned cleaners access checklist template items"
  on public.checklist_template_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.checklist_templates
      where checklist_templates.id = checklist_template_items.template_id
        and public.user_can_access_house(checklist_templates.house_id)
    )
  );

create policy "owners manage checklist template items"
  on public.checklist_template_items for all
  to authenticated
  using (
    exists (
      select 1
      from public.checklist_templates
      where checklist_templates.id = checklist_template_items.template_id
        and public.user_owns_house(checklist_templates.house_id)
    )
  )
  with check (
    exists (
      select 1
      from public.checklist_templates
      where checklist_templates.id = checklist_template_items.template_id
        and public.user_owns_house(checklist_templates.house_id)
    )
  );

create policy "owners and assigned cleaners access checklist runs"
  on public.checklist_runs for all
  to authenticated
  using (
    exists (
      select 1
      from public.cleaning_jobs
      where cleaning_jobs.id = checklist_runs.cleaning_job_id
        and public.user_can_access_house(cleaning_jobs.house_id)
    )
  )
  with check (
    exists (
      select 1
      from public.cleaning_jobs
      where cleaning_jobs.id = checklist_runs.cleaning_job_id
        and public.user_can_access_house(cleaning_jobs.house_id)
    )
  );

create policy "owners and assigned cleaners access checklist run items"
  on public.checklist_run_items for all
  to authenticated
  using (
    exists (
      select 1
      from public.checklist_runs
      join public.cleaning_jobs on cleaning_jobs.id = checklist_runs.cleaning_job_id
      where checklist_runs.id = checklist_run_items.checklist_run_id
        and public.user_can_access_house(cleaning_jobs.house_id)
    )
  )
  with check (
    exists (
      select 1
      from public.checklist_runs
      join public.cleaning_jobs on cleaning_jobs.id = checklist_runs.cleaning_job_id
      where checklist_runs.id = checklist_run_items.checklist_run_id
        and public.user_can_access_house(cleaning_jobs.house_id)
    )
  );

create policy "owners and assigned cleaners access notes"
  on public.notes for all
  to authenticated
  using (
    coalesce(
      public.user_can_access_house(house_id),
      exists (
        select 1
        from public.rooms
        where rooms.id = notes.room_id
          and public.user_can_access_house(rooms.house_id)
      ),
      false
    )
  )
  with check (
    coalesce(
      public.user_can_access_house(house_id),
      exists (
        select 1
        from public.rooms
        where rooms.id = notes.room_id
          and public.user_can_access_house(rooms.house_id)
      ),
      false
    )
  );

create policy "owners and assigned cleaners access issues"
  on public.issues for all
  to authenticated
  using (public.user_can_access_house(house_id))
  with check (public.user_can_access_house(house_id));

create policy "owners and assigned cleaners access attachments"
  on public.attachments for all
  to authenticated
  using (
    coalesce(
      public.user_can_access_house(house_id),
      exists (
        select 1
        from public.rooms
        where rooms.id = attachments.room_id
          and public.user_can_access_house(rooms.house_id)
      ),
      false
    )
  )
  with check (
    coalesce(
      public.user_can_access_house(house_id),
      exists (
        select 1
        from public.rooms
        where rooms.id = attachments.room_id
          and public.user_can_access_house(rooms.house_id)
      ),
      false
    )
  );

create policy "owners and assigned cleaners access playbooks"
  on public.house_playbooks for all
  to authenticated
  using (public.user_can_access_house(house_id))
  with check (public.user_owns_house(house_id));
