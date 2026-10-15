-- Corrige a política que permite ao usuário autenticado salvar seus próprios leads.
-- Execute no SQL Editor do projeto Supabase do ProspectandoAI.
begin;

alter table public.leads enable row level security;

drop policy if exists "leads próprios" on public.leads;

create policy "leads próprios" on public.leads
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
