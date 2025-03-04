import { NextFunction, Request, Response } from "express";
import { Http } from "@status/codes";

import { createProductSchema, purchaseProductSchema } from "./dto/product.dto";
import { productService } from "./product.service";
import { createResponse } from "../common/utils/response";
import { RequestWithUser } from "user/interface/user.inteface";

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          createResponse(
            false,
            Http.BadRequest,
            "Validation failed",
            parseResult.error.format()
          )
        );
    }

    const createProductDto = parseResult.data;

    try {
      const product = await productService.createProduct(createProductDto);
      return res.status(Http.Created).json(
        createResponse(true, Http.Created, "Product created successfully", {
          product,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getProducts();
      return res.status(Http.Ok).json(
        createResponse(true, Http.Ok, "Products fetched successfully", {
          products,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Purchase a product
  async purchaseProduct(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const parseResult = purchaseProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res
        .status(Http.BadRequest)
        .json(
          createResponse(
            false,
            Http.BadRequest,
            "Validation failed",
            parseResult.error.format()
          )
        );
    }

    const purchaseProductDto = parseResult.data;

    try {
      const product = await productService.purchaseProduct(
        purchaseProductDto.productId,
        req.user.id
      );
      return res.status(Http.Ok).json(
        createResponse(true, Http.Ok, "Product purchase successful", {
          product,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
