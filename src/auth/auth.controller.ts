import { Request, Response } from 'express';
import { Http } from '@status/codes';
import { Service } from 'typedi';
import { AuthService } from './auth.service';
import { createUserSchema } from '../user/dtos/user.dto';
import { loginUserSchema } from './dtos/auth.dto';
import catchAsync from '../common/utils/catch-async';
import AppResponse from '../common/utils/response';

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  public register = catchAsync(async (req: Request, res: Response) => {
    const parseResult = createUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const createUserDto = parseResult.data;
    const response = await this.authService.register(createUserDto);
    return res.status(Http.Created).json(response);
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const parseResult = loginUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const loginUserDto = parseResult.data;
    const response = await this.authService.login(loginUserDto);
    return res.status(Http.Ok).json(response);
  });
}
