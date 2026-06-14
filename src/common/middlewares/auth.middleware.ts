import { config } from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedException } from '../exceptions';
import catchAsync from '../utils/catch-async';

import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthenticatedRequest } from '@/modules/user/interfaces/user.inteface';

export const authMiddleware = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = decoded;
    next();
  }
);
