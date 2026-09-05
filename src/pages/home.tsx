import { Mic, MessagesSquare, CalendarDays } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Mic className="size-4" />
            </span>
            Palestras e Debates
          </div>
        </div>
      </header>

      <main className="container animate-fade-in py-16">
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Palestras e Debates
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Scaffold inicial pronto. A partir daqui construímos as telas do produto.
          </p>
        </section>

        <section className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: Mic, title: 'Palestras', desc: 'Catálogo e agenda de palestras.' },
            { icon: MessagesSquare, title: 'Debates', desc: 'Espaços de discussão e mediação.' },
            { icon: CalendarDays, title: 'Eventos', desc: 'Inscrições e organização.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6 text-card-foreground">
              <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default HomePage
