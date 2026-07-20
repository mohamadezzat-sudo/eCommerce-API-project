import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData = {
    ...req.body,
    categoryId: new mongoose.Types.ObjectId(req.body.categoryId)
  };

  const product = await Product.create(productData);
  res.status(201).json({ success: true, data: product });
});

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const filter: any = {};

  if (req.query.categoryId) {
    if (!mongoose.Types.ObjectId.isValid(req.query.categoryId as string)) {
      throw new AppError("Invalid Category ID format", 400);
    }
    filter.categoryId = new mongoose.Types.ObjectId(req.query.categoryId as string);
  }

  const products = await Product.find(filter).populate('categoryId');
  res.status(200).json({ success: true, data: products });
});

const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('categoryId');
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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