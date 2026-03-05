import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router-dom"
import { TradeForm } from "@/components/TradeForm"

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

    // Initially 1 leg
    expect(screen.getAllByPlaceholderText("e.g. AAPL")).toHaveLength(1)

    // Add a leg
    await user.click(screen.getByText("Add Leg"))

    expect(screen.getAllByPlaceholderText("e.g. AAPL")).toHaveLength(2)

    // Remove buttons appear (Trash2 icons rendered as SVGs in buttons)
    const removeButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("svg.lucide-trash-2"),
    )
    expect(removeButtons).toHaveLength(2)

    await user.click(removeButtons[0])
    expect(screen.getAllByPlaceholderText("e.g. AAPL")).toHaveLength(1)
  })
})
