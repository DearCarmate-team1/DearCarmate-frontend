import type { Request, Response } from 'express';
import { authService } from '@/services/auth.service.js';
import {
  loginRequestSchema,
  registerRequestSchema,
  refreshTokenRequestSchema,
} from '@/dtos/auth.dto.js';
import { createSuccessResponse } from '@/types/api.types.js';
import { asyncHandler } from '@/middlewares/errorHandler.js';
import { mapUserToUserInfoDto } from '@/mappers/user.mapper.js';
import { env } from '@/config/env.js';

/**
 * Auth Controller
 * 인증 관련 HTTP 요청/응답 처리
 */
export class AuthController {
  /**
   * POST /api/auth/login
   * 로그인
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    // 1. 요청 데이터 검증 (Zod)
    const dto = loginRequestSchema.parse(req.body);

    // 2. 서비스 호출
    const result = await authService.login(dto);

    // 3. 쿠키에 토큰 저장
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    // 4. 응답
    res.json(createSuccessResponse(result));
  });

  /**
   * POST /api/auth/register
   * 회원가입
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // 1. 요청 데이터 검증 (Zod)
    const dto = registerRequestSchema.parse(req.body);

    // 2. 서비스 호출
    const result = await authService.register(dto);

    // 3. 쿠키에 토큰 저장
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    // 4. 응답
    res.status(201).json(createSuccessResponse(result));
  });

  /**
   * POST /api/auth/refresh
   * 토큰 갱신
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    // 1. 쿠키 또는 body에서 refresh token 추출
    const refreshToken =
      req.cookies.refreshToken || refreshTokenRequestSchema.parse(req.body).refreshToken;

    // 2. 서비스 호출
    const result = await authService.refreshToken(refreshToken);

    // 3. 쿠키에 새 토큰 저장
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    // 4. 응답
    res.json(createSuccessResponse(result));
  });

  /**
   * POST /api/auth/logout
   * 로그아웃 (쿠키 삭제)
   */
  logout = asyncHandler(async (_req: Request, res: Response) => {
    // 쿠키 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json(
      createSuccessResponse({
        message: '로그아웃되었습니다',
      }),
    );
  });

  /**
   * GET /api/auth/me
   * 현재 로그인한 사용자 정보 조회
   * - 인증 필요 (authenticate 미들웨어)
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    // req.user는 authenticate 미들웨어에서 설정됨
    const userId = req.user!.userId;

    // 서비스 호출
    const user = await authService.getCurrentUser(userId);

    // Mapper를 통해 민감한 정보 제외
    const userInfo = mapUserToUserInfoDto(user);

    res.json(createSuccessResponse(userInfo));
  });

  /**
   * POST /api/auth/change-password
   * 비밀번호 변경
   * - 인증 필요 (authenticate 미들웨어)
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

    res.json(
      createSuccessResponse({
        message: '비밀번호가 변경되었습니다',
      }),
    );
  });

  /**
   * 토큰을 HTTP-only 쿠키에 저장하는 헬퍼 함수
   */
  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = env.NODE_ENV === 'production';

    // Access Token 쿠키 (1시간)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Refresh Token 쿠키 (7일)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}

// 싱글톤 인스턴스 export
export const authController = new AuthController();
