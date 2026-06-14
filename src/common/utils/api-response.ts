import { ZodError } from 'zod';

interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
  details?: unknown;
}

export const createSuccessResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const createErrorResponse = ({
  statusCode,
  code,
  message,
  errors,
  details,
}: Omit<ErrorResponse, 'success'>): ErrorResponse => ({
  success: false,
  statusCode,
  code,
  message,
  errors,
  details,
});

export const formatZodErrors = (error: ZodError): Record<string, string[]> => {
  return error.issues.reduce(
    (acc, issue) => {
      const key = issue.path.join('.');
      if (!acc[key]) acc[key] = [];
      acc[key].push(issue.message);
      return acc;
    },
    {} as Record<string, string[]>
  );
};
