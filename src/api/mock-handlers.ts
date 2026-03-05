import type { Trade } from "./types"
import { mockTrades, mockPositions, mockUser, delay } from "./mock-data"

// In-memory store for demo
let trades = [...mockTrades]
let nextId = 4

export const mockApi = {
  auth: {
    async login(username: string, _password: string) {
      await delay()
      if (username === "demo") {
        return { token: "mock-jwt-token", user: mockUser }
      }
      throw { response: { status: 401, data: { message: "Invalid credentials" } } }
    },
    async me() {
      await delay(100)
      return mockUser
    },
  },

  trades: {
    async list(): Promise<Trade[]> {
      await delay()
      return [...trades].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    },

    async get(id: string): Promise<Trade> {
      await delay()
      const trade = trades.find((t) => t.id === id)
      if (!trade) throw { response: { status: 404 } }
      return trade
    },

    async create(data: Omit<Trade, "id" | "status" | "createdAt" | "updatedAt">): Promise<Trade> {
      await delay(500)
      const now = new Date().toISOString()
      const trade: Trade = {
        ...data,
        id: String(nextId++),
        status: "OPEN",
        createdAt: now,
        updatedAt: now,
      }
      trades.push(trade)
      return trade
    },

    async update(id: string, data: Partial<Trade>): Promise<Trade> {
      await delay(500)
      const index = trades.findIndex((t) => t.id === id)
      if (index === -1) throw { response: { status: 404 } }
      trades[index] = { ...trades[index], ...data, updatedAt: new Date().toISOString() }
      return trades[index]
    },

    async cancel(id: string): Promise<Trade> {
      return this.update(id, { status: "CANCELLED" })
    },
  },

  positions: {
    async list() {
      await delay()
      return mockPositions
    },
  },
}
