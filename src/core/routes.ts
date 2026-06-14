import { Application } from 'express';
import rateLimit from 'express-rate-limit';

import { container } from './container';

import { AuthRouter } from '@/modules/auth/auth.router';
import { FlashSaleRouter } from '@/modules/flashsale/flashsale.router';
import { LeaderboardRouter } from '@/modules/leaderboard/leaderboard.router';
import { ProductRouter } from '@/modules/product/product.router';
import { UserRouter } from '@/modules/user/user.router';

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later.',
});

const readLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 60,
  message: 'Too many requests, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many requests, please try again later.',
});

const purchaseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Too many requests, please try again later.',
});

const setupRoutes = (app: Application): void => {
  // Main Route, redirecting to API Docs
  app.get('/', (_req, res) => {
    res.send('Welcome to the Flash Sale API!');
  }); // Health Check route
  app.get('/health', (_req, res) => {
    res.send('Server is healthy');
  });

  // API Routes with rate limiting middleware applied
  app.use('/api/auth', authLimiter, container.get(AuthRouter).getRouter());
  app.use('/api/user', globalLimiter, container.get(UserRouter).getRouter());
  app.use(
    '/api/products',
    readLimiter,
    container.get(ProductRouter).getRouter()
  );
  app.use(
    '/api/flashsales',
    purchaseLimiter,
    container.get(FlashSaleRouter).getRouter()
  );
  app.use(
    '/api/leaderboard',
    readLimiter,
    container.get(LeaderboardRouter).getRouter()
  );
};

export default setupRoutes;
