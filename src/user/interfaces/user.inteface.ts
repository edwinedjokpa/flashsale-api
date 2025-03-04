import { Request } from "express";

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RequestWithUser extends Request {
  user?: { id: string; email: string };
}
