import { Http } from '@status/codes';
import { ClientSession } from 'mongoose';
import { Inject, Service } from 'typedi';

import { ProductModel } from './product.model';
import { IProduct } from './product.schema';
import { CreateProductDto } from './dtos/product.dto';
import { HttpException } from '../common/utils/http.exception';
import AppResponse from '../common/utils/response';

@Service()
export class ProductService {
  constructor(@Inject() private productModel: ProductModel) {}
  async createProduct(createProductDto: CreateProductDto) {
    const roundedPrice = Math.round(createProductDto.price * 100) / 100;

    const product = await this.productModel.save({
      ...createProductDto,
      price: roundedPrice,
    });

    if (!product) {
      throw new HttpException(Http.BadRequest, 'Failed to create product');
    }

    const data = { product };
    return AppResponse.Success('Product created successfully', data);
  }

  async getProducts() {
    const products = await this.productModel.findAll();

    const data = { products };
    return AppResponse.Success('Products retrieved successfully', data);
  }

  async getProduct(productId: string) {
    const product = await this.getProductById(productId);

    const data = { product };
    return AppResponse.Success('Product retrieved successfully', data);
  }

  async updateProduct(
    productId: string,
    updateProductDto: Partial<CreateProductDto>
  ) {
    await this.getProductById(productId);

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

    const data = { product: updatedProduct };
    return AppResponse.Success('Product updated successfully', data);
  }

  async deleteProduct(productId: string) {
    const product = await this.getProductById(productId);
    await this.productModel.delete(product._id as string);

    return AppResponse.Success('Product deleted successfully');
  }

  async incrementProductStock(productId: string, stock: number) {
    await this.getProductById(productId);

    const product = await this.productModel.incrementStock(productId, stock);

    if (!product) {
      throw new HttpException(
        Http.BadRequest,
        'Failed to increment product stock'
      );
    }

    const updatedProduct = await this.getProductById(productId);

    const data = { product: updatedProduct };
    return AppResponse.Success('Product stock incremented successfully', data);
  }

  // Add other methods as needed
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

  async getProductById(productId: string): Promise<IProduct> {
    const product = await this.productModel.findOne(productId);

    if (!product) {
      throw new HttpException(Http.NotFound, 'Product not found');
    }

    return product;
  }
}
