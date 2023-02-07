import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../error-handler/error-handler'

export const errorHandlingMiddleware = function (error: Error, request: Request, response: Response, next: NextFunction): Response {
  if (error instanceof ApiError) {
    return response.status(error.status).json({
      message: error.message
    });
  }

  console.error('\x1b[40m\x1b[31m\x1b[1m', error);
  return response.status(500).json({
    message: "Unexpected Error"
  });
};
