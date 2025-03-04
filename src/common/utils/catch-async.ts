import { NextFunction, Request, Response } from "express";

const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => next(err));
  };
};

export default catchAsync;
