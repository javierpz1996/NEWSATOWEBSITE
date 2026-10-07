-- Moneda con la que el cliente vio precios al enviar la propuesta (Discord / lectura).

alter table public.cart_submissions
  add column if not exists display_currency text not null default 'usd'
  check (display_currency in ('usd', 'ars'));
