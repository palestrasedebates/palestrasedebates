import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFab } from '@/components/whatsapp-fab'
import { DrWilsonLoader } from '@/components/dr-wilson'

export const SiteLayout = () => {
  const { pathname, hash } = useLocation()

  // Sobe ao topo ao trocar de página (mas respeita âncoras como /#servicos).
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <DrWilsonLoader />
    </div>
  )
}
