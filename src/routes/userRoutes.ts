import { Router } from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUsersSchema, loginUsersSchema } from "../models/userSchema";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// POST /api/users/register
router.post("/register", validate(createUsersSchema), registerUser);

// GET /api/users/profile
router.get("/profile", protect, getUserProfile);

// POST /api/users/login
// Note: You will need to create a login function in your userController.ts
router.post("/login", validate(loginUsersSchema), loginUser);

export default router;