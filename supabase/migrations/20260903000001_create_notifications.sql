create table if not exists public.notifications (
  notification_id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  organization_id text,
  requested_blood_group text not null,
  units_requested integer not null check (units_requested > 0),
  latitude double precision,
  longitude double precision,
  notification_type text not null,
  status text not null default 'pending',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Allow notification inserts"
  on public.notifications
  for insert
  to anon, authenticated
  with check (true);