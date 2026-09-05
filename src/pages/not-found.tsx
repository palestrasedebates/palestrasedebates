import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div>
        <p className="text-5xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-muted-foreground">O endereço acessado não existe.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
