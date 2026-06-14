import { Http } from '@status/codes';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { RequestData } from 'types/request-data';

import catchAsync from '../../common/utils/catch-async';

import {
  CreateProductDto,
  ProductParamsDto,
  RestockProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

@injectable()
export class ProductController {
  constructor(
    @inject(ProductService)
    private productService: ProductService
  ) {}

  public createProduct = catchAsync(
    async (req: RequestData<never, CreateProductDto>, res: Response) => {
      const { body } = req.validated;

      const response = await this.productService.createProduct(body);
      return res.status(Http.Created).json(response);
    }
  );

  public getProducts = catchAsync(async (req: Request, res: Response) => {
    const response = await this.productService.getProducts();
    return res.status(Http.Ok).json(response);
  });

  public getProduct = catchAsync(
    async (req: RequestData<ProductParamsDto>, res: Response) => {
      const { params } = req.validated;

      const response = await this.productService.getProduct(params.productId);
      return res.status(Http.Ok).json(response);
    }
  );

  public updateProduct = catchAsync(
    async (
      req: RequestData<ProductParamsDto, UpdateProductDto>,
      res: Response
    ) => {
      const { params, body } = req.validated;

      const response = await this.productService.updateProduct(
        params.productId,
        body
      );
      return res.status(Http.Ok).json(response);
    }
  );

  public deleteProduct = catchAsync(
    async (req: RequestData<ProductParamsDto>, res: Response) => {
      const { params } = req.validated;

      const response = await this.productService.deleteProduct(
        params.productId
      );
      return res.status(Http.Ok).json(response);
    }
  );

  public restockProduct = catchAsync(
    async (
      req: RequestData<ProductParamsDto, RestockProductDto>,
      res: Response
    ) => {
      const { params, body } = req.validated;

      const response = await this.productService.incrementProductStock(
        params.productId,
        body
      );
      return res.status(Http.Ok).json(response);
    }
  );
}
