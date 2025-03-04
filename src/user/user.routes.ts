import { Application, Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../common/middlewares/auth.middleware";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  userController.getDashboard as unknown as Application
);

export default router;
