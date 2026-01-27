import { Router, Request, Response } from "express";
import { User, Lesson } from "../models";
import mongoose from "mongoose";

const router = Router();

// Development-only debug endpoints to inspect DB contents quickly.
router.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("_id email name createdAt").limit(100);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

router.get("/lessons", async (_req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find().limit(100);
    res.json({ lessons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// POST /api/debug/seed-lessons?force=true
// Development helper: seed sample lessons with questions. If `force=true` it will delete existing lessons first.
router.post("/seed-lessons", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "not allowed in production" });
  }

  const force = req.query.force === "true";
  try {
    if (force) {
      await Lesson.deleteMany({});
    }

    const existing = await Lesson.countDocuments();
    if (existing > 0 && !force) {
      return res.status(400).json({ error: "lessons already exist, use ?force=true to replace" });
    }

    const sample = [
      {
        title: "Intro to Hiragana",
        language: "Japanese",
        content: "Learn the basic hiragana characters and pronunciation.",
        questions: [
          { question: "What is the hiragana for 'a' ?", options: ["あ", "い", "う", "え"], correct: 0 },
          { question: "What is the hiragana for 'i' ?", options: ["お", "い", "う", "え"], correct: 1 },
          { question: "What is the hiragana for 'u' ?", options: ["あ", "い", "う", "え"], correct: 2 },
          { question: "What is the hiragana for 'e' ?", options: ["あ", "い", "う", "え"], correct: 3 },
          { question: "Which hiragana is 'na'?", options: ["な", "に", "ぬ", "ね"], correct: 0 },
          { question: "Which hiragana is 'mi'?", options: ["む", "め", "み", "も"], correct: 2 }
        ]
      },
      {
        title: "Basic English Grammar",
        language: "English",
        content: "Nouns, verbs, and simple sentence structure.",
        questions: [
          { question: "Which word is a noun?", options: ["Run", "Quickly", "Table", "Blue"], correct: 2 },
          { question: "Which is a verb?", options: ["Happy", "Eat", "Big", "Yellow"], correct: 1 },
          { question: "Choose the plural noun:", options: ["Child", "Children", "Childs", "Childes"], correct: 1 },
          { question: "Which is an adjective?", options: ["Run", "Happy", "Quickly", "He"], correct: 1 },
          { question: "Select the pronoun:", options: ["Apple", "They", "Walk", "Green"], correct: 1 }
        ]
      },
      {
        title: "Spanish Greetings",
        language: "Spanish",
        content: "Common greetings and polite phrases.",
        questions: [
          { question: "How do you say 'Hello' in Spanish?", options: ["Hola", "Bonjour", "Ciao", "Hallo"], correct: 0 },
          { question: "What does 'Gracias' mean?", options: ["Please", "Thank you", "Goodbye", "Hello"], correct: 1 },
          { question: "How do you say 'Good morning'?", options: ["Buenas noches", "Buenos días", "Buenas tardes", "Adiós"], correct: 1 },
          { question: "Which is a polite way to say 'please'?", options: ["Por favor", "Gracias", "De nada", "Lo siento"], correct: 0 },
          { question: "How do you say 'See you later'?", options: ["Hasta luego", "Hola", "Adiós", "Buenos días"], correct: 0 }
        ]
      }
    ];

    const docs = await Lesson.insertMany(sample);
    res.json({ inserted: docs.length, lessons: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// Return Mongoose connection info to help diagnose wrong DB/URI
router.get("/info", (_req: Request, res: Response) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn.db ? (conn.db.databaseName as string) : undefined;
    const readyState = conn.readyState; // 0 disconnected, 1 connected
    const debug = mongoose.get("debug") || false;
    // Mask the URI for safety
    const rawUri = process.env.MONGODB_URI || null;
    const maskedUri = rawUri ? rawUri.replace(/:(?:[^:@]+)@/, ':***@') : null;
    res.json({ readyState, dbName, debug, uri: maskedUri, nodeEnv: process.env.NODE_ENV || "development" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
