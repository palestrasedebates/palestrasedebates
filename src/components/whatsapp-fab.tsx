import { MessageCircle } from 'lucide-react'
import { SITE } from '@/lib/site'

export const WhatsAppFab = () => {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale connosco no WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-bold text-white shadow-xl transition hover:brightness-95"
    >
      <MessageCircle className="size-6 shrink-0" />
      <span className="hidden sm:inline">Fale connosco</span>
    </a>
  )
}
