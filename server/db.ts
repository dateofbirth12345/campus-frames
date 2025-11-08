import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users, surveys, stories, alerts, counselorRequests } from "../shared/schema";

// Use SQLite for development if no DATABASE_URL is provided
const isDevelopment = process.env.NODE_ENV === "development";

if (!process.env.DATABASE_URL && !isDevelopment) {
  throw new Error("DATABASE_URL environment variable is not set");
}

let db;
let sqlite: Database.Database | null = null;

if (isDevelopment && !process.env.DATABASE_URL) {
  // Use SQLite for development
  sqlite = new Database("development.db");
  // Enable foreign keys
  sqlite.pragma("foreign_keys = ON");
  db = drizzle(sqlite);
  console.log("Using SQLite database for development");
} else {
  // Use PostgreSQL for production
  const { drizzle: drizzleNeon } = await import("drizzle-orm/neon-serverless");
  const ws = await import("ws");
  
  db = drizzleNeon({
    connection: process.env.DATABASE_URL!,
    ws: ws.default,
  });
  console.log("Using PostgreSQL database");
}

// Initialize database tables for SQLite
export async function initDatabase() {
  if (isDevelopment && !process.env.DATABASE_URL && sqlite) {
    try {
      // Create tables if they don't exist
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          full_name TEXT NOT NULL,
          created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
        );

        CREATE TABLE IF NOT EXISTS surveys (
          id TEXT PRIMARY KEY,
          staff_id TEXT,
          student_grade TEXT,
          is_anonymous INTEGER DEFAULT 1,
          mood TEXT NOT NULL,
          stress_level INTEGER NOT NULL,
          sleep_quality TEXT,
          social_interaction TEXT,
          academic_pressure INTEGER,
          concerns TEXT,
          additional_notes TEXT,
          created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
          FOREIGN KEY (staff_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS stories (
          id TEXT PRIMARY KEY,
          student_id TEXT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL,
          is_published INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
          published_at TEXT,
          FOREIGN KEY (student_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS alerts (
          id TEXT PRIMARY KEY,
          severity TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          suggestion TEXT,
          affected_count INTEGER,
          is_resolved INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
          resolved_at TEXT
        );

        CREATE TABLE IF NOT EXISTS counselor_requests (
          id TEXT PRIMARY KEY,
          student_id TEXT,
          urgency TEXT NOT NULL,
          reason TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          verification_code TEXT,
          assigned_counselor_id TEXT,
          created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
          resolved_at TEXT,
          FOREIGN KEY (student_id) REFERENCES users(id),
          FOREIGN KEY (assigned_counselor_id) REFERENCES users(id)
        );
      `);

      console.log("✅ SQLite database tables created successfully");
    } catch (error) {
      console.error("❌ Error creating database tables:", error);
    }
  }
}

export { db };
