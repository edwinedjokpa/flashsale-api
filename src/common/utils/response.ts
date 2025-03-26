interface ApiResponse<T> {
  success: boolean;
  status?: number;
  message: string;
  data?: T;
}

export function AppResponse<T>(
  success: boolean,
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success,
    message,
    data,
  };
}

// Adding static methods to AppResponse
AppResponse.Success = <T>(message: string, data?: T): ApiResponse<T> => {
  return AppResponse(true, message, data);
};

AppResponse.Error = <T>(message: string, data?: T): ApiResponse<T> => {
  return AppResponse(false, message, data);
};

export default AppResponse;
