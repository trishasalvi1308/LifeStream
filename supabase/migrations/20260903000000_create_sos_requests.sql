create table if not exists public.sos_requests (
  request_id uuid primary key default gen_random_uuid(),
  requested_blood_group text not null,
  units_requested integer not null check (units_requested > 0),
  latitude double precision not null,
  longitude double precision not null,
  request_type text not null default 'sos',
  status text not null default 'pending',
  location_label text,
  created_at timestamptz not null default now()
);

alter table public.sos_requests enable row level security;

create policy "Allow SOS request inserts"
  on public.sos_requests
  for insert
  to anon, authenticated
  with check (true);