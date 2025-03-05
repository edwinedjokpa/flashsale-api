import { Service } from "typedi";
import { ICreateLeaderboard } from "./interface/leaderboard.interface";
import Leaderboard, { ILeaderboard } from "./leaderboard.schema";

@Service()
class LeaderboardModel {
  async create(data: ICreateLeaderboard): Promise<ILeaderboard> {
    return Leaderboard.create(data);
  }

  async getAll(): Promise<ILeaderboard[]> {
    return Leaderboard.find()
      .sort({ purchaseTime: 1 })
      .populate("userId", "firstName lastName email");
  }

  startSession() {
    return Leaderboard.startSession();
  }
}

export { LeaderboardModel };
