import { prisma } from '@/config/database.js';
import type { User, Prisma } from '@prisma/client';

/**
 * User Repository
 * 데이터베이스 접근 계층 - Prisma ORM을 통한 데이터 조회/조작
 */
export class UserRepository {
  /**
   * 이메일로 사용자 조회
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * ID로 사용자 조회
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * 회사 내 사원번호로 사용자 조회
   */
  async findByEmployeeNumber(companyId: string, employeeNumber: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        companyId_employeeNumber: {
          companyId,
          employeeNumber,
        },
      },
    });
  }

  /**
   * 사용자 생성
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * 사용자 수정
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * 사용자 삭제
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * 회사 ID로 사용자 목록 조회
   */
  async findByCompanyId(companyId: string): Promise<User[]> {
    return prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 전체 사용자 수 조회
   */
  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  }

  /**
   * 이메일 중복 체크
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  /**
   * 회사 내 사원번호 중복 체크
   */
  async existsByEmployeeNumber(companyId: string, employeeNumber: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        companyId,
        employeeNumber,
      },
    });
    return count > 0;
  }

  /**
   * 회사별 사용자 수 조회
   */
  async countByCompanyId(companyId: string): Promise<number> {
    return prisma.user.count({
      where: { companyId },
    });
  }

  /**
   * 사용자 목록 조회 (페이지네이션, 검색)
   */
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return prisma.user.findMany({
      ...params,
      include: {
        company: true,
      },
    });
  }
}

// 싱글톤 인스턴스 export
export const userRepository = new UserRepository();
