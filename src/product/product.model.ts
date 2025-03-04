import { Service } from "typedi";
import { ICreateProduct } from "./interfaces/product.interface";
import Product, { IProduct } from "./product.schema";
import { startSession, Types } from "mongoose";

@Service()
class ProductModel {
  async create(productData: ICreateProduct): Promise<IProduct> {
    return Product.create(productData);
  }

  async findById(productId: string): Promise<IProduct | null> {
    return Product.findById(productId);
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<IProduct[]> {
    return Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  }

  async update(
    productId: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(productId, data, { new: true });
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

  async decrementStock(productId: string): Promise<IProduct | null> {
    return Product.findOneAndUpdate(
      { _id: productId, stock: { $gt: 0 } },
      { $inc: { stock: -1 } },
      { new: true }
    );
  }

  async addPurchasedUser(
    productId: string,
    purchasedUser: Types.ObjectId
  ): Promise<void> {
    await Product.updateOne(
      { _id: productId },
      { $push: { purchasedUsers: purchasedUser } }
    );
  }

  async hasUserPurchased(productId: string, userId: string): Promise<boolean> {
    const product = await Product.findById(productId);
    if (!product) return false;

    return product.purchasedUsers.includes(userId);
  }

  async startSession() {
    return startSession();
  }
}

export default ProductModel;
