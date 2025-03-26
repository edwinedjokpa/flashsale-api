import { z } from 'zod';

export const createFlashSaleSchema = z.object({
  productId: z.string(),
  discountPrice: z
    .number()
    .min(0, { message: 'Discount price must be greater than or equal to 0' }),
  soldUnits: z.number().optional(),
  remainingUnits: z.number().optional(),
  saleStartTime: z.string().datetime({ offset: true }),
});

export const updateFlashSaleSchema = z.object({
  discountPrice: z
    .number()
    .min(0, { message: 'Discount price must be greater than or equal to 0' })
    .optional(),
  soldUnits: z.number().optional(),
  remainingUnits: z.number().optional(),
  saleStartTime: z.string().datetime({ offset: true }),
});

export type CreateFlashSaleDto = z.infer<typeof createFlashSaleSchema>;
export type UpdateFlashSaleDto = z.infer<typeof updateFlashSaleSchema>;
