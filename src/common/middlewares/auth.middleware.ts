import { Http } from '@status/codes';
import { config } from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catch-async';
import { HttpException } from '../utils/http.exception';

import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthenticatedRequest } from '@/modules/user/interfaces/user.inteface';

export const authMiddleware = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new HttpException(
        Http.Unauthorized,
        'Authentication token is missing'
      );
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    if (!decoded) {
      throw new HttpException(Http.Unauthorized, 'Invalid token');
    }

    req.user = decoded;
    next();
  }
);
