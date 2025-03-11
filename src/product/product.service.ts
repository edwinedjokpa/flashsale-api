import { Http } from '@status/codes';
import { ClientSession } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ProductModel } from './product.model';
import { HttpException } from '../common/utils/http.exception';
import { IProduct } from './product.schema';
import { CreateProductDto } from './dtos/product.dto';

@Service()
export class ProductService {
  constructor(@Inject() private productModel: ProductModel) {}
  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const roundedPrice = Math.round(createProductDto.price * 100) / 100;

    const product = await this.productModel.save({
      ...createProductDto,
      price: roundedPrice,
    });

    if (!product) {
      throw new HttpException(Http.BadRequest, 'Failed to create product');
    }

    return product;
  }

  async getProducts(): Promise<IProduct[]> {
    return this.productModel.findAll();
  }

  async getProduct(productId: string): Promise<IProduct> {
    const product = await this.productModel.findOne(productId);
    if (!product) {
      throw new HttpException(Http.NotFound, 'Product not found!');
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
      updateProductDto.price = roundedPrice;
    }

    const updatedProduct = await this.productModel.update(
      productId,
      updateProductDto
    );

    if (!updatedProduct) {
      throw new HttpException(Http.BadRequest, 'Failed to update product');
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
        'Failed to increment product stock'
      );
    }

    return this.getProduct(productId);
  }

  async decrementProductStock(
    productId: string,
    session: ClientSession
  ): Promise<boolean> {
    const product = await this.productModel.decrementStock(productId, session);
    if (!product) {
      throw new HttpException(
        Http.BadRequest,
        'Failed to decrement product stock'
      );
    }
    return true;
  }

  // Add other methods as needed
}
