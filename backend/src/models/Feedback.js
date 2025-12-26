import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    customerId: { type: String, index: true },
    customerName: { type: String },
    customerEmail: { type: String },
    product: { type: String, index: true },
    feature: { type: String },
    channel: {
      type: String,
      enum: ["web", "email", "chat", "store", "phone", "other"],
      default: "other",
      index: true,
    },
    rating: { type: Number, min: 1, max: 5 },
    text: { type: String, required: true },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
      index: true,
    },
    keywords: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    language: { type: String, default: "en" },
    summary: { type: String },
    status: { type: String, enum: ["open", "resolved"], default: "open", index: true },
    toxicity: { type: Number, min: 0, max: 1, default: 0 },
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ sentiment: 1, channel: 1 });
FeedbackSchema.index({ product: 1, feature: 1 });
FeedbackSchema.index({ text: "text", keywords: "text", tags: "text" });

export const Feedback = mongoose.model("Feedback", FeedbackSchema);

