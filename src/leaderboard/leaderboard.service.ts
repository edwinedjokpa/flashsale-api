import { Inject, Service } from 'typedi';
import { ClientSession } from 'mongoose';
import { Http } from '@status/codes';

import { ILeaderboard } from './leaderboard.schema';
import { LeaderboardModel } from './leaderboard.model';
import { HttpException } from '../common/utils/http.exception';
import { CreateLeaderboardDto } from './dtos/leaderboard.dto';

@Service()
export class LeaderboardService {
  constructor(@Inject() private leaderboardModel: LeaderboardModel) {}

  async addToLeaderboard(
    createLeaderboardDto: CreateLeaderboardDto,
    session: ClientSession
  ): Promise<ILeaderboard> {
    const newLeaderboard = await this.leaderboardModel.save(
      { ...createLeaderboardDto, purchasedTime: new Date() },
      session
    );

    if (!newLeaderboard) {
      throw new HttpException(Http.BadRequest, 'Failed to add to leaderboard');
    }

    return newLeaderboard;
  }

  async getLeaderboard(): Promise<ILeaderboard[]> {
    return this.leaderboardModel.getAll();
  }

  async getLeaderboardByFlashSaleId(flashSaleId: string) {
    return this.leaderboardModel.getByFlashSaleId(flashSaleId);
  }
}
