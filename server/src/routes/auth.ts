import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models";
import RevokedToken from "../models/RevokedToken";
import { authMiddleware, RequestWithUser } from "../middleware/auth";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// POST /api/auth/signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    console.log("signup attempt for", email?.toLowerCase());
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "user exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), password: hashed, name });
    console.log("created user:", { id: user._id, email: user.email });
    return res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    const anyErr = err as { code?: number; message?: string };
    if (anyErr?.code === 11000) {
      return res.status(409).json({ error: "user exists" });
    }
    // More helpful error logging for debugging (do not expose in production)
    console.error("signup error", anyErr?.message ?? err);
    return res.status(500).json({
      error: "internal error",
      details: process.env.NODE_ENV === "production" ? undefined : anyErr?.message,
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});

// POST /api/auth/logout
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "no token" });
    const parts = auth.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "invalid token format" });
    const token = parts[1];
    // Try to extract expiry from token
    const decoded = jwt.decode(token) as any;
    let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // fallback 7 days
    if (decoded && decoded.exp) {
      expiresAt = new Date(decoded.exp * 1000);
    }
    // Save to revoked tokens collection (unique index prevents duplicates)
    try {
      await RevokedToken.create({ token, expiresAt });
    } catch (e) {
      // ignore duplicate key errors
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("logout error", err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthorized" });
    const user = await User.findById(userId).select("_id email name").lean();
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal error" });
  }
});
