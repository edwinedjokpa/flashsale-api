import { Http } from '@status/codes';
import { inject, injectable } from 'inversify';

import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { ProductService } from '../product/product.service';

import { CreateFlashSaleDto, UpdateFlashSaleDto } from './dto/flashsale.dto';
import FlashSale, { IFlashSale } from './flashsale.schema';

import { HttpException } from '@/common/utils/http.exception';
import { createSuccessResponse } from '@/common/utils/response';

@injectable()
export class FlashSaleService {
  constructor(
    @inject(ProductService)
    private readonly productService: ProductService,
    @inject(LeaderboardService)
    private readonly leaderboardService: LeaderboardService
  ) {}

  async createFlashSale(data: CreateFlashSaleDto) {
    const product = await this.productService.getProductById(data.productId);

    const flashSale = await FlashSale.create({
      ...data,
      remainingUnits: product.stock,
    });

    if (!flashSale) {
      throw new HttpException(Http.BadRequest, 'Failed to create flash sale');
    }

    return createSuccessResponse('Flashsale event created successfully', {
      flashSale,
    });
  }

  async getFlashSales() {
    const flashSales = await FlashSale.find().exec();

    return createSuccessResponse('Flashsale events retrieved successfully', {
      flashSales,
    });
  }

  async getFlashSale(flashSaleId: string) {
    const flashSale = await this.getFlashSaleById(flashSaleId);

    return createSuccessResponse('Flashsale event retrieved successfully', {
      flashSale,
    });
  }

  async updateFlashSale(
    flashSaleId: string,
    updateFlashSaleDto: UpdateFlashSaleDto
  ) {
    await this.getFlashSaleById(flashSaleId);

    const updatedFlashSale = await FlashSale.findByIdAndUpdate(
      flashSaleId,
      updateFlashSaleDto,
      {
        new: true,
      }
    ).exec();

    if (!updatedFlashSale) {
      throw new HttpException(Http.BadRequest, 'Failed to update flashsale');
    }

    return createSuccessResponse('Flashsale event updated successfully', {
      flashSale: updatedFlashSale,
    });
  }

  async deleteFlashSale(flashSaleId: string) {
    await this.getFlashSaleById(flashSaleId);
    await FlashSale.findByIdAndDelete(flashSaleId);

    return createSuccessResponse('Flashsale event deleted successfully');
  }

  async purchaseProduct(flashSaleId: string, userId: string) {
    const flashSale = await this.getFlashSaleById(flashSaleId);
    const productId = flashSale.productId.toString();

    // Check sales start time
    if (new Date() < flashSale.saleStartTime) {
      throw new HttpException(
        Http.BadRequest,
        'Flashsale event has not started yet.'
      );
    }

    // Check product stock
    if (flashSale.remainingUnits <= 0) {
      throw new HttpException(
        Http.BadRequest,
        'Flashsale event has ended as the product is out of stock.'
      );
    }

    const leaderboard =
      await this.leaderboardService.getLeaderboardForFlashSale(flashSaleId);

    const userHasPurchased = leaderboard.some(
      (entry) => entry.userId.toString() === userId.toString()
    );

    if (userHasPurchased) {
      throw new HttpException(
        Http.BadRequest,
        'You have already purchased this product.'
      );
    }

    const session = await FlashSale.startSession();
    session.startTransaction();

    try {
      // Decrement stock and add purchased user within the session
      const updatedSalesEvent = await FlashSale.findOneAndUpdate(
        { _id: flashSaleId, remainingUnits: { $gt: 0 } },
        {
          $inc: { remainingUnits: -1, soldUnits: 1 },
        },
        { session, new: true }
      );

      if (!updatedSalesEvent) {
        throw new HttpException(
          Http.BadRequest,
          'Failed to decrement remaining units and add purchased user.'
        );
      }

      // Update product stock
      await this.productService.decrementStock(productId, session);

      // Add to leaderboard
      await this.leaderboardService.addToLeaderboard(
        { flashSaleId, userId, productId },
        session
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return createSuccessResponse('Product purchased successfully', {
        flashSale: updatedSalesEvent,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getFlashSaleLeaderboard(flashSaleId: string) {
    const leaderboard =
      await this.leaderboardService.getLeaderboardByFlashSaleId(flashSaleId);

    return createSuccessResponse('Leaderboard fetched successfully', {
      leaderboard,
    });
  }

  // Helper function
  async getFlashSaleById(flashSaleId: string): Promise<IFlashSale> {
    const flashSale = await FlashSale.findById(flashSaleId);

    if (!flashSale) {
      throw new HttpException(Http.NotFound, 'Flash sale not found');
    }

    return flashSale;
  }
}
