-- WCAC PCAC — database schema
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  hostel text,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- security-definer helper so accepting a response / signing up can award points
-- to *another* user without needing a broad profiles update policy.
create or replace function public.award_points(target_user uuid, amount integer)
returns void as $$
begin
  update profiles set points = points + amount where id = target_user;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function public.award_points(uuid, integer) to authenticated;

-- ── communities (hostels, committees, societies, clubs) ───────
create table if not exists communities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind text not null check (kind in ('HOSTEL','COMMITTEE','SOCIETY','CLUB')),
  description text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table communities enable row level security;

create policy "communities are viewable by authenticated users"
  on communities for select
  to authenticated
  using (true);

create policy "authenticated users can create communities"
  on communities for insert
  to authenticated
  with check (auth.uid() = created_by);

create table if not exists community_members (
  community_id uuid not null references communities(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

alter table community_members enable row level security;

create policy "community members are viewable by authenticated users"
  on community_members for select
  to authenticated
  using (true);

create policy "users can join a community themselves"
  on community_members for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can leave a community themselves"
  on community_members for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── events (committee/society event hubs) ──────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references communities(id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

create policy "events are viewable by authenticated users"
  on events for select
  to authenticated
  using (true);

create policy "community members can create events for their community"
  on events for insert
  to authenticated
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from community_members
      where community_members.community_id = events.community_id
      and community_members.user_id = auth.uid()
    )
  );

create table if not exists event_needs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  item_name text not null,
  created_at timestamptz not null default now()
);

alter table event_needs enable row level security;

create policy "event needs are viewable by authenticated users"
  on event_needs for select
  to authenticated
  using (true);

create policy "event creators can add needs to their event"
  on event_needs for insert
  to authenticated
  with check (
    exists (
      select 1 from events
      where events.id = event_needs.event_id
      and events.created_by = auth.uid()
    )
  );

create table if not exists event_need_responses (
  id uuid primary key default gen_random_uuid(),
  event_need_id uuid not null references event_needs(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  response text not null check (response in ('HAVE','NEED')),
  created_at timestamptz not null default now(),
  unique (event_need_id, user_id)
);

alter table event_need_responses enable row level security;

create policy "event need responses are viewable by authenticated users"
  on event_need_responses for select
  to authenticated
  using (true);

create policy "users can respond to an event need themselves"
  on event_need_responses for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own event need response"
  on event_need_responses for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete their own event need response"
  on event_need_responses for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── posts ───────────────────────────────────────────────────
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  -- references profiles (not auth.users) so PostgREST can embed profiles in posts queries
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('WCAC','PCAC','WCAB','PCAB','LOST','FOUND','VOLUNTEER')),
  title text not null,
  description text,
  category text,
  location text,
  status text not null default 'OPEN' check (status in ('OPEN','FULFILLED','CLOSED')),
  event_id uuid references events(id) on delete set null,
  community_id uuid references communities(id) on delete set null,
  slots_needed integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "posts are viewable by authenticated users"
  on posts for select
  to authenticated
  using (true);

create policy "users can create their own posts"
  on posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own posts"
  on posts for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete their own posts"
  on posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── responses ───────────────────────────────────────────────
create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  message text,
  accepted boolean not null default false,
  created_at timestamptz not null default now()
);

alter table responses enable row level security;

create policy "responses are viewable by authenticated users"
  on responses for select
  to authenticated
  using (true);

create policy "users can create their own responses"
  on responses for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "responders can delete their own response"
  on responses for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "post owners can accept responses on their post"
  on responses for update
  to authenticated
  using (
    exists (
      select 1 from posts
      where posts.id = responses.post_id
      and posts.user_id = auth.uid()
    )
  );

-- ── resources ("My Stuff" — the standing campus resource pool) ─
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  mode text not null check (mode in ('LEND','RENT','SELL','GIVE_AWAY')),
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE','UNAVAILABLE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table resources enable row level security;

create policy "resources are viewable by authenticated users"
  on resources for select
  to authenticated
  using (true);

create policy "users can create their own resources"
  on resources for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own resources"
  on resources for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete their own resources"
  on resources for delete
  to authenticated
  using (auth.uid() = user_id);

create index if not exists posts_status_idx on posts(status);
create index if not exists posts_type_idx on posts(type);
create index if not exists posts_event_id_idx on posts(event_id);
create index if not exists responses_post_id_idx on responses(post_id);
create index if not exists community_members_user_id_idx on community_members(user_id);
create index if not exists events_community_id_idx on events(community_id);
create index if not exists events_event_date_idx on events(event_date);
create index if not exists resources_status_idx on resources(status);
create index if not exists posts_community_id_idx on posts(community_id);

-- ── stats views backing the leaderboard (Most Helpful MICAans + Community Wars)
create or replace view public.user_stats
with (security_invoker = true) as
select
  p.id as user_id,
  p.full_name,
  p.points,
  count(r.id) filter (where r.accepted) as accepted_count,
  count(r.id) filter (where r.accepted and po.type = 'VOLUNTEER') as volunteer_accepted_count
from profiles p
left join responses r on r.user_id = p.id
left join posts po on po.id = r.post_id
group by p.id, p.full_name, p.points;

create or replace view public.community_stats
with (security_invoker = true) as
select
  c.id as community_id,
  c.name,
  c.kind,
  coalesce(sum(p.points), 0) as total_points,
  count(distinct cm.user_id) as member_count
from communities c
left join community_members cm on cm.community_id = c.id
left join profiles p on p.id = cm.user_id
group by c.id, c.name, c.kind;

-- ── seed a few real MICA communities so Communities/Hostel Mode isn't empty ─
insert into communities (name, kind, description)
values
  ('Hostel 1', 'HOSTEL', 'Hostel 1 campus feed.'),
  ('Hostel 2', 'HOSTEL', 'Hostel 2 campus feed.'),
  ('Hostel 3', 'HOSTEL', 'Hostel 3 campus feed.'),
  ('Hostel 4', 'HOSTEL', 'Hostel 4 campus feed.'),
  ('Hostel 5', 'HOSTEL', 'Hostel 5 campus feed.'),
  ('CulComm', 'COMMITTEE', 'Cultural Committee — Oorja and other campus culturals.'),
  ('LitCom', 'COMMITTEE', 'Literary Committee.'),
  ('Sports Com', 'COMMITTEE', 'Sports Committee.')
on conflict (name) do nothing;
