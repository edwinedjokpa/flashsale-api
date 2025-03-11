import { Schema, model, Document, Types } from 'mongoose';

export interface IFlashSale extends Document {
  productId: Types.ObjectId;
  discountPrice: number;
  soldUnits: number;
  remainingUnits: number;
  saleStartTime: Date;
  purchasedUsers: string[];
}

const flashSaleSchema = new Schema<IFlashSale>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    discountPrice: { type: Number, required: true },
    soldUnits: { type: Number, default: 0 },
    remainingUnits: { type: Number, default: 0 },
    saleStartTime: { type: Date, required: true },
    purchasedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

flashSaleSchema.index({ saleStartTime: 1 });
flashSaleSchema.index({ purchasedUsers: 1 });

const FlashSale = model<IFlashSale>('FlashSale', flashSaleSchema);

export default FlashSale;
