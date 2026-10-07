#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${SUPABASE_DEPLOY_ENV:-$ROOT/supabase/.env.deploy}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Falta $ENV_FILE (DISCORD_WEBHOOK_URL, COMMISSIONS_NOTIFY_SECRET, SUPABASE_PROJECT_REF)." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

: "${DISCORD_WEBHOOK_URL:?}"
: "${COMMISSIONS_NOTIFY_SECRET:?}"
: "${SUPABASE_PROJECT_REF:?}"

export PATH="${HOME}/.local/bin:${PATH}"

# Sin `supabase login` / llavero: token en https://supabase.com/dashboard/account/tokens
# Exportalo o agregá SUPABASE_ACCESS_TOKEN en supabase/.env.deploy
if [[ -n "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  export SUPABASE_ACCESS_TOKEN
else
  echo "Tip: definí SUPABASE_ACCESS_TOKEN para no usar el llavero de macOS (supabase login)." >&2
fi

npx --yes supabase@latest secrets set \
  DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
  COMMISSIONS_NOTIFY_SECRET="$COMMISSIONS_NOTIFY_SECRET" \
  --project-ref "$SUPABASE_PROJECT_REF"

npx --yes supabase@latest functions deploy commissions-discord-notify \
  --project-ref "$SUPABASE_PROJECT_REF"

npx --yes supabase@latest functions deploy cart-proposal-discord-notify \
  --project-ref "$SUPABASE_PROJECT_REF"

npx --yes supabase@latest functions deploy contact-message-discord-notify \
  --project-ref "$SUPABASE_PROJECT_REF"

echo ""
echo "Listo: funciones desplegadas y secrets cargados."
echo "Triggers SQL (pg_net): commissions_in_progress, cart_submissions, contact_messages — ver migrations 20261007040000+."
echo "Header x-webhook-secret = COMMISSIONS_NOTIFY_SECRET en $ENV_FILE (Vault: commissions_notify_secret)."
