// DEMO: gerador do seed da demo (6 diagnósticos + planos) para o Dashboard EU.
// Reusa o catálogo e a tabela de preços §8; calcula estimated_value igual ao backend.
// Uso: node scripts/gen-seed.mjs > supabase/seed.sql
// NÃO aplica nada — só emite SQL para o Toni colar no SQL Editor (depois da 0003).

// id -> [titulo, area, duracao_h]  (espelho de src/data/catalogo.ts)
const CAT = {
  "combate-assedio": ["Combate ao assédio no trabalho", "saude", 4],
  "qualidade-vida-stress": ["Qualidade de vida e gestão do stress", "saude", 2],
  "saude-mental-emocional": ["Saúde mental e emocional", "saude", 4],
  "ist-dst-sida": ["Infeções sexualmente transmissíveis — prevenção", "saude", 2],
  "saude-homem": ["Saúde do homem em foco", "saude", 2],
  "saude-mulher": ["A saúde da mulher moderna", "saude", 2],
  "prevencao-drogas": ["Prevenção do consumo de substâncias", "saude", 2],
  "perturbacoes-sono": ["Perturbações do sono e desempenho", "saude", 2],
  "higiene-saude-oral": ["Higiene e saúde oral", "saude", 2],
  "ergonomia": ["Ergonomia e movimentação manual de cargas", "saude", 4],
  "doencas-virais": ["Prevenção de doenças virais no local de trabalho", "saude", 2],
  "primeiros-socorros": ["Primeiros socorros", "seguranca", 8],
  "seguranca-saude-trabalho": ["Segurança e saúde no trabalho", "seguranca", 8],
  "uso-epi-epc": ["Uso de EPI e EPC — cuidado com as mãos", "seguranca", 4],
  "comportamento-seguro": ["Comportamento seguro e preventivo", "seguranca", 4],
  "ler-dort": ["Prevenção de LER/DORT", "seguranca", 4],
  "direcao-defensiva": ["Direção defensiva", "seguranca", 4],
  "conducao-segura-economica": ["Condução segura e económica", "seguranca", 4],
  "manuseio-quimicos": ["Manuseio seguro de produtos químicos", "seguranca", 8],
  "trabalho-altura": ["Trabalho em altura", "seguranca", 8],
  "meio-ambiente-etica-seguranca": ["Meio ambiente, ética e assertividade na segurança", "seguranca", 2],
  "motivacao-palestra-show": ["Motivação (palestra-show)", "gestao", 2],
  "inovacao-criatividade": ["Inovação e criatividade", "gestao", 4],
  "qualidade-5s-8s": ["Qualidade total — 5S e 8S", "gestao", 4],
  "sustentabilidade-cidadania": ["Sustentabilidade, ambiente e cidadania", "gestao", 2],
  "planeamento-economico": ["Planeamento económico pessoal", "gestao", 4],
  "gestao-risco": ["Gestão do risco", "gestao", 4],
  "servico-cliente": ["Gestão do serviço ao cliente", "gestao", 4],
  "vendas-impacto": ["Vendas de impacto", "gestao", 4],
  "etica-postura-marketing-pessoal": ["Ética, postura profissional e marketing pessoal", "gestao", 4],
  "workshop-lideranca": ["Workshop de Liderança", "gestao", 8],
  "comunicacao-relacionamento": ["Comunicação e relacionamento nas equipas", "gestao", 4],
  "4fs-sucesso": ["Os 4Fs do sucesso — propósito e mentalidade", "gestao", 2],
  "gestao-conflitos": ["Gestão de conflitos", "gestao", 4],
  "inteligencia-emocional": ["Inteligência emocional", "gestao", 4],
  "atendimento-cliente": ["Atendimento ao cliente", "gestao", 4],
  "dependencia-tecnologica": ["A comunicação na era da dependência tecnológica", "tecnologia", 2],
  "palestras-interativas-on-time": ["Palestra interativa 'On Time'", "tecnologia", 2],
  "webconferencia": ["Palestras e cursos via webconferência", "tecnologia", 2],
  "sipat-eventos": ["SIPAT e eventos corporativos", "especiais", 8],
  "ginastica-laboral": ["Ginástica laboral", "especiais", 2],
  "intervencoes-setores": ["Intervenções nos setores", "especiais", 2],
};

const DESCONTO = 0.2; // §8: 20% de contrato anual
const precoAvulso = (h) => (h <= 2 ? 450 : h <= 4 ? 850 : 1400);

