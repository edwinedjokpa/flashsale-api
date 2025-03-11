import { Service } from 'typedi';
import FlashSale, { IFlashSale } from './flashsale.schema';
import { CreateFlashSaleDto } from './dtos/flashsale.dto';
import { ClientSession, Types } from 'mongoose';

@Service()
export class FlashSaleModel {
  constructor() {}

  async save(createFlashSaleDto: CreateFlashSaleDto): Promise<IFlashSale> {
    return FlashSale.create(createFlashSaleDto);
  }

  async findAll(): Promise<IFlashSale[]> {
    return FlashSale.find().exec();
  }

  async findOne(flashSaleId: string): Promise<IFlashSale | null> {
    return FlashSale.findById(flashSaleId).exec();
  }

  async update(
    flashSaleId: string,
    updateFlashSaleDto: Partial<CreateFlashSaleDto>
  ): Promise<IFlashSale | null> {
    return FlashSale.findByIdAndUpdate(flashSaleId, updateFlashSaleDto, {
      new: true,
    }).exec();
  }

  async delete(flashSaleId: string): Promise<IFlashSale | null> {
    return FlashSale.findByIdAndDelete(flashSaleId).exec();
  }

  async decrementUnitsAndAddPurchasedUser(
    flashSaleId: string,
    purchasedUser: Types.ObjectId,
    session: ClientSession
  ): Promise<IFlashSale | null> {
    return FlashSale.findOneAndUpdate(
      { _id: flashSaleId, remainingUnits: { $gt: 0 } },
      {
        $inc: { remainingUnits: -1, soldUnits: 1 },
        $push: { purchasedUsers: purchasedUser },
      },
      { session, new: true }
    );
  }

  async hasUserPurchased(
    flashSaleId: string,
    userId: string
  ): Promise<boolean> {
    const flashSale = await FlashSale.findById(flashSaleId).exec();
    if (!flashSale) return false;

    return flashSale.purchasedUsers.includes(userId);
  }

  startSession() {
    return FlashSale.startSession();
  }
}
