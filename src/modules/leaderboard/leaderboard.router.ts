import { Router } from 'express';
import { inject, injectable } from 'inversify';

import { LeaderboardController } from './leaderboard.controller';

@injectable()
export class LeaderboardRouter {
  constructor(
    @inject(LeaderboardController)
    private readonly controller: LeaderboardController
  ) {}

  public getRouter(): Router {
    const router = Router();

    router.get('/', this.controller.getLeaderboard.bind(this.controller));

    return router;
  }
}
