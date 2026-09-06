import { Link } from 'react-router-dom'
import { Carousel } from '@/components/carousel'
import { openDrWilson } from '@/components/dr-wilson'
import { SITE } from '@/lib/site'
import { HERO_SLIDES, SERVICOS, PALESTRAS_DESTAQUE, CATEGORIAS } from '@/data/content'

const HomePage = () => {
  return (
    <>
      {/* Hero carousel */}
      <section className="relative">
        <Carousel autoplay autoplayDelay={6000} slideClassName="basis-full" className="[&_.px-2]:px-0" showDots>
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className="relative flex h-[420px] items-center bg-cover bg-center sm:h-[520px]"
              style={{ backgroundImage: `url(${s.img})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
              <div className="container relative z-10 max-w-2xl text-white">
                <h2 className="text-3xl font-extrabold uppercase leading-tight drop-shadow sm:text-5xl">
                  {s.title}
                </h2>
                {s.subtitle && <p className="mt-4 text-lg font-semibold text-white/90">{s.subtitle}</p>}
                {s.cta && (
                  <a
                    href={s.cta.href}
                    target={s.cta.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="btn-cta mt-6"
                  >
                    {s.cta.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Faixa de ajuda / CTA */}
      <section className="bg-accent">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
          <h2 className="text-xl font-extrabold uppercase text-primary sm:text-2xl">
            Precisa de ajuda para criar uma FORMAÇÃO inesquecível?
          </h2>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-primary shrink-0">
            Orçamento!
          </a>
        </div>
      </section>

      {/* Sobre */}
      <section className="py-16">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <img src="/img/logo.png" alt="Palestras e Debates" className="mx-auto h-40 w-auto" />
          <div>
            <h3 className="section-title">Rapidez e excelência no serviço!</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Nós da PALESTRAS E DEBATES chegámos para uma nova jornada em Portugal! Uma empresa
              especialista em formação corporativa nas áreas da segurança, saúde e gestão de pessoas
              e equipas.
            </p>
            <Link to="/empresa" className="btn-primary mt-6">Conheça a nossa empresa!</Link>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="scroll-mt-24 bg-secondary py-16">
        <div className="container">
          <h3 className="section-title mb-10 text-center">Nossos serviços</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICOS.map((s) => (
              <article key={s.title} className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-border">
                <img src={s.img} alt={s.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h4 className="mb-2 text-lg font-extrabold uppercase text-primary">{s.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dr. Wilson AI — banner inteiro clicável (abre o chat) */}
      <section
        role="button"
        tabIndex={0}
        onClick={openDrWilson}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openDrWilson()
          }
        }}
        className="cursor-pointer bg-primary py-14 text-white outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="container flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <img src="/img/logodrwilsonpeq.png" alt="Dr. Wilson AI" className="h-24 w-auto" />
          <div className="flex-1">
            <p className="text-lg font-semibold">
              Fale comigo. Sou o Dr. Wilson AI, a primeira inteligência artificial de saúde com
              atuação global.
            </p>
          </div>
          <span className="btn-cta shrink-0">Falar agora!</span>
        </div>
      </section>

      {/* ACELERA+ */}
      <section className="py-16">
        <div className="container max-w-3xl text-center">
          <h3 className="section-title">ACELERA+</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Somos especialistas na construção de conselho consultivo e dispomos de profissionais
            conselheiros estratégicos para participar da mesa de conselho, aconselhando-o nas suas
            decisões e no seu crescimento organizado.
          </p>
          <Link to="/contato" className="btn-cta mt-6">Entre em contacto!</Link>
        </div>
      </section>

      {/* Nossas palestras */}
      <section className="bg-secondary py-16">
        <div className="container">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-accent">Palestras especiais</p>
          <h3 className="section-title mb-10 text-center">Nossas palestras</h3>
          <Carousel loop slideClassName="basis-full sm:basis-1/2 lg:basis-1/3">
            {PALESTRAS_DESTAQUE.map((p) => (
              <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-border">
                <div className="relative h-52">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4">
                    <p className="text-sm font-bold uppercase text-white">{p.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {CATEGORIAS.map((c) => (
              <Link
                key={c.key}
                to="/palestras"
                className="group rounded-lg border-2 border-primary/10 bg-white p-6 text-center transition hover:border-accent hover:shadow-md"
              >
                <h4 className="text-lg font-extrabold uppercase text-primary group-hover:text-accent">{c.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Métricas 86% */}
      <section className="py-16">
        <div className="container max-w-3xl text-center">
          <h3 className="section-title">
            Sabia que 86% dos profissionais são desengajados e que 50% têm algum distúrbio mental?
          </h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Contacte-nos para implementarmos a nossa metodologia de Inteligência Produtiva. Ela
            aumentará a sua produtividade e entregar-lhe-á profissionais mais empenhados, com melhor
            saúde mental e, por consequência, melhores resultados financeiros para a sua empresa.
          </p>
          <Link to="/contato" className="btn-cta mt-6">Entre em contacto!</Link>
        </div>
      </section>

      {/* Nossa presença */}
      <section className="bg-secondary py-14">
        <div className="container text-center">
          <h3 className="section-title mb-8">Nossa presença</h3>
          <img src="/img/mapa.jpg" alt="Nossa presença" className="mx-auto max-h-[420px] w-auto rounded-lg" />
        </div>
      </section>
    </>
  )
}

export default HomePage
