# CLAUDE.md — Palestras e Debates

App web do ecossistema Veltz Group. Vite + React 19 + TS + Tailwind + Supabase, deploy na Vercel.

## Convenções

- Alias de import: `@/*` → `src/*`.
- UI em português brasileiro, linguagem de negócio (sem jargão técnico na tela).
- Tema via CSS vars em `src/styles/globals.css` (claro/escuro).
- Páginas em `src/pages`, lazy-loaded no `App.tsx`.
- Antes de commitar: `npm run build` verde (o build real é `tsc -b && vite build`; `tsc --noEmit` não pega tudo).

## Git flow

- `feat/*` → `develop` → `main`. Nunca commitar direto na `main`.
