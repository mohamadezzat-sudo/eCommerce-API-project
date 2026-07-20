import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be a positive number"),
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format"),
});