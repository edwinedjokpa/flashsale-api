import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  soldUnits: number;
  saleStartTime: string;
  purchasedUsers: string[]; // References to the User collection
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

productSchema.index({ saleStartTime: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ purchasedUsers: 1 });

const Product = model<IProduct>("Product", productSchema);

export default Product;
