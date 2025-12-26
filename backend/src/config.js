import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/feedback_dev",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) || [
    "http://localhost:5173",
  ],
  jwtSecret: process.env.JWT_SECRET || "change_me",
  refreshSecret: process.env.REFRESH_SECRET || "change_me_refresh",
  accessMinutes: Number(process.env.ACCESS_TOKEN_MINUTES || 30),
  refreshDays: Number(process.env.REFRESH_TOKEN_DAYS || 7),
  otpExpMinutes: Number(process.env.OTP_EXP_MINUTES || 10),
  otpResendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60),
  mailFrom: process.env.MAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};

