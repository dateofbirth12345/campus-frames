import { useQuery, useMutation } from "@tanstack/react-query"
import { apiRequest, queryClient } from "@/lib/queryClient"
import type { Story, InsertStory } from "../../../shared/schema"

export function useStories(limit?: number) {
  const url = limit ? `/api/stories?limit=${limit}` : "/api/stories"
  return useQuery<{ stories: Story[] }>({
    queryKey: [url],
  })
}

export function useStory(id: string) {
  return useQuery<{ story: Story }>({
    queryKey: [`/api/stories/${id}`],
    enabled: !!id,
  })
}

export function useCreateStory() {
  return useMutation({
    mutationFn: async (data: InsertStory) => {
      const res = await apiRequest("POST", "/api/stories", data)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] })
    },
  })
}

export function usePublishStory() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/stories/${id}/publish`)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] })
    },
  })
}

export function useLikeStory() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/stories/${id}/like`)
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] })
    },
  })
}
