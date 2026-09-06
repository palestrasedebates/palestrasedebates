import { useEffect } from 'react'

// Embed do assistente virtual Dr. Wilson (bot InBot nº 103, do Grupo 4F).
// O framework do InBot EXIGE jQuery carregado antes do script do bot; depois
// ele injeta sozinho o widget (launcher flutuante + painel de chat).
const INBOT_SRC =
  'https://in.bot/api/inbot.gz.js?bot_id=103&bot_token=affvyja8931bor2b3cww&bot_server_type=production&bot_translate=pt-BR'

let started = false

export const loadDrWilson = () => {
  if (started || typeof document === 'undefined') return
  started = true

  const injectBot = () => {
    if (document.getElementById('chatscript')) return
    const s = document.createElement('script')
    s.id = 'chatscript' // o loader do InBot lê a própria tag por este id
    s.async = true
    s.src = INBOT_SRC
    document.body.appendChild(s)
  }

  // Reusa jQuery se já existir; senão carrega o exigido pelo InBot.
  if ((window as unknown as { jQuery?: unknown }).jQuery) {
    injectBot()
  } else {
    const jq = document.createElement('script')
    jq.src = 'https://code.jquery.com/jquery-3.4.1.min.js'
    jq.onload = injectBot
    document.head.appendChild(jq)
  }
}

// Injeta um rodapé "Saiba mais sobre o Dr. Wilson" dentro da caixa do chat
// (o widget é DOM inline, não iframe, então dá para acrescentar conteúdo nosso).
const injectSaibaMais = () => {
  if (document.getElementById('ped_saiba_mais_wilson')) return
  const host =
    document.querySelector('#bot_widget_after_foot') ||
    document.querySelector('#bot_widget_foot') ||
    document.querySelector('#box_chat')
  if (!host) return
  const a = document.createElement('a')
  a.id = 'ped_saiba_mais_wilson'
  a.href = 'https://www.drwilson.pt/'
  a.target = '_blank'
  a.rel = 'noreferrer'
  a.textContent = 'Saiba mais sobre o Dr. Wilson'
  a.style.cssText =
    'display:block;text-align:center;padding:10px;font-size:13px;font-weight:700;' +
    'color:#186979;text-decoration:none;background:#eef6f8;border-top:1px solid #d7e8ec;'
  host.appendChild(a)
}

// Abre o chat clicando no launcher do InBot (não há API global de abrir).
// Tenta por alguns segundos caso o widget ainda esteja a carregar.
export const openDrWilson = () => {
  loadDrWilson()
  const tryOpen = (attempt = 0) => {
    const el =
      document.querySelector<HTMLElement>('#bot_icon_img') ||
      document.querySelector<HTMLElement>('#bot_icon_pointer_td') ||
      document.querySelector<HTMLElement>('#bot_icon')
    if (el) {
      el.click()
      injectSaibaMais()
      window.setTimeout(injectSaibaMais, 600) // reforço caso o rodapé pinte depois
      return
    }
    if (attempt < 40) window.setTimeout(() => tryOpen(attempt + 1), 400)
  }
  tryOpen()
}

// Monta o widget assim que a app carrega (o balão do InBot fica disponível).
export const DrWilsonLoader = () => {
  useEffect(() => {
    loadDrWilson()
  }, [])
  return null
}
