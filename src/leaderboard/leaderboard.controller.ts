import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import { Http } from '@status/codes';
import { LeaderboardService } from './leaderboard.service';
import catchAsync from '../common/utils/catch-async';

@Service()
export class LeaderboardController {
  constructor(@Inject() private leaderboardService: LeaderboardService) {}

  getLeaderboard = catchAsync(async (req: Request, res: Response) => {
    const response = await this.leaderboardService.getLeaderboard();
    return res.status(Http.Ok).json(response);
  });
}
