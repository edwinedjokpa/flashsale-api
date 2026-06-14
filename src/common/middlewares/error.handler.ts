import { ErrorRequestHandler } from 'express';

import { createErrorResponse } from '@/common/utils/api-response';
import { HttpException } from '@/common/utils/http.exception';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json(err.toResponse());
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json(
      createErrorResponse({
        statusCode: 400,
        code: 'INVALID_ID',
        message: 'Invalid ID format',
      })
    );
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json(
      createErrorResponse({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid data',
      })
    );
    return;
  }

  if (err.code === 11000) {
    res.status(400).json(
      createErrorResponse({
        statusCode: 400,
        code: 'CONFLICT',
        message: 'Resource already exists',
      })
    );
    return;
  }

  res.status(500).json(
    createErrorResponse({
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
  );
};
