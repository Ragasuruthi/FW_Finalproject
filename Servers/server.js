// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db"; // ✅ use your db.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// ----------------------
// 1️⃣ Load environment variables
// ----------------------
dotenv.config();

// ----------------------
// 2️⃣ Connect to MongoDB
// ----------------------
connectDB(); // This replaces mongoose.connect(...)

// ----------------------
// 3️⃣ Check Gemini API Key
// ----------------------
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env");
  process.exit(1);
}

// ----------------------
// 4️⃣ Initialize Express app
// ----------------------
const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// 5️⃣ Initialize Google Generative AI
// ----------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ----------------------
// 6️⃣ System prompts helper
// ----------------------
const getSystemPrompt = (mode, topic, learningStyle) => {
  const basePrompt = `You are an expert, friendly, and patient language learning tutor.
Learning Style: The student learns best through ${learningStyle} methods.
`;

  const modePrompts = {
    tutor: `${basePrompt}
Mode: General Tutoring
- Explain concepts clearly with examples
- Ask follow-up questions to check understanding
- Encourage the student and celebrate progress
- Adapt explanations based on their level
- Provide relevant context and real-world examples
${topic ? `- Focus on: ${topic}` : ""}`,

    practice: `${basePrompt}
Mode: Practice Partner
- Have a natural conversation in the learning language
- Gently correct mistakes while keeping the conversation flowing
- Encourage longer responses with follow-up questions
- Praise good attempts and constructive feedback
- Mix easy and challenging topics to maintain engagement
${topic ? `- Topic: ${topic}` : ""}
Use simple language but gradually introduce complexity.`,

    "grammar-check": `${basePrompt}
Mode: Grammar Assistant
- Analyze the user's input for grammar, spelling, and punctuation
- Provide clear explanations for any errors
- Suggest improvements with examples
- Explain the underlying grammar rules
- Be encouraging and non-judgmental
${topic ? `- Focus on grammar related to: ${topic}` : ""}`,

    vocabulary: `${basePrompt}
Mode: Vocabulary Builder
- Help expand the student's vocabulary
- Provide definitions, examples, and usage context
- Suggest similar words (synonyms) and opposites (antonyms)
- Create sentences showing word usage
- Explain nuances between similar words
${topic ? `- Focus on vocabulary related to: ${topic}` : ""}
- Use the words in engaging, memorable contexts`
  };

  return modePrompts[mode] || modePrompts.tutor;
};

// ----------------------
// 7️⃣ AI Tutor endpoint
// ----------------------
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { message, mode = "tutor", topic = "", conversationHistory = [], learningStyle = "visual" } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: getSystemPrompt(mode, topic, learningStyle)
    });

    let conversationContext = [];
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
    }

    conversationContext.push({
      role: "user",
      parts: [{ text: message }]
    });

    const chat = model.startChat({
      history: conversationContext.slice(0, -1)
    });

    const result = await chat.sendMessage(message);
    const reply = result.response?.text() || "I'm having trouble responding. Please try again.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini error:", error.message || error);
    res.status(500).json({
      reply: "I encountered an error while processing your request. Please try again in a moment."
    });
  }
});

// ----------------------
// 8️⃣ Health check endpoint
// ----------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "AI Tutor Server" });
});

// ----------------------
// 9️⃣ Start server
// ----------------------
const PORT = process.env.AI_PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ AI Tutor Server running at http://localhost:${PORT}`);
  console.log(`📚 Ready to help students learn languages!`);
});