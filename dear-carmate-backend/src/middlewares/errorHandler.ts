import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError, isAppError, ValidationError, DatabaseError } from '@/utils/errors.js';
import { createErrorResponse } from '@/types/api.types.js';

/**
 * Express 에러 핸들링 미들웨어
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  // 이미 응답이 전송된 경우 처리하지 않음
  if (res.headersSent) {
    return;
  }

  // Zod 유효성 검사 에러
  if (err instanceof ZodError) {
    const validationError = new ValidationError('Request validation failed', {
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      })),
    });

    return res.status(validationError.statusCode).json(
      createErrorResponse(validationError.code, validationError.message, validationError.details),
    );
  }

  // Prisma 에러
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const dbError = handlePrismaError(err);
    return res
      .status(dbError.statusCode)
      .json(createErrorResponse(dbError.code, dbError.message, dbError.details));
  }

  // 커스텀 AppError
  if (isAppError(err)) {
    return res
      .status(err.statusCode)
      .json(createErrorResponse(err.code, err.message, err.details));
  }

  // 예상치 못한 에러
  console.error('Unexpected error:', err);

  return res.status(500).json(
    createErrorResponse(
      'INTERNAL_SERVER_ERROR',
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message || 'Internal server error',
      process.env.NODE_ENV === 'development'
        ? {
            stack: err.stack,
            name: err.name,
          }
        : undefined,
    ),
  );
}

/**
 * Prisma 에러를 AppError로 변환
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    // Unique constraint 위반
    case 'P2002': {
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] || 'field';
      return new ValidationError(`${field} already exists`, {
        field,
        constraint: 'unique',
      });
    }

    // Foreign key constraint 위반
    case 'P2003':
      return new ValidationError('Referenced record does not exist', {
        constraint: 'foreign_key',
      });

    // Record not found
    case 'P2025':
      return new DatabaseError('Record not found', {
        operation: error.meta?.cause,
      });

    // Timeout
    case 'P2024':
      return new DatabaseError('Database operation timed out');

    default:
      return new DatabaseError('Database operation failed', {
        code: error.code,
        meta: error.meta,
      });
  }
}

/**
 * 404 Not Found 핸들러
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(
    createErrorResponse('NOT_FOUND', `Route ${req.method} ${req.path} not found`, {
      method: req.method,
      path: req.path,
    }),
  );
}

/**
 * Async 핸들러 래퍼
 * Express 라우트 핸들러에서 async/await 사용 시 에러를 자동으로 catch
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
