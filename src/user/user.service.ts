import { Http } from '@status/codes';
import { Inject, Service } from 'typedi';

import { UserModel } from './user.model';
import { HttpException } from '../common/utils/http.exception';
import AppResponse from '../common/utils/response';

@Service()
export class UserService {
  constructor(@Inject() private userModel: UserModel) {}

  async dashboard(userId: string) {
    const user = await this.userModel.findOne(userId);

    if (!user) {
      throw new HttpException(Http.NotFound, 'User not found');
    }

    const data = { user };

    return AppResponse.Success(
      'User dashboard data fetched successfully',
      data
    );
  }
}
