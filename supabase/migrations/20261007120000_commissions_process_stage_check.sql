-- Etapas de proceso en comisiones en curso (status_label).

update public.commissions_in_progress
set status_label = 'No empezado'
where status_label is null
   or trim(status_label) = ''
   or status_label = 'En curso';

alter table public.commissions_in_progress
  alter column status_label set default 'No empezado';

alter table public.commissions_in_progress
  drop constraint if exists commissions_in_progress_status_label_check;

alter table public.commissions_in_progress
  add constraint commissions_in_progress_status_label_check
  check (
    status_label in (
      'No empezado',
      'Boceto',
      'Lineart',
      'Coloreado',
      'Finalizado'
    )
  );
