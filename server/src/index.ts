import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import lessonsRoutes from "./routes/lessons";
import progressRoutes from "./routes/progress";
import userRoutes from "./routes/user";
import debugRoutes from "./routes/debug";
import conversationsRoutes from "./routes/conversations";
import preferencesRoutes from "./routes/preferences";
import Lesson from "./models/Lesson";
import { generateTutorReply } from "./services/aiTutor";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- AI TUTOR (Gemini or OpenAI — see AI_PROVIDER in .env) ---
app.post("/api/ai-tutor", async (req, res) => {
  const { message, mode, topic, conversationHistory } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message required" });
  }

  const { success, reply } = await generateTutorReply({
    message,
    mode,
    topic,
    conversationHistory,
  });

  if (!success) {
    return res.status(503).json({ error: reply });
  }

  return res.json({ reply });
});
// ----------------------------

app.get("/", (req, res) => res.send({ status: "ok", message: "Learning-web backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/preferences", preferencesRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use("/api/debug", debugRoutes);
}

async function start() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/learning-web";
  try {
    mongoose.set("strictQuery", false);
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    mongoose.connection.on("connected", () => {
      console.log("✅ Mongoose connected");
    });

    await mongoose.connect(mongoUri);
    console.log("🚀 Connected to MongoDB");

    // Seed sample lessons... (Your existing seed logic remains exactly the same)
    const count = await Lesson.countDocuments();
    if (count === 0) {
      const sample = [
        {
          title: "Intro to Hiragana",
          language: "Japanese",
          content: "Learn the basic hiragana characters and pronunciation.",
          questions: [
            { question: "What is the hiragana for 'a' ?", options: ["あ", "い", "う", "え"], correct: 0 },
            // ... (rest of your sample lessons)
          ]
        }
      ];
      await Lesson.insertMany(sample);
    }

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`✨ Server listening on http://localhost:${port}`);
  });
}

start();