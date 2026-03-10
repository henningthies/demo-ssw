---
globs: src/auth/**,src/api/client.ts,.env*
---

# Security Rules

- Never hardcode secrets or tokens - always use environment variables
- Store JWT tokens only in memory (AuthContext), never in localStorage
- API client must automatically redirect to login on 401
- No sensitive data in console logs
- CORS and CSP headers are set by the Java backend, not the frontend
