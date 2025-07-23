// src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  getProfile,
  refreshToken,
} from "../controllers/authController";
import { validateRegister, validateLogin } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.post("/refresh", authenticate, refreshToken);

export default router;
