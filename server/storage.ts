import { db } from "./db"
import {
  users,
  surveys,
  stories,
  alerts,
  counselorRequests,
  type User,
  type InsertUser,
  type Survey,
  type InsertSurvey,
  type Story,
  type InsertStory,
  type Alert,
  type InsertAlert,
  type CounselorRequest,
  type InsertCounselorRequest,
} from "../shared/schema"
import { eq, desc, and, gte, sql } from "drizzle-orm"

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>
  getUserByEmail(email: string): Promise<User | undefined>
  createUser(user: InsertUser): Promise<User>

  // Survey operations
  createSurvey(survey: InsertSurvey): Promise<Survey>
  getSurveys(limit?: number): Promise<Survey[]>
  getSurveysByDateRange(startDate: Date, endDate: Date): Promise<Survey[]>
  getSurveyStats(): Promise<{
    total: number
    avgStressLevel: number
    avgAcademicPressure: number
    moodDistribution: Record<string, number>
  }>

  // Story operations
  createStory(story: InsertStory): Promise<Story>
  getStory(id: string): Promise<Story | undefined>
  getPublishedStories(limit?: number): Promise<Story[]>
  getStoriesByStudent(studentId: string): Promise<Story[]>
  publishStory(id: string): Promise<Story | undefined>
  likeStory(id: string): Promise<Story | undefined>

  // Alert operations
  createAlert(alert: InsertAlert): Promise<Alert>
  getActiveAlerts(): Promise<Alert[]>
  resolveAlert(id: string): Promise<Alert | undefined>

  // Counselor request operations
  createCounselorRequest(request: InsertCounselorRequest): Promise<CounselorRequest>
  getCounselorRequests(status?: string): Promise<CounselorRequest[]>
  assignCounselor(requestId: string, counselorId: string): Promise<CounselorRequest | undefined>
  updateRequestStatus(requestId: string, status: string): Promise<CounselorRequest | undefined>
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return result[0]
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return result[0]
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning()
    return result[0]
  }

  // Survey operations
  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const result = await db.insert(surveys).values(insertSurvey).returning()
    return result[0]
  }

  async getSurveys(limit = 100): Promise<Survey[]> {
    return db.select().from(surveys).orderBy(desc(surveys.createdAt)).limit(limit)
  }

  async getSurveysByDateRange(startDate: Date, endDate: Date): Promise<Survey[]> {
    return db
      .select()
      .from(surveys)
      .where(and(gte(surveys.createdAt, startDate), sql`${surveys.createdAt} <= ${endDate}`))
      .orderBy(desc(surveys.createdAt))
  }

  async getSurveyStats(): Promise<{
    total: number
    avgStressLevel: number
    avgAcademicPressure: number
    moodDistribution: Record<string, number>
    concernDistribution?: Record<string, number>
  }> {
    const allSurveys = await db.select().from(surveys)

    const total = allSurveys.length
    const avgStressLevel = total > 0 ? allSurveys.reduce((sum: number, s: Survey) => sum + s.stressLevel, 0) / total : 0
    const avgAcademicPressure =
      total > 0 ? allSurveys.reduce((sum: number, s: Survey) => sum + (s.academicPressure || 0), 0) / total : 0

    const moodDistribution: Record<string, number> = {}
    const concernDistribution: Record<string, number> = {}
    allSurveys.forEach((s: Survey) => {
      if (s.mood) {
        moodDistribution[s.mood] = (moodDistribution[s.mood] || 0) + 1
      }
      // SQLite: concerns stored as a JSON string
      let surveyConcerns: string[] | undefined
      if (typeof s.concerns === "string" && s.concerns.trim().startsWith("[")) {
        try {
          surveyConcerns = JSON.parse(s.concerns)
        } catch {
          surveyConcerns = undefined
        }
      } else if (Array.isArray(s.concerns)) {
        surveyConcerns = s.concerns
      }
      if (surveyConcerns) {
        surveyConcerns.forEach((concern: string) => {
          if (concern) {
            concernDistribution[concern] = (concernDistribution[concern] || 0) + 1
          }
        })
      }
    })

    return {
      total,
      avgStressLevel: Math.round(avgStressLevel * 10) / 10,
      avgAcademicPressure: Math.round(avgAcademicPressure * 10) / 10,
      moodDistribution,
      concernDistribution,
    }
  }

  // Story operations
  async createStory(insertStory: InsertStory): Promise<Story> {
    const result = await db.insert(stories).values(insertStory).returning()
    return result[0]
  }

  async getStory(id: string): Promise<Story | undefined> {
    const result = await db.select().from(stories).where(eq(stories.id, id)).limit(1)
    return result[0]
  }

  async getPublishedStories(limit = 50): Promise<Story[]> {
    return db
      .select()
      .from(stories)
      .where(eq(stories.isPublished, true))
      .orderBy(desc(stories.publishedAt))
      .limit(limit)
  }

  async getStoriesByStudent(studentId: string): Promise<Story[]> {
    return db.select().from(stories).where(eq(stories.studentId, studentId)).orderBy(desc(stories.createdAt))
  }

  async publishStory(id: string): Promise<Story | undefined> {
    const result = await db
      .update(stories)
      .set({ isPublished: true, publishedAt: new Date() })
      .where(eq(stories.id, id))
      .returning()
    return result[0]
  }

  async likeStory(id: string): Promise<Story | undefined> {
    const story = await this.getStory(id)
    if (!story) return undefined

    const result = await db
      .update(stories)
      .set({ likes: (story.likes || 0) + 1 })
      .where(eq(stories.id, id))
      .returning()
    return result[0]
  }

  // Alert operations
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(insertAlert).returning()
    return result[0]
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return db.select().from(alerts).where(eq(alerts.isResolved, false)).orderBy(desc(alerts.createdAt))
  }

  async resolveAlert(id: string): Promise<Alert | undefined> {
    const result = await db
      .update(alerts)
      .set({ isResolved: true, resolvedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning()
    return result[0]
  }

  // Counselor request operations
  async createCounselorRequest(insertRequest: InsertCounselorRequest): Promise<CounselorRequest> {
    const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    const result = await db
      .insert(counselorRequests)
      .values({ ...insertRequest, verificationCode })
      .returning()
    return result[0]
  }

  async getCounselorRequests(status?: string): Promise<CounselorRequest[]> {
    if (status) {
      return db
        .select()
        .from(counselorRequests)
        .where(eq(counselorRequests.status, status))
        .orderBy(desc(counselorRequests.createdAt))
    }
    return db.select().from(counselorRequests).orderBy(desc(counselorRequests.createdAt))
  }

  async assignCounselor(requestId: string, counselorId: string): Promise<CounselorRequest | undefined> {
    const result = await db
      .update(counselorRequests)
      .set({ assignedCounselorId: counselorId, status: "assigned" })
      .where(eq(counselorRequests.id, requestId))
      .returning()
    return result[0]
  }

  async updateRequestStatus(requestId: string, status: string): Promise<CounselorRequest | undefined> {
    const updateData: any = { status }
    if (status === "resolved") {
      updateData.resolvedAt = new Date()
    }
    const result = await db
      .update(counselorRequests)
      .set(updateData)
      .where(eq(counselorRequests.id, requestId))
      .returning()
    return result[0]
  }
}

export const storage = new DbStorage()
