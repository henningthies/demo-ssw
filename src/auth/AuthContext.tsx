import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockApi } from "@/api/mock-handlers"
import type { User } from "@/api/types"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      mockApi.auth
        .me()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
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

export function useAuth() {
  return useContext(AuthContext)
}
