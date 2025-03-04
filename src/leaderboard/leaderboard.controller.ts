import { NextFunction, Request, Response } from "express";
import { Http } from "@status/codes";

import { leaderboardService } from "./leaderboard.service";
import { createResponse } from "../common/utils/response";

class LeaderboardController {
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const leaderboard = await leaderboardService.getLeaderboard();
      res.status(Http.Ok).json(
        createResponse(true, Http.Ok, "Leaderboard data fetched successfully", {
          leaderboard,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
