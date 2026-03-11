import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { TradeForm } from "@/components/TradeForm"

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("TradeForm", () => {
  it("renders the form", () => {
    renderWithProviders(<TradeForm />)
    expect(screen.getByText("New Trade")).toBeInTheDocument()
    expect(screen.getByText("Submit Trade")).toBeInTheDocument()
  })

  it("validates required fields on submit", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    await user.click(screen.getByText("Submit Trade"))

    await waitFor(() => {
      expect(screen.getByText("Symbol required")).toBeInTheDocument()
    })
  })

  it("can add and remove legs", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    expect(screen.getAllByPlaceholderText("e.g. AAPL")).toHaveLength(1)

    await user.click(screen.getByText("Add Leg"))
    expect(screen.getAllByPlaceholderText("e.g. AAPL")).toHaveLength(2)

    const removeButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("svg.lucide-trash-2"),
    )
    expect(removeButtons).toHaveLength(2)

    await user.click(removeButtons[0])
    expect(screen.getAllByPlaceholderText("e.g. AAPL")).toHaveLength(1)
  })

  it("shows reason field only for SELL orders", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    // BUY is default — no reason field
    expect(screen.queryByPlaceholderText("Why are you selling?")).not.toBeInTheDocument()

    // Switch to SELL
    await user.click(screen.getByRole("combobox"))
    await user.click(screen.getByRole("option", { name: "Sell" }))

    expect(screen.getByPlaceholderText("Why are you selling?")).toBeInTheDocument()
  })

  it("requires reason for SELL orders", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    // Switch to SELL
    await user.click(screen.getByRole("combobox"))
    await user.click(screen.getByRole("option", { name: "Sell" }))

    // Fill leg but leave reason empty
    await user.type(screen.getByPlaceholderText("e.g. AAPL"), "AAPL")
    await user.clear(screen.getByPlaceholderText("Qty"))
    await user.type(screen.getByPlaceholderText("Qty"), "10")
    await user.clear(screen.getByPlaceholderText("Price"))
    await user.type(screen.getByPlaceholderText("Price"), "150")

    await user.click(screen.getByText("Submit Trade"))

    await waitFor(() => {
      expect(screen.getByText("Reason required for SELL orders")).toBeInTheDocument()
    })
  })

  it("displays total notional when leg has values", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    await user.clear(screen.getByPlaceholderText("Qty"))
    await user.type(screen.getByPlaceholderText("Qty"), "100")
    await user.clear(screen.getByPlaceholderText("Price"))
    await user.type(screen.getByPlaceholderText("Price"), "50")

    await waitFor(() => {
      expect(screen.getByText("Total Notional")).toBeInTheDocument()
      expect(screen.getByText("$5,000.00")).toBeInTheDocument()
    })
  })

  it("submits a valid BUY trade and navigates to /trades", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText("e.g. AAPL"), "MSFT")
    await user.clear(screen.getByPlaceholderText("Qty"))
    await user.type(screen.getByPlaceholderText("Qty"), "50")
    await user.clear(screen.getByPlaceholderText("Price"))
    await user.type(screen.getByPlaceholderText("Price"), "400")

    await user.click(screen.getByText("Submit Trade"))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/trades")
    })
  })

  it("navigates to /trades on cancel", async () => {
    renderWithProviders(<TradeForm />)
    const user = userEvent.setup()

    await user.click(screen.getByText("Cancel"))

    expect(mockNavigate).toHaveBeenCalledWith("/trades")
  })
})
