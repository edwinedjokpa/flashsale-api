import { Router } from 'express';
import { Container, Inject, Service } from 'typedi';

import { FlashSaleController } from './flashsale.controller';
import { authMiddleware } from '../common/middlewares/auth.middleware';

@Service()
export class FlashSaleRouter {
  constructor(@Inject() private flashSaleController: FlashSaleController) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/',
      this.flashSaleController.createFlashSale.bind(this.flashSaleController)
    );

    router.get(
      '/',
      this.flashSaleController.getFlashSales.bind(this.flashSaleController)
    );

    router.get(
      '/:flashSaleId',
      this.flashSaleController.getFlashSale.bind(this.flashSaleController)
    );

    router.put(
      '/:flashSaleId',
      this.flashSaleController.updateFlashSale.bind(this.flashSaleController)
    );

    router.delete(
      '/:flashSaleId',
      this.flashSaleController.deleteFlashSale.bind(this.flashSaleController)
    );

    router.post(
      '/:flashSaleId/purchase',
      authMiddleware,
      this.flashSaleController.purchaseProduct.bind(this.flashSaleController)
    );

    router.get(
      '/:flashSaleId/leaderboard',
      this.flashSaleController.getFlashSaleLeaderboard.bind(
        this.flashSaleController
      )
    );

    return router;
  }
}

// Export the router
export default () => Container.get(FlashSaleRouter).getRouter();
