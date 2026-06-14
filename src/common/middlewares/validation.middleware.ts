import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

import { ValidationException } from '@/common/exceptions/index';
import { formatZodErrors } from '@/common/utils/api-response';

type ValidationSchemas = {
  params?: ZodTypeAny;
  body?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validateRequest =
  (schemas: ValidationSchemas): RequestHandler =>
  (req, res, next) => {
    const { params, body, query } = schemas;
    const validated: Record<string, unknown> = {};

    if (params && req.params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        return next(
          new ValidationException(
            'Invalid route parameters',
            formatZodErrors(result.error)
          )
        );
      }
      validated.params = result.data;
    }

    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return next(
          new ValidationException(
            'Invalid request body',
            formatZodErrors(result.error)
          )
        );
      }
      validated.body = result.data;
    }

    if (query && req.query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        return next(
          new ValidationException(
            'Invalid query parameters',
            formatZodErrors(result.error)
          )
        );
      }
      validated.query = result.data;
    }

    req.validated = validated;
    next();
  };
