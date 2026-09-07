// Cliente do front para o endpoint serverless de IA (/api/ai, provider OpenAI).
// O front SÓ fala com estas duas funções — nunca chama a OpenAI diretamente.
import type { Diagnostico, Plano, Msg, MesDoPlano } from '@/types/diagnostico'

// DEMO: enquanto /api/ai não tem dono, VITE_MOCK_AI=1 destrava as telas do funil
// com um plano fabricado (mesmo formato do endpoint real). Off por padrão.
const MOCK_AI = import.meta.env.VITE_MOCK_AI === '1'

async function postAI<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`IA indisponível (${res.status}). ${detail}`.trim())
  }
  return res.json() as Promise<T>
}

// mode:"plan" → { meses, leitura_geral, valor_estimado }
export function gerarPlano(diagnostico: Diagnostico): Promise<Plano> {
  if (MOCK_AI) return Promise.resolve(mockPlano(diagnostico))
  return postAI<Plano>({ mode: 'plan', diagnostico })
}

// mode:"chat" → o servidor devolve { text: "<resposta>…</resposta>\n<plano_atualizado>{json}</plano_atualizado>" }
// (o servidor já saneia/canoniza o <plano_atualizado>). Aqui parseamos o envelope.
const RE_RESPOSTA = /<resposta>([\s\S]*?)<\/resposta>/
const RE_PLANO = /<plano_atualizado>([\s\S]*?)<\/plano_atualizado>/

export function parseEnvelopeChat(text: string): { resposta: string; plano_atualizado?: Plano } {
  let plano_atualizado: Plano | undefined
  const mPlano = text.match(RE_PLANO)
  if (mPlano) {
    try {
      plano_atualizado = JSON.parse(mPlano[1].trim()) as Plano
    } catch {
      /* servidor devia entregar JSON válido; se não, ignora a alteração */
    }
  }
  const mResp = text.match(RE_RESPOSTA)
  const resposta = mResp
    ? mResp[1].trim()
    : // sem envelope <resposta>: usa o texto todo, tirando o bloco do plano e tags soltas
      text.replace(RE_PLANO, '').replace(/<\/?resposta>/g, '').trim()
  return { resposta, plano_atualizado }
}

export async function conversar(
  diagnostico: Diagnostico,
  plano: Plano,
  mensagens: Msg[],
): Promise<{ resposta: string; plano_atualizado?: Plano }> {
  if (MOCK_AI) {
    const ultima = mensagens[mensagens.length - 1]?.content ?? ''
    return {
      resposta: `Boa questão. Com base no seu perfil (${diagnostico.sector}), sugiro manter o foco nas obrigações legais nos primeiros meses. Sobre "${ultima.slice(0, 60)}": posso ajustar o plano se preferir dar prioridade a outra área.`,
    }
  }
  const { text } = await postAI<{ text: string }>({
    mode: 'chat',
    diagnostico,
    plano,
    mensagens,
  })
  return parseEnvelopeChat(text)
}

// DEMO: plano fabricado de 12 meses no mesmo formato do endpoint real.
function mockPlano(d: Diagnostico): Plano {
  const base: Array<Omit<MesDoPlano, 'mes'>> = [
    { catalogo_id: 'sst-01', titulo: 'Segurança e Saúde no Trabalho — Sensibilização', area: 'seguranca', duracao_h: 8, justificativa: 'Obrigação legal e base para reduzir acidentes.' },
    { catalogo_id: 'sst-02', titulo: 'Primeiros Socorros', area: 'saude', duracao_h: 6, justificativa: 'Exigência legal mínima e resposta a emergências.' },
    { catalogo_id: 'seg-03', titulo: 'Prevenção de Riscos Profissionais', area: 'seguranca', duracao_h: 8, justificativa: 'Reduz sinistralidade no perfil de risco indicado.' },
    { catalogo_id: 'ges-04', titulo: 'Liderança de Equipas', area: 'gestao', duracao_h: 12, justificativa: 'Melhora clima e retenção de colaboradores.' },
    { catalogo_id: 'saude-05', titulo: 'Saúde Mental e Gestão do Stress', area: 'saude', duracao_h: 6, justificativa: 'Impacta diretamente motivação e absentismo.' },
    { catalogo_id: 'seg-06', titulo: 'Combate a Incêndios e Evacuação', area: 'seguranca', duracao_h: 6, justificativa: 'Requisito legal de segurança contra incêndio.' },
    { catalogo_id: 'ges-07', titulo: 'Comunicação Interna Eficaz', area: 'gestao', duracao_h: 8, justificativa: 'Alinha equipas e reduz conflitos.' },
    { catalogo_id: 'tec-08', titulo: 'Ferramentas Digitais para Produtividade', area: 'tecnologia', duracao_h: 8, justificativa: 'Ganhos de eficiência operacional.' },
    { catalogo_id: 'saude-09', titulo: 'Ergonomia no Posto de Trabalho', area: 'saude', duracao_h: 4, justificativa: 'Previne lesões e baixas médicas.' },
    { catalogo_id: 'ges-10', titulo: 'Gestão do Tempo e Prioridades', area: 'gestao', duracao_h: 6, justificativa: 'Aumenta capacidade de entrega das equipas.' },
    { catalogo_id: 'esp-11', titulo: 'Atendimento e Experiência do Cliente', area: 'especiais', duracao_h: 8, justificativa: 'Diferencia o serviço e fideliza clientes.' },
    { catalogo_id: 'seg-12', titulo: 'Auditoria Interna de Segurança', area: 'seguranca', duracao_h: 8, justificativa: 'Consolida a cultura de segurança do ano.' },
  ]
  const meses: MesDoPlano[] = base.map((m, i) => ({ mes: i + 1, ...m }))
  return {
    meses,
    leitura_geral: `Para uma empresa do setor ${d.sector}, montámos um percurso anual de formação que começa pelas obrigações legais e evolui para liderança, clima e produtividade. As primeiras formações garantem conformidade; as seguintes constroem equipas mais motivadas e seguras.`,
    valor_estimado: 8400,
  }
}
