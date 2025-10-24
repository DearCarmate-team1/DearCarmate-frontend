import type { Request, Response } from 'express';
import { healthService } from '@/services/health.service.js';
import { createSuccessResponse } from '@/types/api.types.js';
import { asyncHandler } from '@/middlewares/errorHandler.js';

/**
 * Health Check Controller
 * HTTP 요청/응답을 처리하는 계층
 */
export class HealthController {
  /**
   * GET /health
   * 시스템 헬스 체크
   */
  checkHealth = asyncHandler(async (_req: Request, res: Response) => {
    const healthData = await healthService.checkHealth();
    res.json(createSuccessResponse(healthData));
  });
}

// 싱글톤 인스턴스 export
export const healthController = new HealthController();
