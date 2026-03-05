# React Development Patterns

## When writing React components

- Use function components, never class components
- Destructure props in the function signature
- Co-locate related code: hook + component in same file if only used once
- Extract to custom hook when logic is reused across components

## When writing forms

- Always use React Hook Form + Zod for validation
- Define Zod schema first, derive TypeScript type with `z.infer<typeof schema>`
- Use `useFieldArray` for dynamic/repeatable field groups
- Use `watch()` for conditional fields
- Handle server errors with `setError()` from React Hook Form
- Show validation errors inline below each field

## When writing API hooks

- Use TanStack Query for all server state
- Name pattern: `use[Resource]()` for queries, `useCreate[Resource]()` for mutations
- Always invalidate related queries on mutation success
- Return loading/error states to the component

## When adding UI components

- Use shadcn/ui components from `@/components/ui/`
- Add new shadcn components with: `npx shadcn@latest add [component]`
- Compose shadcn primitives, don't wrap them in unnecessary abstractions

## When writing tests

- Test behavior, not implementation
- Use Testing Library queries: getByRole > getByLabelText > getByText > getByTestId
- Wrap components in required providers (QueryClient, MemoryRouter)
- Test form validation by submitting and checking error messages
- Test conditional rendering by changing inputs and asserting visibility
