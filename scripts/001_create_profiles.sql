create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null,
  avatar text not null default 'bg-gradient-to-br from-violet-500 to-purple-700',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
