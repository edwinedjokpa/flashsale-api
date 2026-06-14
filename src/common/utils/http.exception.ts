import { createErrorResponse, ErrorResponse } from './api-response';

export class HttpException extends Error {
  statusCode: number;
  code: string;
  errors?: ErrorResponse['errors'];
  details?: unknown;

  constructor({
    statusCode,
    code,
    message,
    errors,
    details,
  }: Omit<ErrorResponse, 'success'>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.details = details;
  }

  toResponse(): ErrorResponse {
    return createErrorResponse({
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      errors: this.errors,
      details: this.details,
    });
  }
}
