import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import { IUserModel, IRequestModified, ControllerMethod } from '../types/types';

export const checkRoleMiddleware = function (role: string): ControllerMethod {
  return function (request: IRequestModified, response: Response, next: NextFunction): void | Response {
    if (request.method === "OPTIONS") {
      next();
    }

    try {
      if (!request.headers.authorization) {
        return response.status(401).json({
          message: "Unauthorized"
        });
      }

      const token = request.headers.authorization.split(" ")[1];
      if (!token) {
        return response.status(401).json({
          message: "Unauthorized"
        });
      }

      if (process.env.JWT_SECRET) {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
          if (error) {
            return response.status(401).json({
              message: error.message
            });
          }

          const decodedData = decoded as IUserModel;
          if (decodedData && decodedData.role)
            if (decodedData.role !== role) {
              return response.status(403).json({
                message: "Forbidden"
              });
            }

          request.user = decodedData;
          next();
        });
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        console.log("\x1b[40m\x1b[31m\x1b[1m", exception.message);
        response.status(401).json({
          message: exception.message
        });
      }
    }
  };
};
