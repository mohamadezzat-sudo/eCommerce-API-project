import { Request, Response, NextFunction } from 'express';
import Category from '../models/categoryModel';
// Local lightweight async handler wrapper to avoid missing import
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Create a new category
export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const newCategory = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

// Get all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find();

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});