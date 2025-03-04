import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  saleStartTime: string;
  saleEndTime?: string;
  purchasedUsers: string[];
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  saleStartTime: { type: String, required: true },
  saleEndTime: { type: String },
  purchasedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Product = model<IProduct>("Product", productSchema);
export default Product;
