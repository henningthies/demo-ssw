import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TradeExportDialog } from "@/components/TradeExportDialog"
import { mockTrades } from "@/api/mock-data"
import { renderWithProviders } from "@/test/test-utils"

describe("TradeExportDialog", () => {
  it("opens dialog when Export button is clicked", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TradeExportDialog trades={mockTrades} />)

    await user.click(screen.getByRole("button", { name: /export/i }))

    expect(screen.getByText("Export Trades")).toBeInTheDocument()
    expect(screen.getByText(/configure filters/i)).toBeInTheDocument()
  })

  it("shows status checkboxes", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TradeExportDialog trades={mockTrades} />)

    await user.click(screen.getByRole("button", { name: /export/i }))

    expect(screen.getByText("OPEN")).toBeInTheDocument()
    expect(screen.getByText("FILLED")).toBeInTheDocument()
    expect(screen.getByText("CANCELLED")).toBeInTheDocument()
  })

  it("shows column checkboxes", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TradeExportDialog trades={mockTrades} />)

    await user.click(screen.getByRole("button", { name: /export/i }))

    expect(screen.getByText("Symbol")).toBeInTheDocument()
    expect(screen.getByText("Price")).toBeInTheDocument()
    expect(screen.getByText("Notional")).toBeInTheDocument()
  })

  it("shows trade count", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TradeExportDialog trades={mockTrades} />)

    await user.click(screen.getByRole("button", { name: /export/i }))

    expect(screen.getByText(/3 trades will be exported/i)).toBeInTheDocument()
  })

  it("shows 'no trades' message when trades array is empty", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TradeExportDialog trades={[]} />)

    await user.click(screen.getByRole("button", { name: /export/i }))

    expect(screen.getByText(/no trades to export/i)).toBeInTheDocument()
  })

  it("filters by status", async () => {
    const user = userEvent.setup()
    renderWithProviders(<TradeExportDialog trades={mockTrades} />)

    await user.click(screen.getByRole("button", { name: /export/i }))

    // Click OPEN label — only 1 trade is OPEN
    await user.click(screen.getByText("OPEN"))

    expect(screen.getByText(/1 trade will be exported/i)).toBeInTheDocument()
  })

  it("triggers download on export", async () => {
    const user = userEvent.setup()
    // Mock URL.createObjectURL and URL.revokeObjectURL
    const createObjectURL = vi.fn(() => "blob:test")
    const revokeObjectURL = vi.fn()
    globalThis.URL.createObjectURL = createObjectURL
    globalThis.URL.revokeObjectURL = revokeObjectURL

    renderWithProviders(<TradeExportDialog trades={mockTrades} />)

    await user.click(screen.getByRole("button", { name: /export/i }))
    await user.click(screen.getByRole("button", { name: /export csv/i }))

    expect(createObjectURL).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalled()
  })
})
