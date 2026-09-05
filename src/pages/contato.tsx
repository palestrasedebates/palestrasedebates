import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Phone, Mail, MapPin } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/social-icons'
import { PageHero } from '@/components/page-hero'
import { SITE } from '@/lib/site'
import { supabase, isSupabaseReady } from '@/lib/supabase'

const schema = z.object({
  name: z.string().min(2, 'Por favor, preencha o seu nome'),
  telefone: z.string().min(6, 'Por favor, preencha o seu telefone'),
  email: z.string().email('Por favor, preencha um e-mail válido'),
  message: z.string().min(5, 'Por favor, preencha a mensagem'),
})

type FormValues = z.infer<typeof schema>

const ContatoPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    // Caminho principal: grava a lead no Supabase.
    if (isSupabaseReady && supabase) {
      const { error } = await supabase.from('leads').insert({
        name: values.name,
        telefone: values.telefone,
        email: values.email,
        message: values.message,
        source: 'contato',
      })
      if (error) {
        toast.error('Não foi possível enviar. Tente pelo WhatsApp, por favor.')
        return
      }
      toast.success('Mensagem enviada! Retornaremos o mais breve possível.')
      reset()
      return
    }

    // Fallback enquanto o Supabase não está conectado: abre o e-mail preenchido.
    const body = `Nome: ${values.name}%0ATelefone: ${values.telefone}%0AE-mail: ${values.email}%0A%0A${values.message}`
    window.location.href = `mailto:${SITE.email}?subject=Contacto pelo site&body=${body}`
    toast.success('Abrimos o seu e-mail para concluir o envio.')
    reset()
  }

  return (
    <>
      <PageHero title="Fale connosco" bg="/img/palestras/006.jpg" />

      <section className="py-14">
        <div className="container max-w-3xl text-center">
          <p className="leading-relaxed text-muted-foreground">
            Utilize os telefones, e-mails, redes sociais, mapas ou o formulário abaixo para nos{' '}
            <strong className="text-primary">contactar</strong> ou{' '}
            <strong className="text-primary">solicitar o seu orçamento</strong>. Será uma satisfação
            atender a todas as suas necessidades e, juntos, conquistarmos mais vitórias —
            capacitando e influenciando de forma <strong className="text-primary">Divertida,
            Diferente e Dinâmica</strong>, o nosso método 3D.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container grid gap-10 lg:grid-cols-2">
          {/* Contactos */}
          <div>
            <h2 className="section-title mb-6">Telefone, morada e e-mail</h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-primary">Telefone / WhatsApp</p>
                  <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">{SITE.phone}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-primary">Morada</p>
                  <a href={SITE.maps} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent">{SITE.address}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Mail className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-primary">E-mail</p>
                  <a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-accent">{SITE.email}</a>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <p className="mb-3 font-bold text-primary">Redes sociais</p>
              <div className="flex gap-3">
                <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-11 place-items-center rounded-full bg-primary text-white transition hover:bg-accent">
                  <InstagramIcon className="size-5" />
                </a>
                <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid size-11 place-items-center rounded-full bg-primary text-white transition hover:bg-accent">
                  <FacebookIcon className="size-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div>
            <h2 className="section-title mb-6">Entre em contacto</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <input
                  {...register('name')}
                  placeholder="Seu nome"
                  className="w-full rounded-md border border-input px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  {...register('telefone')}
                  placeholder="Seu telefone"
                  className="w-full rounded-md border border-input px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.telefone && <p className="mt-1 text-sm text-destructive">{errors.telefone.message}</p>}
              </div>
              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full rounded-md border border-input px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <textarea
                  {...register('message')}
                  rows={6}
                  placeholder="Mensagem"
                  className="w-full rounded-md border border-input px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-cta w-full disabled:opacity-60">
                {isSubmitting ? 'A enviar…' : 'Enviar'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-14">
        <div className="container text-center">
          <h3 className="section-title mb-8">Nossa presença</h3>
          <img src="/img/mapa.jpg" alt="Nossa presença" className="mx-auto max-h-[420px] w-auto rounded-lg" />
        </div>
      </section>
    </>
  )
}

export default ContatoPage
