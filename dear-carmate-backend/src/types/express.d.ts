import type { JwtPayload } from '@/utils/jwt';

/**
 * Express Request 타입 확장
 * JWT 인증 후 사용자 정보를 Request 객체에 추가
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
