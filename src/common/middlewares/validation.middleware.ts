import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

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
        res.status(400).json({
          success: false,
          message: 'Invalid route parameters',
          errors: result.error.format(),
        });

        return;
      }

      validated.params = result.data;
    }

    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request body',
          errors: result.error.format(),
        });

        return;
      }

      validated.body = result.data;
    }

    if (query && req.query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: result.error.format(),
        });

        return;
      }

      validated.query = result.data;
    }

    req.validated = validated;
    next();
  };
