import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import type { Alert } from "../../../shared/schema"

export function useAlerts() {
  return useQuery<{ alerts: Alert[] }>({
    queryKey: ["/api/alerts"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/alerts")
      return await res.json()
    },
  })
}

export function useResolveAlert() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/alerts/${id}/resolve`)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] })
    },
  })
}
