import type {
  CreateCompanyRequestDto,
  UpdateCompanyRequestDto,
  CompanyResponseDto,
  GetCompaniesQueryDto,
  GetCompanyUsersQueryDto,
  CompanyUserResponseDto,
} from '@/dtos/company.dto.js';
import { companyRepository } from '@/repositories/company.repository.js';
import { userRepository } from '@/repositories/user.repository.js';
import { NotFoundError, ConflictError } from '@/utils/errors.js';
import { mapCompanyToResponseDto, mapUserToCompanyUserDto } from '@/mappers/company.mapper.js';
import type { OffsetPagination } from '@/types/api.types.js';
import type { Prisma } from '@prisma/client';

/**
 * Company Service
 * 회사 관련 비즈니스 로직 처리
 */
export class CompanyService {
  /**
   * 회사 등록
   * POST /companies
   */
  async createCompany(dto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    // 1. 회사 코드 중복 체크
    const existingCompany = await companyRepository.findByCode(dto.companyCode);
    if (existingCompany) {
      throw new ConflictError('이미 사용 중인 회사 코드입니다');
    }

    // 2. 회사 생성
    const company = await companyRepository.create({
      companyName: dto.companyName,
      companyCode: dto.companyCode,
    });

    // 3. 응답 DTO 생성 (새로 생성된 회사는 사용자 수 0)
    return mapCompanyToResponseDto(company, 0);
  }

  /**
   * 회사 목록 조회 (페이지네이션 + 검색)
   * GET /companies
   */
  async getCompanies(
    query: GetCompaniesQueryDto,
  ): Promise<OffsetPagination<CompanyResponseDto>> {
    const { page, pageSize, searchBy, keyword } = query;

    // 1. 검색 조건 구성
    const where: Prisma.CompanyWhereInput = {};
    if (searchBy && keyword) {
      if (searchBy === 'companyName') {
        where.companyName = { contains: keyword, mode: 'insensitive' };
      } else if (searchBy === 'companyCode') {
        where.companyCode = { contains: keyword, mode: 'insensitive' };
      }
    }

    // 2. 회사 목록 조회
    const [companies, totalItemCount] = await Promise.all([
      companyRepository.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      companyRepository.count(where),
    ]);

    // 3. 각 회사의 사용자 수 조회
    const companiesWithUserCount = await Promise.all(
      companies.map(async (company) => {
        const userCount = await userRepository.countByCompanyId(company.id);
        return mapCompanyToResponseDto(company, userCount);
      }),
    );

    // 4. 페이지네이션 응답 생성
    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: companiesWithUserCount,
    };
  }

  /**
   * 회사 수정
   * PATCH /companies/:id
   */
  async updateCompany(
    id: string,
    dto: UpdateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    // 1. 회사 조회
    const company = await companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('회사를 찾을 수 없습니다');
    }

    // 2. 회사 코드 중복 체크 (변경하는 경우)
    if (dto.companyCode && dto.companyCode !== company.companyCode) {
      const existingCompany = await companyRepository.findByCode(dto.companyCode);
      if (existingCompany) {
        throw new ConflictError('이미 사용 중인 회사 코드입니다');
      }
    }

    // 3. 회사 업데이트
    const updatedCompany = await companyRepository.update(id, {
      ...(dto.companyName && { companyName: dto.companyName }),
      ...(dto.companyCode && { companyCode: dto.companyCode }),
    });

    // 4. 사용자 수 조회
    const userCount = await userRepository.countByCompanyId(id);

    // 5. 응답 DTO 생성
    return mapCompanyToResponseDto(updatedCompany, userCount);
  }

  /**
   * 회사 삭제
   * DELETE /companies/:id
   */
  async deleteCompany(id: string): Promise<void> {
    // 1. 회사 조회
    const company = await companyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('회사를 찾을 수 없습니다');
    }

    // 2. 회사에 속한 사용자가 있는지 확인
    const userCount = await userRepository.countByCompanyId(id);
    if (userCount > 0) {
      throw new ConflictError(
        '회사에 속한 사용자가 있어 삭제할 수 없습니다. 먼저 사용자를 삭제해주세요.',
      );
    }

    // 3. 회사 삭제
    await companyRepository.delete(id);
  }

  /**
   * 회사별 사용자 목록 조회 (페이지네이션 + 검색)
   * GET /companies/users
   */
  async getCompanyUsers(
    query: GetCompanyUsersQueryDto,
  ): Promise<OffsetPagination<CompanyUserResponseDto>> {
    const { page, pageSize, searchBy, keyword } = query;

    // 1. 검색 조건 구성
    const where: Prisma.UserWhereInput = {
      companyId: { not: null }, // 회사에 속한 사용자만
    };

    if (searchBy && keyword) {
      if (searchBy === 'companyName') {
        where.company = {
          companyName: { contains: keyword, mode: 'insensitive' },
        };
      } else if (searchBy === 'name') {
        where.name = { contains: keyword, mode: 'insensitive' };
      } else if (searchBy === 'email') {
        where.email = { contains: keyword, mode: 'insensitive' };
      }
    }

    // 2. 사용자 목록 조회
    const [users, totalItemCount] = await Promise.all([
      userRepository.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      userRepository.count(where),
    ]);

    // 3. DTO 변환
    const companyUsers = users.map((user) => mapUserToCompanyUserDto(user));

    // 4. 페이지네이션 응답 생성
    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: companyUsers,
    };
  }
}

// 싱글톤 인스턴스 export
export const companyService = new CompanyService();
