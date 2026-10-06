-- Propuestas enviadas desde el carrito de la home (ver ADR-0006).

create table if not exists public.cart_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text,
  social_network text not null,
  social_username text not null,
  notes text,
  items jsonb not null,
  total_usd numeric(12, 2) not null check (total_usd >= 0)
);

create index if not exists cart_submissions_created_at_idx
  on public.cart_submissions (created_at desc);

alter table public.cart_submissions enable row level security;

drop policy if exists "cart_submissions_anon_insert" on public.cart_submissions;

create policy "cart_submissions_anon_insert"
  on public.cart_submissions
  for insert
  to anon, authenticated
  with check (true);
