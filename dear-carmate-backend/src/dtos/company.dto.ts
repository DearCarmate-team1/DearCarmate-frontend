import { z } from 'zod';

/**
 * Company DTOs
 * 회사 관련 데이터 전송 객체 및 Zod 스키마
 */

/**
 * 회사 등록 요청 DTO
 * POST /companies
 */
export const createCompanyRequestSchema = z.object({
  companyName: z.string().min(1, '회사명을 입력해주세요'),
  companyCode: z.string().min(1, '회사 코드를 입력해주세요'),
});

export type CreateCompanyRequestDto = z.infer<typeof createCompanyRequestSchema>;

/**
 * 회사 수정 요청 DTO
 * PATCH /companies/:id
 */
export const updateCompanyRequestSchema = z.object({
  companyName: z.string().min(1, '회사명을 입력해주세요').optional(),
  companyCode: z.string().min(1, '회사 코드를 입력해주세요').optional(),
});

export type UpdateCompanyRequestDto = z.infer<typeof updateCompanyRequestSchema>;

/**
 * 회사 응답 DTO
 */
export const companyResponseSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  companyCode: z.string(),
  userCount: z.number(),
});

export type CompanyResponseDto = z.infer<typeof companyResponseSchema>;

/**
 * 회사별 사용자 응답 DTO
 */
export const companyUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  employeeNumber: z.string(),
  phoneNumber: z.string(),
  company: z.object({
    companyName: z.string(),
  }),
});

export type CompanyUserResponseDto = z.infer<typeof companyUserResponseSchema>;

/**
 * 회사 목록 조회 쿼리 파라미터 DTO
 * GET /companies
 */
export const getCompaniesQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  pageSize: z.string().optional().default('10').transform(Number),
  searchBy: z.enum(['companyName', 'companyCode']).optional(),
  keyword: z.string().optional().default(''),
});

export type GetCompaniesQueryDto = z.infer<typeof getCompaniesQuerySchema>;

/**
 * 회사별 사용자 목록 조회 쿼리 파라미터 DTO
 * GET /companies/users
 */
export const getCompanyUsersQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  pageSize: z.string().optional().default('10').transform(Number),
  searchBy: z.enum(['companyName', 'name', 'email']).optional(),
  keyword: z.string().optional().default(''),
});

export type GetCompanyUsersQueryDto = z.infer<typeof getCompanyUsersQuerySchema>;
