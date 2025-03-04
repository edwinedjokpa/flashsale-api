import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Http } from "@status/codes";

import { HttpException } from "../utils/http.exception";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new HttpException(
      Http.Unauthorized,
      "No token, authorization denied"
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (!decoded) {
      throw new HttpException(Http.Unauthorized, "Invalid token");
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
