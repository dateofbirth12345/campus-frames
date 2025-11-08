import { useQuery } from "@tanstack/react-query"

export interface AnalyticsData {
  summary: {
    totalSurveys: number
    avgStressLevel: number
    avgAcademicPressure: number
    moodDistribution: Record<string, number>
  }
  insights: {
    title: string
    description: string
    severity: "info" | "warning" | "urgent"
    affectedCount: number
    recommendation: string
  }[]
  trends: {
    period: string
    stressLevel: number
    academicPressure: number
    wellnessScore: number
  }[]
  recommendations: {
    category: string
    actions: string[]
    priority: "high" | "medium" | "low"
  }[]
}

export function useAnalytics() {
  return useQuery<{ success: boolean; analytics: AnalyticsData }>({
    queryKey: ["/api/analytics"],
  })
}
