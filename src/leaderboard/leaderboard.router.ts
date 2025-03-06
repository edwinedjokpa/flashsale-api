import { Router } from "express";
import { LeaderboardController } from "./leaderboard.controller";
import { Inject, Service } from "typedi";

const router = Router();

@Service()
export class LeaderboardRouter {
  constructor(@Inject() private leaderboardController: LeaderboardController) {}

  public getRouter(): Router {
    const router = Router();

    router.get(
      "/",
      this.leaderboardController.getLeaderboard.bind(this.leaderboardController)
    );

    return router;
  }
}

// Export the router
export default (container: any) => container.get(LeaderboardRouter).getRouter();
