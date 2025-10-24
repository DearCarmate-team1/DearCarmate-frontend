import { Router } from 'express';
import { healthController } from '@/controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import companyRoutes from './company.routes.js';

const router = Router();

/**
 * Health Check Route
 * GET /health - 시스템 헬스 체크
 */
router.get('/health', healthController.checkHealth);

/**
 * API Routes
 */
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/companies', companyRoutes);

// TODO: 추가 예정
// router.use('/api/cars', carRoutes);
// router.use('/api/customers', customerRoutes);
// router.use('/api/contracts', contractRoutes);
// router.use('/api/documents', documentRoutes);

export default router;
