import mongoose from 'mongoose';
import logger from '../common/utils/logger';

const registerConnectionEvents = () => {
  const conn = mongoose.connection;

  if (conn.listenerCount('connected') > 0) return;
  conn.on('connected', () => logger.info('MongoDB connected'));
  conn.on('error', (err) => logger.error('MongoDB connection error', { err }));
  conn.on('disconnected', () => logger.warn('MongoDB disconnected'));
  conn.on('reconnected', () => logger.info('MongoDB reconnected'));
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
};

export const connectDatabase = async (
  mongodbURI: string
): Promise<mongoose.Connection> => {
  registerConnectionEvents();

  await mongoose.connect(mongodbURI, {
    autoIndex: process.env.NODE_ENV !== 'production',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  return mongoose.connection;
};
