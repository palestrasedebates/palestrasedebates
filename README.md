# Palestras e Debates

Aplicação web do ecossistema Veltz Group.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS (design system por CSS vars, tema claro/escuro)
- React Router + TanStack Query
- Supabase (auth + dados)
- Deploy: Vercel

## Rodando local

```bash
npm install
cp .env.example .env   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint
- `npm run preview` — pré-visualiza o build

## Estrutura

```
src/
  App.tsx          # rotas + providers
  main.tsx         # entrypoint
  lib/             # supabase client, utils
  pages/           # páginas (lazy-loaded)
  components/ui/   # componentes de UI reutilizáveis
  styles/          # globals.css (CSS vars do tema)
```
