import jwt from 'jsonwebtoken';

import { IUserModel, ControllerMethod } from '../types/types';

export const checkAuthMiddleware: ControllerMethod = function (request, response, next) {
  if (request.method === 'OPTIONS') {
    next();
  }
  try {
    if (!request.headers.authorization) {
      return response.status(401).json({
        message: 'Unauthorized'
      });
    }
    
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      return response.status(401).json({
        message: 'Unauthorized'
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
        if (decodedData) {
          request.user = decodedData;
        }
        next();
      });
    }
  } catch (exception: unknown) {
    if (exception instanceof Error) {
      console.log('\x1b[40m\x1b[31m\x1b[1m', exception.message);
      response.status(401).json({
        message: exception.message
      });
    }
  }
};
