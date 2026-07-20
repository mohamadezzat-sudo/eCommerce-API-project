import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  // Use req.body directly; Mongoose handles the string-to-ObjectId conversion automatically
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