type PageHeroProps = {
  title: string
  bg?: string
}

// Hero das páginas internas: imagem de fundo real (fundoempresa/fundopalestras/
// fundocontato, baixadas do site no ar) com camada da marca por cima para
// manter a legibilidade do título.
export const PageHero = ({ title, bg = '/img/fundoempresa.jpg' }: PageHeroProps) => {
  return (
    <section
      className="relative flex h-56 items-center justify-center bg-cover bg-center sm:h-72"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-primary/70" />
      <h1 className="relative z-10 px-4 text-center text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
    </section>
  )
}
