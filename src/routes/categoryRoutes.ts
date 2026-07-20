import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController';

const router = express.Router();

// Route: /api/categories
router
  .route('/')
  .post(createCategory)
  .get(getAllCategories);

export default router;