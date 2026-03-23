import { Router, Request, Response } from "express";
import { authMiddleware, RequestWithUser } from "../middleware/auth";
import UserPreferences from "../models/UserPreferences";

const router = Router();

// GET /api/preferences -> get user preferences
router.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    let preferences = await UserPreferences.findOne({ userId });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = new UserPreferences({
        userId,
        preferredLanguage: "english",
        learningStyle: "visual",
        difficulty: "beginner",
        dailyGoalXp: 100,
        notificationsEnabled: true,
        darkMode: true,
        theme: "dark"
      });
      await preferences.save();
    }

    return res.json({ preferences });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

// PUT /api/preferences -> update user preferences
router.put("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const {
      preferredLanguage,
      learningStyle,
      difficulty,
      dailyGoalXp,
      notificationsEnabled,
      darkMode,
      theme
    } = req.body;

    const updates: any = {};
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (learningStyle) updates.learningStyle = learningStyle;
    if (difficulty) updates.difficulty = difficulty;
    if (dailyGoalXp !== undefined) updates.dailyGoalXp = dailyGoalXp;
    if (notificationsEnabled !== undefined) updates.notificationsEnabled = notificationsEnabled;
    if (darkMode !== undefined) updates.darkMode = darkMode;
    if (theme) updates.theme = theme;

    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: updates },
      { upsert: true, new: true }
    );

    return res.json({ preferences });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
