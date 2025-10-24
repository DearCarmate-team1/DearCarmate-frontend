import { prisma } from '@/config/database.js';
import type { Company, Prisma } from '@prisma/client';

/**
 * Company Repository
 * 데이터베이스 접근 계층 - 회사 관련 데이터 조회/조작
 */
export class CompanyRepository {
  /**
   * ID로 회사 조회
   */
  async findById(id: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  /**
   * 회사 코드로 회사 조회
   */
  async findByCode(companyCode: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { companyCode },
    });
  }

  /**
   * 회사명과 코드로 회사 조회 (회원가입 시 검증용)
   */
  async findByNameAndCode(companyName: string, companyCode: string): Promise<Company | null> {
    return prisma.company.findFirst({
      where: {
        companyName,
        companyCode,
      },
    });
  }

  /**
   * 회사 생성
   */
  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return prisma.company.create({
      data,
    });
  }

  /**
   * 회사 수정
   */
  async update(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  /**
   * 회사 삭제
   */
  async delete(id: string): Promise<Company> {
    return prisma.company.delete({
      where: { id },
    });
  }

  /**
   * 회사 목록 조회 (페이지네이션)
   */
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput;
  }): Promise<Company[]> {
    return prisma.company.findMany({
      ...params,
    });
  }

  /**
   * 회사 수 조회
   */
  async count(where?: Prisma.CompanyWhereInput): Promise<number> {
    return prisma.company.count({ where });
  }

  /**
   * 회사 코드 중복 체크
   */
  async existsByCode(companyCode: string): Promise<boolean> {
    const count = await prisma.company.count({
      where: { companyCode },
    });
    return count > 0;
  }
}

// 싱글톤 인스턴스 export
export const companyRepository = new CompanyRepository();
