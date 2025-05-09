import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const globalRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
