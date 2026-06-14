import { Http } from '@status/codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { LeaderboardService } from './leaderboard.service';

import catchAsync from '@/common/utils/catch-async';

@injectable()
export class LeaderboardController {
  constructor(
    @inject(LeaderboardService)
    private readonly leaderboardService: LeaderboardService
  ) {}

  getLeaderboard = catchAsync(async (req: Request, res: Response) => {
    const response = await this.leaderboardService.getLeaderboard();
    return res.status(Http.Ok).json(response);
  });
}
