import { Service } from "typedi";
import { ICreateLeaderboard } from "./interfaces/leaderboard.interface";
import Leaderboard, { ILeaderboard } from "./leaderboard.schema";
import { ClientSession } from "mongoose";

@Service()
class LeaderboardModel {
  async create(
    data: ICreateLeaderboard,
    session?: ClientSession
  ): Promise<ILeaderboard> {
    const createdLeaderboard = await Leaderboard.create([data], { session });
    return createdLeaderboard[0];
  }
  async getAll(): Promise<ILeaderboard[]> {
    return Leaderboard.aggregate([
      {
        $group: {
          _id: "$productId",
          rankings: {
            $push: {
              userId: "$userId",
              purchasedTime: "$purchasedTime",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "rankings.userId",
          foreignField: "_id",
          as: "users",
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          productId: "$_id",
          rankings: {
            $map: {
              input: "$rankings",
              as: "entry",
              in: {
                purchasedTime: "$$entry.purchasedTime",
                userId: "$$entry.userId",
                email: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$users",
                        as: "user",
                        cond: { $eq: ["$$user._id", "$$entry.userId"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
          _id: 0,
        },
      },
      {
        $project: {
          productId: 1,
          rankings: {
            $map: {
              input: "$rankings",
              as: "entry",
              in: {
                purchasedTime: "$$entry.purchasedTime",
                userId: "$$entry.userId",
                email: "$$entry.email.email",
              },
            },
          },
        },
      },
      {
        $project: {
          productId: 1,
          rankings: {
            $sortArray: {
              input: "$rankings",
              sortBy: { purchasedTime: 1 },
            },
          },
        },
      },
    ]);
  }

  startSession() {
    return Leaderboard.startSession();
  }
}

export { LeaderboardModel };
