import { Service } from 'typedi';

import Leaderboard, { ILeaderboard } from './leaderboard.schema';
import { ClientSession, Types } from 'mongoose';
import { CreateLeaderboardDto } from './dtos/leaderboard.dto';

@Service()
export class LeaderboardModel {
  async save(
    createLeaderboardDto: CreateLeaderboardDto,
    session?: ClientSession
  ): Promise<ILeaderboard> {
    const createdLeaderboard = await Leaderboard.create(
      [createLeaderboardDto],
      { session }
    );
    return createdLeaderboard[0];
  }

  async getAll(): Promise<ILeaderboard[]> {
    return Leaderboard.aggregate([
      {
        $group: {
          _id: '$flashSaleId',
          productId: { $first: '$productId' },
          rankings: {
            $push: {
              userId: '$userId',
              purchasedTime: '$purchasedTime',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'rankings.userId',
          foreignField: '_id',
          as: 'users',
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
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $project: {
          flashSaleId: '$_id', // Include the flashSaleId
          productName: { $arrayElemAt: ['$product.name', 0] },
          rankings: {
            $map: {
              input: '$rankings',
              as: 'entry',
              in: {
                purchasedTime: '$$entry.purchasedTime',
                userId: '$$entry.userId',
                email: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$users',
                        as: 'user',
                        cond: { $eq: ['$$user._id', '$$entry.userId'] },
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
          flashSaleId: 1,
          productName: 1,
          rankings: {
            $map: {
              input: '$rankings',
              as: 'entry',
              in: {
                purchasedTime: '$$entry.purchasedTime',
                userId: '$$entry.userId',
                email: '$$entry.email.email',
              },
            },
          },
        },
      },
      {
        $project: {
          flashSaleId: 1,
          productName: 1,
          rankings: {
            $sortArray: {
              input: '$rankings',
              sortBy: { purchasedTime: 1 },
            },
          },
        },
      },
    ]);
  }

  async getByFlashSaleId(flashSaleId: string) {
    const flashSaleObjectId = new Types.ObjectId(flashSaleId);

    const data = await Leaderboard.aggregate([
      {
        $match: { flashSaleId: flashSaleObjectId },
      },
      {
        $group: {
          _id: '$flashSaleId',
          productId: { $first: '$productId' },
          rankings: {
            $push: {
              userId: '$userId',
              purchasedTime: '$purchasedTime',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'rankings.userId',
          foreignField: '_id',
          as: 'users',
          pipeline: [
            {
              $project: {
                email: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $project: {
          flashSaleId: '$_id',
          productName: { $arrayElemAt: ['$product.name', 0] },
          rankings: {
            $map: {
              input: '$rankings',
              as: 'entry',
              in: {
                purchasedTime: '$$entry.purchasedTime',
                userId: '$$entry.userId',
                email: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$users',
                        as: 'user',
                        cond: { $eq: ['$$user._id', '$$entry.userId'] },
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
          flashSaleId: 1,
          productName: 1,
          rankings: {
            $sortArray: {
              input: '$rankings',
              sortBy: { purchasedTime: 1 },
            },
          },
        },
      },
    ]);

    const cleanData = data.map(
      (entry: {
        flashSaleId: string;
        productName: string;
        rankings: {
          userId: string;
          email: { email: string };
          purchasedTime: string;
        }[];
      }) => ({
        flashSaleId: entry.flashSaleId,
        productName: entry.productName,
        rankings: entry.rankings.map(
          (ranking: {
            purchasedTime: string;
            userId: string;
            email: { email: string };
          }) => ({
            purchasedTime: ranking.purchasedTime,
            userId: ranking.userId,
            email: ranking.email.email,
          })
        ),
      })
    );

    return cleanData;
  }

  startSession() {
    return Leaderboard.startSession();
  }
}
