import jwt from 'jsonwebtoken';

import { IUserModel, ControllerMethod } from '../types/types';

export const roleAndIdAccessMiddleware: ControllerMethod = function (request, response, next) {
  if (request.method === 'OPTIONS') {
    next();
  }
  try {
    if (!request.headers.authorization) {
      request.role = 'USER';

      next();
    } else {
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        request.role = 'USER';
        next();
      }

      if (process.env.JWT_SECRET) {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
          if (error) {
            request.role = 'USER';
            next();
          }

          const decodedData = decoded as IUserModel;
          if (decodedData) {
            request.role = decodedData.role;
            request.requesterId = decodedData.id;
            next();
          }
        });
      }
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
