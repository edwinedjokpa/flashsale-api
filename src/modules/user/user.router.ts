import { Router } from 'express';
import { inject, injectable } from 'inversify';

import { UserController } from './user.controller';

import { authMiddleware } from '@/common/middlewares/auth.middleware';

@injectable()
export class UserRouter {
  constructor(
    @inject(UserController)
    private readonly controller: UserController
  ) {}

  public getRouter(): Router {
    const router = Router();

    router.get(
      '/',
      authMiddleware,
      this.controller.profile.bind(this.controller)
    );

    return router;
  }
}
