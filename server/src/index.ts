import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. New Import

import authRoutes from "./routes/auth";
import lessonsRoutes from "./routes/lessons";
import progressRoutes from "./routes/progress";
import userRoutes from "./routes/user";
import debugRoutes from "./routes/debug";
import conversationsRoutes from "./routes/conversations";
import preferencesRoutes from "./routes/preferences";
import Lesson from "./models/Lesson";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- AI TUTOR INTEGRATION ---
// This handles the request coming from your conversations.js route
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}
const genAI = new GoogleGenerativeAI(apiKey);

app.post("/api/ai-tutor", async (req, res) => {
  const { message, mode, topic, conversationHistory } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are an expert, friendly AI Tutor. 
      Current Learning Mode: ${mode || 'General'}. 
      Current Topic: ${topic || 'Language Learning'}.
      Style: Use simple analogies, be encouraging, and always end with a small question to check if the student understood.`
    });

    // Format history for Gemini (from user/assistant to user/model)
    const history = (conversationHistory || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ error: "The AI Tutor is resting. Try again in a moment!" });
  }
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