function justificativa(id, empresa) {
  const [, area] = CAT[id];
  const legal = new Set([
    "combate-assedio", "ergonomia", "primeiros-socorros", "seguranca-saude-trabalho",
    "uso-epi-epc", "manuseio-quimicos", "trabalho-altura",
  ]);
  if (legal.has(id)) return `Formação com obrigação legal, prioritária para ${empresa.sector.toLowerCase()}.`;
  const porArea = {
    saude: `Reforça a saúde e o bem-estar das equipas de ${empresa.sector.toLowerCase()}.`,
    seguranca: `Responde aos riscos declarados: ${empresa.risks.join(", ") || "risco geral"}.`,
    gestao: `Desenvolve competências de gestão alinhadas com a prioridade declarada.`,
    tecnologia: `Moderniza a comunicação interna da equipa.`,
    especiais: `Ação de envolvimento e cultura para toda a organização.`,
  };
  return porArea[area];
}

// 6 empresas portuguesas plausíveis (§10). ids = plano de 12 meses (legais nos 1os meses; agosto sem 8h).
const EMPRESAS = [
  {
    company_name: "MetalAçor, Lda.", sector: "Metalomecânica", headcount_band: "51_200",
    risks: ["trabalho em altura", "químicos"], last_actions: "Ação pontual de EPI em 2025",
    priority: "reducao_acidentes", budget_band: "15.000 a 30.000 €", contact_email: "geral@metalacor.pt",
    dias: 42, leitura_geral: "Empresa industrial com exposição a trabalho em altura e agentes químicos. O plano prioriza as obrigações legais de segurança e a proteção coletiva antes de evoluir para cultura preventiva e gestão de equipas.",
    ids: ["seguranca-saude-trabalho", "trabalho-altura", "manuseio-quimicos", "uso-epi-epc", "primeiros-socorros", "comportamento-seguro", "ergonomia", "ginastica-laboral", "ler-dort", "qualidade-5s-8s", "combate-assedio", "gestao-conflitos"],
  },
  {
    company_name: "Hotel Caldeira Verde", sector: "Hotelaria", headcount_band: "11_50",
    risks: ["atendimento ao público"], last_actions: "Formação de acolhimento em 2024",
    priority: "clima_motivacao", budget_band: "5.000 a 15.000 €", contact_email: "rh@caldeiraverde.pt",
    dias: 35, leitura_geral: "Unidade hoteleira açoriana focada na experiência do hóspede. O plano cobre as bases legais de segurança e higiene e investe fortemente em atendimento, clima e bem-estar das equipas.",
    ids: ["seguranca-saude-trabalho", "primeiros-socorros", "combate-assedio", "ergonomia", "servico-cliente", "atendimento-cliente", "qualidade-vida-stress", "ginastica-laboral", "motivacao-palestra-show", "comunicacao-relacionamento", "saude-mental-emocional", "gestao-conflitos"],
  },
  {
    company_name: "SuperIlha Distribuição, S.A.", sector: "Retalho alimentar", headcount_band: "mais_200",
    risks: ["esforço repetitivo", "turnos noturnos"], last_actions: null,
    priority: "reducao_acidentes", budget_band: "mais de 30.000 €", contact_email: null,
    dias: 28, leitura_geral: "Retalhista de grande dimensão com trabalho repetitivo e por turnos. O plano combina segurança e ergonomia com ações de saúde para reduzir sinistralidade e absentismo.",
    ids: ["seguranca-saude-trabalho", "primeiros-socorros", "ergonomia", "uso-epi-epc", "ler-dort", "comportamento-seguro", "perturbacoes-sono", "ginastica-laboral", "qualidade-5s-8s", "combate-assedio", "servico-cliente", "qualidade-vida-stress"],
  },
  {
    company_name: "TransAtlântico Logística, Lda.", sector: "Transportes e logística", headcount_band: "51_200",
    risks: ["condução"], last_actions: "Reciclagem de condução em 2025",
    priority: "reducao_acidentes", budget_band: "15.000 a 30.000 €", contact_email: "pessoas@translantico.pt",
    dias: 21, leitura_geral: "Operador logístico com frota significativa. O plano concentra-se na segurança rodoviária e no comportamento seguro, complementado com gestão de risco e literacia financeira das equipas.",
    ids: ["seguranca-saude-trabalho", "primeiros-socorros", "direcao-defensiva", "uso-epi-epc", "conducao-segura-economica", "comportamento-seguro", "ergonomia", "ginastica-laboral", "perturbacoes-sono", "combate-assedio", "gestao-risco", "planeamento-economico"],
  },
  {
    company_name: "Lar Solar do Monte", sector: "Cuidados a idosos", headcount_band: "11_50",
    risks: ["esforço repetitivo"], last_actions: "Sem formação estruturada",
    priority: "obrigacoes_legais", budget_band: "5.000 a 15.000 €", contact_email: null,
    dias: 14, leitura_geral: "Estrutura residencial para idosos com forte carga física no cuidado. O plano garante as obrigações legais e reforça ergonomia, saúde mental e comunicação das equipas cuidadoras.",
    ids: ["seguranca-saude-trabalho", "primeiros-socorros", "ergonomia", "combate-assedio", "ler-dort", "uso-epi-epc", "saude-mental-emocional", "ginastica-laboral", "higiene-saude-oral", "qualidade-vida-stress", "comunicacao-relacionamento", "gestao-conflitos"],
  },
  {
    company_name: "LinhaViva Contact Center, S.A.", sector: "Contact center", headcount_band: "mais_200",
    risks: ["atendimento ao público"], last_actions: "Workshop de stress em 2024",
    priority: "clima_motivacao", budget_band: "15.000 a 30.000 €", contact_email: null,
    dias: 7, leitura_geral: "Operação de contact center com elevada carga emocional e prioridade na saúde mental. O plano equilibra as bases de segurança com um forte eixo de bem-estar psicológico e gestão de conflitos.",
    ids: ["seguranca-saude-trabalho", "primeiros-socorros", "combate-assedio", "ergonomia", "saude-mental-emocional", "qualidade-vida-stress", "gestao-conflitos", "ginastica-laboral", "perturbacoes-sono", "comunicacao-relacionamento", "servico-cliente", "inteligencia-emocional"],
  },
];

