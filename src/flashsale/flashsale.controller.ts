import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { Http } from '@status/codes';

import { FlashSaleService } from './flashsale.service';
import {
  createFlashSaleSchema,
  updateFlashSaleSchema,
} from './dtos/flashsale.dto';
import AppResponse from '../common/utils/response';
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
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const createFlashSaleDto = parseResult.data;
    const response =
      await this.flashSaleService.createFlashSale(createFlashSaleDto);
    return res.status(Http.Created).json(response);
  });

  // Get flash sale events
  public getFlashSales = catchAsync(async (req: Request, res: Response) => {
    const response = await this.flashSaleService.getFlashSales();
    return res.status(Http.Ok).json(response);
  });

  // Get a flash sale event
  public getFlashSale = catchAsync(async (req: Request, res: Response) => {
    const flashSaleId = req.params.flashSaleId;

    const response = await this.flashSaleService.getFlashSale(flashSaleId);
    return res.status(Http.Ok).json(response);
  });

  // Update a flash sale event
  public updateFlashSale = catchAsync(async (req: Request, res: Response) => {
    const flashSaleId = req.params.flashSaleId;

    const parseResult = updateFlashSaleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const updateFlashSaleDto = req.body;
    const response = await this.flashSaleService.updateFlashSale(
      flashSaleId,
      updateFlashSaleDto
    );
    return res.status(Http.Ok).json(response);
  });

  // Delete a flash sale event
  public deleteFlashSale = catchAsync(async (req: Request, res: Response) => {
    const flashSaleId = req.params.flashSaleId;
    const response = await this.flashSaleService.deleteFlashSale(flashSaleId);
    return res.status(Http.Ok).json(response);
  });

  // Purchase a product
  public purchaseProduct = catchAsync(
    async (req: RequestWithUser, res: Response) => {
      const flashSaleId = req.params.flashSaleId;

      if (!req.user) {
        return res
          .status(Http.Unauthorized)
          .json(AppResponse.Error('User not authenticated'));
      }

      const response = await this.flashSaleService.purchaseProduct(
        flashSaleId,
        req.user.id
      );

      return res.status(Http.Ok).json(response);
    }
  );

  // Get a flash sale event leaderboard data
  public getFlashSaleLeaderboard = catchAsync(
    async (req: Request, res: Response) => {
      const flashSaleId = req.params.flashSaleId;

      const response =
        await this.flashSaleService.getFlashSaleLeaderboard(flashSaleId);
      return res.status(Http.Ok).json(response);
    }
  );
}
