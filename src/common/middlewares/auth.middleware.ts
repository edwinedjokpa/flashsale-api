import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Http } from '@status/codes';

import { HttpException } from '../utils/http.exception';
import catchAsync from '../utils/catch-async';
import { RequestWithUser } from 'user/interfaces/user.inteface';
import { JwtPayload } from 'auth/interfaces/jwt-payload.interface';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new HttpException(
        Http.Unauthorized,
        'No token, authorization denied'
      );
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decodedToken) {
      throw new HttpException(Http.Unauthorized, 'Invalid token');
    }

    req.user = decodedToken;
    next();
  }
);
