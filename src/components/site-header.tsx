import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone, Stethoscope } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/social-icons'
import { openDrWilson } from '@/components/dr-wilson'
import { NAV, SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

export const SiteHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top bar */}
      <div className="hidden bg-primary text-white md:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <a href={SITE.whatsapp} className="flex items-center gap-2 hover:text-accent" target="_blank" rel="noreferrer">
            <Phone className="size-3.5" /> {SITE.phone}
          </a>
          <div className="flex items-center gap-4">
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-accent">
              <InstagramIcon className="size-4" />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-accent">
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Palestras e Debates — início">
          <img src="/img/logo.png" alt="Palestras e Debates" className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary transition hover:text-accent',
                  isActive && item.to !== '/#servicos' && 'text-accent',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={openDrWilson}
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-[#186979] px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm ring-2 ring-[#2c98b0]/40 transition hover:bg-[#12525f]"
          >
            <Stethoscope className="size-4" />
            Dr. Wilson
          </button>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-cta ml-2">
            Orçamento
          </a>
        </nav>

        <button
          type="button"
          className="text-primary lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t bg-white lg:hidden">
          <div className="container flex flex-col py-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b py-3 text-sm font-bold uppercase tracking-wide text-primary"
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openDrWilson()
              }}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#186979] px-4 py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              <Stethoscope className="size-4" />
              Falar com o Dr. Wilson
            </button>
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-cta mt-2">
              Orçamento
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
