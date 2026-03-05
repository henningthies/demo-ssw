import type { Trade, Position, User } from "./types"

// Mock data for demo - simulates Java backend responses

export const mockUser: User = {
  id: "1",
  username: "hthies",
  displayName: "Henning Thies",
  role: "TRADER",
}

export const mockTrades: Trade[] = [
  {
    id: "1",
    symbol: "AAPL",
    quantity: 100,
    price: 178.5,
    type: "BUY",
    status: "FILLED",
    notes: "Earnings play",
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:05Z",
  },
  {
    id: "2",
    symbol: "TSLA",
    quantity: 50,
    price: 245.0,
    type: "SELL",
    status: "OPEN",
    createdAt: "2026-03-03T14:30:00Z",
    updatedAt: "2026-03-03T14:30:00Z",
  },
  {
    id: "3",
    symbol: "NVDA",
    quantity: 200,
    price: 890.25,
    type: "BUY",
    status: "FILLED",
    notes: "AI momentum",
    createdAt: "2026-03-04T09:15:00Z",
    updatedAt: "2026-03-04T09:15:10Z",
  },
]

export const mockPositions: Position[] = [
  { symbol: "AAPL", quantity: 100, avgPrice: 178.5, currentPrice: 182.3, pnl: 380 },
  { symbol: "NVDA", quantity: 200, avgPrice: 890.25, currentPrice: 905.0, pnl: 2950 },
  { symbol: "MSFT", quantity: 75, avgPrice: 415.0, currentPrice: 410.5, pnl: -337.5 },
]

// Simulated API delay
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
