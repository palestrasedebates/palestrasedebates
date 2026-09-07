// Rota única de IA da demo. Runtime edge, handler Web standard (Request -> Response).
// Dois modos no mesmo endpoint: `plan` (saída estruturada) e `chat` (texto).
// Provider OpenAI direto via Vercel AI SDK. Modelo gpt-5-nano é reasoning:
// structured output sai pelo Responses API (openai.responses) e NÃO se seta temperature.
// Imports relativos (não alias @/) — empacotado pela Vercel fora do tsconfig.app.

import { generateObject, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import { systemPromptPlano, systemPromptChat, precoAvulso, PRECOS } from "./_prompts";
import { CATALOGO_POR_ID, itemMaisProximoDaArea } from "../src/data/catalogo";
import type { Diagnostico, Plano, MesDoPlano, Msg, Area } from "../src/types/diagnostico";

export const config = { runtime: "edge" };

// DEMO: provider fixado em OpenAI. AI_PROVIDER fica lido para ser trocável no futuro.
const AI_MODEL = process.env.AI_MODEL ?? "gpt-5-nano";

const openai = createOpenAI({ apiKey: process.env.AI_API_KEY });
// gpt-5-nano é reasoning -> Responses API + reasoning effort mínimo (rápido).
const model = openai.responses(AI_MODEL);
const reasoningMinimo = { openai: { reasoningEffort: "minimal" as const } };

const mesSchema = z.object({
  mes: z.number().int().min(1).max(12),
  catalogo_id: z.string(),
  titulo: z.string(),
  area: z.string(),
  duracao_h: z.number(),
  justificativa: z.string(),
});
const planoSchema = z.object({
  meses: z.array(mesSchema),
  leitura_geral: z.string(),
  valor_estimado: z.number(),
});

const AREAS: Area[] = ["saude", "seguranca", "gestao", "tecnologia", "especiais"];
function coerceArea(a: string): Area {
  return (AREAS as string[]).includes(a) ? (a as Area) : "gestao";
}

// Garante um plano válido para a demo: 12 meses, catalogo_id existente,
// campos canónicos do catálogo, sem repetições, e valor recalculado no servidor.
function normalizarPlano(bruto: z.infer<typeof planoSchema>, diagnostico: Diagnostico): Plano {
  const usados = new Set<string>();
  const meses: MesDoPlano[] = [];

  for (let i = 0; i < bruto.meses.length && meses.length < 12; i++) {
    const m = bruto.meses[i];
    let item = CATALOGO_POR_ID[m.catalogo_id];
    // DEMO: catalogo_id inexistente -> troca pelo item mais próximo da mesma área.
    if (!item) item = itemMaisProximoDaArea(coerceArea(m.area));
    if (usados.has(item.id)) continue; // sem repetir o mesmo item no ano
    usados.add(item.id);
    meses.push({
      mes: meses.length + 1,
      catalogo_id: item.id,
      titulo: item.titulo,
      area: item.area,
      duracao_h: item.duracao_h,
      justificativa: m.justificativa,
    });
  }

  // DEMO: se o modelo devolveu menos de 12, completa com itens ainda não usados.
  for (const item of Object.values(CATALOGO_POR_ID)) {
    if (meses.length >= 12) break;
    if (usados.has(item.id)) continue;
    usados.add(item.id);
    meses.push({
      mes: meses.length + 1,
      catalogo_id: item.id,
      titulo: item.titulo,
      area: item.area,
      duracao_h: item.duracao_h,
      justificativa: `Reforço complementar ao perfil de ${diagnostico.sector}.`,
    });
  }

  // Valor recalculado no servidor (§8): soma avulsa com 20% de desconto anual.
  const avulso = meses.reduce((s, m) => s + precoAvulso(m.duracao_h), 0);
  const valor_estimado = Math.round(avulso * (1 - PRECOS.desconto_contrato_anual));

  return { meses, leitura_geral: bruto.leitura_geral, valor_estimado };
}

async function handlePlan(diagnostico: Diagnostico): Promise<Response> {
  const { object } = await generateObject({
    model,
    schema: planoSchema,
    system: systemPromptPlano(),
    prompt: `Diagnóstico da empresa (JSON):\n${JSON.stringify(diagnostico)}`,
    providerOptions: reasoningMinimo,
  });
  const plano = normalizarPlano(object, diagnostico);
  return Response.json(plano);
}

async function handleChat(diagnostico: Diagnostico, plano: Plano, mensagens: Msg[]): Promise<Response> {
  // DEMO: sem streaming (generateText). Streaming é upgrade opcional no fim.
  const { text } = await generateText({
    model,
    system: systemPromptChat(diagnostico, plano),
    messages: mensagens.map((m) => ({ role: m.role, content: m.content })),
    providerOptions: reasoningMinimo,
  });
  return Response.json({ text });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Método não permitido." }, { status: 405 });
  }
  if (!process.env.AI_API_KEY) {
    return Response.json({ error: "AI_API_KEY em falta na função." }, { status: 500 });
  }

  try {
    const body = (await req.json()) as
      | { mode: "plan"; diagnostico: Diagnostico }
      | { mode: "chat"; diagnostico: Diagnostico; plano: Plano; mensagens: Msg[] };

    if (body.mode === "plan") return await handlePlan(body.diagnostico);
    if (body.mode === "chat") return await handleChat(body.diagnostico, body.plano, body.mensagens);

    return Response.json({ error: "mode inválido (usa 'plan' ou 'chat')." }, { status: 400 });
  } catch (err) {
    // DEMO: erro genérico basta (um toast do lado do front).
    console.error("[/api/ai] erro:", err);
    return Response.json({ error: "Falha ao gerar resposta da IA." }, { status: 500 });
  }
}
