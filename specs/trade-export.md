# Feature: Trade Export

## Background

Traders need to export their trades regularly — for compliance reports,
risk analysis, and internal evaluations. Currently they have to manually
copy data from the table.

## Requirement

As a trader, I want to export my trades as CSV or Excel, filtered by
time range and status.

## Constraints

- Export runs client-side (no backend endpoint needed for MVP)
- Later: backend export for large datasets (>10,000 trades)
- Date format: ISO 8601 for CSV, localized (browser locale) for Excel
- Columns must be configurable

## Decisions

### Filters
- Export has its own standalone filters in the popover (not tied to table filters)
- Date range filter applies to `createdAt` only
- Status filter: multi-select (OPEN, FILLED, CANCELLED)

### Columns
- All columns selected by default: ID, Symbol, Quantity, Price, Type, Status, Notes, CreatedAt, UpdatedAt, Notional (computed)
- Simple checkbox list to toggle columns — no reordering
- No export templates for MVP

### File Output
- Formats: CSV (`.csv`) and Excel (`.xlsx`)
- File naming: `trades_YYYY-MM-DD.csv` / `trades_YYYY-MM-DD.xlsx` (export date)
- CSV: sanitize cells starting with `=`, `+`, `-`, `@` (prefix with `'`) to prevent CSV injection

### Data Volume
- No client-side cap — export all matching trades
- If performance becomes an issue, consider background job later

### Access Control
- All roles (TRADER, ADMIN, VIEWER) can export

### UX
- Export button next to "New Trade" button on the trades page
- Popover for export options (format, date range, status filter, column selection)

## Acceptance Criteria

```gherkin
Scenario: Export trades as CSV
  Given I am on the Trades page
  When I click "Export" and select CSV format
  And I set a date range and status filter
  Then a CSV file downloads with matching trades
  And dates are in ISO 8601 format
  And the filename is trades_YYYY-MM-DD.csv

Scenario: Export trades as Excel
  Given I am on the Trades page
  When I click "Export" and select Excel format
  Then an .xlsx file downloads with matching trades
  And dates are formatted in my browser locale

Scenario: Configure exported columns
  Given the export popover is open
  When I deselect the "Notes" column
  Then the exported file does not contain a Notes column

Scenario: No matching trades
  Given no trades match my selected filters
  When I click Export
  Then I see a message "No trades match your filters"
  And no file is downloaded

Scenario: CSV injection prevention
  Given a trade has notes starting with "="
  When I export as CSV
  Then the cell value is prefixed with a single quote
```
