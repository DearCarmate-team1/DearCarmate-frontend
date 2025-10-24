import { prisma } from '@/config/database.js';
import { env } from '@/config/env.js';
import type { HealthResponseDto } from '@/dtos/health.dto.js';
import { DatabaseError } from '@/utils/errors.js';

/**
 * Health Check Service
 * 비즈니스 로직을 처리하는 계층
 */
export class HealthService {
  /**
   * 시스템 헬스 체크
   */
  async checkHealth(): Promise<HealthResponseDto> {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      environment: env.NODE_ENV,
    };
  }

  /**
   * 데이터베이스 연결 상태 확인
   */
  private async checkDatabase(): Promise<'connected' | 'disconnected'> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return 'connected';
    } catch (error) {
      throw new DatabaseError('Database connection failed');
    }
  }
}

// 싱글톤 인스턴스 export
export const healthService = new HealthService();
