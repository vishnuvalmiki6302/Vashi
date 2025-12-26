import { config } from "../config.js";

// Placeholder SMS sender. Replace with Twilio (or similar) if you have credentials.
export async function sendSms(to, message) {
  if (!to) return;
  if (config.twilioSid && config.twilioToken && config.smsFrom) {
    // Lazy-load to avoid dependency unless configured.
    const twilio = (await import("twilio")).default;
    const client = twilio(config.twilioSid, config.twilioToken);
    await client.messages.create({ from: config.smsFrom, to, body: message });
  } else {
    console.log(`[SMS mock] to ${to}: ${message}`);
  }
}

