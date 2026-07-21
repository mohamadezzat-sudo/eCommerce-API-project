import express from 'express';
import { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    updateCategory, 
    deleteCategory 
} from '../controllers/categoryController';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';
const router = express.Router();

router
    .route('/')
    .get(getAllCategories)
    .post(protect, admin, createCategory);

router
    .route('/:id')
    .get(getCategoryById)
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;