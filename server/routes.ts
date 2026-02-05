import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.questions.next.path, async (req, res) => {
    const question = await storage.generateQuestion();
    // Don't send the answer to the client!
    res.json({
      id: question.id,
      questionText: question.questionText
    });
  });

  app.post(api.questions.check.path, async (req, res) => {
    try {
      const input = api.questions.check.input.parse(req.body);
      const result = await storage.checkAnswer(input.id, input.answer);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
