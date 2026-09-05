import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { SiteLayout } from '@/components/site-layout'

const HomePage = lazy(() => import('@/pages/home'))
const EmpresaPage = lazy(() => import('@/pages/empresa'))
const PalestrasPage = lazy(() => import('@/pages/palestras'))
const ContatoPage = lazy(() => import('@/pages/contato'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <Suspense
          fallback={<div className="grid min-h-screen place-items-center text-muted-foreground">Carregando…</div>}
        >
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/empresa" element={<EmpresaPage />} />
              <Route path="/palestras" element={<PalestrasPage />} />
              <Route path="/contato" element={<ContatoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
