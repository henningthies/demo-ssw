import { useState } from "react"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ALL_EXPORT_COLUMNS,
  exportTrades,
  filterTrades,
  type ExportColumn,
  type ExportFormat,
} from "@/lib/trade-export"
import type { Trade } from "@/api/types"

const STATUSES: Trade["status"][] = ["OPEN", "FILLED", "CANCELLED"]

interface ExportPopoverProps {
  trades: Trade[]
}

export function ExportPopover({ trades }: ExportPopoverProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>("csv")
  const [columns, setColumns] = useState<ExportColumn[]>(
    ALL_EXPORT_COLUMNS.map((c) => c.key)
  )
  const [statuses, setStatuses] = useState<Trade["status"][]>([])
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  function toggleColumn(col: ExportColumn) {
    setColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  function toggleStatus(status: Trade["status"]) {
    setStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  function handleExport() {
    const options = { format, columns, statuses, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }
    const filtered = filterTrades(trades, options)

    if (filtered.length === 0) {
      toast.warning("No trades match your filters")
      return
    }

    exportTrades(filtered, options)
    toast.success(`Exported ${filtered.length} trade${filtered.length !== 1 ? "s" : ""} as ${format.toUpperCase()}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">Format</h4>
            <div className="flex gap-2">
              <Button
                variant={format === "csv" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat("csv")}
              >
                CSV
              </Button>
              <Button
                variant={format === "xlsx" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat("xlsx")}
              >
                Excel
              </Button>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="export-date-from" className="text-xs">From</Label>
                <Input
                  id="export-date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="export-date-to" className="text-xs">To</Label>
                <Input
                  id="export-date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Status</h4>
            <div className="flex gap-2">
              {STATUSES.map((status) => (
                <Badge
                  key={status}
                  variant={statuses.includes(status) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
            {statuses.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">All statuses</p>
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium">Columns</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {ALL_EXPORT_COLUMNS.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={columns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>

          <Button className="w-full" onClick={handleExport} disabled={columns.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export {format.toUpperCase()}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
