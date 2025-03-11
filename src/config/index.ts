import dotenv from 'dotenv';

dotenv.config();

export const configService = {
  // General settings
  NODE_ENV: (process.env.NODE_ENV as string) || 'development',

  // Server settings
  PORT: (process.env.PORT as unknown as number) || 3000,

  // Other settings
  APP_URL: process.env.APP_URL || 'http://localhost',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || 'logs/app.log',

  // Database settings
  MONGODB_URI:
    (process.env.MONGODB_URI as string) ||
    'mongodb://localhost:27017/flashsale-api',

  // JWT settings
  JWT_SECRET:
    (process.env.JWT_SECRET as unknown as string) || 'your-jwt-secret',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as unknown as number) || 3600,

  // Email settings
  EMAIL_HOST: (process.env.EMAIL_HOST as string) || 'smtp.mailtrap.io',
  EMAIL_PORT: (process.env.EMAIL_PORT as unknown as number) || 587,
  EMAIL_USER: (process.env.EMAIL_USER as string) || '',
  EMAIL_PASSWORD: (process.env.EMAIL_PASSWORD as string) || '',

  // Redis settings
  REDIS_HOST: (process.env.REDIS_HOST as string) || 'localhost',
  REDIS_PORT: (process.env.REDIS_PORT as unknown as number) || 6379,
};
