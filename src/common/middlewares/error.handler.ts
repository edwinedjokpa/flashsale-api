import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/http.exception";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error!",
    stack: err.stack || "",
  });
};
