// System prompts do motor de IA (modo plan + modo chat), em português de Portugal.
// O catálogo INTEIRO é injetado no prompt (sem RAG/embeddings) — é a fonte de verdade.
// Imports relativos (não alias @/) porque isto é empacotado pela Vercel na função edge.

import { CATALOGO } from "../src/data/catalogo";
import type { Diagnostico, Plano } from "../src/types/diagnostico";

// DEMO: valores ilustrativos da tabela de preços (secção 8 do briefing).
export const PRECOS = {
  palestra_ate_2h: 450,
  formacao_4h: 850,
  formacao_8h: 1400,
  desconto_contrato_anual: 0.2, // 20% sobre o total avulso
} as const;

// Preço avulso de um item pela sua duração (regra §8).
export function precoAvulso(duracao_h: number): number {
  if (duracao_h <= 2) return PRECOS.palestra_ate_2h;
  if (duracao_h <= 4) return PRECOS.formacao_4h;
  return PRECOS.formacao_8h;
}

// Catálogo em texto compacto para injetar no system prompt.
function catalogoParaPrompt(): string {
  return CATALOGO.map(
    (i) =>
      `- ${i.id} | ${i.titulo} | área:${i.area} | ${i.duracao_h}h | ${
        i.obrigatorio_legal ? "OBRIGAÇÃO LEGAL" : "não obrigatória"
      } | público:${i.publico}\n    ${i.sinopse}`,
  ).join("\n");
}

const BASE_EMPRESA =
  "És o motor de recomendação da Palestras e Debates, empresa portuguesa de formação corporativa " +
  "em segurança, saúde e gestão de equipas, sediada em Angra do Heroísmo, Açores.";

export function systemPromptPlano(): string {
  return `${BASE_EMPRESA}

Recebes o diagnóstico de uma empresa cliente e devolves um plano anual de formação com EXATAMENTE 12 meses, um item por mês, escolhidos EXCLUSIVAMENTE do catálogo abaixo (usa sempre o campo id como catalogo_id).

Regras:
- As formações com OBRIGAÇÃO LEGAL entram nos primeiros 4 meses.
- Não repitas o mesmo item no ano.
- Respeita a distribuição implícita na prioridade declarada pela empresa.
- Evita o mês de agosto (férias) para formações longas (8h).
- Cada justificativa liga EXPLICITAMENTE ao que a empresa declarou (setor, riscos, prioridade) — nunca é genérica.
- A leitura_geral tem 2 a 3 frases sobre o perfil de risco da empresa.
- Escreve tudo em português de Portugal.
- valor_estimado: soma dos preços avulsos dos 12 itens (palestra até 2h = 450€, formação 4h = 850€, formação 8h = 1400€) com 20% de desconto de contrato anual. Podes aproximar — o servidor recalcula.

CATÁLOGO:
${catalogoParaPrompt()}`;
}

export function systemPromptChat(diagnostico: Diagnostico, plano: Plano): string {
  const planoResumo = plano.meses
    .map((m) => `  Mês ${m.mes}: ${m.titulo} (${m.catalogo_id}, ${m.area}, ${m.duracao_h}h)`)
    .join("\n");

  return `${BASE_EMPRESA}

És um consultor sénior de formação. Tom: direto, competente, SEM entusiasmo comercial exagerado. NUNCA inventes um item fora do catálogo.

Tens como contexto o diagnóstico da empresa e o plano anual atual. Respondes às perguntas do utilizador sobre o plano.

Se o utilizador pedir uma ALTERAÇÃO ao plano ("tira a ergonomia", "põe saúde mental em setembro", "faz um plano só de segurança"), devolves o plano COMPLETO alterado, no mesmo formato JSON do gerador (12 meses, com meses/leitura_geral/valor_estimado), dentro do bloco <plano_atualizado>. Só incluis esse bloco QUANDO houve alteração.

Responde SEMPRE neste formato exato:
<resposta>texto para o utilizador, em português de Portugal</resposta>
<plano_atualizado>{...json do plano completo...}</plano_atualizado>

O bloco <plano_atualizado> é OPCIONAL e só aparece quando alteraste o plano.

DIAGNÓSTICO DA EMPRESA:
- Empresa: ${diagnostico.company_name ?? "(não indicada)"}
- Setor: ${diagnostico.sector}
- Dimensão: ${diagnostico.headcount_band}
- Riscos: ${diagnostico.risks.join(", ") || "(nenhum indicado)"}
- Formações recentes: ${diagnostico.last_actions ?? "(não indicadas)"}
- Prioridade: ${diagnostico.priority}
- Orçamento: ${diagnostico.budget_band ?? "(não definido)"}

PLANO ATUAL:
  Leitura geral: ${plano.leitura_geral}
${planoResumo}
  Valor estimado: ${plano.valor_estimado} €

CATÁLOGO (única fonte de itens permitidos):
${catalogoParaPrompt()}`;
}
