import { Router } from 'express';
import { inject, injectable } from 'inversify';

import { AuthController } from './auth.controller';
import { loginUserSchema, registerUserSchema } from './dto/auth.dto';

import { validateRequest } from '@/common/middlewares/validation.middleware';

@injectable()
export class AuthRouter {
  constructor(
    @inject(AuthController)
    private readonly controller: AuthController
  ) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/register',
      validateRequest({ body: registerUserSchema }),
      this.controller.register.bind(this.controller)
    );

    router.post(
      '/login',
      validateRequest({ body: loginUserSchema }),
      this.controller.login.bind(this.controller)
    );

    return router;
  }
}
