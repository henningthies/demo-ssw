---
name: parallel-review
description: Run parallel code review (quality, security, performance)
---

# Parallel Code Review

Start multiple review agents in parallel that review code from different perspectives.

## Workflow

Start 3 agents in parallel using the Agent tool:

### Agent 1: Code Quality Review
```
Review the code for:
- Readability and naming
- DRY principle, unnecessary complexity
- Consistency with existing patterns in the project
- Missing error handling
```

### Agent 2: Security Review
```
Review the code for:
- XSS, injection, unsafe data handling
- Auth/authz: Are permissions checked?
- Sensitive data in logs or client state?
- OWASP Top 10 relevance
```

### Agent 3: Performance Review
```
Review the code for:
- Unnecessary re-renders (React)
- N+1 queries or missing pagination
- Bundle size impact (new dependencies?)
- Caching opportunities (TanStack Query staleTime, etc.)
```

## Consolidate Results

Collect the three reviews and create a prioritized list:
1. **Blocker** - Must be fixed before merge
2. **Important** - Should be fixed, but can be a follow-up
3. **Nice-to-have** - Improvement suggestions

## Note

This pattern is especially suited for greenfield projects or larger features.
For small changes in existing projects, a single review is sufficient.
