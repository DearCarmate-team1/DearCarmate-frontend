import { Router } from 'express';
import { authController } from '@/controllers/auth.controller.js';
import { authenticate } from '@/middlewares/auth.js';

const router = Router();

/**
 * Public Routes (인증 불필요)
 */

// POST /api/auth/login - 로그인
router.post('/login', authController.login);

// POST /api/auth/register - 회원가입
router.post('/register', authController.register);

// POST /api/auth/refresh - 토큰 갱신
router.post('/refresh', authController.refreshToken);

/**
 * Protected Routes (인증 필요)
 */

// POST /api/auth/logout - 로그아웃
router.post('/logout', authenticate, authController.logout);

// GET /api/auth/me - 현재 사용자 정보
router.get('/me', authenticate, authController.getCurrentUser);

// POST /api/auth/change-password - 비밀번호 변경
router.post('/change-password', authenticate, authController.changePassword);

export default router;
