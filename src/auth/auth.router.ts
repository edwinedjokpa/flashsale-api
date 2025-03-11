import { Router } from 'express';
import { Container, Inject, Service } from 'typedi';
import { AuthController } from './auth.controller';

@Service()
export class AuthRouter {
  constructor(@Inject() private authController: AuthController) {}

  public getRouter(): Router {
    const router = Router();

    router.post(
      '/register',
      this.authController.register.bind(this.authController)
    );

    router.post('/login', this.authController.login.bind(this.authController));

    return router;
  }
}

// Export the router
export default () => Container.get(AuthRouter).getRouter();
