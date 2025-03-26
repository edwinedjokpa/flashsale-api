import { Response } from 'express';
import { Http } from '@status/codes';
import { Inject, Service } from 'typedi';

import { UserService } from './user.service';
import { RequestWithUser } from './interfaces/user.inteface';
import { HttpException } from '../common/utils/http.exception';
import catchAsync from '../common/utils/catch-async';

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  public getDashboard = catchAsync(
    async (req: RequestWithUser, res: Response) => {
      if (!req.user) {
        throw new HttpException(Http.Unauthorized, 'User not authenticated');
      }

      const response = await this.userService.dashboard(req.user.id);

      return res.status(Http.Ok).json(response);
    }
  );
}
