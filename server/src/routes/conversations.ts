import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { authMiddleware, RequestWithUser } from "../middleware/auth";
import Conversation from "../models/Conversation";
import { generateTutorReply } from "../services/aiTutor";

const router = Router();

async function findConversationForUser(id: string, uid: mongoose.Types.ObjectId) {
  // Primary path: conversation already has rightful owner
  const conversation = await Conversation.findOne({ _id: id, userId: uid });
  if (conversation) return conversation;

  // Legacy fallback: conversation exists but missing userId (migrated or old data defect)
  const conversationById = await Conversation.findById(id);
  if (conversationById && !conversationById.userId) {
    conversationById.userId = uid;
    await conversationById.save();
    return conversationById;
  }

  return null;
}

// GET /api/conversations -> get all conversations for current user
router.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const uid = new mongoose.Types.ObjectId(userId);
    const conversations = await Conversation.find({ userId: uid })
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

    const uid = new mongoose.Types.ObjectId(userId);
    const conversation = await findConversationForUser(id, uid);

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

    const uid = new mongoose.Types.ObjectId(userId);
    const conversation = new Conversation({
      userId: uid,
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

      // Find conversation for this user (with legacy fallback for missing userId)
      const uid = new mongoose.Types.ObjectId(userId);
      console.log("[DEBUG] POST /:id/messages  id=%s  userId=%s  uid=%s  typeof_userId=%s", id, userId, uid.toString(), typeof userId);
      const conversation = await findConversationForUser(id, uid);

      if (!conversation) {
        return res.status(404).json({ error: "conversation not found" });
      }

      // Add user message
      conversation.messages.push({
        role: "user",
        content,
        timestamp: new Date()
      });

      const { reply: aiResponse } = await generateTutorReply({
        message: content,
        mode: conversation.mode,
        topic: conversation.topic || undefined,
        conversationHistory: conversation.messages.slice(0, -1).map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      });

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

    const uid = new mongoose.Types.ObjectId(userId);
    const conversation = await findConversationForUser(id, uid);
    if (!conversation) {
      return res.status(404).json({ error: "conversation not found" });
    }

    await Conversation.deleteOne({ _id: conversation._id });

    return res.json({ message: "conversation deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
