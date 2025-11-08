import type { Express } from "express"
import { createServer, type Server } from "http"
import { storage } from "./storage"
import {
  analyzeSurveyTrends,
  generateAlertSuggestion,
  moderateStoryContent,
} from "./ai-service"
import { generateAnalyticsReport } from "./ai-analytics"
import { insertSurveySchema, insertStorySchema, insertCounselorRequestSchema } from "../shared/schema"

export async function registerRoutes(app: Express): Promise<Server> {
  // Survey routes
  app.post("/api/surveys", async (req, res) => {
    try {
      const validatedData = insertSurveySchema.parse(req.body)
      const survey = await storage.createSurvey(validatedData)
      res.json({ success: true, survey })
    } catch (error) {
      console.error("Error creating survey:", error)
      res.status(400).json({ success: false, message: "Invalid survey data" })
    }
  })

  app.get("/api/surveys", async (req, res) => {
    try {
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 100
      const surveys = await storage.getSurveys(limit)
      res.json({ success: true, surveys })
    } catch (error) {
      console.error("Error fetching surveys:", error)
      res.status(500).json({ success: false, message: "Failed to fetch surveys" })
    }
  })

  app.get("/api/surveys/stats", async (req, res) => {
    try {
      const stats = await storage.getSurveyStats()
      res.json({ success: true, stats })
    } catch (error) {
      console.error("Error fetching survey stats:", error)
      res.status(500).json({ success: false, message: "Failed to fetch stats" })
    }
  })

  // AI-powered trend analysis
  app.post("/api/surveys/analyze", async (req, res) => {
    try {
      const { days = 7 } = req.body
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const surveys = await storage.getSurveysByDateRange(startDate, new Date())
      const trends = await analyzeSurveyTrends(surveys)

      // Create alerts for significant trends
      const alerts = []
      for (const trend of trends) {
        const suggestion = await generateAlertSuggestion(trend.patterns[0], trend.severity, trend.affectedCount)

        const alert = await storage.createAlert({
          severity: trend.severity,
          title: trend.patterns[0],
          description: `Analysis of ${surveys.length} surveys from the past ${days} days.`,
          suggestion,
          affectedCount: trend.affectedCount,
        })
        alerts.push(alert)
      }

      res.json({ success: true, trends, alerts })
    } catch (error) {
      console.error("Error analyzing surveys:", error)
      res.status(500).json({ success: false, message: "Failed to analyze surveys" })
    }
  })

  // Story routes
  app.post("/api/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body)

      // Moderate content before saving
      const moderation = await moderateStoryContent(validatedData.title, validatedData.content)

      if (!moderation.isAppropriate) {
        return res.status(400).json({
          success: false,
          message: "Content needs review",
          concerns: moderation.concerns,
          suggestions: moderation.suggestions,
        })
      }

      const story = await storage.createStory(validatedData)
      res.json({ success: true, story })
    } catch (error) {
      console.error("Error creating story:", error)
      res.status(400).json({ success: false, message: "Invalid story data" })
    }
  })

  app.get("/api/stories", async (req, res) => {
    try {
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 50
      const stories = await storage.getPublishedStories(limit)
      res.json({ success: true, stories })
    } catch (error) {
      console.error("Error fetching stories:", error)
      res.status(500).json({ success: false, message: "Failed to fetch stories" })
    }
  })

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getStory(req.params.id)
      if (!story) {
        return res.status(404).json({ success: false, message: "Story not found" })
      }
      res.json({ success: true, story })
    } catch (error) {
      console.error("Error fetching story:", error)
      res.status(500).json({ success: false, message: "Failed to fetch story" })
    }
  })

  app.post("/api/stories/:id/publish", async (req, res) => {
    try {
      const story = await storage.publishStory(req.params.id)
      if (!story) {
        return res.status(404).json({ success: false, message: "Story not found" })
      }
      res.json({ success: true, story })
    } catch (error) {
      console.error("Error publishing story:", error)
      res.status(500).json({ success: false, message: "Failed to publish story" })
    }
  })

  app.post("/api/stories/:id/like", async (req, res) => {
    try {
      const story = await storage.likeStory(req.params.id)
      if (!story) {
        return res.status(404).json({ success: false, message: "Story not found" })
      }
      res.json({ success: true, story })
    } catch (error) {
      console.error("Error liking story:", error)
      res.status(500).json({ success: false, message: "Failed to like story" })
    }
  })

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts()
      res.json({ success: true, alerts })
    } catch (error) {
      console.error("Error fetching alerts:", error)
      res.status(500).json({ success: false, message: "Failed to fetch alerts" })
    }
  })

  app.post("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const alert = await storage.resolveAlert(req.params.id)
      if (!alert) {
        return res.status(404).json({ success: false, message: "Alert not found" })
      }
      res.json({ success: true, alert })
    } catch (error) {
      console.error("Error resolving alert:", error)
      res.status(500).json({ success: false, message: "Failed to resolve alert" })
    }
  })

  // Counselor request routes
  app.post("/api/counselor-requests", async (req, res) => {
    try {
      const validatedData = insertCounselorRequestSchema.parse(req.body)
      const request = await storage.createCounselorRequest(validatedData)
      res.json({ success: true, request })
    } catch (error) {
      console.error("Error creating counselor request:", error)
      res.status(400).json({ success: false, message: "Invalid request data" })
    }
  })

  app.get("/api/counselor-requests", async (req, res) => {
    try {
      const status = req.query.status as string | undefined
      const requests = await storage.getCounselorRequests(status)
      res.json({ success: true, requests })
    } catch (error) {
      console.error("Error fetching counselor requests:", error)
      res.status(500).json({ success: false, message: "Failed to fetch requests" })
    }
  })

  app.post("/api/counselor-requests/:id/assign", async (req, res) => {
    try {
      const { counselorId } = req.body
      if (!counselorId) {
        return res.status(400).json({ success: false, message: "Counselor ID required" })
      }

      const request = await storage.assignCounselor(req.params.id, counselorId)
      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found" })
      }
      res.json({ success: true, request })
    } catch (error) {
      console.error("Error assigning counselor:", error)
      res.status(500).json({ success: false, message: "Failed to assign counselor" })
    }
  })

  app.post("/api/counselor-requests/:id/status", async (req, res) => {
    try {
      const { status } = req.body
      if (!status) {
        return res.status(400).json({ success: false, message: "Status required" })
      }

      const request = await storage.updateRequestStatus(req.params.id, status)
      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found" })
      }
      res.json({ success: true, request })
    } catch (error) {
      console.error("Error updating request status:", error)
      res.status(500).json({ success: false, message: "Failed to update status" })
    }
  })

  // New analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const surveys = await storage.getSurveys(1000)
      const analytics = await generateAnalyticsReport(surveys)
      res.json({ success: true, analytics })
    } catch (error) {
      console.error("Error generating analytics:", error)
      res.status(500).json({ success: false, message: "Failed to generate analytics" })
    }
  })

  const httpServer = createServer(app)
  return httpServer
}
