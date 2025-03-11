import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import { Http } from '@status/codes';
import { LeaderboardService } from './leaderboard.service';
import { createResponse } from '../common/utils/response';
import catchAsync from '../common/utils/catch-async';

@Service()
export class LeaderboardController {
  constructor(@Inject() private leaderboardService: LeaderboardService) {}

  getLeaderboard = catchAsync(async (req: Request, res: Response) => {
    const leaderboard = await this.leaderboardService.getLeaderboard();
    res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Leaderboard data fetched successfully', {
        leaderboard,
      })
    );
  });
}
