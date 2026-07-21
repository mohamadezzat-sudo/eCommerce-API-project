import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import Category from '../models/categoryModel';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.body; // or categoryId depending on your schema

    // Check if category exists (FR016)
    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            throw new AppError("Product-Category Integrity failed: Category does not exist", 400);
        }
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const filter: any = {};

  if (req.query.category) {
    // Only validate if it's a valid hex string, then assign directly
    if (!mongoose.Types.ObjectId.isValid(req.query.category as string)) {
      throw new AppError("Invalid Category ID format", 400);
    }
    filter.category = req.query.category;
  }

  const products = await Product.find(filter).populate('category');
  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.body;

    // Check if category exists if it's being updated (FR016)
    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            throw new AppError("Product-Category Integrity failed: Category does not exist", 400);
        }
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('category');

    if (!product) {
        throw new AppError("Product not found", 404);
    }
    res.status(200).json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({ success: true, data: {} });
});

export { createProduct, getProducts, getProductById, updateProduct, deleteProduct };