import { Application, Router } from "express";
import { productController } from "./product.controller";
import { authMiddleware } from "../common/middlewares/auth.middleware";

const router = Router();

router.post("/", productController.createProduct as unknown as Application);
router.get("/", productController.getProducts as unknown as Application);
router.post(
  "/purchase",
  authMiddleware,
  productController.purchaseProduct as unknown as Application
);

export default router;
