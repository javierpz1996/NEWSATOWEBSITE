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

## Tabla `contact_messages`

Mensajes del formulario de contacto en la home (reseñas / consultas). Solo `INSERT` anon; lectura en el dashboard.

## Vista `/sales` en el sitio

1. Agregá `SUPABASE_SERVICE_ROLE_KEY` y `SALES_ACCESS_TOKEN` en `.env.local` (y en Vercel).
2. Abrí `/sales`, ingresá la clave y revisá los pedidos del carrito.
3. No enlaces `/sales` en la web pública: es solo para vos.

## Comisiones en curso (`commissions_in_progress`)

1. Ejecutá `migrations/20261005140000_commissions_in_progress.sql` en el SQL Editor.
2. Gestioná altas en **`/new-work`** (misma clave que `/sales`).
3. Lo publicado se muestra en **Comisiones abiertas** en la home.

## Alertas en Discord

Flujo: **tabla** → **trigger `pg_net` o Database Webhook** → **Edge Function** → **Discord Webhook**.

| Tabla | Eventos | Edge Function | Contenido del embed |
|---|---|---|---|
| `commissions_in_progress` | INSERT, UPDATE | `commissions-discord-notify` | Obra, estado, fechas, ID (sin datos privados de cliente) |
| `cart_submissions` | INSERT | `cart-proposal-discord-notify` | Nombre, contacto, pago, ítems, total, notas, ID |
| `contact_messages` | INSERT | `contact-message-discord-notify` | Título, mensaje e ID |

Ambas usan los mismos secrets (`DISCORD_WEBHOOK_URL`, `COMMISSIONS_NOTIFY_SECRET`) y el Vault `commissions_notify_secret` en los triggers SQL.

### 1. Webhook de Discord

1. En Discord: canal → **Editar canal** → **Integraciones** → **Webhooks** → **Nuevo webhook**.
2. Copiá la **URL del webhook** (se guarda solo en Supabase, no en Vercel ni en el repo).

### 2. Desplegar la Edge Function

Con [Supabase CLI](https://supabase.com/docs/guides/cli) vinculado al proyecto:

**Auth sin llavero de macOS:** en [Account → Access Tokens](https://supabase.com/dashboard/account/tokens) creá un token y usalo en lugar de `supabase login`:

```bash
export SUPABASE_ACCESS_TOKEN="sbp_..."
# o agregá la misma línea en supabase/.env.deploy (gitignored)
./scripts/deploy-commissions-discord-notify.sh
```

Con `SUPABASE_ACCESS_TOKEN` el CLI **no** pide contraseña del llavero.

Alternativa con login (guarda sesión en el llavero):

```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase secrets set DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
supabase secrets set COMMISSIONS_NOTIFY_SECRET="una-clave-larga-aleatoria"
supabase functions deploy commissions-discord-notify
```

| Secret (Edge Function) | Obligatorio | Uso |
|---|---|---|
| `DISCORD_WEBHOOK_URL` | Sí | URL del webhook del canal de Discord |
| `COMMISSIONS_NOTIFY_SECRET` | Recomendado | Mismo valor que el header `x-webhook-secret` del Database Webhook |

También podés cargar los secrets en **Dashboard → Edge Functions → Secrets**.

La función tiene `verify_jwt = false` en `config.toml` porque el llamador es el Database Webhook (no un usuario JWT). La protección es el secret compartido.

### 3. Disparador (elegí una opción)

#### Opción A — Dashboard (recomendada si falla el SQL)

En proyectos **hosted**, el esquema `supabase_functions` **no existe**; el trigger SQL con
`supabase_functions.http_request` da error `3F000`. Usá el panel:

**Dashboard → Database → Webhooks → Create a new hook**

| Campo | Valor |
|---|---|
| **Name** | `commissions-discord-notify` (o el que prefieras) |
| **Table** | `public.commissions_in_progress` |
| **Events** | `INSERT`, `UPDATE` |
| **Type** | **Supabase Edge Functions** |
| **Edge Function** | `commissions-discord-notify` |
| **HTTP Headers** | `x-webhook-secret` = el mismo string que `COMMISSIONS_NOTIFY_SECRET` |

Si elegís **HTTP Request** en lugar de Edge Function, la URL es:

`https://TU_PROJECT_REF.supabase.co/functions/v1/commissions-discord-notify`

y los headers:

- `Authorization: Bearer TU_ANON_O_SERVICE_ROLE_KEY` (solo si activás JWT en la función)
- `x-webhook-secret: TU_SECRET`

Recomendado: destino **Edge Function** desde el panel (menos fricción).

#### Opción B — SQL con `pg_net` (migración)

1. En SQL Editor, guardá el secret en Vault (una vez):

```sql
select vault.create_secret(
  'TU_COMMISSIONS_NOTIFY_SECRET',
  'commissions_notify_secret',
  'Auth header for commissions-discord-notify'
);
```

2. Ejecutá `migrations/20261007040000_commissions_discord_pg_net_trigger.sql`.

### 4. Probar

1. En **Table Editor**, insertá o editá una fila en `commissions_in_progress`.
2. Revisá el canal de Discord.
3. Si falla: **Edge Functions → commissions-discord-notify → Logs** y el historial del webhook en **Database → Webhooks**.

### 5. UPDATE manual en SQL

Los `UPDATE` hechos en el SQL Editor también disparan el webhook si está activo para `UPDATE`.
