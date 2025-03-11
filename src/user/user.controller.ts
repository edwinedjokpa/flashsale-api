import { Response } from 'express';
import { Http } from '@status/codes';

import { UserService } from './user.service';
import { createResponse } from '../common/utils/response';
import { RequestWithUser } from './interfaces/user.inteface';
import { Inject, Service } from 'typedi';
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

      const user = await this.userService.dashboard(req.user.id);

      return res
        .status(Http.Ok)
        .json(
          createResponse(
            true,
            Http.Ok,
            'User dashboard data fetched successfully',
            { user }
          )
        );
    }
  );
}
