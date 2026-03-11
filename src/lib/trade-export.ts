import * as XLSX from "xlsx"
import type { Trade } from "@/api/types"

export type ExportFormat = "csv" | "xlsx"

export type ExportColumn =
  | "id"
  | "symbol"
  | "quantity"
  | "price"
  | "type"
  | "status"
  | "notes"
  | "createdAt"
  | "updatedAt"
  | "notional"

export const ALL_EXPORT_COLUMNS: { key: ExportColumn; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "symbol", label: "Symbol" },
  { key: "quantity", label: "Quantity" },
  { key: "price", label: "Price" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "notes", label: "Notes" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
  { key: "notional", label: "Notional" },
]

export interface ExportOptions {
  format: ExportFormat
  columns: ExportColumn[]
  dateFrom?: string
  dateTo?: string
  statuses: Trade["status"][]
}

export function sanitizeCsvCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return "'" + value
  }
  return value
}

function formatDate(iso: string, format: ExportFormat): string {
  const date = new Date(iso)
  if (format === "csv") {
    return date.toISOString()
  }
  return date.toLocaleString()
}

function tradeToRow(
  trade: Trade,
  columns: ExportColumn[],
  format: ExportFormat,
  sanitize: boolean
): Record<string, string | number> {
  const row: Record<string, string | number> = {}

  const columnMap: Record<ExportColumn, () => string | number> = {
    id: () => trade.id,
    symbol: () => trade.symbol,
    quantity: () => trade.quantity,
    price: () => trade.price,
    type: () => trade.type,
    status: () => trade.status,
    notes: () => trade.notes ?? "",
    createdAt: () => formatDate(trade.createdAt, format),
    updatedAt: () => formatDate(trade.updatedAt, format),
    notional: () => trade.quantity * trade.price,
  }

  for (const col of columns) {
    const label = ALL_EXPORT_COLUMNS.find((c) => c.key === col)!.label
    let value = columnMap[col]()
    if (sanitize && typeof value === "string") {
      value = sanitizeCsvCell(value)
    }
    row[label] = value
  }

  return row
}

export function filterTrades(trades: Trade[], options: ExportOptions): Trade[] {
  return trades.filter((trade) => {
    if (options.statuses.length > 0 && !options.statuses.includes(trade.status)) {
      return false
    }
    if (options.dateFrom) {
      const from = new Date(options.dateFrom + "T00:00:00")
      if (new Date(trade.createdAt) < from) return false
    }
    if (options.dateTo) {
      const to = new Date(options.dateTo + "T23:59:59.999")
      if (new Date(trade.createdAt) > to) return false
    }
    return true
  })
}

function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function exportTrades(trades: Trade[], options: ExportOptions): void {
  const sanitize = options.format === "csv"
  const rows = trades.map((t) => tradeToRow(t, options.columns, options.format, sanitize))
  const filename = `trades_${todayString()}.${options.format}`

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trades")

  if (options.format === "csv") {
    XLSX.writeFile(workbook, filename, { bookType: "csv" })
  } else {
    XLSX.writeFile(workbook, filename, { bookType: "xlsx" })
  }
}
