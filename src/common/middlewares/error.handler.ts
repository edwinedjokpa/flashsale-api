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
      status: err.status,
      message: err.message,
    });

    return;
  }

  res.status(500).json({
    success: false,
    status: 500,
    message: err.message || "Internal Server Error!",
    stack: err.stack || "",
  });

  return;
};
