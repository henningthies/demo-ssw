---
name: parallel-tasks
description: Split feature into independent subtasks and execute in parallel
---

# Parallel Task Execution

Split a feature into independent subtasks and execute them in parallel with multiple agents.

## Prerequisites

- Tasks must be **independent of each other** (no shared files)
- Best suited for **greenfield projects** or clearly separated areas
- For existing code: beware of merge conflict risk

## Workflow

### 1. Analyze and split the feature

Identify independent subtasks. Example for a new feature "Trade Export":

| Task | Files | Independent? |
|------|-------|-------------|
| API types + mock handler | src/api/ | Yes |
| Export button component | src/components/ExportButton.tsx | Yes |
| Export hook | src/hooks/useExport.ts | Depends on types |
| Tests | src/test/export.test.tsx | Depends on everything |

### 2. Start independent tasks in parallel

Start agents using the Agent tool with `isolation: "worktree"`:

```
Agent 1 (worktree): "Create API types and mock handler for trade export"
Agent 2 (worktree): "Create ExportButton component with shadcn/ui"
```

### 3. Merge results

- Review and merge worktree branches
- Implement dependent tasks (hook, tests) sequentially afterwards

## When NOT to parallelize

- Small features (< 1 hour of work) - overhead not worth it
- Tightly coupled code - merge conflicts eat up the time savings
- Existing legacy codebase - too many implicit dependencies
