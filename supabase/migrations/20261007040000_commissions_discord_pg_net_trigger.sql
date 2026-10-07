-- Discord: INSERT/UPDATE en commissions_in_progress → Edge Function (pg_net).
-- No usa supabase_functions (no existe en proyectos hosted).
--
-- Antes de aplicar, guardá el secret en Vault (SQL Editor):
--   select vault.create_secret(
--     'TU_COMMISSIONS_NOTIFY_SECRET',
--     'commissions_notify_secret',
--     'Auth header for commissions-discord-notify'
--   );
--
-- Alternativa sin SQL: Dashboard → Database → Webhooks → Edge Function.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_commissions_discord()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  webhook_secret text;
  edge_url text := 'https://mkrzdugdllzebhmdqsin.supabase.co/functions/v1/commissions-discord-notify';
begin
  select decrypted_secret
  into webhook_secret
  from vault.decrypted_secrets
  where name = 'commissions_notify_secret'
  limit 1;

  if webhook_secret is null or webhook_secret = '' then
    raise warning 'notify_commissions_discord: falta vault secret commissions_notify_secret';
    return coalesce(new, old);
  end if;

  perform net.http_post(
    url := edge_url,
    body := jsonb_build_object(
      'type', tg_op,
      'table', tg_table_name,
      'schema', tg_table_schema,
      'record', case when tg_op <> 'DELETE' then to_jsonb(new) else null end,
      'old_record', case when tg_op <> 'INSERT' then to_jsonb(old) else null end
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', webhook_secret
    ),
    timeout_milliseconds := 5000
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists commissions_discord_notify_trigger on public.commissions_in_progress;

create trigger commissions_discord_notify_trigger
after insert or update on public.commissions_in_progress
for each row
execute function public.notify_commissions_discord();
