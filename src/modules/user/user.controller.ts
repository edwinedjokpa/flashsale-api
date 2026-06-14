import { Http } from '@status/codes';
import { Response } from 'express';
import { inject, injectable } from 'inversify';

import { AuthenticatedRequest } from './interfaces/user.inteface';
import { UserService } from './user.service';

import catchAsync from '@/common/utils/catch-async';

@injectable()
export class UserController {
  constructor(
    @inject(UserService)
    private readonly userService: UserService
  ) {}

  public profile = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const user = req.user;

      const result = await this.userService.profile(user.id);
      return res.status(Http.Ok).json(result);
    }
  );
}
