import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import Container from "typedi";

// Routers
import authRouter from "./auth/auth.routes";
import userRouter from "./user/user.router";
import productRouter from "./product/product.router";
import leaderboardRouter from "./leaderboard/leaderboard.router";

// Middlewares
import { globalRequestHandler } from "./common/middlewares/request.handler";
import { globalErrorHandler } from "./common/middlewares/error.handler";
import rateLimit from "express-rate-limit";

const app: Application = express();
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  message: "Too many requests, please try again later.",
});

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(rateLimiter);

// Global Request Handler
app.use(globalRequestHandler);

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.send("Server is healthy");
});

// Routes
app.use("/api/auth", rateLimiter, authRouter(Container));
app.use("/api/user", rateLimiter, userRouter(Container));
app.use("/api/products", rateLimiter, productRouter(Container));
app.use("/api/leaderboard", rateLimiter, leaderboardRouter(Container));

// Global Error Handler
app.use(globalErrorHandler);

export default app;
