// DEMO: /admin — painel de operação (KPIs + pipeline de diagnósticos). Shell próprio.
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, TrendingUp, ClipboardList, MailCheck, MailX } from 'lucide-react'
import { lerLinhasAdmin, type LinhaAdmin } from '@/lib/diagnostico-db'
import { HEADCOUNT_CURTO, PRIORIDADE_LABEL } from '@/lib/diagnostico-labels'

const eur = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const dataFmt = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })

// DEMO: dados fabricados quando as tabelas ainda não existem, pra o painel não ficar vazio.
const LINHAS_DEMO: LinhaAdmin[] = [
  { planId: 'demo-1', data: '2026-09-05', empresa: 'Padaria do Mar, Lda.', setor: 'Restauração', headcount_band: '11_50', priority: 'reducao_acidentes', valor: 8400, temEmail: true },
  { planId: 'demo-2', data: '2026-09-04', empresa: 'Construções Atlântico', setor: 'Construção civil', headcount_band: '51_200', priority: 'obrigacoes_legais', valor: 14200, temEmail: true },
  { planId: 'demo-3', data: '2026-09-03', empresa: 'Clínica Sorriso', setor: 'Saúde', headcount_band: 'ate_10', priority: 'clima_motivacao', valor: 5600, temEmail: false },
  { planId: 'demo-4', data: '2026-09-02', empresa: 'TransAçores', setor: 'Logística', headcount_band: 'mais_200', priority: 'lideranca_gestao', valor: 22800, temEmail: true },
  { planId: 'demo-5', data: '2026-09-01', empresa: 'Hotel Caldeira', setor: 'Hotelaria', headcount_band: '51_200', priority: 'clima_motivacao', valor: 11700, temEmail: false },
]

const AdminPage = () => {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(true)
  const [linhas, setLinhas] = useState<LinhaAdmin[]>([])
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      const dados = await lerLinhasAdmin().catch(() => null)
      if (!vivo) return
      if (dados && dados.length > 0) {
        setLinhas(dados)
      } else {
        setLinhas(LINHAS_DEMO) // DEMO: tabelas ainda vazias/inexistentes
        setDemo(true)
      }
      setCarregando(false)
    })()
    return () => {
      vivo = false
    }
  }, [])

  const kpis = useMemo(() => {
    const total = linhas.reduce((s, l) => s + l.valor, 0)
    return { qtd: linhas.length, pipeline: total }
  }, [linhas])

  const abrir = (l: LinhaAdmin) => {
    if (l.planId.startsWith('demo-')) return // DEMO: linhas fabricadas não têm plano real
    navigate(`/plano/${l.planId}`)
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-input bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/img/logo.png" alt="Palestras e Debates" className="h-8 w-auto max-w-full shrink-0 object-contain" />
            <span className="text-sm font-semibold text-primary">Operação · Diagnósticos</span>
          </div>
          {demo && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Dados de demonstração
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {carregando ? (
          <div className="grid h-64 place-items-center">
            <Loader2 className="size-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {/* KPIs grandes */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Kpi
                icone={<ClipboardList className="size-6" />}
                rotulo="Diagnósticos realizados"
                valor={String(kpis.qtd)}
                nota="empresas que fizeram o diagnóstico"
              />
              <Kpi
                icone={<TrendingUp className="size-6" />}
                rotulo="Valor total em pipeline"
                valor={eur.format(kpis.pipeline)}
                nota="soma dos planos anuais gerados"
                destaque
              />
            </div>

            {/* Tabela de operação */}
            <div className="mt-8 overflow-hidden rounded-xl border border-input bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-input bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Data</th>
                    <th className="px-4 py-3 font-semibold">Empresa</th>
                    <th className="px-4 py-3 font-semibold">Setor</th>
                    <th className="px-4 py-3 font-semibold">Colab.</th>
                    <th className="px-4 py-3 font-semibold">Prioridade</th>
                    <th className="px-4 py-3 text-right font-semibold">Valor</th>
                    <th className="px-4 py-3 text-center font-semibold">E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((l) => (
                    <tr
                      key={l.planId}
                      onClick={() => abrir(l)}
                      className="cursor-pointer border-b border-input/60 transition last:border-0 hover:bg-secondary/40"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {l.data ? dataFmt.format(new Date(l.data)) : 'n/d'}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">{l.empresa}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.setor}</td>
                      <td className="px-4 py-3 text-muted-foreground">{HEADCOUNT_CURTO[l.headcount_band] ?? 'n/d'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{PRIORIDADE_LABEL[l.priority] ?? 'n/d'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-primary">{eur.format(l.valor)}</td>
                      <td className="px-4 py-3">
                        <span className="flex justify-center">
                          {l.temEmail ? (
                            <MailCheck className="size-4 text-emerald-600" aria-label="Com e-mail" />
                          ) : (
                            <MailX className="size-4 text-muted-foreground/50" aria-label="Sem e-mail" />
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const Kpi = ({
  icone,
  rotulo,
  valor,
  nota,
  destaque,
}: {
  icone: React.ReactNode
  rotulo: string
  valor: string
  nota: string
  destaque?: boolean
}) => (
  <div className={`rounded-2xl border p-6 ${destaque ? 'border-accent bg-accent/5' : 'border-input bg-white'}`}>
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className={`grid size-10 place-items-center rounded-full ${destaque ? 'bg-accent/15 text-accent' : 'bg-secondary text-primary'}`}>
        {icone}
      </span>
      <span className="text-sm font-medium">{rotulo}</span>
    </div>
    <p className="mt-4 text-4xl font-extrabold text-primary">{valor}</p>
    <p className="mt-1 text-sm text-muted-foreground">{nota}</p>
  </div>
)

export default AdminPage
