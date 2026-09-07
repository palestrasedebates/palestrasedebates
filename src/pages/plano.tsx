// DEMO: /plano/:id — leitura geral + 12 cards com gate de e-mail (F3).
import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Clock, Lock, Check, ArrowRight, Loader2 } from 'lucide-react'
import {
  lerPlano,
  lerPlanoLocal,
  gravarLeadDiagnostico,
  atualizarContactEmail,
} from '@/lib/diagnostico-db'
import { AREA_LABEL, AREA_BADGE, tituloLimpo } from '@/lib/diagnostico-labels'
import type { Plano, Diagnostico, Area, MesDoPlano } from '@/types/diagnostico'

const eur = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const gateSchema = z.object({ email: z.string().email('Indique um e-mail válido') })
type GateValues = z.infer<typeof gateSchema>

const PlanoPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const [carregando, setCarregando] = useState(true)
  const [plano, setPlano] = useState<Plano | null>(null)
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null)
  const [desbloqueado, setDesbloqueado] = useState(false)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      // 1) tenta ler do Supabase; 2) cai no cache local (modo demo).
      let dados = await lerPlano(id).catch(() => null)
      if (!dados) dados = lerPlanoLocal(id)
      if (!vivo) return
      if (dados) {
        setPlano(dados.plano)
        setDiagnostico(dados.diagnostico)
        if (dados.diagnostico.contact_email) setDesbloqueado(true) // já converteu antes
      }
      setCarregando(false)
    })()
    return () => {
      vivo = false
    }
  }, [id])

  // estimated_value (valor_estimado) JÁ É o valor anual com desconto (o servidor calcula
  // avulso × 0,8). Reconstruímos o avulso a partir dele — não aplicar -20% de novo.
  const precos = useMemo(() => {
    const anual = plano?.valor_estimado ?? 0
    const avulso = Math.round(anual / 0.8)
    return { anual, avulso, poupanca: avulso - anual }
  }, [plano])

  if (carregando) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <Loader2 className="size-10 animate-spin text-accent" />
      </section>
    )
  }

  if (!plano || !diagnostico) {
    return (
      <section className="grid min-h-[60vh] place-items-center py-20">
        <div className="container max-w-lg text-center">
          <h1 className="section-title">Plano não encontrado</h1>
          <p className="mt-3 text-muted-foreground">
            O link pode ter expirado. Faça um novo diagnóstico para gerar o seu plano.
          </p>
          <button onClick={() => navigate('/diagnostico')} className="btn-cta mt-6">
            Fazer diagnóstico
          </button>
        </div>
      </section>
    )
  }

  const visiveis = plano.meses.slice(0, 3)
  const bloqueados = plano.meses.slice(3)

  return (
    <section className="py-14">
      <div className="container max-w-5xl">
        {/* Cabeçalho + leitura geral */}
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          Plano anual de formação
        </p>
        <h1 className="section-title mt-1">
          {diagnostico.company_name || 'A sua empresa'}
        </h1>
        <div className="mt-5 rounded-xl border border-input bg-secondary/50 p-6">
          <p className="leading-relaxed text-foreground">{plano.leitura_geral}</p>
        </div>

        {/* 3 primeiros meses — visíveis */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((m) => (
            <CardMes key={m.mes} m={m} />
          ))}
        </div>

        {/* Restantes 9 meses — bloqueados atrás do gate */}
        {desbloqueado ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bloqueados.map((m) => (
              <CardMes key={m.mes} m={m} />
            ))}
          </div>
        ) : (
          <div className="relative mt-4">
            <div className="pointer-events-none grid select-none gap-4 blur-[6px] sm:grid-cols-2 lg:grid-cols-3">
              {bloqueados.map((m) => (
                <CardMes key={m.mes} m={m} />
              ))}
            </div>
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-white/40 to-white/90">
              <GateEmail
                empresa={diagnostico.company_name}
                diagnosticId={diagnostico.id}
                onDesbloquear={() => setDesbloqueado(true)}
              />
            </div>
          </div>
        )}

        {/* Comparativo + CTA — só depois de revelar */}
        {desbloqueado && (
          <div className="mt-14">
            <h2 className="section-title text-center">Como quer avançar?</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Avulso */}
              <div className="rounded-xl border border-input bg-white p-7">
                <p className="font-semibold text-primary">Formações avulsas</p>
                <p className="mt-2 text-3xl font-extrabold text-primary">{eur.format(precos.avulso)}</p>
                <p className="mt-1 text-sm text-muted-foreground">Contratadas uma a uma, ao longo do ano.</p>
              </div>
              {/* Anual */}
              <div className="relative rounded-xl border-2 border-accent bg-accent/5 p-7">
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-white">
                  Poupa 20%
                </span>
                <p className="font-semibold text-primary">Plano anual</p>
                <p className="mt-2 text-3xl font-extrabold text-primary">{eur.format(precos.anual)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Todo o percurso num só compromisso: poupa {eur.format(precos.poupanca)}.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-primary p-8 text-center text-white">
              <h3 className="text-xl font-bold">Gerir este plano com o seu consultor</h3>
              <p className="mx-auto mt-2 max-w-xl text-white/80">
                Crie a sua conta para acompanhar o plano, ajustar formações e falar com o consultor virtual sempre que precisar.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="btn-cta mt-6 inline-flex items-center gap-2"
              >
                Criar conta para gerir este plano <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const CardMes = ({ m }: { m: MesDoPlano }) => {
  const area = m.area as Area
  return (
    <div className="flex h-full flex-col rounded-xl border border-input bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Mês {m.mes}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${AREA_BADGE[area] ?? 'bg-secondary text-foreground'}`}>
          {AREA_LABEL[area] ?? m.area}
        </span>
      </div>
      <h3 className="mt-3 font-bold leading-snug text-primary">{tituloLimpo(m.titulo)}</h3>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="size-4" /> {m.duracao_h} horas
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.justificativa}</p>
    </div>
  )
}

const GateEmail = ({
  empresa,
  diagnosticId,
  onDesbloquear,
}: {
  empresa?: string
  diagnosticId?: string
  onDesbloquear: () => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GateValues>({ resolver: zodResolver(gateSchema) })

  const onSubmit = async ({ email }: GateValues) => {
    try {
      await gravarLeadDiagnostico(email, empresa) // grava a lead (padrão único)
      if (diagnosticId) {
        // best-effort: vincula o contacto ao diagnóstico (depende de RLS de UPDATE)
        await atualizarContactEmail(diagnosticId, email).catch((e) =>
          console.warn('DEMO: update contact_email indisponível.', e),
        )
      }
      toast.success('Plano completo desbloqueado!')
      onDesbloquear()
    } catch (e) {
      console.error(e) // DEMO
      toast.error('Não foi possível registar o e-mail. Tente novamente, por favor.')
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-input bg-white p-7 text-center shadow-xl">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/10 text-accent">
        <Lock className="size-6" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-primary">Receba o plano completo</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Indique o seu e-mail para ver os 12 meses e o investimento estimado.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-3">
        <input
          {...register('email')}
          type="email"
          placeholder="o.seu@email.pt"
          className="w-full rounded-md border border-input px-4 py-3 text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-cta w-full disabled:opacity-60">
          {isSubmitting ? (
            'A desbloquear…'
          ) : (
            <span className="inline-flex items-center gap-2">
              Ver plano completo <Check className="size-4" />
            </span>
          )}
        </button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">Sem compromisso. Usamos o e-mail só para lhe enviar o plano.</p>
    </div>
  )
}

export default PlanoPage
