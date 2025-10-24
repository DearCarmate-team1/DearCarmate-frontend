import { Router } from 'express';
import { userController } from '@/controllers/user.controller.js';
import { authenticate, requireAdmin } from '@/middlewares/auth.js';

const router = Router();

/**
 * User Routes
 * 사용자 관련 API 엔드포인트
 */

/**
 * @route   POST /users
 * @desc    회원가입
 * @access  Public
 */
router.post('/', userController.register);

/**
 * @route   GET /users/me
 * @desc    내 정보 조회
 * @access  Private
 */
router.get('/me', authenticate, userController.getMe);

/**
 * @route   POST /users/check
 * @desc    비밀번호 확인
 * @access  Private
 */
router.post('/check', authenticate, userController.checkPassword);

/**
 * @route   PATCH /users/me
 * @desc    내 정보 수정
 * @access  Private
 */
router.patch('/me', authenticate, userController.updateMe);

/**
 * @route   DELETE /users/:id
 * @desc    사용자 삭제 (관리자용)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser);

export default router;
