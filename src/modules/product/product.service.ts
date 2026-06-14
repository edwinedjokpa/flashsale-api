import Decimal from 'decimal.js';
import { injectable } from 'inversify';
import { ClientSession } from 'mongoose';

import {
  CreateProductDto,
  RestockProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import Product, { IProduct } from './product.model';

import { NotFoundException } from '@/common/exceptions';
import { createSuccessResponse } from '@/common/utils/api-response';

@injectable()
export class ProductService {
  constructor() {}

  async createProduct(data: CreateProductDto) {
    const priceInCents = new Decimal(data.price)
      .times(100)
      .toDecimalPlaces(0)
      .toNumber();

    const product = await Product.create({
      ...data,
      price: priceInCents,
    });

    return createSuccessResponse('Product created successfully', { product });
  }

  async getProducts() {
    const products = await Product.find({}).exec();
    return createSuccessResponse('Products retrieved successfully', {
      products,
    });
  }

  async getProduct(productId: string) {
    const product = await this.getProductById(productId);

    const data = { product };
    return createSuccessResponse('Product retrieved successfully', data);
  }

  async updateProduct(productId: string, data: UpdateProductDto) {
    await this.getProductById(productId);

    if (data.price) {
      const priceInCents = new Decimal(data.price)
        .times(100)
        .toDecimalPlaces(0)
        .toNumber();
      data.price = priceInCents;
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true,
    }).exec();

    return createSuccessResponse('Product updated successfully', {
      product: updatedProduct,
    });
  }

  async deleteProduct(productId: string) {
    await this.getProductById(productId);
    await Product.findByIdAndDelete(productId);

    return createSuccessResponse('Product deleted successfully');
  }

  async incrementProductStock(productId: string, data: RestockProductDto) {
    await this.getProductById(productId);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: data.stock } },
      { new: true }
    );

    return createSuccessResponse('Product stock incremented successfully', {
      product: updatedProduct,
    });
  }

  async decrementStock(
    productId: string,
    session: ClientSession
  ): Promise<IProduct | null> {
    await this.getProductById(productId);
    return Product.findOneAndUpdate(
      { _id: productId, stock: { $gt: 0 } },
      { $inc: { stock: -1, soldUnits: 1 } },
      { session, new: true }
    );
  }

  async getProductById(productId: string): Promise<IProduct> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
