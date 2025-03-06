import { z } from "zod";

// Create Product DTO
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "name must be at least 3 characters long")
    .max(100, "name cannot exceed 100 characters"),
  price: z.number().positive("price must be a positive number"),
  stock: z.number().int().min(0, "stock cannot be negative"),
  saleStartTime: z.string().datetime({ offset: true }),
  saleEndTime: z.string().datetime({ offset: true }).optional(),
});

export const restockProductSchema = z.object({
  stock: z.number().int().min(1, "stock must be at least 1"),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
