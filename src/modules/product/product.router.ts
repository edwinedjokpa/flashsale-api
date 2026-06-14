import { Router } from 'express';
import { inject, injectable } from 'inversify';

import {
  createProductSchema,
  productParamsSchema,
  restockProductSchema,
  updateProductSchema,
} from './dto/product.dto';
import { ProductController } from './product.controller';

import { validateRequest } from '@/common/middlewares/validation.middleware';

@injectable()
export class ProductRouter {
  constructor(
    @inject(ProductController)
    private readonly controller: ProductController
  ) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/',
      validateRequest({ body: createProductSchema }),
      this.controller.createProduct.bind(this.controller)
    );

    router.get('/', this.controller.getProducts.bind(this.controller));

    router.get(
      '/:productId',
      validateRequest({ params: productParamsSchema }),
      this.controller.getProduct.bind(this.controller)
    );

    router.put(
      '/:productId',
      validateRequest({
        params: productParamsSchema,
        body: updateProductSchema,
      }),
      this.controller.updateProduct.bind(this.controller)
    );

    router.delete(
      '/:productId',
      validateRequest({ params: productParamsSchema }),
      this.controller.deleteProduct.bind(this.controller)
    );

    router.put(
      '/:productId/restock',
      validateRequest({
        params: productParamsSchema,
        body: restockProductSchema,
      }),
      this.controller.restockProduct.bind(this.controller)
    );

    return router;
  }
}
