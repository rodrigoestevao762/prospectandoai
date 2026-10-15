-- Corrige o salvamento e a leitura das fotos dos leads no ProspectandoAI.
-- Execute no SQL Editor do projeto Supabase do ProspectandoAI.

begin;

alter table public.leads
  add column if not exists fontes jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';

commit;
