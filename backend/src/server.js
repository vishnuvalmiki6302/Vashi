import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { config } from "./config.js";
import feedbackRouter from "./routes/feedback.js";
import authRouter from "./routes/auth.js";

async function start() {
  const app = express();
  app.use(cors({ origin: config.allowedOrigins }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRouter);
  app.use("/api/feedback", feedbackRouter);

  app.use((err, _req, res, _next) => {
    // simple error boundary to keep responses clean
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});

