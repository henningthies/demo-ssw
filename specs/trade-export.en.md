# Feature: Trade Export

## Summary

CSV export with a dialog for filtering by date range, status, and column selection.

## Decisions

- CSV only (no Excel)
- Export dialog (not direct download)
- Configurable columns in dialog
- Export is self-contained — does not connect to table filters
- Date filter on `createdAt` only
- Filename: `trades-YYYY-MM-DD.csv` (current date)

## User Stories

### Story 1: Export Dialog
**As a** trader **I want** an export dialog, **so that** I can configure what gets exported.

**Acceptance Criteria:**
- [ ] "Export" button on Trades page opens a dialog
- [ ] Dialog has: date range picker, status filter, column picker, "Export" button
- [ ] Clicking "Export" downloads CSV and closes dialog
- [ ] "No trades to export" message when filters match nothing

**Technical Notes:**
- New component: `TradeExportDialog.tsx`
- shadcn: Dialog, DatePicker, Checkbox
- Add button next to "New Trade" on TradesPage

**Effort:** M

---

### Story 2: CSV Generation
**As a** trader **I want** to download my trades as CSV, **so that** I can use them in external tools.

**Acceptance Criteria:**
- [ ] Downloaded file is valid CSV with headers
- [ ] Dates formatted as ISO 8601
- [ ] Notional (qty × price) is a computed column
- [ ] Filename: `trades-YYYY-MM-DD.csv`

**Technical Notes:**
- Client-side CSV generation (no backend)
- Blob + URL.createObjectURL for download
- No external library needed

**Effort:** S

---

### Story 3: Date Range Filter
**As a** trader **I want** to filter exports by date range, **so that** I get only relevant trades.

**Acceptance Criteria:**
- [ ] "From" and "To" date pickers in dialog
- [ ] Filters on `createdAt` (inclusive)
- [ ] Empty fields = no filter (all trades)
- [ ] Validation: "From" must be before "To"

**Effort:** S

---

### Story 4: Status Filter
**As a** trader **I want** to filter exports by status, **so that** I can create focused reports.

**Acceptance Criteria:**
- [ ] Checkboxes for OPEN, FILLED, CANCELLED
- [ ] Multiple selection allowed
- [ ] Nothing selected = all statuses included

**Effort:** S

---

### Story 5: Column Picker
**As a** trader **I want** to choose which columns to export, **so that** I get clean data.

**Acceptance Criteria:**
- [ ] Checkboxes for each column (Date, Symbol, Side, Qty, Price, Notional, Status, Notes)
- [ ] All selected by default
- [ ] At least one column must be selected

**Effort:** S

## Build Order

1 (Dialog shell) → 2 (CSV) → 3 (Date) → 4 (Status) → 5 (Columns)
