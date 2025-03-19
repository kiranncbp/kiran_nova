import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Contact Messages Table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  company: text("company"),
});

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  username: varchar("username", { length: 255 }).notNull(), // ✅ Use varchar(255)
});

// Validation Schema (Better Approach)
export const insertContactSchema = createInsertSchema(contactMessages)
  .omit({ id: true }) // ✅ Exclude `id`
  .extend({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    company: z.string().optional(),
  });

// Type Definitions
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
