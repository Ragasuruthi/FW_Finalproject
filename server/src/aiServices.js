const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ai-tutor", async (req, res) => {
    const { message, mode, topic, conversationHistory } = req.body;

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `You are an expert AI Tutor. 
            Current Mode: ${mode}. 
            Current Topic: ${topic || 'General Learning'}.
            Instructions: Be encouraging, explain complex concepts simply, and ask follow-up questions to ensure the student understands.`
        });

        // Convert your DB history format to Gemini's format
        const history = conversationHistory.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "AI failed to generate a response" });
    }
});

module.exports = router;