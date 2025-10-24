import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
} from '@/dtos/auth.dto.js';
import { userRepository } from '@/repositories/user.repository.js';
import { companyRepository } from '@/repositories/company.repository.js';
import { hashPassword, verifyPassword } from '@/utils/password.js';
import { generateTokenPair, verifyRefreshToken } from '@/utils/jwt.js';
import {
  AuthenticationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  DuplicateResourceError,
} from '@/utils/errors.js';
import { mapUserAndTokensToLoginResponse, mapUserToJwtPayload } from '@/mappers/user.mapper.js';

/**
 * Auth Service
 * 인증 관련 비즈니스 로직 처리
 */
export class AuthService {
  /**
   * 로그인
   */
  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    // 1. 이메일로 사용자 조회
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AuthenticationError('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await verifyPassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    // 3. JWT 토큰 생성
    const jwtPayload = mapUserToJwtPayload(user);
    const tokens = generateTokenPair(jwtPayload);

    // 4. 응답 DTO 생성 (Mapper 사용)
    return mapUserAndTokensToLoginResponse(user, tokens);
  }

  /**
   * 회원가입
   */
  async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    // 1. 이메일 중복 체크
    const existingUser = await userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new DuplicateResourceError('User', 'email', dto.email);
    }

    // 2. 회사 검증 (회사명 + 회사코드)
    const company = await companyRepository.findByNameAndCode(dto.companyName, dto.companyCode);
    if (!company) {
      throw new NotFoundError('회사를 찾을 수 없습니다. 회사명과 인증코드를 확인해주세요.');
    }

    // 3. 회사 내 사원번호 중복 체크
    const existingEmployeeNumber = await userRepository.existsByEmployeeNumber(
      company.id,
      dto.employeeNumber,
    );
    if (existingEmployeeNumber) {
      throw new ConflictError('이미 사용 중인 사원번호입니다');
    }

    // 4. 비밀번호 해싱
    const hashedPassword = await hashPassword(dto.password);

    // 5. 사용자 생성
    const user = await userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      employeeNumber: dto.employeeNumber,
      phoneNumber: dto.phoneNumber,
      isAdmin: false,
      company: {
        connect: { id: company.id },
      },
    });

    // 6. JWT 토큰 생성
    const jwtPayload = mapUserToJwtPayload(user);
    const tokens = generateTokenPair(jwtPayload);

    // 7. 응답 DTO 생성
    return mapUserAndTokensToLoginResponse(user, tokens);
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    try {
      // 1. Refresh Token 검증
      const payload = verifyRefreshToken(refreshToken);

      // 2. 사용자 조회 (사용자가 삭제되었는지 확인)
      const user = await userRepository.findById(payload.userId);
      if (!user) {
        throw new AuthenticationError('사용자를 찾을 수 없습니다');
      }

      // 3. 새로운 토큰 페어 생성
      const jwtPayload = mapUserToJwtPayload(user);
      const tokens = generateTokenPair(jwtPayload);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new AuthenticationError('토큰 갱신에 실패했습니다');
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    return user;
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // 1. 사용자 조회
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }

    // 2. 현재 비밀번호 검증
    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('현재 비밀번호가 올바르지 않습니다');
    }

    // 3. 새 비밀번호와 현재 비밀번호가 같은지 체크
    if (currentPassword === newPassword) {
      throw new BadRequestError('새 비밀번호는 현재 비밀번호와 달라야 합니다');
    }

    // 4. 새 비밀번호 해싱
    const hashedPassword = await hashPassword(newPassword);

    // 5. 비밀번호 업데이트
    await userRepository.update(userId, {
      password: hashedPassword,
    });

    return true;
  }
}

// 싱글톤 인스턴스 export
export const authService = new AuthService();
