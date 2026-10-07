-- Título del mensaje de contacto (formulario home + Discord).

alter table public.contact_messages
  add column if not exists title text;

update public.contact_messages
set title = left(trim(message), 120)
where title is null or trim(title) = '';

alter table public.contact_messages
  alter column title set not null;

alter table public.contact_messages
  drop constraint if exists contact_messages_title_nonempty;

alter table public.contact_messages
  add constraint contact_messages_title_nonempty
  check (char_length(trim(title)) > 0);
