interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

export function createResponse<T>(
  success: boolean,
  status: number,
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success,
    status,
    message,
    data,
  };
}
