import { Request, Response } from 'express';
import { Http } from '@status/codes';

import { HttpException } from '../utils/http.exception';
import { configService } from '../../config';

export const globalErrorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof HttpException) {
    res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
    });

    return;
  }

  res.status(Http.InternalServerError).json({
    success: false,
    status: Http.InternalServerError,
    message: err.message || 'Internal Server Error!',
    stack: configService.NODE_ENV === 'development' ? err.stack : undefined,
  });

  return;
};
