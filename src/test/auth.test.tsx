import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach } from "vitest"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/auth/AuthContext"
import { ProtectedRoute } from "@/auth/ProtectedRoute"
import { LoginPage } from "@/pages/LoginPage"

function renderApp(initialRoute = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div>Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("Authentication", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("redirects to login when not authenticated", async () => {
    renderApp("/")
    await waitFor(() => {
      expect(screen.getByText("Sign in")).toBeInTheDocument()
    })
  })

  it("can log in with demo credentials", async () => {
    renderApp("/login")
    const user = userEvent.setup()

    await user.type(screen.getByLabelText("Username"), "demo")
    await user.type(screen.getByLabelText("Password"), "test")
    await user.click(screen.getByText("Sign In"))

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument()
    })
  })

  it("shows error for invalid credentials", async () => {
    renderApp("/login")
    const user = userEvent.setup()

    await user.type(screen.getByLabelText("Username"), "wrong")
    await user.type(screen.getByLabelText("Password"), "wrong")
    await user.click(screen.getByText("Sign In"))

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument()
    })
  })
})
