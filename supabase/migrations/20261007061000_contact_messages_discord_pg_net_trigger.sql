-- Discord: INSERT en contact_messages → Edge Function contact-message-discord-notify (pg_net).

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_contact_message_discord()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  webhook_secret text;
  edge_url text := 'https://mkrzdugdllzebhmdqsin.supabase.co/functions/v1/contact-message-discord-notify';
begin
  select decrypted_secret
  into webhook_secret
  from vault.decrypted_secrets
  where name = 'commissions_notify_secret'
  limit 1;

  if webhook_secret is null or webhook_secret = '' then
    raise warning 'notify_contact_message_discord: falta vault secret commissions_notify_secret';
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

drop trigger if exists contact_message_discord_notify_trigger on public.contact_messages;

create trigger contact_message_discord_notify_trigger
after insert on public.contact_messages
for each row
execute function public.notify_contact_message_discord();
