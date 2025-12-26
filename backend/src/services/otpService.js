import dayjs from "dayjs";
import { config } from "../config.js";
import { sendMailOtp } from "./mailService.js";

export function generateOtp() {
  return ("" + Math.floor(100000 + Math.random() * 900000)).slice(-6);
}

export function isCooldown(activeAt) {
  if (!activeAt) return false;
  const diff = dayjs().diff(dayjs(activeAt), "second");
  return diff < config.otpResendCooldownSeconds;
}

export async function issueOtp(user) {
  const code = generateOtp();
  user.otpCode = code;
  user.otpExpiresAt = dayjs().add(config.otpExpMinutes, "minute").toDate();
  user.otpRequestedAt = new Date();
  user.otpAttempts = 0;
  await user.save();
  if (user.email) {
    await sendMailOtp(user.email, code, config.otpExpMinutes);
  }
  return code;
}

export function verifyOtp(user, code) {
  if (!user.otpCode || !user.otpExpiresAt) return { ok: false, reason: "no-code" };
  if (dayjs().isAfter(dayjs(user.otpExpiresAt))) return { ok: false, reason: "expired" };
  if (user.otpCode !== code) return { ok: false, reason: "mismatch" };
  return { ok: true };
}

