import { Request, Response } from 'express';
import { Http } from '@status/codes';
import { Inject, Service } from 'typedi';

import { createProductSchema, restockProductSchema } from './dtos/product.dto';
import { ProductService } from './product.service';
import { createResponse } from '../common/utils/response';
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
          createResponse(
            false,
            Http.BadRequest,
            'Validation failed',
            parseResult.error.format()
          )
        );
    }

    const createProductDto = parseResult.data;
    const product = await this.productService.createProduct(createProductDto);
    return res.status(Http.Created).json(
      createResponse(true, Http.Created, 'Product created successfully', {
        product,
      })
    );
  });

  // Get products
  public getProducts = catchAsync(async (req: Request, res: Response) => {
    const products = await this.productService.getProducts();
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Products fetched successfully', {
        products,
      })
    );
  });

  // Get a product
  public getProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const product = await this.productService.getProduct(productId);
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Product fetched successfully', {
        product,
      })
    );
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
          createResponse(
            false,
            Http.BadRequest,
            'Validation failed',
            parseResult.error.format()
          )
        );
    }

    const updateProductDto = parseResult.data;
    const product = await this.productService.updateProduct(
      productId,
      updateProductDto
    );
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Product updated successfully', {
        product,
      })
    );
  });

  // Delete a product
  public deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    await this.productService.deleteProduct(productId);
    return res
      .status(Http.Ok)
      .json(createResponse(true, Http.Ok, 'Product deleted successfully'));
  });

  //Restock a product
  public restockProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const parseResult = restockProductSchema.safeParse(req.body);

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

    const stock = parseResult.data.stock;
    const product = await this.productService.incrementProductStock(
      productId,
      stock
    );
    return res.status(Http.Ok).json(
      createResponse(true, Http.Ok, 'Product restocked successfully', {
        product,
      })
    );
  });
}
