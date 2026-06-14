import { ValidatedRequest } from './validated-request';

export type RequestData<
  TParams = unknown,
  TBody = unknown,
  TQuery = unknown,
> = ValidatedRequest<TParams, TBody, TQuery>;
