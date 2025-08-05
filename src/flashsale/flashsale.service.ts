import { Inject, Service } from 'typedi';
import { Http } from '@status/codes';

import AppResponse from '../common/utils/response';
import { FlashSaleModel } from './flashsale.model';
import { IFlashSale } from './flashsale.schema';
import { CreateFlashSaleDto, UpdateFlashSaleDto } from './dtos/flashsale.dto';
import { HttpException } from '../common/utils/http.exception';
import { ProductService } from '../product/product.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Service()
export class FlashSaleService {
  constructor(
    @Inject() private readonly flashSaleModel: FlashSaleModel,
    @Inject() private readonly productService: ProductService,
    @Inject() private readonly leaderboardService: LeaderboardService
  ) {}

  async createFlashSale(createFlashSaleDto: CreateFlashSaleDto) {
    const product = await this.productService.getProductById(
      createFlashSaleDto.productId
    );

    const flashSale = await this.flashSaleModel.save({
      ...createFlashSaleDto,
      remainingUnits: product.stock,
    });

    if (!flashSale) {
      throw new HttpException(Http.BadRequest, 'Failed to create flash sale');
    }

    const data = { flashSale };
    return AppResponse.Success('Flashsale event created successfully', data);
  }

  async getFlashSales() {
    const flashSales = await this.flashSaleModel.findAll();

    const data = { flashSales };
    return AppResponse.Success('Flashsale events retrieved successfully', data);
  }

  async getFlashSale(flashSaleId: string) {
    const flashSale = await this.getFlashSaleById(flashSaleId);

    const data = { flashSale };
    return AppResponse.Success('Flashsale event retrieved successfully', data);
  }

  async updateFlashSale(
    flashSaleId: string,
    updateFlashSaleDto: UpdateFlashSaleDto
  ) {
    await this.getFlashSaleById(flashSaleId);

    const updatedFlashSale = await this.flashSaleModel.update(
      flashSaleId,
      updateFlashSaleDto
    );

    if (!updatedFlashSale) {
      throw new HttpException(Http.BadRequest, 'Failed to update flashsale');
    }

    const data = { flashSale: updatedFlashSale };
    return AppResponse.Success('Flashsale event updated successfully', data);
  }

  async deleteFlashSale(flashSaleId: string) {
    await this.getFlashSaleById(flashSaleId);
    await this.flashSaleModel.delete(flashSaleId);

    return AppResponse.Success('Flashsale event deleted successfully');
  }

  async purchaseProduct(flashSaleId: string, userId: string) {
    const flashSale = await this.getFlashSaleById(flashSaleId);
    const productId = flashSale.productId.toString();

    // Check sales start time
    if (new Date() < flashSale.saleStartTime) {
      throw new HttpException(
        Http.BadRequest,
        'Flasesale event has not started yet.'
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

    const session = await this.flashSaleModel.startSession();
    session.startTransaction();

    try {
      // Decrement stock and add purchased user within the session
      const updatedSalesEvent = await this.flashSaleModel.decrementUnits(
        flashSaleId,
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

      const data = { flashSale: updatedSalesEvent };
      return AppResponse.Success('Product purchased successfully', data);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getFlashSaleLeaderboard(flashSaleId: string) {
    const leaderboard =
      await this.leaderboardService.getLeaderboardByFlashSaleId(flashSaleId);

    const data = { leaderboard };
    return AppResponse.Success('Leaderboard fetched successfully', data);
  }

  // Other methods
  async getFlashSaleById(flashSaleId: string): Promise<IFlashSale> {
    const flashSale = await this.flashSaleModel.findOne(flashSaleId);

    if (!flashSale) {
      throw new HttpException(Http.NotFound, 'Flash sale not found');
    }

    return flashSale;
  }
}
