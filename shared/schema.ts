import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll use this schema for type definitions, even though we use in-memory storage
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions);

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

// API Schemas
export const checkAnswerSchema = z.object({
  id: z.number(),
  answer: z.number(),
});

export const checkAnswerResponseSchema = z.object({
  correct: z.boolean(),
  correctAnswer: z.number(),
  message: z.string(),
});
