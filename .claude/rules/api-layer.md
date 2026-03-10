---
globs: src/api/**
---

# API Layer Rules

- Types in `src/api/types.ts` must always mirror the Java backend DTOs
- Changes to types require verification: Does this still match the backend contract?
- New API endpoints must be implemented in `mock-handlers.ts` first
- Never use the Axios client (`client.ts`) directly in components - always go through hooks
- Handle backend error types (400, 401, 403, 422, 500) consistently
