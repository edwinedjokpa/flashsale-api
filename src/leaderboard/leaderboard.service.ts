import { Types } from "mongoose";
import { leaderboardRepository } from "./leaderboard.respository";
import { ILeaderboard } from "./leaderboard.schema";

class LeaderboardService {
  async addToLeaderboard(userId: string): Promise<ILeaderboard> {
    return leaderboardRepository.create({ userId, purchasedTime: new Date() });
  }

  async getLeaderboard(): Promise<ILeaderboard[]> {
    return leaderboardRepository.getAll();
  }
}

export const leaderboardService = new LeaderboardService();
