import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .min(3, 'Category name must be at least 3 characters long'),
    slug: z
      .string()
      .optional()
      .transform((val) => val?.toLowerCase().replace(/\s+/g, '-')),
    description: z.string().optional(),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];