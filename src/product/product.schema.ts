import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  soldUnits: number;
  saleStartTime: string;
  purchasedUsers: string[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    soldUnits: { type: Number, default: 0 },
    saleStartTime: { type: String, required: true },
    purchasedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);
export default Product;
