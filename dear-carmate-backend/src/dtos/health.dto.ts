import { z } from 'zod';

/**
 * Health Check Response DTO Schema
 */
export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  uptime: z.number(),
  database: z.enum(['connected', 'disconnected']),
  environment: z.string(),
});

/**
 * Health Check Response DTO Type
 */
export type HealthResponseDto = z.infer<typeof healthResponseSchema>;

/**
 * DTO 생성 헬퍼 함수
 */
export function createHealthResponseDto(data: HealthResponseDto): HealthResponseDto {
  return healthResponseSchema.parse(data);
}
