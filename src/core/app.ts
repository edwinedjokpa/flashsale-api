import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import setupRoutes from './routes';

// Middlewares
import { globalRequestHandler } from '../common/middlewares/request.handler';
import { globalErrorHandler } from '../common/middlewares/error.handler';

export const setupApp = (): Application => {
  const app = express();

  app.set('trust proxy', false);

  // Core middlewares
  app.use(express.json());
  app.use(helmet());
  app.use(compression());
  app.use(cors());

  // Request logger
  app.use(globalRequestHandler);

  // Routes
  setupRoutes(app);

  // Error handler (must be last)
  app.use(globalErrorHandler);

  return app;
};
