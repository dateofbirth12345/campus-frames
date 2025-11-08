import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import type { Survey, InsertSurvey } from "../../../shared/schema"

export function useSurveys(limit?: number) {
  const url = limit ? `/api/surveys?limit=${limit}` : "/api/surveys"
  return useQuery<{ surveys: Survey[] }>({
    queryKey: [url],
  })
}

export function useSurveyStats() {
  return useQuery({
    queryKey: ["/api/surveys/stats"],
  })
}

export function useCreateSurvey() {
  return useMutation({
    mutationFn: async (data: InsertSurvey) => {
      const res = await apiRequest("POST", "/api/surveys", data)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/surveys"] })
      queryClient.invalidateQueries({ queryKey: ["/api/surveys/stats"] })
    },
  })
}

export function useAnalyzeSurveys() {
  return useMutation({
    mutationFn: async (days = 7) => {
      const res = await apiRequest("POST", "/api/surveys/analyze", { days })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] })
    },
  })
}
