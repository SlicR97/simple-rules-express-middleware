import express from 'express';
import { ValidationResult } from '@slicr97/simple-rules';

export type MiddlewareOptions<Type = unknown, TOutput = unknown> = {
  statusCode?: number;
  formatter?: (arg0: ValidationResult<Type>) => TOutput;
};

export const validationMiddleware =
  <T, TOutput = unknown>(
    validator: (arg0: T) => ValidationResult<T>,
    options?: MiddlewareOptions<T, TOutput>,
  ) =>
  (req: express.Request, res: express.Response, next: () => void) => {
    const body = req.body;
    const validationResult = validator(body);
    if (Object.keys(validationResult).length) {
      res.status(options?.statusCode ?? 400);
      if (options?.formatter) {
        res.send(options.formatter(validationResult));
      } else {
        res.send(validationResult);
      }

      return;
    }

    next();
  };
