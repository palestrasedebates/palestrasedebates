// Mapeamento entre o contrato (Diagnostico/Plano) e as colunas do Supabase.
// Centralizado aqui pra front e infra não divergirem no shape.
// DEMO: shape do jsonb `months` = { leitura_geral, meses } (a confirmar com infra).
import { supabase, isSupabaseReady } from '@/lib/supabase'
import type { Diagnostico, Plano } from '@/types/diagnostico'

// Grava o diagnóstico e devolve o id gerado. null se Supabase não está ligado.
export async function inserirDiagnostico(d: Diagnostico): Promise<string | null> {
  if (!isSupabaseReady || !supabase) return null
  const { data, error } = await supabase
    .from('diagnostics')
    .insert({
      company_name: d.company_name ?? null,
      sector: d.sector,
      headcount_band: d.headcount_band,
      risks: d.risks,
      last_actions: d.last_actions ?? null,
      priority: d.priority,
      budget_band: d.budget_band ?? null,
      contact_email: d.contact_email ?? null,
      owner_id: null, // fluxo público: sem login
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

// Grava o plano vinculado ao diagnóstico. months = { leitura_geral, meses }.
export async function inserirPlano(diagnosticId: string, p: Plano): Promise<string | null> {
  if (!isSupabaseReady || !supabase) return null
  const { data, error } = await supabase
    .from('plans')
    .insert({
      diagnostic_id: diagnosticId,
      months: { leitura_geral: p.leitura_geral, meses: p.meses }, // DEMO: jsonb
      estimated_value: p.valor_estimado,
      owner_id: null,
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id as string
}

// Gate de e-mail: grava a lead. Padrão ÚNICO fixado pelo Copiloto (bate com a infra).
export async function gravarLeadDiagnostico(email: string, empresa?: string): Promise<void> {
  if (!isSupabaseReady || !supabase) return
  const { error } = await supabase.from('leads').insert({
    email,
    name: empresa || 'Lead do plano anual', // DEMO: fallback quando não há nome de empresa
    telefone: '000000000', // DEMO: satisfaz NOT NULL sem alterar a tabela
    message: 'Pedido de plano completo (gate /plano/:id)', // DEMO
    source: 'diagnostico',
  })
  if (error) throw error
}

// Atualiza o contacto no diagnóstico (best-effort — depende de RLS de UPDATE anon).
export async function atualizarContactEmail(diagnosticId: string, email: string): Promise<void> {
  if (!isSupabaseReady || !supabase) return
  const { error } = await supabase.from('diagnostics').update({ contact_email: email }).eq('id', diagnosticId)
  if (error) throw error
}

// Linha do painel de operação (/admin).
export type LinhaAdmin = {
  planId: string
  data: string | null
  empresa: string
  setor: string
  headcount_band: Diagnostico['headcount_band']
  priority: Diagnostico['priority']
  valor: number
  temEmail: boolean
}

// Lê os diagnósticos+planos pro painel. null se as tabelas ainda não existem (modo demo).
export async function lerLinhasAdmin(): Promise<LinhaAdmin[] | null> {
  if (!isSupabaseReady || !supabase) return null
  const { data, error } = await supabase
    .from('plans')
    .select('id, estimated_value, created_at, diagnostics(company_name, sector, headcount_band, priority, contact_email)')
    .order('created_at', { ascending: false })
  if (error || !data) return null

  return data.map((row) => {
    const r = row as Record<string, unknown>
    const dgRaw = Array.isArray(r.diagnostics) ? r.diagnostics[0] : r.diagnostics
    const dg = (dgRaw ?? {}) as Record<string, unknown>
    return {
      planId: r.id as string,
      data: (r.created_at as string) ?? null,
      empresa: (dg.company_name as string) || '—',
      setor: (dg.sector as string) || '—',
      headcount_band: dg.headcount_band as Diagnostico['headcount_band'],
      priority: dg.priority as Diagnostico['priority'],
      valor: Number(r.estimated_value ?? 0),
      temEmail: Boolean(dg.contact_email),
    }
  })
}

// DEMO: cache em sessionStorage pra /plano/:id funcionar sem Supabase (mock/local).
export function guardarPlanoLocal(id: string, plano: Plano, diagnostico: Diagnostico) {
  try {
    sessionStorage.setItem(`plano:${id}`, JSON.stringify({ plano, diagnostico }))
  } catch { /* ignora quota/privado */ }
}

export function lerPlanoLocal(id: string): { plano: Plano; diagnostico: Diagnostico } | null {
  try {
    const raw = sessionStorage.getItem(`plano:${id}`)
    return raw ? (JSON.parse(raw) as { plano: Plano; diagnostico: Diagnostico }) : null
  } catch {
    return null
  }
}

// Lê um plano por id (usado em /plano/:id). null se não encontrado / sem Supabase.
export async function lerPlano(
  id: string,
): Promise<{ plano: Plano; diagnostico: Diagnostico } | null> {
  if (!isSupabaseReady || !supabase) return null
  const { data, error } = await supabase
    .from('plans')
    .select('id, diagnostic_id, months, estimated_value, diagnostics(*)')
    .eq('id', id)
    .single()
  if (error || !data) return null

  const months = data.months as { leitura_geral?: string; meses?: Plano['meses'] }
  // O join pode vir como objeto ou array conforme a relação inferida.
  const dgRaw = Array.isArray(data.diagnostics) ? data.diagnostics[0] : data.diagnostics
  const dg = (dgRaw ?? {}) as unknown as Record<string, unknown>
  const plano: Plano = {
    id: data.id as string,
    diagnostic_id: data.diagnostic_id as string,
    meses: months.meses ?? [],
    leitura_geral: months.leitura_geral ?? '',
    valor_estimado: Number(data.estimated_value ?? 0),
  }
  const diagnostico: Diagnostico = {
    id: dg.id as string,
    company_name: (dg.company_name as string) ?? undefined,
    sector: (dg.sector as string) ?? '',
    headcount_band: dg.headcount_band as Diagnostico['headcount_band'],
    risks: (dg.risks as string[]) ?? [],
    last_actions: (dg.last_actions as string) ?? undefined,
    priority: dg.priority as Diagnostico['priority'],
    budget_band: (dg.budget_band as string) ?? undefined,
    contact_email: (dg.contact_email as string) ?? undefined,
  }
  return { plano, diagnostico }
}
