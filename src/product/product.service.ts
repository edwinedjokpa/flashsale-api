import { Http } from "@status/codes";
import { Types } from "mongoose";
import { Inject, Service } from "typedi";

import { ProductModel } from "./product.model";
import { HttpException } from "../common/utils/http.exception";
import { IProduct } from "./product.schema";
import { CreateProductDto } from "./dtos/product.dto";
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

  async deleteProduct(productId: string): Promise<void> {
    const product = await this.getProduct(productId);
    await this.productModel.delete(product._id as string);
  }

  async incrementProductStock(
    productId: string,
    stock: number
  ): Promise<IProduct> {
    const product = await this.productModel.incrementStock(productId, stock);

    if (!product) {
      throw new HttpException(
        Http.BadRequest,
        "Failed to increment product stock"
      );
    }

    return this.getProduct(productId);
  }

  async decrementProductStock(productId: string): Promise<Boolean> {
    const product = await this.productModel.decrementStock(productId);
    if (!product) {
      throw new HttpException(
        Http.BadRequest,
        "Failed to decrement product stock"
      );
    }
    return true;
  }

  async purchaseProduct(productId: string, userId: string): Promise<IProduct> {
    const product = await this.getProduct(productId);

    // Check sales start time
    if (new Date().toISOString() < product.saleStartTime) {
      throw new HttpException(Http.BadRequest, "Sale has not started yet.");
    }

    // Check product stock
    if (product.stock <= 0) {
      throw new HttpException(
        Http.BadRequest,
        "Sales have ended as the product is out of stock."
      );
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
      // Decrement stock and add purchased user within the session
      const updatedProduct =
        await this.productModel.decrementStockAndAddPurchasedUser(
          productId,
          new Types.ObjectId(userId),
          session
        );

      if (!updatedProduct) {
        throw new HttpException(
          Http.BadRequest,
          "Failed to decrement stock and add purchased user."
        );
      }

      // Add to leaderboard
      await this.leaderboardService.addToLeaderboard(
        userId,
        productId,
        session
      );

      // Commit transaction
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