const q = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const arr = (xs) => `ARRAY[${xs.map((x) => `'${x.replace(/'/g, "''")}'`).join(", ")}]::text[]`;

function buildMonths(emp) {
  const meses = emp.ids.slice(0, 12).map((id, i) => {
    const [titulo, area, duracao_h] = CAT[id];
    return { mes: i + 1, catalogo_id: id, titulo, area, duracao_h, justificativa: justificativa(id, emp) };
  });
  const avulso = meses.reduce((s, m) => s + precoAvulso(m.duracao_h), 0);
  const estimated_value = Math.round(avulso * (1 - DESCONTO));
  const months = { leitura_geral: emp.leitura_geral, meses };
  return { months, estimated_value };
}

let out = `-- DEMO: seed de demonstração para a reunião do fundo (6 diagnósticos + planos).
-- Colar no SQL Editor do Dashboard EU DEPOIS de aplicar a migration 0003_demo_saas.sql.
-- Gerado por scripts/gen-seed.mjs. owner_id=NULL (públicos). O user demo@ é criado à parte pelo Dashboard.
-- Idempotente: apaga seeds anteriores desta demo pelo prefixo do company_name antes de reinserir.

delete from public.plans p using public.diagnostics d
  where p.diagnostic_id = d.id and d.company_name in (${EMPRESAS.map((e) => q(e.company_name)).join(", ")});
delete from public.diagnostics
  where company_name in (${EMPRESAS.map((e) => q(e.company_name)).join(", ")});
`;

for (const emp of EMPRESAS) {
  const { months, estimated_value } = buildMonths(emp);
  const monthsJson = JSON.stringify(months).replace(/'/g, "''");
  out += `
with d as (
  insert into public.diagnostics
    (created_at, company_name, sector, headcount_band, risks, last_actions, priority, budget_band, contact_email, owner_id)
  values (now() - interval '${emp.dias} days', ${q(emp.company_name)}, ${q(emp.sector)}, ${q(emp.headcount_band)}, ${arr(emp.risks)}, ${q(emp.last_actions)}, ${q(emp.priority)}, ${q(emp.budget_band)}, ${q(emp.contact_email)}, null)
  returning id
)
insert into public.plans (created_at, diagnostic_id, months, estimated_value, owner_id)
select now() - interval '${emp.dias} days', id, '${monthsJson}'::jsonb, ${estimated_value}, null from d;
`;
}

process.stdout.write(out);
