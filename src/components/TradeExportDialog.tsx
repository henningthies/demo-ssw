import { useState, useMemo } from "react"
import { format } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Trade } from "@/api/types"

const STATUSES: Trade["status"][] = ["OPEN", "FILLED", "CANCELLED"]

const COLUMNS = [
  { key: "date", label: "Date", value: (t: Trade) => t.createdAt },
  { key: "symbol", label: "Symbol", value: (t: Trade) => t.symbol },
  { key: "side", label: "Side", value: (t: Trade) => t.type },
  { key: "qty", label: "Qty", value: (t: Trade) => String(t.quantity) },
  { key: "price", label: "Price", value: (t: Trade) => String(t.price) },
  { key: "notional", label: "Notional", value: (t: Trade) => String(t.quantity * t.price) },
  { key: "status", label: "Status", value: (t: Trade) => t.status },
  { key: "notes", label: "Notes", value: (t: Trade) => `"${(t.notes ?? "").replace(/"/g, '""')}"` },
] as const

type ColumnKey = (typeof COLUMNS)[number]["key"]

interface TradeExportDialogProps {
  trades: Trade[]
}

function filterTrades(
  trades: Trade[],
  fromDate: Date | undefined,
  toDate: Date | undefined,
  statuses: Set<Trade["status"]>,
): Trade[] {
  let fromMs: number | undefined
  let toMs: number | undefined

  if (fromDate) {
    const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
    fromMs = from.getTime()
  }
  if (toDate) {
    const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 23, 59, 59, 999)
    toMs = to.getTime()
  }

  return trades.filter((trade) => {
    const createdAt = new Date(trade.createdAt).getTime()
    if (fromMs !== undefined && createdAt < fromMs) return false
    if (toMs !== undefined && createdAt > toMs) return false
    if (statuses.size > 0 && !statuses.has(trade.status)) return false
    return true
  })
}

function selectedColumns(columns: Set<ColumnKey>) {
  return COLUMNS.filter((c) => columns.has(c.key))
}

function buildCsvHeader(columns: Set<ColumnKey>): string {
  return selectedColumns(columns).map((c) => c.label).join(",")
}

function buildCsvRow(trade: Trade, columns: Set<ColumnKey>): string {
  return selectedColumns(columns).map((c) => c.value(trade)).join(",")
}

function downloadCsv(content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `trades-${format(new Date(), "yyyy-MM-dd")}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function TradeExportDialog({ trades }: TradeExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [fromDate, setFromDate] = useState<Date | undefined>()
  const [toDate, setToDate] = useState<Date | undefined>()
  const [selectedStatuses, setSelectedStatuses] = useState<Set<Trade["status"]>>(new Set())
  const [selectedColumns, setSelectedColumns] = useState<Set<ColumnKey>>(
    new Set(COLUMNS.map((c) => c.key)),
  )

  const dateError =
    fromDate && toDate && fromDate > toDate ? '"From" must be before "To"' : null

  const filtered = useMemo(
    () => filterTrades(trades, fromDate, toDate, selectedStatuses),
    [trades, fromDate, toDate, selectedStatuses],
  )
  const canExport = selectedColumns.size > 0 && !dateError

  function toggleStatus(status: Trade["status"]) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  function toggleColumn(key: ColumnKey) {
    setSelectedColumns((prev) => {
      const next = new Set(prev)
      if (next.has(key) && next.size > 1) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleExport() {
    const header = buildCsvHeader(selectedColumns)
    const rows = filtered.map((t) => buildCsvRow(t, selectedColumns))
    const csv = [header, ...rows].join("\n")
    downloadCsv(csv)
    setOpen(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setFromDate(undefined)
      setToDate(undefined)
      setSelectedStatuses(new Set())
      setSelectedColumns(new Set(COLUMNS.map((c) => c.key)))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Export Trades</DialogTitle>
          <DialogDescription>
            Configure filters and columns, then export as CSV.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Range</Label>
            <div className="flex gap-2">
              <DatePicker label="From" date={fromDate} onSelect={setFromDate} />
              <DatePicker label="To" date={toDate} onSelect={setToDate} />
            </div>
            {dateError && <p className="text-sm text-destructive">{dateError}</p>}
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex gap-4">
              {STATUSES.map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedStatuses.has(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  {status}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Nothing selected = all statuses included
            </p>
          </div>

          {/* Column Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Columns</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLUMNS.map((col) => (
                <label key={col.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedColumns.has(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              At least one column must be selected
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No trades to export
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {filtered.length} trade{filtered.length !== 1 ? "s" : ""} will be exported
          </p>
        )}

        <DialogFooter>
          <Button
            onClick={handleExport}
            disabled={!canExport || filtered.length === 0}
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DatePicker({
  label,
  date,
  onSelect,
}: {
  label: string
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy-MM-dd") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  )
}
