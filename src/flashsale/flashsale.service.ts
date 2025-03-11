import { Inject, Service } from 'typedi';
import { Http } from '@status/codes';

import { FlashSaleModel } from './flashsale.model';
import { IFlashSale } from './flashsale.schema';
import { CreateFlashSaleDto } from './dtos/flashsale.dto';
import { HttpException } from '../common/utils/http.exception';
import { ProductService } from '../product/product.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { Types } from 'mongoose';

@Service()
export class FlashSaleService {
  constructor(
    @Inject() private readonly flashSaleModel: FlashSaleModel,
    @Inject() private readonly productService: ProductService,
    @Inject() private readonly leaderboardService: LeaderboardService
  ) {}

  async createFlashSale(
    createFlashSaleDto: CreateFlashSaleDto
  ): Promise<IFlashSale> {
    const product = await this.productService.getProduct(
      createFlashSaleDto.productId
    );

    if (!product) {
      throw new HttpException(Http.BadRequest, 'Product not found');
    }

    const flashSale = await this.flashSaleModel.save({
      ...createFlashSaleDto,
      remainingUnits: product.stock,
    });

    if (!flashSale) {
      throw new HttpException(Http.BadRequest, 'Failed to create flash sale');
    }

    return flashSale;
  }

  async getFlashSales(): Promise<IFlashSale[]> {
    return this.flashSaleModel.findAll();
  }

  async getFlashSale(flashSaleId: string): Promise<IFlashSale> {
    const flashSale = await this.flashSaleModel.findOne(flashSaleId);

    if (!flashSale) {
      throw new HttpException(Http.NotFound, 'Flash sale not found');
    }

    return flashSale;
  }

  async updateFlashSale(
    flashSaleId: string,
    updateFlashSaleDto: CreateFlashSaleDto
  ): Promise<IFlashSale> {
    await this.getFlashSale(flashSaleId);

    const updatedFlashSale = await this.flashSaleModel.update(
      flashSaleId,
      updateFlashSaleDto
    );
    if (!updatedFlashSale) {
      throw new HttpException(Http.BadRequest, 'Failed to update flash sale');
    }

    return updatedFlashSale;
  }

  async deleteFlashSale(flashSaleId: string): Promise<void> {
    await this.getFlashSale(flashSaleId);
    await this.flashSaleModel.delete(flashSaleId);
  }

  async purchaseProduct(flashSaleId: string, userId: string) {
    const flashSale = await this.getFlashSale(flashSaleId);
    const productId = flashSale.productId.toString();

    // Check sales start time
    if (new Date() < flashSale.saleStartTime) {
      throw new HttpException(Http.BadRequest, 'Sale has not started yet.');
    }

    // Check product stock
    if (flashSale.remainingUnits <= 0) {
      throw new HttpException(
        Http.BadRequest,
        'Sales have ended as the product is out of stock.'
      );
    }

    const userHasPurchased = await this.flashSaleModel.hasUserPurchased(
      flashSaleId,
      userId
    );

    if (userHasPurchased) {
      throw new HttpException(
        Http.BadRequest,
        'You have already purchased this product.'
      );
    }

    const session = await this.flashSaleModel.startSession();
    session.startTransaction();

    try {
      // Decrement stock and add purchased user within the session
      const updatedSalesEvent =
        await this.flashSaleModel.decrementUnitsAndAddPurchasedUser(
          flashSaleId,
          new Types.ObjectId(userId),
          session
        );

      if (!updatedSalesEvent) {
        throw new HttpException(
          Http.BadRequest,
          'Failed to decrement remaining units and add purchased user.'
        );
      }

      // Update product stock
      await this.productService.decrementProductStock(productId, session);

      // Add to leaderboard
      await this.leaderboardService.addToLeaderboard(
        { flashSaleId, userId, productId },
        session
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return await this.flashSaleModel.findOne(flashSaleId);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getFlashSaleLeaderboard(flashSaleId: string): Promise<unknown[]> {
    return this.leaderboardService.getLeaderboardByFlashSaleId(flashSaleId);
  }
}
