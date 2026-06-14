import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'name must be at least 3 characters long')
    .max(100, 'name cannot exceed 100 characters'),
  price: z.number().positive('price must be a positive number'),
  stock: z.number().int().min(0, 'stock cannot be negative'),
});

export const updateProductSchema = createProductSchema.partial();

export const restockProductSchema = z.object({
  stock: z.number().int().min(1, 'stock must be at least 1'),
});

export const productParamsSchema = z.object({
  productId: z.string(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type RestockProductDto = z.infer<typeof restockProductSchema>;
export type ProductParamsDto = z.infer<typeof productParamsSchema>;
