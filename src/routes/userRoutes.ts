import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../models/userSchema";

const router = Router();

// POST /api/users/register
router.post("/register", validate(createUserSchema), registerUser);

// POST /api/users/login
// Note: You will need to create a login function in your userController.ts
router.post("/login", validate(loginUserSchema), loginUser);

export default router;