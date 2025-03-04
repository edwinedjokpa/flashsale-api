import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../common/middlewares/auth.middleware";
import { Inject, Service } from "typedi";

const router = Router();

@Service()
export class ProductRouter {
  constructor(@Inject() private productController: ProductController) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      "/",
      this.productController.createProduct.bind(this.productController)
    );
    router.get(
      "/",
      this.productController.getProducts.bind(this.productController)
    );
    router.post(
      "/purchase",
      authMiddleware,
      this.productController.purchaseProduct.bind(this.productController)
    );

    return router;
  }
}

// Export the router
export default (container: any) => container.get(ProductRouter).getRouter();
