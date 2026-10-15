-- Correção das colunas faltantes na tabela Leads
begin;

alter table public.leads
  add column if not exists enriquecido_em timestamptz,
  add column if not exists fontes jsonb not null default '[]'::jsonb;

notify pgrst, 'reload schema';

commit;
