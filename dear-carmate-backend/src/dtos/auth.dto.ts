import { z } from 'zod';

// ============================================
// Login DTOs
// ============================================

/**
 * 로그인 요청 DTO Schema
 */
export const loginRequestSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

/**
 * 로그인 응답 DTO Schema
 */
export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    employeeNumber: z.string(),
    phoneNumber: z.string(),
    imageUrl: z.string().nullable(),
    isAdmin: z.boolean(),
    company: z
      .object({
        companyName: z.string(),
      })
      .nullable(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResponseDto = z.infer<typeof loginResponseSchema>;

// ============================================
// Register DTOs
// ============================================

/**
 * 회원가입 요청 DTO Schema
 */
export const registerRequestSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[A-Za-z]/, '비밀번호는 최소 1개의 영문자를 포함해야 합니다')
    .regex(/[0-9]/, '비밀번호는 최소 1개의 숫자를 포함해야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  employeeNumber: z.string().min(1, '사원번호를 입력해주세요'),
  phoneNumber: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '유효한 전화번호를 입력해주세요'),
  companyName: z.string().min(1, '회사명을 입력해주세요'),
  companyCode: z.string().min(1, '회사 인증코드를 입력해주세요'),
});

export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;

/**
 * 회원가입 응답 DTO Schema
 */
export const registerResponseSchema = loginResponseSchema;

export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;

// ============================================
// Token Refresh DTOs
// ============================================

/**
 * 토큰 갱신 요청 DTO Schema
 */
export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token이 필요합니다'),
});

export type RefreshTokenRequestDto = z.infer<typeof refreshTokenRequestSchema>;

/**
 * 토큰 갱신 응답 DTO Schema
 */
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type RefreshTokenResponseDto = z.infer<typeof refreshTokenResponseSchema>;

// ============================================
// User Info DTO
// ============================================

/**
 * 사용자 정보 DTO Schema (민감한 정보 제외)
 */
export const userInfoSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  employeeNumber: z.string(),
  phoneNumber: z.string(),
  imageUrl: z.string().nullable(),
  isAdmin: z.boolean(),
  company: z
    .object({
      companyName: z.string(),
    })
    .nullable(),
});

export type UserInfoDto = z.infer<typeof userInfoSchema>;
