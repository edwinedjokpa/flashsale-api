import mongoose from "mongoose";
import app from "./app";
import logger from "./common/utils/logger";
import { configService } from "./config";

// MongoDB connection
mongoose
  .connect(configService.MONGODB_URI)
  .then(() => {
    logger.info("MongoDB connected...");
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
  });

// Start server
app.listen(configService.PORT, () => {
  logger.info(
    `Application is running on ${configService.APP_URL}:${configService.PORT}`
  );
});
