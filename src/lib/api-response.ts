/**
 * Standard API Response Types and Helper Functions
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// HTTP Status Codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Codes
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

/**
 * Success Response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = HttpStatus.OK
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Created Response (201)
 */
export function createdResponse<T>(data: T, message = 'Created successfully'): Response {
  return successResponse(data, message, HttpStatus.CREATED);
}

/**
 * Error Response
 */
export function errorResponse(
  error: ApiError,
  status: number = HttpStatus.INTERNAL_SERVER_ERROR
): Response {
  const body: ApiResponse = {
    success: false,
    error,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Bad Request Response (400)
 */
export function badRequestResponse(message: string, details?: Record<string, unknown>): Response {
  return errorResponse(
    {
      code: ErrorCode.BAD_REQUEST,
      message,
      details,
    },
    HttpStatus.BAD_REQUEST
  );
}

/**
 * Unauthorized Response (401)
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(
    {
      code: ErrorCode.UNAUTHORIZED,
      message,
    },
    HttpStatus.UNAUTHORIZED
  );
}

/**
 * Forbidden Response (403)
 */
export function forbiddenResponse(message = 'Forbidden'): Response {
  return errorResponse(
    {
      code: ErrorCode.FORBIDDEN,
      message,
    },
    HttpStatus.FORBIDDEN
  );
}

/**
 * Not Found Response (404)
 */
export function notFoundResponse(resource: string): Response {
  return errorResponse(
    {
      code: ErrorCode.NOT_FOUND,
      message: `${resource} not found`,
    },
    HttpStatus.NOT_FOUND
  );
}

/**
 * Conflict Response (409)
 */
export function conflictResponse(message: string): Response {
  return errorResponse(
    {
      code: ErrorCode.CONFLICT,
      message,
    },
    HttpStatus.CONFLICT
  );
}

/**
 * Validation Error Response (400)
 */
export function validationErrorResponse(
  details: Record<string, unknown>
): Response {
  return errorResponse(
    {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details,
    },
    HttpStatus.BAD_REQUEST
  );
}

/**
 * Internal Server Error Response (500)
 */
export function internalErrorResponse(message = 'Internal server error'): Response {
  return errorResponse(
    {
      code: ErrorCode.INTERNAL_ERROR,
      message,
    },
    HttpStatus.INTERNAL_SERVER_ERROR
  );
}

/**
 * No Content Response (204)
 */
export function noContentResponse(): Response {
  return new Response(null, {
    status: HttpStatus.NO_CONTENT,
    headers: { 'Content-Type': 'application/json' },
  });
}
