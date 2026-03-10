---
globs: src/**/*.test.*
---

# Testing Rules

- Test behavior, not implementation
- Query priority: getByRole > getByLabelText > getByText > getByTestId
- Wrap every test in the required providers (QueryClient, MemoryRouter)
- No snapshots - they break on every UI change and test nothing meaningful
- Reuse mock data from `src/api/mock-data.ts` instead of inventing new data
- Always await async operations with waitFor/findBy
