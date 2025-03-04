import { Schema, model, Document, Types } from "mongoose";

export interface ILeaderboard extends Document {
  userId: Types.ObjectId;
  purchasedTime: Date;
}

// Define the schema for Leaderboard
const leaderboardSchema = new Schema<ILeaderboard>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  purchasedTime: {
    type: Date,
    default: Date.now,
  },
});

const Leaderboard = model<ILeaderboard>("Leaderboard", leaderboardSchema);

export default Leaderboard;
