import "reflect-metadata";
import express, { Application } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import Container from "typedi";
// Routes
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import productRoutes from "./product/product.routes";
import leaderboardRoutes from "./leaderboard/leaderboard.routes";

// Middlewares
import { globalRequestHandler } from "./common/middlewares/request.handler";
import { globalErrorHandler } from "./common/middlewares/error.handler";

const app: Application = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

// request handler
app.use(globalRequestHandler);

// Routes
app.use("/api/auth", authRoutes(Container));
app.use("/api/user", userRoutes(Container));
app.use("/api/products", productRoutes(Container));
app.use("/api/leaderboard", leaderboardRoutes(Container));

// error handler
app.use(globalErrorHandler);

export default app;
