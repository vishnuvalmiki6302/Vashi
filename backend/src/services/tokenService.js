import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: `${config.accessMinutes}m` });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, config.refreshSecret, { expiresIn: `${config.refreshDays}d` });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshSecret);
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

