# Supabase — NewSatoWeb

## Primera vez

1. En [Supabase](https://supabase.com/dashboard) → tu proyecto → **SQL Editor**.
2. Ejecutá el contenido de `migrations/20261005120000_cart_submissions.sql`.
3. En **Project Settings → API**, copiá la URL y la clave **publishable** (o anon).
4. En la raíz del repo, creá `.env.local` a partir de `.env.example` y pegá los valores.
5. En Vercel, agregá las mismas variables `NEXT_PUBLIC_*` al proyecto.

## Tabla `cart_submissions`

Cada fila es un «Envío realizado» del carrito: contacto, notas, ítems (`jsonb`) y total USD.

Lectura: Table Editor o SQL en el dashboard (no está expuesta al sitio por RLS).

## Vista `/sales` en el sitio

1. Agregá `SUPABASE_SERVICE_ROLE_KEY` y `SALES_ACCESS_TOKEN` en `.env.local` (y en Vercel).
2. Abrí `/sales`, ingresá la clave y revisá los pedidos del carrito.
3. No enlaces `/sales` en la web pública: es solo para vos.

## Comisiones en curso (`commissions_in_progress`)

1. Ejecutá `migrations/20261005140000_commissions_in_progress.sql` en el SQL Editor.
2. Gestioná altas en **`/new-work`** (misma clave que `/sales`).
3. Lo publicado se muestra en **Comisiones abiertas** en la home.
