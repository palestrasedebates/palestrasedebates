-- Garante que o visitante público (role anon) consegue submeter o formulário.
-- Reforça o GRANT de INSERT e recria a policy de forma explícita.

grant insert on table public.leads to anon, authenticated;

drop policy if exists "leads_insert_anon" on public.leads;
create policy "leads_insert_anon"
  on public.leads
  as permissive
  for insert
  to anon, authenticated
  with check (true);
