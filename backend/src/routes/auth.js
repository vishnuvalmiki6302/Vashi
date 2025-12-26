import { Router } from "express";
import { login, refresh, signup, verifyLogin, otpLimiter } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", otpLimiter, login);
router.post("/verify-otp", verifyLogin);
router.post("/refresh", refresh);

export default router;

