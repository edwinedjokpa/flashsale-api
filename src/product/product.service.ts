import { Http } from "@status/codes";

import ProductModel from "./product.model";
import { HttpException } from "../common/utils/http.exception";
import { IProduct } from "./product.schema";
import { CreateProductDto } from "./dto/product.dto";
import { Types } from "mongoose";
import { Inject, Service } from "typedi";
import { LeaderboardService } from "../leaderboard/leaderboard.service";

@Service()
export class ProductService {
  constructor(
    @Inject() private productModel: ProductModel,
    @Inject() private leaderboardService: LeaderboardService
  ) {}
  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const roundedPrice = Math.round(createProductDto.price * 100) / 100;
    const formattedPrice = roundedPrice.toFixed(2);

    return this.productModel.create({
      ...createProductDto,
      price: parseFloat(formattedPrice),
    });
  }

  async getProducts(): Promise<IProduct[]> {
    return this.productModel.findAll();
  }
  async getProduct(productId: string): Promise<IProduct> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new HttpException(Http.NotFound, "Product not found!");
    }

    return product;
  }

  async updateProduct(
    productId: string,
    updateProductDto: Partial<CreateProductDto>
  ): Promise<IProduct> {
    await this.getProduct(productId);

    if (updateProductDto.price) {
      const roundedPrice = Math.round(updateProductDto.price * 100) / 100;
      const formattedPrice = roundedPrice.toFixed(2);
      updateProductDto.price = parseFloat(formattedPrice);
    }

    const updatedProduct = await this.productModel.update(
      productId,
      updateProductDto
    );

    if (!updatedProduct) {
      throw new HttpException(Http.BadRequest, "Failed to update product");
    }

    return await this.getProduct(productId);
  }

  async purchaseProduct(productId: string, userId: string): Promise<IProduct> {
    const product = await this.getProduct(productId);

    //Check sales start time
    if (new Date().toISOString() < product.saleStartTime) {
      throw new HttpException(Http.BadRequest, "Sale has not started yet.");
    }

    //Check product stock
    if (product.stock <= 0) {
      throw new HttpException(Http.BadRequest, "Product out of stock.");
    }

    const userHasPurchased = await this.productModel.hasUserPurchased(
      productId,
      userId
    );
    if (userHasPurchased) {
      throw new HttpException(
        Http.BadRequest,
        "You have already purchased this product."
      );
    }

    const session = await this.productModel.startSession();
    session.startTransaction();

    try {
      const updatedProduct = await this.productModel.decrementStock(productId);
      if (!updatedProduct) {
        throw new HttpException(Http.BadRequest, "Failed to decrement stock");
      }

      // Add to leaderboard
      await this.leaderboardService.addToLeaderboard(userId);

      //Add purchased user
      const purchasedUser = new Types.ObjectId(userId);
      await this.productModel.addPurchasedUser(productId, purchasedUser);

      //Commit transaction
      await session.commitTransaction();
      session.endSession();

      return await this.getProduct(productId);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
  // Add other methods as needed
}
