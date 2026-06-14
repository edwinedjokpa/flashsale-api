import { Http } from '@status/codes';
import { NextFunction, Request, Response } from 'express';

import { HttpException } from '@/common/utils/http.exception';
import logger from '@/common/utils/logger';
import { createErrorResponse } from '@/common/utils/response';
import { config } from '@/config/index';

export const globalErrorHandler = (
  err: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    const result = createErrorResponse(err.message, {
      status: err.statusCode,
      errorCode: err.constructor.name,
    });

    res.status(err.statusCode).json(result);
    next();
    return;
  }

  const statusCode =
    err instanceof Error && err.message === 'Validation failed'
      ? Http.BadRequest
      : Http.InternalServerError;

  const result = createErrorResponse(err.message || 'Internal Server Error!', {
    status: statusCode,
    errorCode: err.name,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (config.NODE_ENV === 'development') {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
  } else {
    logger.error(`Error: ${err.message}`);
  }

  res.status(statusCode).json(result);
  return;
};
