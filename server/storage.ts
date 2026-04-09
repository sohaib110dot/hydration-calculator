import { db } from "./db";
import { profiles, dailyLogs, contacts, contactReplies, type Profile, type InsertProfile, type DailyLog, type Contact, type ContactReply } from "@shared/schema";
import { eq, and } from "drizzle-orm";

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export interface IStorage {
  getProfile(userId: string): Promise<Profile | undefined>;
  upsertProfile(userId: string, profile: InsertProfile, dailyLiters: number): Promise<Profile>;
  upgradeProfile(userId: string): Promise<Profile | undefined>;
  getTodayLog(userId: string, date: string): Promise<DailyLog | undefined>;
  createLog(userId: string, date: string): Promise<DailyLog>;
  updateLogGlasses(id: number, glasses: number, userId: string, date: string, dailyLiterGoal: number): Promise<DailyLog>;
  saveContact(name: string, email: string, subject: string, message: string): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  saveReply(contactId: number, replyText: string): Promise<ContactReply>;
  getRepliesForContact(contactId: number): Promise<ContactReply[]>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async upsertProfile(userId: string, profile: InsertProfile, dailyLiters: number): Promise<Profile> {
    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    if (existing) {
      const [updated] = await db.update(profiles)
        .set({ ...profile, dailyLiters: dailyLiters.toString() })
        .where(eq(profiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(profiles)
        .values({ ...profile, userId, dailyLiters: dailyLiters.toString(), plan: "free" })
        .returning();
      return created;
    }
  }

  async upgradeProfile(userId: string): Promise<Profile | undefined> {
    const [updated] = await db.update(profiles)
      .set({ isPremium: 1 })
      .where(eq(profiles.userId, userId))
      .returning();
    return updated;
  }

  async getTodayLog(userId: string, date: string): Promise<DailyLog | undefined> {
    const [log] = await db.select().from(dailyLogs).where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)));
    return log;
  }

  async createLog(userId: string, date: string): Promise<DailyLog> {
    const [created] = await db.insert(dailyLogs).values({ userId, date, completedGlasses: 0 }).returning();
    return created;
  }

  async updateLogGlasses(id: number, glasses: number, userId: string, date: string, dailyLiterGoal: number): Promise<DailyLog> {
    // Calculate next reminder time (current time + 90 minutes)
    const now = new Date();
    const nextReminderTime = new Date(now.getTime() + 90 * 60 * 1000).toISOString();
    
    const [updated] = await db.update(dailyLogs)
      .set({ 
        completedGlasses: Math.max(0, glasses),
        nextReminderTime 
      })
      .where(eq(dailyLogs.id, id))
      .returning();

    // Update streak if user reached daily goal
    const dailyGoalGlasses = Math.ceil((dailyLiterGoal || 2.75) * 4); // default 2.75L = 11 glasses
    if (Math.max(0, glasses) > 0 && updated.completedGlasses >= dailyGoalGlasses) {
      const [userProfile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
      
      if (userProfile) {
        const lastStreakDate = userProfile.lastStreakDate;
        const today = formatDate(new Date());
        
        // Check if streak should continue or reset
        let newStreak = userProfile.currentStreak;
        
        if (lastStreakDate === today) {
          // Same day, don't change streak
          newStreak = userProfile.currentStreak;
        } else {
          // Different day - check if it's consecutive
          const lastDate = new Date(lastStreakDate || today);
          const todayDate = new Date(today);
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            // Consecutive day
            newStreak = userProfile.currentStreak + 1;
          } else if (daysDiff > 1) {
            // Missed days, reset
            newStreak = 1;
          } else {
            // Same day or future date
            newStreak = userProfile.currentStreak;
          }
        }
        
        await db.update(profiles)
          .set({ currentStreak: newStreak, lastStreakDate: today })
          .where(eq(profiles.userId, userId));
      }
    }

    return updated;
  }

  async saveContact(name: string, email: string, subject: string, message: string): Promise<Contact> {
    const [created] = await db.insert(contacts)
      .values({ name, email, subject, message, createdAt: new Date().toISOString() })
      .returning();
    return created;
  }

  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts);
  }

  async saveReply(contactId: number, replyText: string): Promise<ContactReply> {
    const [created] = await db.insert(contactReplies)
      .values({ contactId, replyText, createdAt: new Date().toISOString() })
      .returning();
    return created;
  }

  async getRepliesForContact(contactId: number): Promise<ContactReply[]> {
    return db.select().from(contactReplies).where(eq(contactReplies.contactId, contactId));
  }
}

export const storage = new DatabaseStorage();
