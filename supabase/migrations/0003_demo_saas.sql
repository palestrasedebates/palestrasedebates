-- DEMO: políticas propositadamente permissivas para a demo do fundo.
-- Refazer com owner_id obrigatório e select restrito ao dono antes de produção.
--
-- Camada SaaS da demo: diagnóstico público -> plano anual gerado por IA.
-- Duas tabelas: diagnostics (o que a empresa respondeu) e plans (o plano gerado).

-- ─────────────────────────────────────────────────────────────
-- Tabelas
-- ─────────────────────────────────────────────────────────────
create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  company_name   text,
  sector         text not null,
  headcount_band text not null,
  risks          text[] not null default '{}',
  last_actions   text,
  priority       text not null,
  budget_band    text,
  contact_email  text,
  owner_id       uuid references auth.users(id)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  diagnostic_id   uuid not null references public.diagnostics(id) on delete cascade,
  months          jsonb not null,   -- { leitura_geral: text, meses: MesDoPlano[] }
  estimated_value numeric,          -- = valor_estimado do plano
  owner_id        uuid references auth.users(id)
);

-- ─────────────────────────────────────────────────────────────
-- RLS + grants
-- DEMO: o funil é público. O anon INSERE o diagnóstico/plano e precisa
-- LER de volta (RETURNING id na navegação + /plano/:id é público sem login).
-- Por isso anon tem INSERT **e** SELECT nas duas tabelas (não só INSERT).
-- ─────────────────────────────────────────────────────────────
alter table public.diagnostics enable row level security;
alter table public.plans        enable row level security;

grant insert, select on table public.diagnostics to anon, authenticated;
grant insert, select on table public.plans        to anon, authenticated;
grant update          on table public.plans        to authenticated;

-- diagnostics: anon insere e lê; authenticated lê tudo
drop policy if exists "diagnostics_insert_anon" on public.diagnostics;
create policy "diagnostics_insert_anon"
  on public.diagnostics for insert
  to anon, authenticated
  with check (true);

drop policy if exists "diagnostics_select_all" on public.diagnostics;
create policy "diagnostics_select_all"
  on public.diagnostics for select
  to anon, authenticated
  using (true);

-- plans: anon insere e lê; authenticated lê tudo e ATUALIZA (edição do plano no /app)
drop policy if exists "plans_insert_anon" on public.plans;
create policy "plans_insert_anon"
  on public.plans for insert
  to anon, authenticated
  with check (true);

drop policy if exists "plans_select_all" on public.plans;
create policy "plans_select_all"
  on public.plans for select
  to anon, authenticated
  using (true);

drop policy if exists "plans_update_authenticated" on public.plans;
create policy "plans_update_authenticated"
  on public.plans for update
  to authenticated
  using (true)
  with check (true);

-- DEMO: ninguém pode DELETE (nenhuma policy de delete criada em qualquer role).
