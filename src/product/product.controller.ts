import { Request, Response } from 'express';
import { Http } from '@status/codes';
import { Inject, Service } from 'typedi';

import { createProductSchema, restockProductSchema } from './dtos/product.dto';
import { ProductService } from './product.service';
import AppResponse from '../common/utils/response';
import catchAsync from '../common/utils/catch-async';

@Service()
export class ProductController {
  constructor(@Inject() private productService: ProductService) {}

  // Create a product
  public createProduct = catchAsync(async (req: Request, res: Response) => {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const createProductDto = parseResult.data;
    const response = await this.productService.createProduct(createProductDto);
    return res.status(Http.Created).json(response);
  });

  // Get products
  public getProducts = catchAsync(async (req: Request, res: Response) => {
    const response = await this.productService.getProducts();
    return res.status(Http.Ok).json(response);
  });

  // Get a product
  public getProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const response = await this.productService.getProduct(productId);
    return res.status(Http.Ok).json(response);
  });

  // Update a product
  public updateProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const updateProductSchema = createProductSchema.partial();
    const parseResult = updateProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const updateProductDto = parseResult.data;
    const response = await this.productService.updateProduct(
      productId,
      updateProductDto
    );
    return res.status(Http.Ok).json(response);
  });

  // Delete a product
  public deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const response = await this.productService.deleteProduct(productId);
    return res.status(Http.Ok).json(response);
  });

  //Restock a product
  public restockProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const parseResult = restockProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          AppResponse.Error('Validation failed', parseResult.error.format())
        );
    }

    const stock = parseResult.data.stock;
    const response = await this.productService.incrementProductStock(
      productId,
      stock
    );
    return res.status(Http.Ok).json(response);
  });
}
