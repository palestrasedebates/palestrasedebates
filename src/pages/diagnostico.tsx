// DEMO: wizard de diagnóstico — 6 passos (§9.1). Reusa rhf+zod do contato.tsx.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { gerarPlano } from '@/lib/ai'
import {
  inserirDiagnostico,
  inserirPlano,
  guardarPlanoLocal,
} from '@/lib/diagnostico-db'
import {
  HEADCOUNT_OPCOES,
  PRIORIDADE_OPCOES,
  RISCOS_OPCOES,
  ORCAMENTO_OPCOES,
} from '@/lib/diagnostico-labels'
import type { Diagnostico } from '@/types/diagnostico'

const schema = z.object({
  company_name: z.string().min(2, 'Indique o nome da empresa'),
  sector: z.string().min(2, 'Indique o setor de atividade'),
  headcount_band: z.enum(['ate_10', '11_50', '51_200', 'mais_200'], {
    message: 'Escolha a dimensão da equipa',
  }),
  risks: z.array(z.string()).min(1, 'Selecione pelo menos um risco'),
  last_actions: z.string().optional(),
  priority: z.enum(
    ['obrigacoes_legais', 'clima_motivacao', 'reducao_acidentes', 'lideranca_gestao'],
    { message: 'Escolha a sua prioridade' },
  ),
  budget_band: z.string().min(1, 'Escolha uma faixa de orçamento'),
})

type FormValues = z.infer<typeof schema>

// Campos validados a cada passo antes de avançar.
const PASSOS: { titulo: string; subtitulo: string; campos: (keyof FormValues)[] }[] = [
  { titulo: 'A sua empresa', subtitulo: 'Comecemos pelo essencial.', campos: ['company_name', 'sector'] },
  { titulo: 'Dimensão da equipa', subtitulo: 'Quantos colaboradores tem?', campos: ['headcount_band'] },
  { titulo: 'Riscos presentes', subtitulo: 'Selecione os que se aplicam à sua atividade.', campos: ['risks'] },
  { titulo: 'Formação recente', subtitulo: 'O que já fizeram nos últimos 12 meses? (opcional)', campos: [] },
  { titulo: 'A sua prioridade', subtitulo: 'O que é mais importante para si este ano?', campos: ['priority'] },
  { titulo: 'Orçamento previsto', subtitulo: 'Ajuda-nos a ajustar a proposta.', campos: ['budget_band'] },
]

const MSG_ESPERA = [
  'A cruzar o seu perfil com 40 formações do catálogo…',
  'A verificar obrigações legais para o seu setor…',
  'A montar o percurso anual mês a mês…',
  'A estimar o investimento…',
]

