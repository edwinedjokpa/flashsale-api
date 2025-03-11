import { Service } from 'typedi';
import { ClientSession, startSession } from 'mongoose';

import Product, { IProduct } from './product.schema';
import { CreateProductDto } from './dtos/product.dto';

@Service()
export class ProductModel {
  async save(createProductDto: CreateProductDto): Promise<IProduct> {
    return Product.create(createProductDto);
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<IProduct[]> {
    return Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async findOne(productId: string): Promise<IProduct | null> {
    return Product.findById(productId);
  }

  async update(
    productId: string,
    updateProductDto: Partial<CreateProductDto>
  ): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(productId, updateProductDto, {
      new: true,
    });
  }

  async delete(productId: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(productId);
  }

  async incrementStock(
    productId: string,
    stock: number
  ): Promise<IProduct | null> {
    return Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { stock: stock } },
      { new: true }
    );
  }

  async decrementStock(
    productId: string,
    session: ClientSession
  ): Promise<IProduct | null> {
    return Product.findOneAndUpdate(
      { _id: productId, stock: { $gt: 0 } },
      { $inc: { stock: -1, soldUnits: 1 } },
      { session, new: true }
    );
  }

  async startSession() {
    return startSession();
  }
}
