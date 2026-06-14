import { ErrorResponse } from '../utils/api-response';
import { HttpException } from '../utils/http.exception';

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super({ statusCode: 404, code: 'NOT_FOUND', message });
  }
}

export class ValidationException extends HttpException {
  constructor(
    message = 'Invalid request body',
    errors?: ErrorResponse['errors']
  ) {
    super({ statusCode: 400, code: 'VALIDATION_ERROR', message, errors });
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super({ statusCode: 401, code: 'UNAUTHORIZED', message });
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super({ statusCode: 403, code: 'FORBIDDEN', message });
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict') {
    super({ statusCode: 409, code: 'CONFLICT', message });
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string, errors?: ErrorResponse['errors']) {
    super({ statusCode: 409, code: 'BAD_REQUEST', message, errors });
  }
}
