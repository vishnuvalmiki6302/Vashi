import { Router } from "express";
import {
  createFeedback,
  exportFeedback,
  feedbackStats,
  listFeedback,
} from "../controllers/feedbackController.js";

const router = Router();

router.get("/", listFeedback);
router.get("/stats", feedbackStats);
router.get("/export", exportFeedback);
router.post("/", createFeedback);

export default router;

