import 'reflect-metadata';

import http from 'http';

import logger from './common/utils/logger';
import { config } from './config';
import { setupApp } from './core/app';
import { connectDatabase, disconnectDatabase } from './core/database';

const startServer = async () => {
  await connectDatabase(config.MONGODB_URI);

  const app = setupApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve, reject) => {
    server.listen(config.PORT, resolve);
    server.once('error', reject);
  });

  logger.info(`Application is running on ${config.APP_URL}:${config.PORT}`);
  return server;
};

const shutdown = async (signal: string, server: http.Server) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
};

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason);
  process.exit(1);
});

startServer()
  .then((server) => {
    process.once('SIGINT', () => shutdown('SIGINT', server));
    process.once('SIGTERM', () => shutdown('SIGTERM', server));
  })
  .catch((err) => {
    logger.error('Failed to start server', err);
    process.exit(1);
  });
