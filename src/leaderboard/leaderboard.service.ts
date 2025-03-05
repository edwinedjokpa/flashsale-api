import { Inject, Service } from "typedi";

import { ILeaderboard } from "./leaderboard.schema";
import { LeaderboardModel } from "./leaderboard.model";

@Service()
export class LeaderboardService {
  constructor(@Inject() private leaderboardModel: LeaderboardModel) {}

  async addToLeaderboard(userId: string): Promise<ILeaderboard> {
    return this.leaderboardModel.create({
      userId,
      purchasedTime: new Date(),
    });
  }

  async getLeaderboard(): Promise<ILeaderboard[]> {
    return this.leaderboardModel.getAll();
  }
}
