import { Router } from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers, 
  deleteUser 
} from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUsersSchema, loginUsersSchema } from "../models/userSchema";
import { protect } from "../middleware/authMiddleware";
import { admin } from "../middleware/adminMiddleware";

const router = Router();

// Public routes
router.post("/register", validate(createUsersSchema), registerUser);
router.post("/login", validate(loginUsersSchema), loginUser);

// Protected user routes
router.get("/profile", protect, getUserProfile);

// Admin-only user management routes
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;