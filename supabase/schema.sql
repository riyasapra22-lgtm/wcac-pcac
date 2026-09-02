-- WCAC PCAC — database schema
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ── profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  hostel text,
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

-- ── posts ───────────────────────────────────────────────────
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('WCAC','PCAC','WCAB','PCAB','LOST','FOUND')),
  title text not null,
  description text,
  category text,
  location text,
  status text not null default 'OPEN' check (status in ('OPEN','FULFILLED','CLOSED')),
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
  user_id uuid not null references auth.users(id) on delete cascade,
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

create index if not exists posts_status_idx on posts(status);
create index if not exists posts_type_idx on posts(type);
create index if not exists responses_post_id_idx on responses(post_id);
