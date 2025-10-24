// ============================================
// Custom Error Classes
// ============================================

/**
 * 기본 애플리케이션 에러
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - 잘못된 요청
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', details?: unknown) {
    super('BAD_REQUEST', message, 400, details);
  }
}

/**
 * 401 Unauthorized - 인증 실패
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super('UNAUTHORIZED', message, 401, details);
  }
}

/**
 * 403 Forbidden - 권한 없음
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super('FORBIDDEN', message, 403, details);
  }
}

/**
 * 404 Not Found - 리소스를 찾을 수 없음
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found', details?: unknown) {
    super('NOT_FOUND', message, 404, details);
  }
}

/**
 * 409 Conflict - 리소스 충돌
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource Conflict', details?: unknown) {
    super('CONFLICT', message, 409, details);
  }
}

/**
 * 422 Unprocessable Entity - 유효성 검사 실패
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation Failed', details?: unknown) {
    super('VALIDATION_ERROR', message, 422, details);
  }
}

/**
 * 500 Internal Server Error - 서버 내부 오류
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error', details?: unknown) {
    super('INTERNAL_SERVER_ERROR', message, 500, details);
  }
}

/**
 * 503 Service Unavailable - 서비스 이용 불가
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service Unavailable', details?: unknown) {
    super('SERVICE_UNAVAILABLE', message, 503, details);
  }
}

// ============================================
// 도메인 특화 에러들
// ============================================

/**
 * 인증 관련 에러
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: unknown) {
    super('AUTHENTICATION_ERROR', message, 401, details);
  }
}

/**
 * 토큰 관련 에러
 */
export class TokenError extends AppError {
  constructor(message: string = 'Invalid or expired token', details?: unknown) {
    super('TOKEN_ERROR', message, 401, details);
  }
}

/**
 * 중복 리소스 에러
 */
export class DuplicateResourceError extends AppError {
  constructor(resource: string, field: string, value: string) {
    super('DUPLICATE_RESOURCE', `${resource} with ${field} '${value}' already exists`, 409, {
      resource,
      field,
      value,
    });
  }
}

/**
 * 리소스를 찾을 수 없는 에러
 */
export class ResourceNotFoundError extends AppError {
  constructor(resource: string, identifier?: string | number) {
    super(
      'RESOURCE_NOT_FOUND',
      identifier ? `${resource} with identifier '${identifier}' not found` : `${resource} not found`,
      404,
      { resource, identifier },
    );
  }
}

/**
 * 데이터베이스 에러
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: unknown) {
    super('DATABASE_ERROR', message, 500, details);
  }
}

/**
 * 파일 업로드 에러
 */
export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed', details?: unknown) {
    super('FILE_UPLOAD_ERROR', message, 400, details);
  }
}

/**
 * Multi-tenant 데이터 격리 위반 에러
 */
export class TenantIsolationError extends AppError {
  constructor(message: string = 'Access to another company data is not allowed') {
    super('TENANT_ISOLATION_ERROR', message, 403);
  }
}

// ============================================
// Error Helper Functions
// ============================================

/**
 * AppError 인스턴스인지 확인
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 에러를 안전하게 처리하여 AppError로 변환
 */
export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message, {
      originalError: error.name,
      stack: error.stack,
    });
  }

  return new InternalServerError('Unknown error occurred', { error });
}
