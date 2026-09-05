import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Carousel } from '@/components/carousel'
import { SITE } from '@/lib/site'
import { CATEGORIAS_PALESTRAS, PALESTRAS_ESPECIAIS } from '@/data/content'

const PalestrasPage = () => {
  return (
    <>
      <PageHero title="Nossas Palestras" bg="/img/palestras/005.jpg" />

      <section className="py-14">
        <div className="container max-w-4xl text-center">
          <p className="leading-relaxed text-muted-foreground">
            A nossa talentosa e premiada equipa de oradores está sempre a atualizar-se para o
            atender com soluções nos mais variados temas, personalizados à sua necessidade.{' '}
            <strong className="text-primary">
              Se o seu tema de interesse não estiver abaixo, produzimos especialmente no prazo de 72
              horas.
            </strong>
          </p>
        </div>
      </section>

      {/* Categorias */}
      {CATEGORIAS_PALESTRAS.map((cat, idx) => (
        <section key={cat.key} className={idx % 2 === 0 ? 'bg-secondary py-16' : 'py-16'}>
          <div className="container">
            <h2 className="section-title mb-2 text-center">{cat.title}</h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">{cat.desc}</p>

            <div className="grid gap-10 lg:grid-cols-2">
              <Carousel loop slideClassName="basis-full" showDots>
                {cat.imgs.map((img) => (
                  <div className="overflow-hidden rounded-lg">
                    <img src={img} alt={cat.title} className="h-72 w-full object-cover" />
                  </div>
                ))}
              </Carousel>

              <div>
                <div className="space-y-3">
                  {cat.destaques.map((d) => (
                    <div key={d} className="flex items-start gap-3 rounded-md bg-white p-4 shadow-sm ring-1 ring-border">
                      <Check className="mt-0.5 size-5 shrink-0 text-accent" />
                      <p className="text-sm font-semibold text-primary">{d}</p>
                    </div>
                  ))}
                </div>

                <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  {cat.temas.map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                      {t}
                    </li>
                  ))}
                </ul>

                <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-cta mt-6">
                  Solicite orçamento já!
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Especiais / Tecnologia */}
      <section className="bg-primary py-16 text-white">
        <div className="container">
          <h2 className="mb-2 text-center text-2xl font-extrabold uppercase sm:text-3xl">
            Palestras especiais
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-white/80">
            Disponibilizamos também os seguintes formatos e abordagens — soluções rápidas, inclusive
            com tecnologia para promover interatividade entre os participantes.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PALESTRAS_ESPECIAIS.map((p) => (
              <article key={p.title} className="overflow-hidden rounded-lg bg-white text-foreground shadow-sm">
                <img src={p.img} alt={p.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h4 className="mb-2 font-extrabold uppercase text-primary">{p.title}</h4>
                  <p className="mb-4 text-sm text-muted-foreground">{p.text}</p>
                  <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-cta w-full">
                    Contrate já!
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Faixa de ajuda */}
      <section className="bg-accent">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
          <h2 className="text-xl font-extrabold uppercase text-primary sm:text-2xl">
            Precisa de ajuda para criar uma FORMAÇÃO inesquecível?
          </h2>
          <Link to="/contato" className="btn-primary shrink-0">Orçamento!</Link>
        </div>
      </section>
    </>
  )
}

export default PalestrasPage
