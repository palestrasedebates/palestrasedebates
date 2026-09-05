import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-xl font-bold text-primary">Página não encontrada</h1>
        <p className="mt-2 text-muted-foreground">O endereço acessado não existe.</p>
        <Link to="/" className="btn-cta mt-6">Voltar ao início</Link>
      </div>
    </div>
  )
}

export default NotFoundPage
