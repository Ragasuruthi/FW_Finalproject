import { Router, Request, Response } from "express";
import { Lesson } from "../models";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/lessons
router.get("/", async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json({ lessons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// GET /api/lessons/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "not found" });
    res.json({ lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// POST /api/lessons (protected)
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, language, content } = req.body;
    if (!title || !language) return res.status(400).json({ error: "title and language required" });
    const lesson = await Lesson.create({ title, language, content });
    res.status(201).json({ lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
