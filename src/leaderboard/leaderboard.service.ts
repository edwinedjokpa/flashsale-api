import { Inject, Service } from "typedi";
import { ClientSession } from "mongoose";
import { Http } from "@status/codes";

import { ILeaderboard } from "./leaderboard.schema";
import { LeaderboardModel } from "./leaderboard.model";
import { ICreateLeaderboard } from "./interfaces/leaderboard.interface";
import { HttpException } from "../common/utils/http.exception";

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

    const newLeaderboard = await this.leaderboardModel.create(data, session);
    if (!newLeaderboard) {
      throw new HttpException(Http.BadRequest, "Failed to add to leaderboard");
    }

    return newLeaderboard;
  }

  async getLeaderboard(): Promise<ILeaderboard[]> {
    return this.leaderboardModel.getAll();
  }
}
