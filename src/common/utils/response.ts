interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message: string;
  data?: T;
}

export const createSuccessResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const createErrorResponse = <T>(
  message: string,
  data?: T
): ApiResponse<T> => ({
  success: false,
  message,
  data,
});
