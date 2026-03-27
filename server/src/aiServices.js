import { Router, Response } from "express";
import { authMiddleware, RequestWithUser } from "../middleware/auth";
import Conversation from "../models/Conversation";
import { generateTutorReply } from "../services/aiServices"; // Fixed Import

const router = Router();

// Create a new conversation session
router.post("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    const { title, language, topic, mode = "tutor" } = req.body;

    const conversation = new Conversation({
      userId,
      title: title || "New Learning Session",
      language: language || "english",
      topic: topic || "General",
      mode,
      messages: []
    });

    await conversation.save();
    return res.status(201).json({ conversation });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Post a message and get AI response
router.post("/:id/messages", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { content } = req.body;

    const conversation = await Conversation.findOne({ _id: id, userId });
    if (!conversation) return res.status(404).json({ error: "Not found" });

    // 1. Add User Message to DB
    conversation.messages.push({ role: "user", content, timestamp: new Date() });

    // 2. Get AI Reply (using the service you provided)
    const aiResult = await generateTutorReply({
      message: content,
      mode: conversation.mode,
      topic: conversation.topic,
      conversationHistory: conversation.messages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    // 3. Add AI Reply to DB
    const assistantMessage = {
      role: "assistant" as const,
      content: aiResult.reply,
      timestamp: new Date()
    };
    conversation.messages.push(assistantMessage);
    
    await conversation.save();

    return res.json({ conversation, message: assistantMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Error" });
  }
});

// GET all conversations for the sidebar
router.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .sort({ updatedAt: -1 });
    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ error: "Error fetching list" });
  }
});

export default router;