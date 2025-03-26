import AppResponse from './response';

export class HttpException extends Error {
  statusCode: number;
  message!: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  toResponse() {
    return AppResponse.Error(this.message);
  }
}
