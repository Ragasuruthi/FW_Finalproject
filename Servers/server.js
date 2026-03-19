import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a friendly English tutor.
Reply like a real chatbot.
Be conversational and helpful.

User: ${message}
AI:
`;

    const result = await model.generateContent(prompt);
    const reply = result.response?.text() || "No response from AI";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini error:", error);
    res.status(500).json({ reply: "AI error occurred" });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
