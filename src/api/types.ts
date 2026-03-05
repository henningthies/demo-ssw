// Domain types matching Java backend DTOs

export interface Trade {
  id: string
  symbol: string
  quantity: number
  price: number
  type: "BUY" | "SELL"
  status: "OPEN" | "FILLED" | "CANCELLED"
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
}

export interface User {
  id: string
  username: string
  displayName: string
  role: "TRADER" | "ADMIN" | "VIEWER"
}

export interface ApiError {
  field: string
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
