import { z } from 'zod';

export const createLeaderboardSchema = z.object({
  flashSaleId: z.string(),
  userId: z.string(),
  productId: z.string(),
  purchasedTime: z.date().optional(),
});

export type CreateLeaderboardDto = z.infer<typeof createLeaderboardSchema>;
