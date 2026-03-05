# SSW Trading Demo

Internal proptrading tool - React frontend for Java API backend.

## Stack

| Layer | Tool | Why |
|-------|------|-----|
| Build | Vite | Fast, modern bundler |
| UI | React 19 + TypeScript | Type-safe components |
| Styling | Tailwind CSS 4 | Utility-first, fast iteration |
| Routing | React Router 7 | SPA navigation |
| API | TanStack Query + Axios | Caching, loading states, JWT auth |
| Forms | React Hook Form + Zod | Validation, dynamic fields, performance |
| Testing | Vitest + Testing Library | Fast, component-level tests |
| Monitoring | Sentry | Error tracking, performance |
| Deployment | Docker + Nginx | Static SPA behind reverse proxy |

## Development

```bash
npm install
npm run dev          # http://localhost:5173
```

Login: username `demo`, any password.

API proxy: Requests to `/api/*` are proxied to `http://localhost:8080` (Java backend).

## Testing

```bash
npm test             # Run once
npm run test:watch   # Watch mode
npm run test:coverage
```

## Build & Deploy

```bash
npm run build        # -> dist/
```

### Docker

```bash
docker build -f docker/Dockerfile -t ssw-frontend .
docker run -p 3000:80 ssw-frontend
```

### Architecture

```
Browser -> Nginx (static files + proxy) -> Java Backend (API)
              |
         React SPA
         - Auth (JWT in localStorage)
         - TanStack Query (API cache)
         - React Hook Form (form state)
```

### Monitoring

Set `VITE_SENTRY_DSN` for error tracking. See `.env.example`.

### Bugtracking

Recommended: Sentry for runtime errors, GitHub Issues / Linear for feature tracking.
Sentry captures unhandled errors + performance data automatically.

## Project Structure

```
src/
  api/          # API client, types, mock data
  auth/         # Auth context, protected routes
  components/   # Shared components (Layout, TradeForm)
  hooks/        # Custom hooks (useTrades, usePositions)
  pages/        # Route-level page components
  test/         # Test setup + test files
  monitoring.ts # Sentry init
docker/
  Dockerfile    # Multi-stage production build
  nginx.conf    # SPA routing + API proxy
  docker-compose.yml
```
