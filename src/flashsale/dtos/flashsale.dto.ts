import { z } from 'zod';

export const createFlashSaleSchema = z.object({
  productId: z.string(),
  discountPrice: z
    .number()
    .min(0, { message: 'Discount price must be greater than or equal to 0' }),
  soldUnits: z.number().optional(),
  remainingUnits: z.number().optional(),
  saleStartTime: z.string().datetime({ offset: true }),
  purchasedUsers: z.array(z.string()).optional(),
});

export type CreateFlashSaleDto = z.infer<typeof createFlashSaleSchema>;
