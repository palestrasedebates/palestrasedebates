-- DEMO: política propositadamente permissiva para a demo do fundo.
-- Refazer com owner_id obrigatório e update restrito ao dono antes de produção.
--
-- ⛔ Aplicar DEPOIS da 0003_demo_saas.sql (SQL Editor do Dashboard EU).
--
-- Fix do funil REAL: o gate de e-mail em /plano/:id faz
--   UPDATE public.diagnostics SET contact_email = <input>
-- mas a 0003 só concedeu INSERT+SELECT ao anon -> o UPDATE era bloqueado
-- silenciosamente pelo RLS, contact_email ficava NULL e o /admin mostrava
-- "Sem e-mail" para leads do fluxo real (só os seeds, entrados via SQL, tinham e-mail).

-- Grant limitado à coluna contact_email: o anon só pode preencher o e-mail do gate,
-- não mexer no resto do diagnóstico (tightening barato sobre um grant total de UPDATE).
grant update (contact_email) on public.diagnostics to anon, authenticated;

drop policy if exists "diagnostics_update_anon" on public.diagnostics;
create policy "diagnostics_update_anon"
  on public.diagnostics for update
  to anon, authenticated
  using (true)
  with check (true);
