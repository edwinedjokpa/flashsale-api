import { Inject, Service } from "typedi";

import { ILeaderboard } from "./leaderboard.schema";
import { LeaderboardModel } from "./leaderboard.model";
import { ClientSession } from "mongoose";
import { ICreateLeaderboard } from "./interfaces/leaderboard.interface";

@Service()
export class LeaderboardService {
  constructor(@Inject() private leaderboardModel: LeaderboardModel) {}

  async addToLeaderboard(
    userId: string,
    productId: string,
    session: ClientSession
  ): Promise<ILeaderboard> {
    const data: ICreateLeaderboard = {
      userId,
      productId,
      purchasedTime: new Date(),
    };

    return this.leaderboardModel.create(data, session);
  }

  async getLeaderboard(): Promise<ILeaderboard[]> {
    return this.leaderboardModel.getAll();
  }
}
