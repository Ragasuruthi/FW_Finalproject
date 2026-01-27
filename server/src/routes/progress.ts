import { Router, Request, Response } from "express";
import { authMiddleware, RequestWithUser } from "../middleware/auth";
import Progress from "../models/Progress";
import Lesson from "../models/Lesson";

const router = Router();

// GET /api/progress -> list progress for current user
router.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    const items = await Progress.find({ userId }).populate("lessonId", "title language").lean();
    return res.json({ progress: items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

// POST /api/progress -> upsert progress for a lesson
router.post("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    const { lessonId, completed, score } = req.body;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    if (!lessonId) return res.status(400).json({ error: "lessonId required" });

    // ensure lesson exists
    const lesson = await Lesson.findById(lessonId).lean();
    if (!lesson) return res.status(404).json({ error: "lesson not found" });

    const update = { completed: !!completed, score };
    const prog = await Progress.findOneAndUpdate(
      { userId, lessonId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.json({ progress: prog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
