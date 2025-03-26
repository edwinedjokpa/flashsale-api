import { NextFunction, Request, Response } from 'express';
import { Http } from '@status/codes';
import { HttpException } from '../utils/http.exception';
import { configService } from '../../config';
import AppResponse from '../utils/response';
import logger from '../utils/logger';

export const globalErrorHandler = (
  err: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle custom HttpException
  if (err instanceof HttpException) {
    const response = AppResponse.Error(err.message, {
      status: err.statusCode,
      errorCode: err.constructor.name,
    });

    res.status(err.statusCode).json(response);
    next();
    return;
  }

  const statusCode =
    err instanceof Error && err.message === 'Validation failed'
      ? Http.BadRequest
      : Http.InternalServerError;

  const response = AppResponse.Error(err.message || 'Internal Server Error!', {
    status: statusCode,
    errorCode: err.name,
    stack: configService.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Log the error details (excluding stack trace in production)
  if (configService.NODE_ENV === 'development') {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
  } else {
    logger.error(`Error: ${err.message}`);
  }

  res.status(statusCode).json(response);
  return;
};
