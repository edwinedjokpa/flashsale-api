import { Request } from 'express';

export type ValidatedRequest<
  TParams = never,
  TBody = never,
  TQuery = never,
> = Request & {
  validated: {
    params: TParams;
    body: TBody;
    query: TQuery;
  };
};
