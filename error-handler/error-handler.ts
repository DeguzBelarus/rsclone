import { IApiError } from '../types/types';

export class ApiError extends Error implements IApiError {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unAuthorized(message: string) {
    return new ApiError(401, message);
  }

  static forbidden(message: string) {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static internalServerError(message: string) {
    return new ApiError(500, message);
  }
}