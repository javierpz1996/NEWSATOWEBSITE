-- Comisiones en curso mostradas en la home (Comisiones abiertas).

create table if not exists public.commissions_in_progress (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status_label text not null default 'No empezado',
  service_title text not null,
  client_display text not null,
  started_label text not null default 'Inicio',
  started_on text not null,
  eta_label text not null default 'Entrega estimada',
  eta_on text not null
);

create index if not exists commissions_in_progress_created_at_idx
  on public.commissions_in_progress (created_at desc);

alter table public.commissions_in_progress enable row level security;

drop policy if exists "commissions_in_progress_anon_select" on public.commissions_in_progress;

create policy "commissions_in_progress_anon_select"
  on public.commissions_in_progress
  for select
  to anon, authenticated
  using (true);
