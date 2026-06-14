import { Http } from '@status/codes';
import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { RequestData } from 'types/request-data';

import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

import catchAsync from '@/common/utils/catch-async';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService)
    private readonly authService: AuthService
  ) {}

  public register = catchAsync(
    async (req: RequestData<unknown, RegisterUserDto>, res: Response) => {
      const { body } = req.validated;

      const response = await this.authService.register(body);
      return res.status(Http.Created).json(response);
    }
  );

  public login = catchAsync(
    async (req: RequestData<unknown, LoginUserDto>, res: Response) => {
      const { body } = req.validated;

      const response = await this.authService.login(body);
      return res.status(Http.Ok).json(response);
    }
  );
}
