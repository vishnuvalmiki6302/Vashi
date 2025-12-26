import nodemailer from "nodemailer";
import { config } from "../config.js";

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  } else {
    // Fallback to console logger when SMTP is not configured
    transporter = {
      sendMail: async (opts) => {
        console.log(`[MAIL mock] to ${opts.to}: ${opts.subject}\n${opts.text}`);
      },
    };
  }
  return transporter;
}

export async function sendMailOtp(to, code, minutes) {
  const mail = {
    from: config.mailFrom || "no-reply@example.com",
    to,
    subject: "Your verification code",
    text: `Your login code is ${code}. It expires in ${minutes} minutes.`,
  };
  await getTransporter().sendMail(mail);
}

