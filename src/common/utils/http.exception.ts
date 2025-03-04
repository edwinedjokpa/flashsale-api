export class HttpException extends Error {
  status: number;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }
  }
}
