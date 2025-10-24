import type { Request, Response } from 'express';
import { companyService } from '@/services/company.service.js';
import {
  createCompanyRequestSchema,
  updateCompanyRequestSchema,
  getCompaniesQuerySchema,
  getCompanyUsersQuerySchema,
} from '@/dtos/company.dto.js';
import { createSuccessResponse } from '@/types/api.types.js';
import { asyncHandler } from '@/middlewares/errorHandler.js';

/**
 * Company Controller
 * 회사 관련 HTTP 요청/응답 처리
 */
export class CompanyController {
  /**
   * POST /companies
   * 회사 등록
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    // 1. 요청 데이터 검증 (Zod)
    const dto = createCompanyRequestSchema.parse(req.body);

    // 2. 서비스 호출
    const company = await companyService.createCompany(dto);

    // 3. 응답
    res.status(201).json(createSuccessResponse(company));
  });

  /**
   * GET /companies
   * 회사 목록 조회 (페이지네이션 + 검색)
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    // 1. 쿼리 파라미터 검증 (Zod)
    const query = getCompaniesQuerySchema.parse(req.query);

    // 2. 서비스 호출
    const result = await companyService.getCompanies(query);

    // 3. 응답
    res.json(createSuccessResponse(result));
  });

  /**
   * PATCH /companies/:id
   * 회사 수정
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // 1. 요청 데이터 검증 (Zod)
    const dto = updateCompanyRequestSchema.parse(req.body);

    // 2. 서비스 호출
    const company = await companyService.updateCompany(id, dto);

    // 3. 응답
    res.json(createSuccessResponse(company));
  });

  /**
   * DELETE /companies/:id
   * 회사 삭제
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    // 서비스 호출
    await companyService.deleteCompany(id);

    // 응답
    res.json(
      createSuccessResponse({
        message: '회사가 삭제되었습니다',
      }),
    );
  });

  /**
   * GET /companies/users
   * 회사별 사용자 목록 조회 (페이지네이션 + 검색)
   */
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    // 1. 쿼리 파라미터 검증 (Zod)
    const query = getCompanyUsersQuerySchema.parse(req.query);

    // 2. 서비스 호출
    const result = await companyService.getCompanyUsers(query);

    // 3. 응답
    res.json(createSuccessResponse(result));
  });
}

// 싱글톤 인스턴스 export
export const companyController = new CompanyController();
