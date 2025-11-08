import OpenAI from "openai"
import type { Survey } from "../shared/schema"

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export interface TrendAnalysis {
  patterns: string[]
  severity: "info" | "warning" | "urgent"
  affectedCount: number
  recommendations: string[]
}

export async function analyzeSurveyTrends(surveys: Survey[]): Promise<TrendAnalysis[]> {
  if (surveys.length === 0) {
    return []
  }

  if (!openai) {
    console.warn("OpenAI API key not provided. Using mock trend analysis.")
    // Return mock data for development
    return [
      {
        patterns: ["High stress levels detected"],
        severity: "warning" as const,
        affectedCount: Math.floor(surveys.length * 0.3),
        recommendations: ["Consider organizing stress management workshops", "Provide additional mental health resources"]
      }
    ]
  }

  const surveyData = surveys.map((s) => ({
    mood: s.mood,
    stressLevel: s.stressLevel,
    sleepQuality: s.sleepQuality,
    socialInteraction: s.socialInteraction,
    academicPressure: s.academicPressure,
    concerns: s.concerns,
    notes: s.additionalNotes,
  }))

  const prompt = `You are a mental health data analyst for a school. Analyze the following anonymous student wellbeing surveys and identify important trends or patterns that require attention.

Survey Data (${surveys.length} responses):
${JSON.stringify(surveyData, null, 2)}

Identify:
1. Significant patterns or trends (e.g., high stress levels, sleep issues, social isolation)
2. Severity level for each pattern (info, warning, or urgent)
3. Estimated number of students affected
4. Specific recommendations for interventions (workshops, resources, policy changes)

Respond in JSON format with an array of trend objects:
{
  "trends": [
    {
      "pattern": "Brief description of the pattern",
      "severity": "info|warning|urgent",
      "affectedCount": number,
      "recommendations": ["specific action 1", "specific action 2"]
    }
  ]
}

Focus on actionable insights that school staff can use to support student wellbeing.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in analyzing student mental health data to identify trends and provide actionable recommendations for school administrators.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(response.choices[0].message.content || "{}")

    return (result.trends || []).map((trend: any) => ({
      patterns: [trend.pattern],
      severity: trend.severity,
      affectedCount: trend.affectedCount,
      recommendations: trend.recommendations,
    }))
  } catch (error) {
    console.error("Error analyzing trends:", error)
    return []
  }
}

export async function generateAlertSuggestion(
  pattern: string,
  severity: string,
  affectedCount: number,
): Promise<string> {
  if (!openai) {
    return `Consider addressing the ${pattern.toLowerCase()} affecting ${affectedCount} students through targeted interventions and support programs.`;
  }

  const prompt = `Given this mental health trend in a school:
- Pattern: ${pattern}
- Severity: ${severity}
- Affected Students: ${affectedCount}

Generate a specific, actionable suggestion for what the school should do (1-2 sentences). Focus on concrete interventions like workshops, resources, or policy adjustments.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a school wellness coordinator providing practical intervention suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    return (
      response.choices[0].message.content ||
      "Consider scheduling a meeting with the wellness team to discuss this trend."
    )
  } catch (error) {
    console.error("Error generating suggestion:", error)
    return "Consider scheduling a meeting with the wellness team to discuss this trend."
  }
}

export async function moderateStoryContent(
  title: string,
  content: string,
): Promise<{
  isAppropriate: boolean
  concerns: string[]
  suggestions: string[]
}> {
  if (!openai) {
    console.warn("OpenAI API key not provided. Allowing all content.")
    return {
      isAppropriate: true,
      concerns: [],
      suggestions: [],
    }
  }

  const prompt = `Review this student story for a school mental health platform:

Title: ${title}
Content: ${content}

Check if it:
1. Contains appropriate content (no graphic violence, self-harm details, or harmful advice)
2. Respects privacy (no identifying information about others)
3. Promotes positive messages

Respond in JSON:
{
  "isAppropriate": true/false,
  "concerns": ["list any issues"],
  "suggestions": ["how to improve if needed"]
}`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are a content moderator for a school mental health platform, ensuring student stories are safe and supportive.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(response.choices[0].message.content || "{}")
    return {
      isAppropriate: result.isAppropriate ?? true,
      concerns: result.concerns || [],
      suggestions: result.suggestions || [],
    }
  } catch (error) {
    console.error("Error moderating content:", error)
    return {
      isAppropriate: true,
      concerns: [],
      suggestions: [],
    }
  }
}
