import mongoose from 'mongoose';
import logger from '../common/utils/logger';

export default async function connectToDatabase(mongodbURI: string) {
  try {
    await mongoose.connect(mongodbURI);
    logger.info('MongoDB connected...');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
  }
}
