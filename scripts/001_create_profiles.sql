-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null,
  avatar_gradient text default 'bg-gradient-to-br from-violet-500 to-purple-700',
  role text default 'member' check (role in ('member', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Anyone can read profiles
create policy "profiles_select_all" on public.profiles for select using (true);
-- Users can insert their own profile
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
-- Users can update their own profile
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Create liked_items table
create table if not exists public.liked_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tmdb_id int not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  vote_average real default 0,
  added_at timestamptz default now(),
  unique(user_id, tmdb_id, media_type)
);

alter table public.liked_items enable row level security;
create policy "liked_select_own" on public.liked_items for select using (auth.uid() = user_id);
create policy "liked_insert_own" on public.liked_items for insert with check (auth.uid() = user_id);
create policy "liked_delete_own" on public.liked_items for delete using (auth.uid() = user_id);

-- Create watched_items table
create table if not exists public.watched_items (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  tmdb_id int not null,
  media_type text not null check (media_type in ('movie', 'tv')),
  title text not null,
  poster_path text,
  vote_average real default 0,
  added_at timestamptz default now(),
  unique(user_id, tmdb_id, media_type)
);

alter table public.watched_items enable row level security;
create policy "watched_select_own" on public.watched_items for select using (auth.uid() = user_id);
create policy "watched_insert_own" on public.watched_items for insert with check (auth.uid() = user_id);
create policy "watched_delete_own" on public.watched_items for delete using (auth.uid() = user_id);

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'Exemple'),
    new.email,
    case when new.email = 'malefiqmax@gmail.com' then 'admin' else 'member' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Admin-only policy for reading all profiles (for admin dashboard)
create policy "admin_select_all_liked" on public.liked_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "admin_select_all_watched" on public.watched_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);