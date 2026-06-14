import { Http } from '@status/codes';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import catchAsync from '../../common/utils/catch-async';
import AppResponse from '../../common/utils/response';
import { createUserSchema } from '../user/dtos/user.dto';
import { AuthService } from './auth.service';
import { loginUserSchema } from './dtos/auth.dto';

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
