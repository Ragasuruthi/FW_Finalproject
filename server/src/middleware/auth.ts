import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import RevokedToken from "../models/RevokedToken";

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "no token" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "invalid token format" });
  const token = parts[1];
  try {
    // Check if token was revoked
    const revoked = await RevokedToken.findOne({ token }).lean();
    if (revoked) return res.status(401).json({ error: "token revoked" });

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = payload.userId;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
};
