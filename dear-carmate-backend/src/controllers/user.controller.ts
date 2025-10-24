import type { Request, Response } from 'express';
import { userService } from '@/services/user.service.js';
import { authService } from '@/services/auth.service.js';
import {
  checkPasswordRequestSchema,
  updateProfileRequestSchema,
} from '@/dtos/user.dto.js';
import { registerRequestSchema } from '@/dtos/auth.dto.js';
import { createSuccessResponse } from '@/types/api.types.js';
import { asyncHandler } from '@/middlewares/errorHandler.js';

/**
 * User Controller
 * 사용자 관련 HTTP 요청/응답 처리
 */
export class UserController {
  /**
   * POST /users
   * 회원가입
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    // 1. 요청 데이터 검증 (Zod)
    const dto = registerRequestSchema.parse(req.body);

    // 2. 서비스 호출 (authService 사용)
    const result = await authService.register(dto);

    // 3. 응답
    res.status(201).json(createSuccessResponse(result.user));
  });

  /**
   * GET /users/me
   * 내 정보 조회
   */
  getMe = asyncHandler(async (req: Request, res: Response) => {
    // req.user는 authenticate 미들웨어에서 설정됨
    const userId = req.user!.userId;

    // 서비스 호출
    const user = await userService.getCurrentUser(userId);

    res.json(createSuccessResponse(user));
  });

  /**
   * POST /users/check
   * 비밀번호 확인
   */
  checkPassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    // 1. 요청 데이터 검증 (Zod)
    const dto = checkPasswordRequestSchema.parse(req.body);

    // 2. 서비스 호출
    const result = await userService.checkPassword(userId, dto);

    // 3. 응답
    res.json(createSuccessResponse(result));
  });

  /**
   * PATCH /users/me
   * 내 정보 수정
   */
  updateMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    // 1. 요청 데이터 검증 (Zod)
    const dto = updateProfileRequestSchema.parse(req.body);

    // 2. 서비스 호출
    const updatedUser = await userService.updateProfile(userId, dto);

    // 3. 응답
    res.json(createSuccessResponse(updatedUser));
  });

  /**
   * DELETE /users/:id
   * 사용자 삭제 (관리자용)
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const adminUserId = req.user!.userId;
    const targetUserId = req.params.id as string;

    // 서비스 호출
    await userService.deleteUser(adminUserId, targetUserId);

    // 응답
    res.json(
      createSuccessResponse({
        message: '사용자가 삭제되었습니다',
      }),
    );
  });
}

// 싱글톤 인스턴스 export
export const userController = new UserController();
