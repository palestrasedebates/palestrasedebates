// DEMO: /app — portal do cliente (plano editável | consultor IA). Shell próprio de produto.
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Send, LogOut, Clock, Pencil, Check, Sparkles, Loader2 } from 'lucide-react'
import { supabase, isSupabaseReady } from '@/lib/supabase'
import { conversar } from '@/lib/ai'
import { lerPlanoLocal, guardarPlanoLocal, lerPlanoMaisRecente } from '@/lib/diagnostico-db'
import { AREA_LABEL, AREA_BADGE } from '@/lib/diagnostico-labels'
import type { Plano, Diagnostico, Area, MesDoPlano, Msg } from '@/types/diagnostico'

const APP_REDIRECT = `${window.location.origin}/app`

// Mensagens que rotam enquanto o consultor pensa (~15s do gpt-5-mini).
const MSG_ESPERA_CHAT = [
  'A analisar o seu pedido…',
  'A rever o plano de formação…',
  'A ajustar as formações…',
  'Quase a terminar…',
]

const AppPortalPage = () => {
  const [sessaoPronta, setSessaoPronta] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const [email, setEmail] = useState('')
  const [enviandoLink, setEnviandoLink] = useState(false)
  const [linkEnviado, setLinkEnviado] = useState(false)

  const [plano, setPlano] = useState<Plano | null>(null)
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      if (isSupabaseReady && supabase) {
        const { data } = await supabase.auth.getSession()
        if (vivo && data.session) setAutenticado(true)
      }
      if (vivo) setSessaoPronta(true)
    })()
    return () => {
      vivo = false
    }
  }, [])

  // Carrega o plano quando entra: 1) sessão local (acabou de fazer o wizard);
  // 2) senão, o mais recente do banco — assim o portal SEMPRE abre cheio pra
  // demonstrar o consultor (planos do funil têm owner_id=NULL). // DEMO
  useEffect(() => {
    if (!autenticado) return
    let vivo = true
    const local = lerPlanoLocal('demo')
    if (local) {
      setPlano(local.plano)
      setDiagnostico(local.diagnostico)
      return
    }
    ;(async () => {
      const recente = await lerPlanoMaisRecente().catch(() => null)
      if (vivo && recente) {
        setPlano(recente.plano)
        setDiagnostico(recente.diagnostico)
      }
    })()
    return () => {
      vivo = false
    }
  }, [autenticado])

  const enviarMagicLink = async () => {
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast.error('Indique um e-mail válido.')
      return
    }
    setEnviandoLink(true)
    try {
      if (isSupabaseReady && supabase) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: APP_REDIRECT },
        })
        if (error) throw error
      }
      setLinkEnviado(true)
      toast.success('Enviámos-lhe um link de acesso por e-mail.')
    } catch (e) {
      console.error(e) // DEMO
      toast.error('Não foi possível enviar o link. Use o acesso de demonstração.')
    } finally {
      setEnviandoLink(false)
    }
  }

  const sair = async () => {
    if (isSupabaseReady && supabase) await supabase.auth.signOut()
    setAutenticado(false)
  }

  const atualizarPlano = (p: Plano) => {
    setPlano(p)
    guardarPlanoLocal('demo', p, diagnostico ?? ({} as Diagnostico)) // mantém a sessão coerente
  }

  if (!sessaoPronta) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!autenticado) {
    return (
      <Login
        email={email}
        setEmail={setEmail}
        enviar={enviarMagicLink}
        enviando={enviandoLink}
        enviado={linkEnviado}
        entrarDemo={() => setAutenticado(true)}
      />
    )
  }

  return (
    // Desktop: ocupa a tela e não rola a página (só as colunas rolam). Mobile: empilha e rola.
    <div className="flex min-h-screen flex-col bg-secondary lg:h-screen lg:min-h-0 lg:overflow-hidden">
      {/* Barra de produto */}
      <header className="flex shrink-0 items-center justify-between border-b border-input bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <img src="/img/logo.png" alt="Palestras e Debates" className="h-8 w-auto max-w-full shrink-0 object-contain" />
          <span className="text-sm font-semibold text-primary">Portal do cliente</span>
        </div>
        <button onClick={sair} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <LogOut className="size-4" /> Sair
        </button>
      </header>

      {!plano || !diagnostico ? (
        <div className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <p className="text-muted-foreground">Ainda não há um plano associado a esta conta.</p>
            <a href="/diagnostico" className="btn-cta mt-4 inline-flex">Fazer diagnóstico</a>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 gap-0 lg:min-h-0 lg:grid-cols-[1.3fr_1fr] lg:overflow-hidden">
          {/* Coluna esquerda — plano editável (rola só ela no desktop) */}
          <div className="border-r border-input p-6 lg:min-h-0 lg:overflow-y-auto">
            <PlanoEditavel plano={plano} empresa={diagnostico.company_name} onChange={atualizarPlano} />
          </div>
          {/* Coluna direita — consultor IA (altura de tela, input sempre visível) */}
          <div className="flex h-[80vh] min-h-0 flex-col bg-white lg:h-full">
            <Consultor diagnostico={diagnostico} plano={plano} onPlanoAtualizado={atualizarPlano} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Login (magic link + acesso demo) ---------- */
const Login = ({
  email,
  setEmail,
  enviar,
  enviando,
  enviado,
  entrarDemo,
}: {
  email: string
  setEmail: (v: string) => void
  enviar: () => void
  enviando: boolean
  enviado: boolean
  entrarDemo: () => void
}) => (
  <div className="grid min-h-screen place-items-center bg-secondary p-6">
    <div className="w-full max-w-md rounded-2xl border border-input bg-white p-8 shadow-lg">
      <img src="/img/logo.png" alt="Palestras e Debates" className="mx-auto h-10 w-auto max-w-full object-contain" />
      <h1 className="mt-6 text-center text-xl font-bold text-primary">Aceder ao portal</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enviamos-lhe um link seguro por e-mail. Sem palavra-passe.
      </p>

      {enviado ? (
        <div className="mt-6 rounded-lg bg-secondary p-4 text-center text-sm text-foreground">
          Verifique o seu e-mail <strong>{email}</strong> e clique no link para entrar.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.seu@email.pt"
            className="w-full rounded-md border border-input px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button onClick={enviar} disabled={enviando} className="btn-cta w-full disabled:opacity-60">
            {enviando ? 'A enviar…' : 'Receber link de acesso'}
          </button>
        </div>
      )}

      <button
        onClick={entrarDemo}
        className="mt-6 w-full text-center text-xs text-muted-foreground underline hover:text-primary"
      >
        Entrar em modo de demonstração {/* DEMO */}
      </button>
    </div>
  </div>
)

/* ---------- Plano editável (coluna esquerda) ---------- */
const PlanoEditavel = ({
  plano,
  empresa,
  onChange,
}: {
  plano: Plano
  empresa?: string
  onChange: (p: Plano) => void
}) => {
  const [editando, setEditando] = useState<number | null>(null)

  const editarMes = (mes: number, patch: Partial<MesDoPlano>) => {
    onChange({ ...plano, meses: plano.meses.map((m) => (m.mes === mes ? { ...m, ...patch } : m)) })
  }

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Plano anual</p>
      <h1 className="mt-1 text-2xl font-extrabold text-primary">{empresa || 'A sua empresa'}</h1>
      <p className="mt-3 rounded-lg bg-white p-4 text-sm leading-relaxed text-muted-foreground">
        {plano.leitura_geral}
      </p>

      <div className="mt-6 space-y-3">
        {plano.meses.map((m) => {
          const area = m.area as Area
          const emEdicao = editando === m.mes
          return (
            <div key={m.mes} className="rounded-xl border border-input bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Mês {m.mes}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${AREA_BADGE[area] ?? 'bg-secondary'}`}>
                    {AREA_LABEL[area] ?? m.area}
                  </span>
                </div>
                {emEdicao ? (
                  <div className="flex gap-1">
                    <button onClick={() => setEditando(null)} className="rounded p-1 text-emerald-600 hover:bg-emerald-50" aria-label="Concluir">
                      <Check className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditando(m.mes)} className="rounded p-1 text-muted-foreground hover:bg-secondary" aria-label="Editar">
                    <Pencil className="size-3.5" />
                  </button>
                )}
              </div>

              {emEdicao ? (
                <div className="mt-2 space-y-2">
                  <input
                    value={m.titulo}
                    onChange={(e) => editarMes(m.mes, { titulo: e.target.value })}
                    className="w-full rounded border border-input px-2 py-1.5 text-sm font-semibold text-primary outline-none focus:border-primary"
                  />
                  <textarea
                    value={m.justificativa}
                    onChange={(e) => editarMes(m.mes, { justificativa: e.target.value })}
                    rows={2}
                    className="w-full rounded border border-input px-2 py-1.5 text-sm text-muted-foreground outline-none focus:border-primary"
                  />
                </div>
              ) : (
                <>
                  <h3 className="mt-2 font-bold leading-snug text-primary">{m.titulo}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> {m.duracao_h} horas
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.justificativa}</p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/* ---------- Consultor IA (coluna direita) ---------- */
const Consultor = ({
  diagnostico,
  plano,
  onPlanoAtualizado,
}: {
  diagnostico: Diagnostico
  plano: Plano
  onPlanoAtualizado: (p: Plano) => void
}) => {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'assistant',
      content: `Olá! Sou o seu consultor de formação. Posso ajustar o plano de ${diagnostico.company_name || 'a sua empresa'}, explicar cada formação ou dar prioridade a uma área. O que gostaria de mudar?`,
    },
  ])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [dicaEspera, setDicaEspera] = useState(0)
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, pensando])

  // O consultor (gpt-5-mini) leva ~15s; rotaciona mensagens pra não parecer travado.
  useEffect(() => {
    if (!pensando) {
      setDicaEspera(0)
      return
    }
    const t = setInterval(() => setDicaEspera((i) => (i + 1) % MSG_ESPERA_CHAT.length), 2500)
    return () => clearInterval(t)
  }, [pensando])

  const enviar = async () => {
    const conteudo = texto.trim()
    if (!conteudo || pensando) return
    const novas: Msg[] = [...msgs, { role: 'user', content: conteudo }]
    setMsgs(novas)
    setTexto('')
    setPensando(true)
    try {
      const r = await conversar(diagnostico, plano, novas)
      setMsgs((m) => [...m, { role: 'assistant', content: r.resposta }])
      if (r.plano_atualizado) {
        onPlanoAtualizado(r.plano_atualizado)
        toast.success('Plano atualizado pelo consultor')
      }
    } catch (e) {
      console.error(e) // DEMO
      setMsgs((m) => [...m, { role: 'assistant', content: 'Peço desculpa, não consegui responder agora. Pode tentar de novo?' }])
    } finally {
      setPensando(false)
    }
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-input px-5 py-3">
        <span className="grid size-8 place-items-center rounded-full bg-accent/10 text-accent">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-primary">Consultor de formação</p>
          <p className="text-xs text-muted-foreground">Ajuda-o a afinar o plano</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-foreground'
              }`}
            >
              {/* Só o consultor responde em markdown leve; a msg do utilizador é texto plano. */}
              {m.role === 'assistant' ? <MarkdownLeve texto={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {pensando && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" /> {MSG_ESPERA_CHAT[dicaEspera]}
              </span>
            </div>
          </div>
        )}
        <div ref={fimRef} />
      </div>

      <div className="shrink-0 border-t border-input p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                enviar()
              }
            }}
            rows={1}
            disabled={pensando}
            placeholder={pensando ? 'O consultor está a responder…' : 'Escreva a sua mensagem…'}
            className="max-h-32 flex-1 resize-none rounded-lg border border-input px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-secondary/50 disabled:opacity-70"
          />
          <button
            onClick={enviar}
            disabled={pensando || !texto.trim()}
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-white transition hover:brightness-95 disabled:opacity-50"
            aria-label="Enviar"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}

// Render de markdown LEVE (sem dep): parágrafos, listas "- " e **negrito**.
// Seguro (sem dangerouslySetInnerHTML). Contrato da <resposta> do consultor.
function renderInline(texto: string, keyBase: string): React.ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => {
    const forte = parte.match(/^\*\*([^*]+)\*\*$/)
    return forte ? <strong key={`${keyBase}-${i}`}>{forte[1]}</strong> : <span key={`${keyBase}-${i}`}>{parte}</span>
  })
}

const MarkdownLeve = ({ texto }: { texto: string }) => {
  const linhas = texto.split('\n')
  const blocos: React.ReactNode[] = []
  let lista: string[] = []
  let k = 0

  const flush = () => {
    if (lista.length) {
      const itens = lista
      blocos.push(
        <ul key={`ul-${k++}`} className="my-1 list-disc space-y-0.5 pl-5">
          {itens.map((item, i) => (
            <li key={i}>{renderInline(item, `li-${k}-${i}`)}</li>
          ))}
        </ul>,
      )
      lista = []
    }
  }

  for (const linha of linhas) {
    const t = linha.trim()
    if (!t) {
      flush()
      continue
    }
    if (t.startsWith('- ') || t.startsWith('* ')) {
      lista.push(t.slice(2))
      continue
    }
    flush()
    blocos.push(
      <p key={`p-${k++}`} className="[&:not(:first-child)]:mt-2">
        {renderInline(t, `p-${k}`)}
      </p>,
    )
  }
  flush()
  return <>{blocos}</>
}

export default AppPortalPage
