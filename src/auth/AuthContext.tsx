import { useState, useEffect, useRef, type ReactNode } from "react"
import { mockApi } from "@/api/mock-handlers"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<import("@/api/types").User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialized = useRef(false)

  // Check existing token on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const token = localStorage.getItem("token")
    if (token) {
      mockApi.auth
        .me()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsLoading(false))
    } else {
      queueMicrotask(() => setIsLoading(false))
    }
  }, [])

  async function login(username: string, password: string) {
    const res = await mockApi.auth.login(username, password)
    localStorage.setItem("token", res.token)
    setUser(res.user)
  }

  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
