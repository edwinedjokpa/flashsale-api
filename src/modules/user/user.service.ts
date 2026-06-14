import { injectable } from 'inversify';

import User from './user.model';

import { NotFoundException } from '@/common/exceptions';
import { createSuccessResponse } from '@/common/utils/api-response';

@injectable()
export class UserService {
  constructor() {}

  async profile(userId: string) {
    const user = await User.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    return createSuccessResponse('User profile data fetched successfully', {
      user: { id: user.id, email: user.email },
    });
  }
}
