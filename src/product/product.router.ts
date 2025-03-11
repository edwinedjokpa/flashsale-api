import { Router } from 'express';
import { Container, Inject, Service } from 'typedi';

import { ProductController } from './product.controller';

@Service()
export class ProductRouter {
  constructor(@Inject() private productController: ProductController) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/',
      this.productController.createProduct.bind(this.productController)
    );
    router.get(
      '/',
      this.productController.getProducts.bind(this.productController)
    );
    router.get(
      '/:productId',
      this.productController.getProduct.bind(this.productController)
    );
    router.put(
      '/:productId',
      this.productController.updateProduct.bind(this.productController)
    );
    router.delete(
      '/:productId',
      this.productController.deleteProduct.bind(this.productController)
    );
    router.put(
      '/:productId/restock',
      this.productController.restockProduct.bind(this.productController)
    );

    return router;
  }
}

// Export the router
export default () => Container.get(ProductRouter).getRouter();
