import { Inject, Service } from 'typedi';
import { ClientSession } from 'mongoose';
import { Http } from '@status/codes';

import { LeaderboardModel } from './leaderboard.model';
import { HttpException } from '../common/utils/http.exception';
import { CreateLeaderboardDto } from './dtos/leaderboard.dto';
import AppResponse from '../common/utils/response';

@Service()
export class LeaderboardService {
  constructor(@Inject() private leaderboardModel: LeaderboardModel) {}

  async addToLeaderboard(
    createLeaderboardDto: CreateLeaderboardDto,
    session: ClientSession
  ) {
    const newLeaderboard = await this.leaderboardModel.save(
      { ...createLeaderboardDto, purchasedTime: new Date() },
      session
    );

    if (!newLeaderboard) {
      throw new HttpException(Http.BadRequest, 'Failed to add to leaderboard');
    }

    const data = { leaderboard: newLeaderboard };
    return AppResponse.Success('Leaderboard added successfully', data);
  }

  async getLeaderboard() {
    const leaderboard = await this.leaderboardModel.getAll();

    const data = { leaderboard };
    return AppResponse.Success('Leaderboard retrieved successfully', data);
  }

  async getLeaderboardByFlashSaleId(flashSaleId: string) {
    return this.leaderboardModel.getByFlashSaleId(flashSaleId);
  }

  async getLeaderboardForFlashSale(flashSaleId: string) {
    return this.leaderboardModel.getLeaderboardByFlashSaleId(flashSaleId);
  }
}
