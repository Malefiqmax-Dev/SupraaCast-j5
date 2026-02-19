-- Profiles table: stores user display info and admin flag
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null,
  avatar text not null default 'bg-gradient-to-br from-violet-500 to-purple-700',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can read profiles (needed for display)
create policy "profiles_select_all" on public.profiles for select using (true);
-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
-- Users can update their own profile
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
-- Users can delete their own profile
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Liked items table
create table if not exists public.liked_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  vote_average numeric not null default 0,
  added_at timestamptz not null default now(),
  unique(user_id, media_id, media_type)
);

alter table public.liked_items enable row level security;

create policy "liked_select_own" on public.liked_items for select using (auth.uid() = user_id);
create policy "liked_insert_own" on public.liked_items for insert with check (auth.uid() = user_id);
create policy "liked_delete_own" on public.liked_items for delete using (auth.uid() = user_id);

-- Watched items table
create table if not exists public.watched_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_id integer not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  vote_average numeric not null default 0,
  added_at timestamptz not null default now(),
  unique(user_id, media_id, media_type)
);

alter table public.watched_items enable row level security;

create policy "watched_select_own" on public.watched_items for select using (auth.uid() = user_id);
create policy "watched_insert_own" on public.watched_items for insert with check (auth.uid() = user_id);
create policy "watched_delete_own" on public.watched_items for delete using (auth.uid() = user_id);
