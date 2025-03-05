import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import logger from "./common/utils/logger";

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info("MongoDB connected...");
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
  });

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server is running on port ${process.env.PORT || 3000}`);
});
