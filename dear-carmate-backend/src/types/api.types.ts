// ============================================
// API Response 표준 타입
// ============================================

/**
 * 성공 응답 타입
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

/**
 * 에러 응답 타입
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * 통합 API 응답 타입
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 페이지네이션 메타 정보
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Offset 기반 페이지네이션 응답 타입 (프론트엔드 스펙)
 */
export interface OffsetPagination<T> {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: T[];
}

/**
 * 페이지네이션 쿼리 파라미터
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/**
 * 정렬 쿼리 파라미터
 */
export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 검색 쿼리 파라미터
 */
export interface SearchQuery {
  search?: string;
}

// ============================================
// Response Helper 함수들
// ============================================

/**
 * 성공 응답 생성
 */
export function createSuccessResponse<T>(data: T, meta?: PaginationMeta): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

/**
 * 에러 응답 생성
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown,
): ApiErrorResponse {
  const error: ApiErrorResponse['error'] = {
    code,
    message,
  };

  if (details !== undefined) {
    error.details = details;
  }

  return {
    success: false,
    error,
  };
}
