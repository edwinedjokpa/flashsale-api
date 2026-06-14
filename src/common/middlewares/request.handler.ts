import { NextFunction, Request, Response } from 'express';

import logger from '@/common/utils/logger';

export const requestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
