---
name: requirements-analysis
description: Analyze a spec and create user stories with acceptance criteria
---

# Requirements Analysis

Analyze a requirement and create structured user stories with acceptance criteria.

## Workflow

1. **Understand the requirement:** Read the requirement/spec and ask clarifying questions
2. **Check context:** Look at the existing codebase to see what already exists
3. **Create user stories:** As a [role] I want [action] so that [benefit]
4. **Acceptance criteria:** Given/When/Then for each story
5. **Technical notes:** What needs to be considered (API changes, new components, etc.)
6. **Effort estimation:** T-shirt sizes (S/M/L/XL) per story

## Output Format

```markdown
## Feature: [Name]

### User Story 1: [Title]
**As a** [role] **I want** [action], **so that** [benefit].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [result]
- [ ] ...

**Technical Notes:**
- ...

**Effort:** [S/M/L/XL]
```

## Guidelines

- Always think from the user's perspective, not the developer's
- Max 5-8 stories per feature - if more, split the feature
- Mark dependencies between stories
- Edge cases and error scenarios as separate acceptance criteria
