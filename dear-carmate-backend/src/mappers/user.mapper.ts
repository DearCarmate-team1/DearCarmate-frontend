import type { User, Company } from '@prisma/client';
import type { UserInfoDto, LoginResponseDto } from '@/dtos/auth.dto.js';
import type { TokenPair } from '@/utils/jwt.js';

/**
 * Prisma User 모델을 UserInfoDto로 변환
 * - 비밀번호 필드를 제외한 사용자 정보 반환
 * - 사이드 이펙트 없이 순수하게 데이터 변환만 수행
 */
export function mapUserToUserInfoDto(
  user: User & { company?: Company | null },
): UserInfoDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    employeeNumber: user.employeeNumber,
    phoneNumber: user.phoneNumber,
    imageUrl: user.imageUrl,
    isAdmin: user.isAdmin,
    company: user.company
      ? {
          companyName: user.company.companyName,
        }
      : null,
  };
}

/**
 * User와 Token을 LoginResponseDto로 변환
 */
export function mapUserAndTokensToLoginResponse(
  user: User & { company?: Company | null },
  tokens: TokenPair,
): LoginResponseDto {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      employeeNumber: user.employeeNumber,
      phoneNumber: user.phoneNumber,
      imageUrl: user.imageUrl,
      isAdmin: user.isAdmin,
      company: user.company
        ? {
            companyName: user.company.companyName,
          }
        : null,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

/**
 * User를 JWT Payload로 변환
 */
export function mapUserToJwtPayload(user: User) {
  return {
    userId: user.id,
    email: user.email,
    companyId: user.companyId,
    isAdmin: user.isAdmin,
  };
}
