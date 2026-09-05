-- Leads capturadas pelo formulário de contacto do site institucional.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  telefone text not null,
  email text not null,
  message text not null,
  source text not null default 'contato',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- O site é público: o visitante (role anon) pode INSERIR a sua lead,
-- mas ninguém anónimo pode LER as leads.
drop policy if exists "leads_insert_anon" on public.leads;
create policy "leads_insert_anon"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Leitura apenas para utilizadores autenticados (ex.: futuro painel admin).
drop policy if exists "leads_select_authenticated" on public.leads;
create policy "leads_select_authenticated"
  on public.leads
  for select
  to authenticated
  using (true);
