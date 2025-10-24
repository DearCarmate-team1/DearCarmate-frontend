import { Router } from 'express';
import { companyController } from '@/controllers/company.controller.js';
import { authenticate, requireAdmin } from '@/middlewares/auth.js';

const router = Router();

/**
 * Company Routes
 * 회사 관련 API 엔드포인트
 * 모든 엔드포인트는 인증 필요
 * 생성/수정/삭제는 관리자 권한 필요
 */

/**
 * @route   POST /companies
 * @desc    회사 등록
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, companyController.create);

/**
 * @route   GET /companies/users
 * @desc    회사별 사용자 목록 조회
 * @access  Private (Admin only)
 * @note    이 라우트는 /companies/:id 보다 먼저 정의되어야 함
 */
router.get('/users', authenticate, requireAdmin, companyController.getUsers);

/**
 * @route   GET /companies
 * @desc    회사 목록 조회 (페이지네이션 + 검색)
 * @access  Private (Admin only)
 */
router.get('/', authenticate, requireAdmin, companyController.getAll);

/**
 * @route   PATCH /companies/:id
 * @desc    회사 수정
 * @access  Private (Admin only)
 */
router.patch('/:id', authenticate, requireAdmin, companyController.update);

/**
 * @route   DELETE /companies/:id
 * @desc    회사 삭제
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, companyController.delete);

export default router;
