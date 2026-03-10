# Project Memory

## Build & Dev

- Dev server: `npm run dev` on port 5173
- Build checks TypeScript first (`tsc`), then Vite build
- ESLint config in `eslint.config.js` (flat config format)

## Architecture Decisions

- Mock API instead of real backend: `src/api/mock-handlers.ts` simulates Java backend
- Auth is simplified: token in context, no OAuth/OIDC for the demo
- Sidebar navigation uses shadcn app-sidebar pattern

## Learned Patterns

- shadcn/ui components: `npx shadcn@latest add [component]` to add
- TanStack Query keys: array format `['trades', filters]` for automatic invalidation
- React Hook Form + Zod: define schema first, derive type with `z.infer<>`
- Toasts via Sonner: `toast.success()` / `toast.error()` imported from `sonner`

## Common Pitfalls

- After new shadcn components: import path is `@/components/ui/[name]`
- Tailwind CSS 4: no more `tailwind.config`, everything in `index.css` via `@theme`
- Vite proxy for API calls in `vite.config.ts` when using a real backend
