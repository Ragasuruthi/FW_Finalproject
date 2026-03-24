import { Router, Request, Response } from "express";
import { authMiddleware, RequestWithUser } from "../middleware/auth";
import Progress from "../models/Progress";
import User from "../models/User";

const router = Router();

// GET /api/user/stats -> aggregated stats for the current user
router.get("/stats", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    // Fetch progress for user
    const progress = await Progress.find({ userId }).lean();

    const lessonsCompleted = progress.filter((p) => p.completed).length;

    // XP calculation: base 50 XP per completed lesson + score (if present)
    let xp = 0;
    for (const p of progress) {
      if (p.completed) {
        xp += 50;
      }
      if (typeof p.score === "number") xp += p.score;
    }

    // Level calculation: 1000 XP per level
    const level = Math.floor(xp / 1000) + 1;

    // Streak calculation: consecutive days with activity ending today
    const now = new Date();
    const daysWithActivity = new Set<string>();
    for (const p of progress) {
      const d = new Date(p.updatedAt || new Date());
      // use YYYY-MM-DD as key
      const key = d.toISOString().slice(0, 10);
      daysWithActivity.add(key);
    }

    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const check = new Date(now);
      check.setDate(now.getDate() - i);
      const key = check.toISOString().slice(0, 10);
      if (daysWithActivity.has(key)) streak += 1;
      else break;
    }

    // Basic user info
    const user = await User.findById(userId).select("_id email name").lean();

    return res.json({ user, xp, level, streak, lessonsCompleted });
  } catch (err) {
    console.error("user stats error", err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
