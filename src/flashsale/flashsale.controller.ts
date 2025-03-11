import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { Http } from '@status/codes';

import { FlashSaleService } from './flashsale.service';
import { createFlashSaleSchema } from './dtos/flashsale.dto';
import { createResponse } from '../common/utils/response';
import catchAsync from '../common/utils/catch-async';
import { RequestWithUser } from '../user/interfaces/user.inteface';

@Service()
export class FlashSaleController {
  constructor(@Inject() private flashSaleService: FlashSaleService) {}

  // Create a flash sale event
  public createFlashSale = catchAsync(async (req: Request, res: Response) => {
    const parseResult = createFlashSaleSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          createResponse(
            false,
            Http.BadRequest,
            'Validation failed',
            parseResult.error.format()
          )
        );
    }

    const createFlashSaleDto = parseResult.data;
    const flashSale =
      await this.flashSaleService.createFlashSale(createFlashSaleDto);
    return res.status(Http.Created).json(
      createResponse(
        true,
        Http.Created,
        'Flash sale event created successfully',
        {
          flashSale,
        }
      )
    );
  });

  // Get flash sale events
  public getFlashSales = catchAsync(async (req: Request, res: Response) => {
    const flashSales = await this.flashSaleService.getFlashSales();
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Flash sales fetched successfully', {
        flashSales,
      })
    );
  });

  // Get a flash sale event
  public getFlashSale = catchAsync(async (req: Request, res: Response) => {
    const flashSaleId = req.params.flashSaleId;
    const flashSale = await this.flashSaleService.getFlashSale(flashSaleId);
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Flash sale fetched successfully', {
        flashSale,
      })
    );
  });

  // Update a flash sale event
  public updateFlashSale = catchAsync(async (req: Request, res: Response) => {
    const flashSaleId = req.params.flashSaleId;
    const updateFlashSaleDto = req.body;
    const flashSale = await this.flashSaleService.updateFlashSale(
      flashSaleId,
      updateFlashSaleDto
    );
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Flash sale updated successfully', {
        flashSale,
      })
    );
  });

  // Delete a flash sale event
  public deleteFlashSale = catchAsync(async (req: Request, res: Response) => {
    const flashSaleId = req.params.flashSaleId;
    await this.flashSaleService.deleteFlashSale(flashSaleId);
    return res
      .status(Http.Ok)
      .json(createResponse(true, Http.Ok, 'Flash sale deleted successfully'));
  });

  // Purchase a product
  public purchaseProduct = catchAsync(
    async (req: RequestWithUser, res: Response) => {
      const flashSaleId = req.params.flashSaleId;

      if (!req.user) {
        return res
          .status(Http.Unauthorized)
          .json(
            createResponse(false, Http.Unauthorized, 'User not authenticated')
          );
      }

      const flashSale = await this.flashSaleService.purchaseProduct(
        flashSaleId,
        req.user.id
      );

      return res.status(Http.Ok).json(
        createResponse(true, Http.Ok, 'Product purchase successful', {
          flashSale,
        })
      );
    }
  );

  // Get a flash sale event leaderboard data
  public getFlashSaleLeaderboard = catchAsync(
    async (req: Request, res: Response) => {
      const flashSaleId = req.params.flashSaleId;
      const leaderboard =
        await this.flashSaleService.getFlashSaleLeaderboard(flashSaleId);
      return res.status(Http.Ok).json(
        createResponse(true, Http.Ok, 'Leaderboard data fetched successfully', {
          leaderboard,
        })
      );
    }
  );
}
