import { Service } from 'typedi';
import FlashSale, { IFlashSale } from './flashsale.schema';
import { CreateFlashSaleDto } from './dtos/flashsale.dto';
import { ClientSession } from 'mongoose';

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

  async decrementUnits(
    flashSaleId: string,
    session: ClientSession
  ): Promise<IFlashSale | null> {
    return FlashSale.findOneAndUpdate(
      { _id: flashSaleId, remainingUnits: { $gt: 0 } },
      {
        $inc: { remainingUnits: -1, soldUnits: 1 },
      },
      { session, new: true }
    );
  }

  startSession() {
    return FlashSale.startSession();
  }
}
