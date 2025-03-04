import { Http } from "@status/codes";

import { productRepository } from "./product.repository";
import { HttpException } from "../common/utils/http.exception";
import { IProduct } from "./product.schema";
import { CreateProductDto } from "./dto/product.dto";
import { leaderboardService } from "../leaderboard/leaderboard.service";
import { Types } from "mongoose";

class ProductService {
  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const roundedPrice = Math.round(createProductDto.price * 100) / 100;
    const formattedPrice = roundedPrice.toFixed(2);

    return productRepository.create({
      ...createProductDto,
      price: parseFloat(formattedPrice),
    });
  }

  async getProducts(): Promise<IProduct[]> {
    return productRepository.findAll();
  }
  async getProduct(productId: string): Promise<IProduct> {
    const product = await productRepository.findById(productId);
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

    const updatedProduct = await productRepository.update(
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

    const userHasPurchased = await productRepository.hasUserPurchased(
      productId,
      userId
    );
    if (userHasPurchased) {
      throw new HttpException(
        Http.BadRequest,
        "You have already purchased this product."
      );
    }

    const session = await productRepository.startSession();
    session.startTransaction();

    try {
      const updatedProduct = await productRepository.decrementStock(productId);
      if (!updatedProduct) {
        throw new HttpException(Http.BadRequest, "Failed to decrement stock");
      }

      // Add to leaderboard
      await leaderboardService.addToLeaderboard(userId);

      //Add purchased user
      const purchasedUser = new Types.ObjectId(userId);
      await productRepository.addPurchasedUser(productId, purchasedUser);

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

export const productService = new ProductService();
