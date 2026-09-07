import { Link } from 'react-router-dom'
import { Eye, Target, Gem } from 'lucide-react'
import { PageHero } from '@/components/page-hero'

const VMV = [
  {
    icon: Eye,
    title: 'Nossa Visão',
    text: 'Ser um fornecedor de soluções, líder e globalmente reconhecido.',
  },
  {
    icon: Target,
    title: 'Nossa Missão',
    text: 'Garantir a satisfação plena dos nossos clientes e parceiros, crescendo 100% até 2 anos.',
  },
  {
    icon: Gem,
    title: 'Nossos Valores',
    text: 'Uma organização enxuta, responsável e em contínua evolução, melhorando constantemente para atingir a satisfação total do cliente.',
  },
]

const EmpresaPage = () => {
  return (
    <>
      <PageHero title="Nossa Empresa" bg="/img/fundoempresa.jpg" />

      <section className="py-16">
        <div className="container max-w-4xl">
          <img src="/img/logo.png" alt="Palestras e Debates" className="mx-auto mb-10 h-32 w-auto max-w-full object-contain" />
          <div className="space-y-5 leading-relaxed text-muted-foreground">
            <p>
              Nós da PALESTRAS E DEBATES chegámos para uma nova jornada em Portugal! Uma empresa
              especialista em formação corporativa nas áreas da segurança, saúde e gestão de pessoas
              e equipas.
            </p>
            <p>
              Com uma equipa multidisciplinar, muito investimento, crescimento planeado, sustentável
              e com fortes parceiros, hoje oferecemos o planeamento, a montagem e a execução da sua
              FORMAÇÃO: palestras, palestras-show, cursos livres e de formação, teatro, intervenções
              nos setores, quick massage, workshops de jogos, terapias alternativas e check-up de
              saúde aos colaboradores, com recolha e relatório de todos os exames laboratoriais e
              ocupacionais, incluindo eletrocardiograma feito por telefone.
            </p>
            <p>
              Vamos impactar e solucionar pela consciencialização os seus acidentes — onde zero
              acidentes é o ideal —, reduzir o seu absentismo, aumentar a sua produtividade e iniciar
              um novo ciclo vencedor para a sua empresa.{' '}
              <strong className="text-primary">
                A sua dor de cabeça acabou: contrate quem vai resolver, venha com a PALESTRAS E
                DEBATES.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* CTA dupla */}
      <section className="bg-secondary py-14">
        <div className="container grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-start gap-4 rounded-lg bg-white p-8 shadow-sm ring-1 ring-border">
            <h4 className="text-lg font-bold text-primary">
              O nosso time de palestrantes está a postos, com soluções nos mais variados temas!
            </h4>
            <Link to="/palestras" className="btn-primary">Conheça nossas palestras</Link>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-lg bg-white p-8 shadow-sm ring-1 ring-border">
            <h4 className="text-lg font-bold text-primary">
              Temos diversas soluções nas áreas de saúde, segurança do trabalho e gestão de equipas!
            </h4>
            <Link to="/#servicos" className="btn-cta">Conheça nossos serviços</Link>
          </div>
        </div>
      </section>

      {/* Visão / Missão / Valores */}
      <section className="py-16">
        <div className="container grid gap-8 md:grid-cols-3">
          {VMV.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border-t-4 border-accent bg-white p-8 text-center shadow-sm ring-1 ring-border">
              <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary text-white">
                <Icon className="size-7" />
              </span>
              <h2 className="text-xl font-extrabold uppercase text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
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

export default EmpresaPage
