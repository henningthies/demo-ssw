import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] })
    },
  })
}

export function useUpdateTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trade> }) =>
      mockApi.trades.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["trades"] })
      queryClient.invalidateQueries({ queryKey: ["trades", id] })
    },
  })
}

export function useCancelTrade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mockApi.trades.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] })
    },
  })
}

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => mockApi.positions.list(),
  })
}
