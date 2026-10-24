
export interface ServiceError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };

export function success<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function failure<T = never>(
  error: ServiceError,
): ServiceResult<T> {
  return { success: false, error };
}
