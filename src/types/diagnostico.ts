// Contrato partilhado entre front (wizard/plano/portal) e infra/IA (/api/ai + catálogo).
// NÃO alterar sem avisar o Copiloto — a outra codificadora constrói em cima disto.

export type Area = "saude" | "seguranca" | "gestao" | "tecnologia" | "especiais";
export type HeadcountBand = "ate_10" | "11_50" | "51_200" | "mais_200";
export type Priority = "obrigacoes_legais" | "clima_motivacao" | "reducao_acidentes" | "lideranca_gestao";

export type ItemCatalogo = { id: string; titulo: string; area: Area; duracao_h: number; publico: string; sinopse: string; obrigatorio_legal: boolean };

export type Diagnostico = { id?: string; company_name?: string; sector: string; headcount_band: HeadcountBand; risks: string[]; last_actions?: string; priority: Priority; budget_band?: string; contact_email?: string };

export type MesDoPlano = { mes: number; catalogo_id: string; titulo: string; area: string; duracao_h: number; justificativa: string };

export type Plano = { id?: string; diagnostic_id?: string; meses: MesDoPlano[]; leitura_geral: string; valor_estimado: number };

export type Msg = { role: "user" | "assistant"; content: string };
