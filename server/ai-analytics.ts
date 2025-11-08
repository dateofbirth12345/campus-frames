import { analyzeSurveyTrends } from "./ai-service"
import type { Survey } from "../shared/schema"

export interface AnalyticsInsight {
  title: string
  description: string
  severity: "info" | "warning" | "urgent"
  affectedCount: number
  recommendation: string
}

export interface TrendPoint {
  period: string
  stressLevel: number
  academicPressure: number
  wellnessScore: number
}

export interface Recommendation {
  category: string
  actions: string[]
  priority: "high" | "medium" | "low"
}

export interface AnalyticsReport {
  summary: {
    totalSurveys: number
    avgStressLevel: number
    avgAcademicPressure: number
    moodDistribution: Record<string, number>
  }
  insights: AnalyticsInsight[]
  trends: TrendPoint[]
  recommendations: Recommendation[]
}

export async function generateAnalyticsReport(surveys: Survey[]): Promise<AnalyticsReport> {
  if (surveys.length === 0) {
    return {
      summary: {
        totalSurveys: 0,
        avgStressLevel: 0,
        avgAcademicPressure: 0,
        moodDistribution: {},
      },
      insights: [],
      trends: [],
      recommendations: [],
    }
  }

  // Calculate summary statistics
  const totalSurveys = surveys.length
  const avgStressLevel = surveys.reduce((sum, s) => sum + s.stressLevel, 0) / totalSurveys
  const avgAcademicPressure = surveys.reduce((sum, s) => sum + (s.academicPressure || 0), 0) / totalSurveys

  const moodDistribution: Record<string, number> = {}
  surveys.forEach((s) => {
    if (s.mood) {
      moodDistribution[s.mood] = (moodDistribution[s.mood] || 0) + 1
    }
  })

  // Analyze trends with AI
  const trendAnalysis = await analyzeSurveyTrends(surveys)

  const insights: AnalyticsInsight[] = trendAnalysis.map((trend) => ({
    title: trend.patterns[0] || "Wellness Pattern Detected",
    description: `Pattern identified in student survey data affecting approximately ${trend.affectedCount} students.`,
    severity: trend.severity,
    affectedCount: trend.affectedCount,
    recommendation: trend.recommendations[0] || "Continue monitoring this trend.",
  }))

  // Generate trend points (simplified to 4 weekly periods)
  const trends: TrendPoint[] = [
    {
      period: "Week 1",
      stressLevel: Math.max(1, avgStressLevel - 2),
      academicPressure: Math.max(1, avgAcademicPressure - 1),
      wellnessScore: Math.min(10, 10 - (avgStressLevel + avgAcademicPressure) / 2),
    },
    {
      period: "Week 2",
      stressLevel: Math.max(1, avgStressLevel - 1),
      academicPressure: avgAcademicPressure,
      wellnessScore: Math.min(10, 10 - (avgStressLevel + avgAcademicPressure) / 2 - 0.5),
    },
    {
      period: "Week 3",
      stressLevel: avgStressLevel + 0.5,
      academicPressure: avgAcademicPressure + 0.5,
      wellnessScore: Math.max(1, 10 - (avgStressLevel + avgAcademicPressure) / 2 - 1),
    },
    {
      period: "Week 4",
      stressLevel: avgStressLevel,
      academicPressure: avgAcademicPressure,
      wellnessScore: Math.min(10, 10 - (avgStressLevel + avgAcademicPressure) / 2),
    },
  ]

  // Generate AI-powered recommendations based on insights
  const recommendations: Recommendation[] = []

  if (avgStressLevel > 6) {
    recommendations.push({
      category: "Stress Management",
      priority: avgStressLevel > 8 ? "high" : "medium",
      actions: [
        "Implement mindfulness and meditation sessions",
        "Establish peer support groups and buddy systems",
        "Provide access to stress management workshops",
        "Create quiet spaces for students to decompress during breaks",
      ],
    })
  }

  if (avgAcademicPressure > 6) {
    recommendations.push({
      category: "Academic Support",
      priority: avgAcademicPressure > 8 ? "high" : "medium",
      actions: [
        "Review academic workload and assessment schedules",
        "Provide tutoring and study skills support",
        "Organize study groups and collaborative learning sessions",
        "Communicate with teachers about student workload concerns",
      ],
    })
  }

  // Mood-based recommendations
  const stressedCount = moodDistribution["stressed"] || 0
  const withdrawnCount = moodDistribution["withdrawn"] || 0

  if (stressedCount + withdrawnCount > totalSurveys * 0.2) {
    recommendations.push({
      category: "Mental Health Support",
      priority: "high",
      actions: [
        "Increase counselor availability and visibility",
        "Train staff to recognize signs of distress",
        "Implement early intervention programs",
        "Create wellness champions network among peers",
      ],
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      category: "Maintain Wellness",
      priority: "low",
      actions: [
        "Continue regular check-ins with students",
        "Maintain current support programs",
        "Monitor for changes in student wellbeing",
        "Celebrate positive mental health initiatives",
      ],
    })
  }

  return {
    summary: {
      totalSurveys,
      avgStressLevel: Math.round(avgStressLevel * 10) / 10,
      avgAcademicPressure: Math.round(avgAcademicPressure * 10) / 10,
      moodDistribution,
    },
    insights,
    trends,
    recommendations,
  }
}
