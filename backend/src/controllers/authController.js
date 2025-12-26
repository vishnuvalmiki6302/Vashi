import rateLimit from "express-rate-limit";
import dayjs from "dayjs";
import { User } from "../models/User.js";
import { issueOtp, verifyOtp, isCooldown } from "../services/otpService.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/tokenService.js";
import { config } from "../config.js";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

export async function signup(req, res, next) {
  try {
    const { email, password, phone } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password are required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "email already registered" });
    const user = new User({ email, phone });
    await user.setPassword(password);
    await user.save();
    return res.status(201).json({ message: "account created" });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "invalid credentials" });
    const ok = await user.verifyPassword(password);
    if (!ok) return res.status(401).json({ message: "invalid credentials" });

    if (isCooldown(user.otpRequestedAt)) {
      return res.status(429).json({ message: "OTP recently sent. Please wait before retrying." });
    }

    await issueOtp(user);
    return res.json({ message: "OTP sent" });
  } catch (err) {
    next(err);
  }
}

export async function verifyLogin(req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "invalid session" });

    const result = verifyOtp(user, code);
    if (!result.ok) return res.status(401).json({ message: "invalid or expired code" });

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    await user.save();

    const access = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refresh = signRefreshToken({ sub: user.id });
    return res.json({ access, refresh });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refresh } = req.body;
    if (!refresh) return res.status(400).json({ message: "missing refresh token" });
    const decoded = verifyRefreshToken(refresh);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: "invalid refresh" });
    const access = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return res.json({ access });
  } catch (err) {
    return res.status(401).json({ message: "invalid refresh" });
  }
}

