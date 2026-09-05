import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/social-icons'
import { SITE } from '@/lib/site'

export const SiteFooter = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="mb-4 text-lg font-extrabold uppercase">Sobre Palestras e Debates</h4>
          <p className="text-sm leading-relaxed text-white/80">
            A Palestras e Debates é especialista em formação corporativa nas áreas da segurança,
            saúde e gestão de pessoas e equipas.
          </p>
          <Link to="/empresa" className="mt-4 inline-block text-sm font-bold text-accent hover:underline">
            Saiba mais →
          </Link>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-extrabold uppercase">Navegação</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/empresa" className="hover:text-accent">Empresa</Link></li>
            <li><Link to="/palestras" className="hover:text-accent">Palestras</Link></li>
            <li><Link to="/#servicos" className="hover:text-accent">Serviços</Link></li>
            <li><Link to="/contato" className="hover:text-accent">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-extrabold uppercase">Contactos</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="hover:text-accent">{SITE.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={SITE.maps} target="_blank" rel="noreferrer" className="hover:text-accent">{SITE.address}</a>
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-accent">
              <InstagramIcon className="size-4" />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-accent">
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName}. Todos os direitos reservados.</p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
