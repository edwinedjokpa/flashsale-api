import { Http } from '@status/codes';
import { injectable } from 'inversify';

import User from './user.schema';

import { HttpException } from '@/common/utils/http.exception';
import AppResponse from '@/common/utils/response';

@injectable()
export class UserService {
  constructor() {}

  async profile(userId: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpException(Http.NotFound, 'User not found');
    }

    return AppResponse.Success('User profile data fetched successfully', {
      user,
    });
  }
}
