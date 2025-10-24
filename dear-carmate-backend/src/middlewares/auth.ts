import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt.js';
import { UnauthorizedError, ForbiddenError, TenantIsolationError } from '@/utils/errors.js';

/**
 * JWT 인증 미들웨어
 * - Authorization 헤더 또는 쿠키에서 토큰 추출
 * - 토큰 검증 후 req.user에 사용자 정보 저장
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // 1. Authorization 헤더에서 토큰 추출
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 2. Authorization 헤더에 없으면 쿠키에서 추출
    if (!token) {
      token = req.cookies.accessToken as string | undefined;
    }

    // 3. 토큰이 없으면 에러
    if (!token) {
      throw new UnauthorizedError('인증 토큰이 필요합니다');
    }

    // 4. 토큰 검증
    const payload = verifyAccessToken(token);

    // 5. req.user에 사용자 정보 저장
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 관리자 권한 체크 미들웨어
 * - authenticate 미들웨어 이후에 사용
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증이 필요합니다');
    }

    if (!req.user.isAdmin) {
      throw new ForbiddenError('관리자 권한이 필요합니다');
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 회사 사용자 권한 체크 미들웨어
 * - authenticate 미들웨어 이후에 사용
 * - 플랫폼 관리자가 아니면서 회사에 속하지 않은 사용자 차단
 */
export function requireCompanyUser(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증이 필요합니다');
    }

    // 플랫폼 관리자는 통과
    if (req.user.isAdmin) {
      return next();
    }

    // 일반 사용자는 회사 ID가 필수
    if (!req.user.companyId) {
      throw new ForbiddenError('회사에 속한 사용자만 접근 가능합니다');
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Multi-Tenant 데이터 격리 체크 미들웨어
 * - URL 파라미터의 companyId가 사용자의 companyId와 일치하는지 검증
 * - 플랫폼 관리자는 모든 회사 접근 가능
 */
export function checkTenantAccess(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증이 필요합니다');
    }

    // 플랫폼 관리자는 모든 회사 접근 가능
    if (req.user.isAdmin) {
      return next();
    }

    // URL 파라미터에서 companyId 추출
    const targetCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;

    // companyId가 없으면 통과 (다른 체크에서 처리)
    if (!targetCompanyId) {
      return next();
    }

    // 사용자의 companyId와 대상 companyId 비교
    if (req.user.companyId !== targetCompanyId) {
      throw new TenantIsolationError('다른 회사의 데이터에 접근할 수 없습니다');
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional 인증 미들웨어
 * - 토큰이 있으면 검증하고, 없으면 그냥 통과
 * - Public API에서 로그인 사용자와 비로그인 사용자 모두 허용할 때 사용
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // Authorization 헤더에서 토큰 추출
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Authorization 헤더에 없으면 쿠키에서 추출
    if (!token) {
      token = req.cookies.accessToken as string | undefined;
    }

    // 토큰이 없으면 그냥 통과
    if (!token) {
      return next();
    }

    // 토큰이 있으면 검증
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
    } catch {
      // 토큰이 유효하지 않아도 에러를 발생시키지 않음
    }

    next();
  } catch (error) {
    next(error);
  }
}
