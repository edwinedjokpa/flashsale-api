import { ICreateLeaderboard } from "./interface/leaderboard.interface";
import Leaderboard, { ILeaderboard } from "./leaderboard.schema";

class LeaderboardRepository {
  async create(data: ICreateLeaderboard): Promise<ILeaderboard> {
    const leaderboardEntry = new Leaderboard({
      userId: data.userId,
      purchaseTime: data.purchasedTime,
    });

    return leaderboardEntry.save();
  }

  async getAll(): Promise<ILeaderboard[]> {
    return Leaderboard.find()
      .sort({ purchaseTime: 1 })
      .populate("userId", "name");
  }

  startSession() {
    return Leaderboard.startSession();
  }
}

export const leaderboardRepository = new LeaderboardRepository();
