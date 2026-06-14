import { Request } from 'express';
import { RequestData } from 'types/request-data';

interface User {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type AuthenticatedRequestData<
  TParams = unknown,
  TBody = unknown,
  TQuery = unknown,
> = RequestData<TParams, TBody, TQuery> & {
  user: User;
};
