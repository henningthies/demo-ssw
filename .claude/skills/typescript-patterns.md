# TypeScript Patterns

## Types

- Use `interface` for object shapes (props, API responses)
- Use `type` for unions, intersections, utility types
- Derive types from Zod schemas instead of duplicating: `type Trade = z.infer<typeof tradeSchema>`
- Use `Pick<>`, `Omit<>`, `Partial<>` to create variants from base types

## Strict mode

- No `any` - use `unknown` and narrow with type guards
- No non-null assertions (`!`) except for `document.getElementById("root")!`
- Prefer optional chaining (`?.`) over manual null checks

## Component props

```tsx
interface TradeRowProps {
  trade: Trade
  onEdit: (id: string) => void
}

function TradeRow({ trade, onEdit }: TradeRowProps) { ... }
```

## API layer

- Keep API types in `src/api/types.ts` matching Java backend DTOs
- Use generics for paginated responses: `PaginatedResponse<Trade>`
