import { Schema, model, Document, Types } from "mongoose";

export interface ILeaderboard extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  purchasedTime: Date;
}

// Define the schema for Leaderboard
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

const Leaderboard = model<ILeaderboard>("Leaderboard", leaderboardSchema);

export default Leaderboard;
