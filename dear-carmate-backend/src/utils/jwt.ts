import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';
import { TokenError } from './errors.js';

/**
 * JWT Payload 타입
 */
export interface JwtPayload {
  userId: string;
  email: string;
  companyId: string | null;
  isAdmin: boolean;
}

/**
 * 토큰 페어 타입
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Access Token 생성
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload as object, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: 'dear-carmate',
    audience: 'dear-carmate-api',
  } as jwt.SignOptions);
}

/**
 * Refresh Token 생성
 */
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload as object, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    issuer: 'dear-carmate',
    audience: 'dear-carmate-api',
  } as jwt.SignOptions);
}

/**
 * Access Token과 Refresh Token 페어 생성
 */
export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Access Token 검증
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'dear-carmate',
      audience: 'dear-carmate-api',
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenError('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TokenError('Invalid access token');
    }
    throw new TokenError('Token verification failed');
  }
}

/**
 * Refresh Token 검증
 */
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'dear-carmate',
      audience: 'dear-carmate-api',
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenError('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TokenError('Invalid refresh token');
    }
    throw new TokenError('Token verification failed');
  }
}

/**
 * 토큰에서 Payload 추출 (검증 없이)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
