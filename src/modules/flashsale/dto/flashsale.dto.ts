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

export const flashSaleParamsSchema = z.object({
  flashSaleId: z.string(),
});

export const flashSaleQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateFlashSaleDto = z.infer<typeof createFlashSaleSchema>;
export type UpdateFlashSaleDto = z.infer<typeof updateFlashSaleSchema>;
export type FlashSaleParamsDto = z.infer<typeof flashSaleParamsSchema>;
export type FlashSaleQueryDto = z.infer<typeof flashSaleQuerySchema>;
