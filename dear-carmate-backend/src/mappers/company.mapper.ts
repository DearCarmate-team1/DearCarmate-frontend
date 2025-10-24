import type { Company, User } from '@prisma/client';
import type { CompanyResponseDto, CompanyUserResponseDto } from '@/dtos/company.dto.js';

/**
 * Company Mapper
 * Prisma 모델을 DTO로 변환하는 순수 함수들
 */

/**
 * Company 모델을 CompanyResponseDto로 변환
 * userCount는 서비스 계층에서 계산하여 전달
 */
export function mapCompanyToResponseDto(
  company: Company,
  userCount: number,
): CompanyResponseDto {
  return {
    id: company.id,
    companyName: company.companyName,
    companyCode: company.companyCode,
    userCount,
  };
}

/**
 * User 모델을 CompanyUserResponseDto로 변환
 * (imageUrl, isAdmin 제외)
 */
export function mapUserToCompanyUserDto(
  user: User & { company: Company | null },
): CompanyUserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    employeeNumber: user.employeeNumber,
    phoneNumber: user.phoneNumber,
    company: user.company
      ? {
          companyName: user.company.companyName,
        }
      : {
          companyName: '',
        },
  };
}
