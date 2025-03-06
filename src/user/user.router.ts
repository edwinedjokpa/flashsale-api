import { Router } from "express";
import { Inject, Service } from "typedi";
import { UserController } from "./user.controller";
import { authMiddleware } from "../common/middlewares/auth.middleware";

@Service()
export class UserRouter {
  constructor(@Inject() private userController: UserController) {}

  public getRouter(): Router {
    const router = Router();

    router.get(
      "/dashboard",
      authMiddleware,
      this.userController.getDashboard.bind(this.userController)
    );

    return router;
  }
}

// Export the router
export default (container: any) => container.get(UserRouter).getRouter();
