import { describe, it, expect } from "vitest"
import { filterTrades, sanitizeCsvCell, type ExportOptions, ALL_EXPORT_COLUMNS } from "@/lib/trade-export"
import { mockTrades } from "@/api/mock-data"

describe("filterTrades", () => {
  const defaultOptions: ExportOptions = {
    format: "csv",
    columns: ALL_EXPORT_COLUMNS.map((c) => c.key),
    statuses: [],
  }

  it("returns all trades when no filters applied", () => {
    const result = filterTrades(mockTrades, defaultOptions)
    expect(result).toHaveLength(mockTrades.length)
  })

  it("filters by status", () => {
    const result = filterTrades(mockTrades, { ...defaultOptions, statuses: ["OPEN"] })
    expect(result.every((t) => t.status === "OPEN")).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it("filters by multiple statuses", () => {
    const result = filterTrades(mockTrades, { ...defaultOptions, statuses: ["OPEN", "FILLED"] })
    expect(result.every((t) => t.status === "OPEN" || t.status === "FILLED")).toBe(true)
  })

  it("filters by date range - from", () => {
    const result = filterTrades(mockTrades, { ...defaultOptions, dateFrom: "2026-03-03" })
    expect(result.every((t) => new Date(t.createdAt) >= new Date("2026-03-03"))).toBe(true)
  })

  it("filters by date range - to", () => {
    const result = filterTrades(mockTrades, { ...defaultOptions, dateTo: "2026-03-02" })
    expect(result.every((t) => new Date(t.createdAt) <= new Date("2026-03-02T23:59:59.999Z"))).toBe(true)
  })

  it("filters by date range and status combined", () => {
    const result = filterTrades(mockTrades, {
      ...defaultOptions,
      statuses: ["FILLED"],
      dateFrom: "2026-03-04",
    })
    expect(result.every((t) => t.status === "FILLED")).toBe(true)
    expect(result.every((t) => new Date(t.createdAt) >= new Date("2026-03-04"))).toBe(true)
  })

  it("returns empty array when no trades match", () => {
    const result = filterTrades(mockTrades, { ...defaultOptions, statuses: ["CANCELLED"] })
    expect(result).toHaveLength(0)
  })
})

describe("CSV injection prevention", () => {
  it("prefixes cells starting with = with single quote", () => {
    expect(sanitizeCsvCell("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0")
  })

  it("prefixes cells starting with + with single quote", () => {
    expect(sanitizeCsvCell("+1234")).toBe("'+1234")
  })

  it("prefixes cells starting with - with single quote", () => {
    expect(sanitizeCsvCell("-1234")).toBe("'-1234")
  })

  it("prefixes cells starting with @ with single quote", () => {
    expect(sanitizeCsvCell("@SUM(A1)")).toBe("'@SUM(A1)")
  })

  it("prefixes cells starting with tab with single quote", () => {
    expect(sanitizeCsvCell("\tcmd")).toBe("'\tcmd")
  })

  it("prefixes cells starting with carriage return with single quote", () => {
    expect(sanitizeCsvCell("\rcmd")).toBe("'\rcmd")
  })

  it("does not modify safe strings", () => {
    expect(sanitizeCsvCell("AAPL")).toBe("AAPL")
    expect(sanitizeCsvCell("Normal notes")).toBe("Normal notes")
    expect(sanitizeCsvCell("")).toBe("")
  })
})
