import { Http } from '@status/codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { RequestData } from 'types/request-data';

import catchAsync from '../../common/utils/catch-async';
import { AuthenticatedRequestData } from '../user/interfaces/user.inteface';

import {
  CreateFlashSaleDto,
  FlashSaleParamsDto,
  UpdateFlashSaleDto,
} from './dto/flashsale.dto';
import { FlashSaleService } from './flashsale.service';

@injectable()
export class FlashSaleController {
  constructor(
    @inject(FlashSaleService)
    private flashSaleService: FlashSaleService
  ) {}

  public createFlashSale = catchAsync(
    async (req: RequestData<unknown, CreateFlashSaleDto>, res: Response) => {
      const { body } = req.validated;

      const response = await this.flashSaleService.createFlashSale(body);
      return res.status(Http.Created).json(response);
    }
  );

  public getFlashSales = catchAsync(async (req: Request, res: Response) => {
    const response = await this.flashSaleService.getFlashSales();
    return res.status(Http.Ok).json(response);
  });

  public getFlashSale = catchAsync(
    async (req: RequestData<FlashSaleParamsDto>, res: Response) => {
      const { params } = req.validated;

      const response = await this.flashSaleService.getFlashSale(
        params.flashSaleId
      );
      return res.status(Http.Ok).json(response);
    }
  );

  public updateFlashSale = catchAsync(
    async (
      req: RequestData<FlashSaleParamsDto, UpdateFlashSaleDto>,
      res: Response
    ) => {
      const { body, params } = req.validated;

      const response = await this.flashSaleService.updateFlashSale(
        params.flashSaleId,
        body
      );
      return res.status(Http.Ok).json(response);
    }
  );

  public deleteFlashSale = catchAsync(
    async (req: RequestData<FlashSaleParamsDto>, res: Response) => {
      const { params } = req.validated;

      const response = await this.flashSaleService.deleteFlashSale(
        params.flashSaleId
      );
      return res.status(Http.Ok).json(response);
    }
  );

  public purchaseProduct = catchAsync(
    async (
      req: AuthenticatedRequestData<FlashSaleParamsDto>,
      res: Response
    ) => {
      const user = req.user;
      const { params } = req.validated;

      const response = await this.flashSaleService.purchaseProduct(
        params.flashSaleId,
        user.id
      );

      return res.status(Http.Ok).json(response);
    }
  );

  public getFlashSaleLeaderboard = catchAsync(
    async (req: RequestData<FlashSaleParamsDto>, res: Response) => {
      const { params } = req.validated;

      const response = await this.flashSaleService.getFlashSaleLeaderboard(
        params.flashSaleId
      );
      return res.status(Http.Ok).json(response);
    }
  );
}
