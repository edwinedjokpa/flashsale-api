import app from './core/app';
import connectToDatabase from './core/db';
import logger from './common/utils/logger';
import { configService } from './config';

// Connect to the database
(async () => {
  try {
    await connectToDatabase(configService.MONGODB_URI);
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    process.exit(1);
  }
})();

// Start server
app.listen(configService.PORT, () => {
  logger.info(
    `Application is running on ${configService.APP_URL}:${configService.PORT}`
  );
});
