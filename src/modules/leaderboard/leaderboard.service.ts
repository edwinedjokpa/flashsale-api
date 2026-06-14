import { inject, injectable } from 'inversify';
import { ClientSession } from 'mongoose';

import { CreateLeaderboardDto } from './dto/leaderboard.dto';
import Leaderboard from './leaderboard.model';
import { LeaderboardQuery } from './leaderboard.query';

import { createSuccessResponse } from '@/common/utils/response';

@injectable()
export class LeaderboardService {
  constructor(
    @inject(LeaderboardQuery)
    private readonly leaderboardQuery: LeaderboardQuery
  ) {}

  async addToLeaderboard(data: CreateLeaderboardDto, session: ClientSession) {
    const leaderboard = await Leaderboard.create([
      { ...data, purchasedTime: new Date() },
      session,
    ]);

    return createSuccessResponse('Leaderboard added successfully', {
      leaderboard: leaderboard[0],
    });
  }

  async getLeaderboard() {
    const leaderboard = await this.leaderboardQuery.getAll();

    return createSuccessResponse('Leaderboard retrieved successfully', {
      leaderboard,
    });
  }

  async getLeaderboardByFlashSaleId(flashSaleId: string) {
    return this.leaderboardQuery.getByFlashSaleId(flashSaleId);
  }

  async getLeaderboardForFlashSale(flashSaleId: string) {
    return this.leaderboardQuery.getLeaderboardByFlashSaleId(flashSaleId);
  }
}
