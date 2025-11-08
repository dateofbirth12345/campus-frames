import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import type { CounselorRequest, InsertCounselorRequest } from "../../../shared/schema"

export function useCounselorRequests(status?: string) {
  const url = status ? `/api/counselor-requests?status=${status}` : "/api/counselor-requests"
  return useQuery<{ requests: CounselorRequest[] }>({
    queryKey: [url],
  })
}

export function useCreateCounselorRequest() {
  return useMutation({
    mutationFn: async (data: InsertCounselorRequest) => {
      const res = await apiRequest("POST", "/api/counselor-requests", data)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/counselor-requests"] })
    },
  })
}

export function useAssignCounselor() {
  return useMutation({
    mutationFn: async ({ requestId, counselorId }: { requestId: string; counselorId: string }) => {
      const res = await apiRequest("POST", `/api/counselor-requests/${requestId}/assign`, { counselorId })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/counselor-requests"] })
    },
  })
}

export function useUpdateRequestStatus() {
  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      const res = await apiRequest("POST", `/api/counselor-requests/${requestId}/status`, { status })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/counselor-requests"] })
    },
  })
}
