import { Http } from '@status/codes';
import Decimal from 'decimal.js';
import { injectable } from 'inversify';
import { ClientSession } from 'mongoose';

import {
  CreateProductDto,
  RestockProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import Product, { IProduct } from './product.schema';

import { HttpException } from '@/common/utils/http.exception';
import AppResponse from '@/common/utils/response';

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

    return AppResponse.Success('Product created successfully', { product });
  }

  async getProducts() {
    const products = await Product.find({}).exec();
    return AppResponse.Success('Products retrieved successfully', { products });
  }

  async getProduct(productId: string) {
    const product = await this.getProductById(productId);

    const data = { product };
    return AppResponse.Success('Product retrieved successfully', data);
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

    if (!updatedProduct) {
      throw new HttpException(Http.BadRequest, 'Failed to update product');
    }

    return AppResponse.Success('Product updated successfully', {
      product: updatedProduct,
    });
  }

  async deleteProduct(productId: string) {
    await this.getProductById(productId);
    await Product.findByIdAndDelete(productId);

    return AppResponse.Success('Product deleted successfully');
  }

  async incrementProductStock(productId: string, data: RestockProductDto) {
    await this.getProductById(productId);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: data.stock } },
      { new: true }
    );

    if (!updatedProduct) {
      throw new HttpException(
        Http.BadRequest,
        'Failed to increment product stock'
      );
    }

    return AppResponse.Success('Product stock incremented successfully', {
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
      throw new HttpException(Http.NotFound, 'Product not found');
    }

    return product;
  }
}
