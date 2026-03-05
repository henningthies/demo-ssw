import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { mockApi } from "@/api/mock-handlers"
import type { Trade } from "@/api/types"

// In production: replace mockApi calls with real api.get/post/put calls

export function useTrades() {
  return useQuery({
    queryKey: ["trades"],
    queryFn: () => mockApi.trades.list(),
  })
}

export function useTrade(id: string) {
  return useQuery({
    queryKey: ["trades", id],
    queryFn: () => mockApi.trades.get(id),
    enabled: !!id,
  })
}

export function useCreateTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Trade, "id" | "status" | "createdAt" | "updatedAt">) =>
      mockApi.trades.create(data),
    onSuccess: (trade) => {
      queryClient.invalidateQueries({ queryKey: ["trades"] })
      toast.success(`Trade submitted`, {
        description: `${trade.type} ${trade.quantity}x ${trade.symbol} at $${trade.price.toFixed(2)}`,
      })
    },
    onError: () => {
      toast.error("Failed to submit trade", {
        description: "Please check your input and try again.",
      })
    },
  })
}

export function useUpdateTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trade> }) =>
      mockApi.trades.update(id, data),
    onSuccess: (trade, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["trades"] })
      queryClient.invalidateQueries({ queryKey: ["trades", id] })
      toast.success(`Trade #${trade.id} updated`)
    },
    onError: () => {
      toast.error("Failed to update trade")
    },
  })
}

export function useCancelTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockApi.trades.cancel(id),
    onSuccess: (trade) => {
      queryClient.invalidateQueries({ queryKey: ["trades"] })
      toast.warning(`Trade #${trade.id} cancelled`, {
        description: `${trade.symbol} ${trade.type} order removed`,
      })
    },
    onError: () => {
      toast.error("Failed to cancel trade")
    },
  })
}

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => mockApi.positions.list(),
  })
}
