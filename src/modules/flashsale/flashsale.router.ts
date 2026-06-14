import { Router } from 'express';
import { inject, injectable } from 'inversify';

import {
  createFlashSaleSchema,
  flashSaleParamsSchema,
  updateFlashSaleSchema,
} from './dto/flashsale.dto';
import { FlashSaleController } from './flashsale.controller';

import { authMiddleware } from '@/common/middlewares/auth.middleware';
import { validateRequest } from '@/common/middlewares/validation.middleware';

@injectable()
export class FlashSaleRouter {
  constructor(
    @inject(FlashSaleController)
    private readonly controller: FlashSaleController
  ) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/',
      validateRequest({ body: createFlashSaleSchema }),
      this.controller.createFlashSale.bind(this.controller)
    );

    router.get('/', this.controller.getFlashSales.bind(this.controller));

    router.get(
      '/:flashSaleId',
      validateRequest({ params: flashSaleParamsSchema }),
      this.controller.getFlashSale.bind(this.controller)
    );

    router.put(
      '/:flashSaleId',
      validateRequest({
        params: flashSaleParamsSchema,
        body: updateFlashSaleSchema,
      }),
      this.controller.updateFlashSale.bind(this.controller)
    );

    router.delete(
      '/:flashSaleId',
      validateRequest({ params: flashSaleParamsSchema }),
      this.controller.deleteFlashSale.bind(this.controller)
    );

    router.post(
      '/:flashSaleId/purchase',
      validateRequest({ params: flashSaleParamsSchema }),
      authMiddleware,
      this.controller.purchaseProduct.bind(this.controller)
    );

    router.get(
      '/:flashSaleId/leaderboard',
      validateRequest({ params: flashSaleParamsSchema }),
      this.controller.getFlashSaleLeaderboard.bind(this.controller)
    );

    return router;
  }
}
