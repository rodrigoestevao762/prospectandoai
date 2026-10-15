-- Garante que cada usuário leia e salve apenas as próprias configurações de envio.
-- Execute no SQL Editor do projeto Supabase do ProspectandoAI.
begin;

alter table public.settings enable row level security;

-- Remove também políticas antigas com nomes diferentes que possam estar
-- bloqueando o INSERT/UPSERT por uma regra conflitante.
do $$
declare
  policy_name text;
begin
  for policy_name in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'settings'
  loop
    execute format('drop policy if exists %I on public.settings', policy_name);
  end loop;
end
$$;

create policy "settings próprios" on public.settings
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
