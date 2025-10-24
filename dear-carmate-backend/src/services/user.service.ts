import type {
  CheckPasswordRequestDto,
  CheckPasswordResponseDto,
  UpdateProfileRequestDto,
} from '@/dtos/user.dto.js';
import { userRepository } from '@/repositories/user.repository.js';
import { hashPassword, verifyPassword } from '@/utils/password.js';
import { NotFoundError, BadRequestError, ConflictError } from '@/utils/errors.js';
import { mapUserToUserInfoDto } from '@/mappers/user.mapper.js';
import type { UserInfoDto } from '@/dtos/auth.dto.js';

/**
 * User Service
 * 사용자 관련 비즈니스 로직 처리
 */
export class UserService {
  /**
   * 비밀번호 확인
   * POST /users/check
   */
  async checkPassword(
    userId: string,
    dto: CheckPasswordRequestDto,
  ): Promise<CheckPasswordResponseDto> {
    // 1. 사용자 조회
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await verifyPassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('비밀번호가 올바르지 않습니다');
    }

    // 3. 암호화된 비밀번호 반환 (프론트엔드에서 다시 사용하기 위함)
    return {
      encryptedCurrentPassword: user.password,
    };
  }

  /**
   * 내 정보 수정
   * PATCH /users/me
   */
  async updateProfile(userId: string, dto: UpdateProfileRequestDto): Promise<UserInfoDto> {
    // 1. 사용자 조회
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    // 2. 현재 비밀번호 검증
    const isPasswordValid = await verifyPassword(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('현재 비밀번호가 올바르지 않습니다');
    }

    // 3. 사원번호 중복 체크 (본인 제외)
    if (dto.employeeNumber !== user.employeeNumber && user.companyId) {
      const existingEmployeeNumber = await userRepository.existsByEmployeeNumber(
        user.companyId,
        dto.employeeNumber,
      );
      if (existingEmployeeNumber) {
        throw new ConflictError('이미 사용 중인 사원번호입니다');
      }
    }

    // 4. 새 비밀번호 해싱 (변경하는 경우)
    let hashedPassword: string | undefined;
    if (dto.password) {
      // 새 비밀번호와 현재 비밀번호가 같은지 체크
      if (dto.password === dto.currentPassword) {
        throw new BadRequestError('새 비밀번호는 현재 비밀번호와 달라야 합니다');
      }
      hashedPassword = await hashPassword(dto.password);
    }

    // 5. 사용자 정보 업데이트
    const updatedUser = await userRepository.update(userId, {
      phoneNumber: dto.phoneNumber,
      employeeNumber: dto.employeeNumber,
      imageUrl: dto.imageUrl,
      ...(hashedPassword && { password: hashedPassword }),
    });

    // 6. 응답 DTO 생성
    return mapUserToUserInfoDto(updatedUser);
  }

  /**
   * 사용자 삭제 (관리자용)
   * DELETE /users/:id
   */
  async deleteUser(adminUserId: string, targetUserId: string): Promise<void> {
    // 1. 관리자 확인
    const admin = await userRepository.findById(adminUserId);
    if (!admin || !admin.isAdmin) {
      throw new BadRequestError('관리자 권한이 필요합니다');
    }

    // 2. 대상 사용자 조회
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    // 3. 자기 자신 삭제 방지
    if (adminUserId === targetUserId) {
      throw new BadRequestError('자기 자신을 삭제할 수 없습니다');
    }

    // 4. 사용자 삭제
    await userRepository.delete(targetUserId);
  }

  /**
   * 현재 사용자 정보 조회
   * GET /users/me
   * (auth.service.ts에도 있지만, 통일성을 위해 여기에도 추가)
   */
  async getCurrentUser(userId: string): Promise<UserInfoDto> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    return mapUserToUserInfoDto(user);
  }
}

// 싱글톤 인스턴스 export
export const userService = new UserService();
