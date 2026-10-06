-- Método de pago elegido en el formulario del carrito.

alter table public.cart_submissions
  add column if not exists payment_method text;
