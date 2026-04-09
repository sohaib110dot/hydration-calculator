import { pgTable, text, serial, integer, numeric, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models so they get created in the database
export * from "./models/auth";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(), // references users.id
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  weight: numeric("weight").notNull(), // in kg
  activity: text("activity").notNull(), // Low, Medium, High
  season: text("season").notNull(), // Summer, Normal, Winter
  wakeTime: text("wake_time").notNull(), // e.g., "07:00"
  sleepTime: text("sleep_time").notNull(), // e.g., "23:00"
  dailyLiters: numeric("daily_liters").notNull(), // calculated base water
  currentStreak: integer("current_streak").notNull().default(0), // consecutive days with water intake
  lastStreakDate: text("last_streak_date"), // YYYY-MM-DD of last streak update
  isPremium: integer("is_premium").notNull().default(0), // 0 = free, 1 = premium
});

export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  completedGlasses: integer("completed_glasses").notNull().default(0),
  nextReminderTime: text("next_reminder_time"), // ISO timestamp for next drink reminder
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull().default("General Questions"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const contactReplies = pgTable("contact_replies", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  replyText: text("reply_text").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, userId: true, dailyLiters: true });
export const insertDailyLogSchema = createInsertSchema(dailyLogs).omit({ id: true, userId: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type InsertDailyLog = z.infer<typeof insertDailyLogSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactReply = typeof contactReplies.$inferSelect;
