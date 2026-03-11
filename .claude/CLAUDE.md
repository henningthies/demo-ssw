# SSW Trading Demo

React SPA for internal proptrading tools. Java backend (API), React frontend.

## Stack

- Vite + React 19 + TypeScript
- shadcn/ui + Tailwind CSS 4
- TanStack Query (API/server state)
- React Hook Form + Zod (forms/validation)
- React Router 7 (routing)
- Vitest + Testing Library (testing)

## Conventions

- Import alias: `@/` maps to `src/`
- Components: PascalCase (`TradeForm.tsx`)
- Hooks: `use` prefix, camelCase (`useTrades.ts`)
- UI components (shadcn): kebab-case files, PascalCase exports
- Pages: one file per route in `src/pages/`
- API types mirror Java backend DTOs in `src/api/types.ts`
- Mock API in `src/api/mock-handlers.ts` simulates Java backend

## Architecture

```
Pages (routes) -> Components (UI) -> Hooks (logic) -> API layer (axios)
```

Provider chain: QueryClientProvider > AuthProvider > SidebarProvider

## Memory

Save memory updates to `.claude/memory/MEMORY.md` in this project (not to the global `~/.claude/projects/` path).

## Commands

```bash
npm run dev          # Dev server on :5173
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm test             # Vitest
```
