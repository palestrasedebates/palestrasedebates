// Rótulos PT-PT e opções do funil de diagnóstico. Partilhado wizard/plano/admin.
import type { Area, HeadcountBand, Priority } from '@/types/diagnostico'

export const HEADCOUNT_OPCOES: { value: HeadcountBand; label: string }[] = [
  { value: 'ate_10', label: 'Até 10 colaboradores' },
  { value: '11_50', label: '11 a 50 colaboradores' },
  { value: '51_200', label: '51 a 200 colaboradores' },
  { value: 'mais_200', label: 'Mais de 200 colaboradores' },
]

export const HEADCOUNT_CURTO: Record<HeadcountBand, string> = {
  ate_10: 'Até 10',
  '11_50': '11–50',
  '51_200': '51–200',
  mais_200: '200+',
}

export const PRIORIDADE_OPCOES: { value: Priority; label: string; descricao: string }[] = [
  { value: 'obrigacoes_legais', label: 'Cumprir obrigações legais', descricao: 'Garantir a conformidade com a legislação de SST.' },
  { value: 'clima_motivacao', label: 'Melhorar o clima e a motivação', descricao: 'Equipas mais envolvidas e satisfeitas.' },
  { value: 'reducao_acidentes', label: 'Reduzir acidentes de trabalho', descricao: 'Baixar a sinistralidade e o absentismo.' },
  { value: 'lideranca_gestao', label: 'Reforçar liderança e gestão', descricao: 'Chefias mais preparadas para conduzir equipas.' },
]

export const PRIORIDADE_LABEL: Record<Priority, string> = {
  obrigacoes_legais: 'Obrigações legais',
  clima_motivacao: 'Clima e motivação',
  reducao_acidentes: 'Redução de acidentes',
  lideranca_gestao: 'Liderança e gestão',
}

export const RISCOS_OPCOES: string[] = [
  'Quedas em altura',
  'Movimentação manual de cargas',
  'Exposição a ruído',
  'Riscos ergonómicos',
  'Riscos psicossociais e stress',
  'Risco de incêndio',
  'Riscos elétricos',
  'Manuseamento de produtos químicos',
  'Trabalho com máquinas',
  'Condução e circulação de veículos',
]

export const ORCAMENTO_OPCOES: { value: string; label: string }[] = [
  { value: 'ate_5k', label: 'Até 5.000 €' },
  { value: '5k_15k', label: '5.000 € a 15.000 €' },
  { value: '15k_30k', label: '15.000 € a 30.000 €' },
  { value: 'mais_30k', label: 'Mais de 30.000 €' },
  { value: 'sem_definir', label: 'Ainda por definir' },
]

export const AREA_LABEL: Record<Area, string> = {
  saude: 'Saúde',
  seguranca: 'Segurança',
  gestao: 'Gestão',
  tecnologia: 'Tecnologia',
  especiais: 'Formações especiais',
}

// Cor de badge por área (classes Tailwind), tom institucional.
export const AREA_BADGE: Record<Area, string> = {
  saude: 'bg-emerald-100 text-emerald-800',
  seguranca: 'bg-red-100 text-red-800',
  gestao: 'bg-blue-100 text-blue-800',
  tecnologia: 'bg-violet-100 text-violet-800',
  especiais: 'bg-amber-100 text-amber-800',
}
