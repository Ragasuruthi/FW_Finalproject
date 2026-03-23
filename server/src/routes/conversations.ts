import { Router, Request, Response } from "express";
import { authMiddleware, RequestWithUser } from "../middleware/auth";
import Conversation from "../models/Conversation";
import axios from "axios";

const router = Router();

// GET /api/conversations -> get all conversations for current user
router.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const conversations = await Conversation.find({ userId })
      .select("_id title language topic mode messages createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({ conversations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

// GET /api/conversations/:id -> get specific conversation
router.get("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const conversation = await Conversation.findOne({
      _id: id,
      userId
    }).lean();

    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    return res.json({ conversation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

// POST /api/conversations -> create new conversation
router.post("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    const { title, language, topic, mode = "tutor" } = req.body;

    if (!userId) return res.status(401).json({ error: "unauthorized" });
    if (!title) return res.status(400).json({ error: "title required" });

    const conversation = new Conversation({
      userId,
      title,
      language: language || "english",
      topic: topic || "",
      mode,
      messages: []
    });

    await conversation.save();
    return res.status(201).json({ conversation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

// POST /api/conversations/:id/messages -> add message and get AI response
router.post(
  "/:id/messages",
  authMiddleware,
  async (req: RequestWithUser, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { content } = req.body;

      if (!userId) return res.status(401).json({ error: "unauthorized" });
      if (!content) return res.status(400).json({ error: "content required" });

      // Find conversation
      const conversation = await Conversation.findOne({ _id: id, userId });

      if (!conversation) {
        return res.status(404).json({ error: "conversation not found" });
      }

      // Add user message
      conversation.messages.push({
        role: "user",
        content,
        timestamp: new Date()
      });

      // Call AI endpoint
      let aiResponse = "";
      try {
        const aiEndpoint = process.env.AI_SERVER_URL || "http://localhost:5000";
        const response = await axios.post(
          `${aiEndpoint}/api/ai-tutor`,
          {
            message: content,
            mode: conversation.mode,
            topic: conversation.topic || undefined,
            conversationHistory: conversation.messages.slice(0, -1).map((msg) => ({
              role: msg.role,
              content: msg.content
            }))
          },
          { timeout: 30000 }
        );

        aiResponse = response.data.reply || "I'm having trouble responding right now. Please try again.";
      } catch (aiError) {
        console.error("AI Service Error:", aiError);
        aiResponse =
          "I'm having trouble connecting to the AI service. Please try again later.";
      }

      // Add AI response
      conversation.messages.push({
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      });

      // Save conversation
      await conversation.save();

      return res.json({
        conversation,
        message: {
          role: "assistant",
          content: aiResponse
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "internal error" });
    }
  }
);

// DELETE /api/conversations/:id -> delete conversation
router.delete("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const result = await Conversation.findOneAndDelete({
      _id: id,
      userId
    });

    if (!result) {
      return res.status(404).json({ error: "conversation not found" });
    }

    return res.json({ message: "conversation deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
