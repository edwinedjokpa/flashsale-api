import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import 'reflect-metadata';

import { errorHandler } from '@/common/middlewares/error.handler';
import { requestHandler } from '@/common/middlewares/request.handler';
import { corsOptions } from '@/config/cors.config';
import setupRoutes from '@/core/routes';

// Middlewares
export const setupApp = (): Application => {
  const app = express();

  app.set('trust proxy', false);

  // Core middlewares
  app.use(express.json());
  app.use(helmet());
  app.use(compression());
  app.use(cors(corsOptions));

  // Request handler
  app.use(requestHandler);

  // Routes
  setupRoutes(app);

  // Error handler
  app.use(errorHandler);

  return app;
};
