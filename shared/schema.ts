import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const surveys = sqliteTable("surveys", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  staffId: text("staff_id").references(() => users.id),
  studentGrade: text("student_grade"),
  isAnonymous: integer("is_anonymous", { mode: 'boolean' }).default(true),
  mood: text("mood").notNull(),
  stressLevel: integer("stress_level").notNull(),
  sleepQuality: text("sleep_quality"),
  socialInteraction: text("social_interaction"),
  academicPressure: integer("academic_pressure"),
  concerns: text("concerns"), 
  additionalNotes: text("additional_notes"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const stories = sqliteTable("stories", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  studentId: text("student_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isPublished: integer("is_published", { mode: 'boolean' }).default(false),
  likes: integer("likes").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  publishedAt: text("published_at"),
});

export const alerts = sqliteTable("alerts", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  suggestion: text("suggestion"),
  affectedCount: integer("affected_count"),
  isResolved: integer("is_resolved", { mode: 'boolean' }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  resolvedAt: text("resolved_at"),
});

export const counselorRequests = sqliteTable("counselor_requests", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  studentId: text("student_id").references(() => users.id),
  urgency: text("urgency").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"),
  verificationCode: text("verification_code"),
  assignedCounselorId: text("assigned_counselor_id").references(() => users.id),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  resolvedAt: text("resolved_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSurveySchema = createInsertSchema(surveys).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
  likes: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  isResolved: true,
});

export const insertCounselorRequestSchema = createInsertSchema(counselorRequests).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  verificationCode: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type CounselorRequest = typeof counselorRequests.$inferSelect;
export type InsertCounselorRequest = z.infer<typeof insertCounselorRequestSchema>;
