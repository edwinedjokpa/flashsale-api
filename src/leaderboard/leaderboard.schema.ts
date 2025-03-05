import { Schema, model, Document, Types } from "mongoose";

export interface ILeaderboard extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  purchasedTime: Date;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    purchasedTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

leaderboardSchema.index({ userId: 1, productId: 1 });
leaderboardSchema.index({ purchasedTime: 1 });

leaderboardSchema.index({ userId: 1, productId: 1, purchasedTime: 1 });

const Leaderboard = model<ILeaderboard>("Leaderboard", leaderboardSchema);

export default Leaderboard;
