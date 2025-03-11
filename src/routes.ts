import { Application } from 'express';
import rateLimit from 'express-rate-limit';

import authRouter from './auth/auth.router';
import userRouter from './user/user.router';
import productRouter from './product/product.router';
import flashsaleRouter from './flashsale/flashsale.router';
import leaderboardRouter from './leaderboard/leaderboard.router';

// Define the rate limiter middleware
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  message: 'Too many requests, please try again later.',
});

const setupRoutes = (app: Application): void => {
  // Main Route, redirecting to API Docs
  app.get('/', (_req, res) => {
    res.send('Welcome to the Flash Sale API!');
  });

  // Health Check route
  app.get('/health', (_req, res) => {
    res.send('Server is healthy');
  });

  // API Routes with rate limiting middleware applied
  app.use('/api/auth', rateLimiter, authRouter());
  app.use('/api/user', rateLimiter, userRouter());
  app.use('/api/products', rateLimiter, productRouter());
  app.use('/api/flashsale', rateLimiter, flashsaleRouter());
  app.use('/api/leaderboard', rateLimiter, leaderboardRouter());
};

export default setupRoutes;
