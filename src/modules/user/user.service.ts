import { Http } from '@status/codes';
import { injectable } from 'inversify';

import User from './user.model';

import { HttpException } from '@/common/utils/http.exception';
import { createSuccessResponse } from '@/common/utils/response';

@injectable()
export class UserService {
  constructor() {}

  async profile(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpException(Http.NotFound, 'User not found');
    }

    return createSuccessResponse('User profile data fetched successfully', {
      user,
    });
  }
}
