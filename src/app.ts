import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

// Routes
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import productRoutes from "./product/product.routes";
import leaderboardRoutes from "./leaderboard/leaderboard.routes";

// Middlewares
import { globalRequestHandler } from "./common/middlewares/request.handler";
import { globalErrorHandler } from "./common/middlewares/error.handler";
import logger from "./common/utils/logger";

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

// request handler
app.use(globalRequestHandler);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info("MongoDB connected...");
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
  });

// error handler
app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server is running on port ${process.env.PORT || 3000}`);
});
