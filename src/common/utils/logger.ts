import winston, { Logger } from 'winston';

import 'winston-daily-rotate-file';
import { config } from '../../config';

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp(),
  winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
  )
);

const logger: Logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.DailyRotateFile({
      dirname: './logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
});

export default logger;
