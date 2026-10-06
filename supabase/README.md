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
