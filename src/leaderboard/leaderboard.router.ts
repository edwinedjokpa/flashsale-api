import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';
import { Container, Inject, Service } from 'typedi';

@Service()
export class LeaderboardRouter {
  constructor(@Inject() private leaderboardController: LeaderboardController) {}

  public getRouter(): Router {
    const router = Router();

    router.get(
      '/',
      this.leaderboardController.getLeaderboard.bind(this.leaderboardController)
    );

    return router;
  }
}

// Export the router
export default () => Container.get(LeaderboardRouter).getRouter();
