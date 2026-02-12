-- Enable RLS on all tables
alter table enrollments enable row level security;
alter table applications enable row level security;
alter table saved_jobs enable row level security;
-- profiles table already has RLS enabled in schema.sql, but we'll double check policies

-- Policies for Profiles
-- Allow users to view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Allow users to update their own profile
-- (Existing policy "Users can update own profile." might cover this, strictly ensuring it)
drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Policies for Enrollments
create policy "Users can view own enrollments" on enrollments
  for select using (auth.uid() = user_id);

create policy "Users can create own enrollments" on enrollments
  for insert with check (auth.uid() = user_id);

-- Policies for Applications
create policy "Users can view own applications" on applications
  for select using (auth.uid() = user_id);

create policy "Users can create own applications" on applications
  for insert with check (auth.uid() = user_id);

-- Policies for Saved Jobs
create policy "Users can view own saved jobs" on saved_jobs
  for select using (auth.uid() = user_id);

create policy "Users can create own saved jobs" on saved_jobs
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved jobs" on saved_jobs
  for delete using (auth.uid() = user_id);