const DiagnosticoPage = () => {
  const navigate = useNavigate()
  const [passo, setPasso] = useState(0)
  const [gerando, setGerando] = useState(false)
  const [msgEspera, setMsgEspera] = useState(0)

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { risks: [], last_actions: '', budget_band: '' },
    mode: 'onTouched',
  })

  const ultimo = passo === PASSOS.length - 1

  const avancar = async () => {
    const ok = await trigger(PASSOS[passo].campos)
    if (ok) setPasso((p) => Math.min(p + 1, PASSOS.length - 1))
  }
  const voltar = () => setPasso((p) => Math.max(p - 1, 0))

  const rodarEspera = () => {
    // roda as mensagens de valorização enquanto a IA responde
    let i = 0
    const t = setInterval(() => {
      i = (i + 1) % MSG_ESPERA.length
      setMsgEspera(i)
    }, 1400)
    return () => clearInterval(t)
  }

  const onSubmit = async (values: FormValues) => {
    setGerando(true)
    const parar = rodarEspera()
    try {
      const diagnostico: Diagnostico = { ...values }

      // DEMO: persistência tolerante — enquanto a migration (diagnostics/plans) não
      // existe, o insert falha e caímos no modo local (sessionStorage) sem quebrar o
      // fluxo. Quando as tabelas existirem, grava e navega pelo id real.
      let diagnosticId: string | null = null
      try {
        diagnosticId = await inserirDiagnostico(diagnostico)
      } catch (e) {
        console.warn('DEMO: tabela diagnostics indisponível, a seguir em modo local.', e)
      }

      const plano = await gerarPlano(diagnostico)

      let planId: string | null = null
      if (diagnosticId) {
        try {
          planId = await inserirPlano(diagnosticId, plano)
        } catch (e) {
          console.warn('DEMO: tabela plans indisponível, a seguir em modo local.', e)
        }
      }

      // Sem persistência (mock/local): guarda em sessão e usa id "demo".
      const rota = planId ?? 'demo'
      if (!planId) guardarPlanoLocal(rota, plano, diagnostico)

      navigate(`/plano/${rota}`)
    } catch (e) {
      toast.error('Não foi possível gerar o plano agora. Tente novamente, por favor.')
      console.error(e) // DEMO
      setGerando(false)
      parar()
    }
  }

  if (gerando) {
    return (
      <section className="grid min-h-[70vh] place-items-center py-20">
        <div className="container max-w-xl text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-accent" />
          <h2 className="section-title mt-6">A preparar o seu plano de formação</h2>
          <p className="mt-3 min-h-[3rem] text-lg text-muted-foreground transition-all">
            {MSG_ESPERA[msgEspera]}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14">
      <div className="container max-w-2xl">
        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>Passo {passo + 1} de {PASSOS.length}</span>
            <span>{Math.round(((passo + 1) / PASSOS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${((passo + 1) / PASSOS.length) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="section-title">{PASSOS[passo].titulo}</h1>
        <p className="mt-1 text-muted-foreground">{PASSOS[passo].subtitulo}</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
          {/* Passo 1 — empresa + setor */}
          {passo === 0 && (
            <>
              <Campo label="Nome da empresa" erro={errors.company_name?.message}>
                <input {...register('company_name')} placeholder="Ex.: Padaria do Mar, Lda." className={inputCls} />
              </Campo>
              <Campo label="Setor de atividade" erro={errors.sector?.message}>
                <input {...register('sector')} placeholder="Ex.: Restauração, Construção, Comércio…" className={inputCls} />
              </Campo>
            </>
          )}

          {/* Passo 2 — dimensão */}
          {passo === 1 && (
            <Controller
              control={control}
              name="headcount_band"
              render={({ field }) => (
                <Campo label="" erro={errors.headcount_band?.message}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {HEADCOUNT_OPCOES.map((o) => (
                      <OpcaoRadio
                        key={o.value}
                        selecionado={field.value === o.value}
                        onClick={() => field.onChange(o.value)}
                        titulo={o.label}
                      />
                    ))}
                  </div>
                </Campo>
              )}
            />
          )}

          {/* Passo 3 — riscos (multi) */}
          {passo === 2 && (
            <Controller
              control={control}
              name="risks"
              render={({ field }) => (
                <Campo label="" erro={errors.risks?.message as string | undefined}>
                  <div className="flex flex-wrap gap-2">
                    {RISCOS_OPCOES.map((r) => {
                      const ativo = field.value?.includes(r)
                      return (
                        <button
                          type="button"
                          key={r}
                          onClick={() =>
                            field.onChange(
                              ativo ? field.value.filter((x) => x !== r) : [...(field.value ?? []), r],
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            ativo
                              ? 'border-accent bg-accent text-white'
                              : 'border-input bg-white text-foreground hover:border-accent'
                          }`}
                        >
                          {r}
                        </button>
                      )
                    })}
                  </div>
                </Campo>
              )}
            />
          )}

          {/* Passo 4 — ações recentes */}
          {passo === 3 && (
            <Campo label="Formações já realizadas" erro={undefined}>
              <textarea
                {...register('last_actions')}
                rows={5}
                placeholder="Ex.: Primeiros socorros em janeiro; nada mais este ano."
                className={inputCls}
              />
            </Campo>
          )}

          {/* Passo 5 — prioridade */}
          {passo === 4 && (
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Campo label="" erro={errors.priority?.message}>
                  <div className="grid gap-3">
                    {PRIORIDADE_OPCOES.map((o) => (
                      <OpcaoRadio
                        key={o.value}
                        selecionado={field.value === o.value}
                        onClick={() => field.onChange(o.value)}
                        titulo={o.label}
                        descricao={o.descricao}
                      />
                    ))}
                  </div>
                </Campo>
              )}
            />
          )}

          {/* Passo 6 — orçamento */}
          {passo === 5 && (
            <Controller
              control={control}
              name="budget_band"
              render={({ field }) => (
                <Campo label="" erro={errors.budget_band?.message}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ORCAMENTO_OPCOES.map((o) => (
                      <OpcaoRadio
                        key={o.value}
                        selecionado={field.value === o.value}
                        onClick={() => field.onChange(o.value)}
                        titulo={o.label}
                      />
                    ))}
                  </div>
                </Campo>
              )}
            />
          )}

          {/* Navegação */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={voltar}
              disabled={passo === 0}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-primary transition hover:text-accent disabled:invisible"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>

            {ultimo ? (
              <button type="submit" className="btn-cta inline-flex items-center gap-2">
                Gerar o meu plano <Check className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={avancar}
                className="btn-cta inline-flex items-center gap-2"
              >
                Continuar <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

const inputCls =
  'w-full rounded-md border border-input px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary'

const Campo = ({
  label,
  erro,
  children,
}: {
  label: string
  erro?: string
  children: React.ReactNode
}) => (
  <div>
    {label && <label className="mb-2 block font-medium text-primary">{label}</label>}
    {children}
    {erro && <p className="mt-2 text-sm text-destructive">{erro}</p>}
  </div>
)

const OpcaoRadio = ({
  selecionado,
  onClick,
  titulo,
  descricao,
}: {
  selecionado: boolean
  onClick: () => void
  titulo: string
  descricao?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg border p-4 text-left transition ${
      selecionado ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-input bg-white hover:border-accent'
    }`}
  >
    <span className="flex items-center gap-2 font-medium text-primary">
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-full border ${
          selecionado ? 'border-accent bg-accent text-white' : 'border-input'
        }`}
      >
        {selecionado && <Check className="size-3" />}
      </span>
      {titulo}
    </span>
    {descricao && <span className="mt-1 block pl-7 text-sm text-muted-foreground">{descricao}</span>}
  </button>
)

export default DiagnosticoPage
