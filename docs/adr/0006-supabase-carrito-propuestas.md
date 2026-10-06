# ADR-0006 · Supabase para propuestas del carrito

- **Estado**: Aceptado
- **Fecha**: 2026-10-05
- **Relacionado**: ADR-0005 (contacto sin backend)

## Contexto

La home tiene un carrito con formulario «Enviar propuesta». Hasta ahora el envío no
persistía en ningún servidor. La artista necesita ver cada pedido (ítems, contacto,
notas) en Supabase al confirmar «Envío realizado».

## Decisión

### 1. Supabase como almacén de propuestas

- Tabla `cart_submissions` con datos del formulario y el carrito en `jsonb`.
- Inserción desde el **cliente** con la clave **publishable** (`NEXT_PUBLIC_*`) y
  **RLS**: solo `INSERT` para `anon`; sin `SELECT` público (lectura en el dashboard
  de Supabase con cuenta de la artista).

### 2. Variables de entorno (públicas)

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publishable (o anon legacy) |

No se commitean valores reales. Plantilla en `.env.example`. En Vercel se configuran
las mismas variables en el proyecto.

### 3. Alcance del sitio

- **No** hay auth de visitantes en el portfolio público.
- Inserción del carrito: cliente + RLS (`INSERT` anon).
- Vista privada **`/sales`**: Server Component + `SUPABASE_SERVICE_ROLE_KEY` (solo servidor)
  y acceso con cookie tras `SALES_ACCESS_TOKEN` (`POST /api/sales/session`).
- El resto del sitio sigue siendo estático en build; carrito y `/sales` hacen red en runtime.

### 4. Esquema y migración

SQL versionado en `supabase/migrations/`. Debe ejecutarse una vez en el SQL Editor
de Supabase (o con Supabase CLI si se adopta después).

### 5. Dependencia

- `@supabase/supabase-js` — cliente oficial; justificada en este ADR.

## Consecuencias

- ADR-0005 deja de ser verdad **solo** para propuestas del carrito; contacto general
  sigue siendo `mailto:` + redes.
- Build local y CI necesitan las variables `NEXT_PUBLIC_*` para probar envíos reales;
  sin ellas el formulario muestra error de configuración al enviar.
- Rotar la clave publishable si se filtra; la service role **nunca** va al frontend.

## Alternativas consideradas

- **Route Handler + service role**: más seguro ante abuso, pero requiere compute y
  secret en servidor; se puede añadir después si hace falta rate limit.
- **Resend / email only**: no da tabla consultable ni historial estructurado.
