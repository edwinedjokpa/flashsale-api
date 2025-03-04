import { Application, Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register as unknown as Application);
router.post("/login", authController.login as unknown as Application);

export default router;
