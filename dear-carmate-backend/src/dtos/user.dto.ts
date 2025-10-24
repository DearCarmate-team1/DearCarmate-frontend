import { z } from 'zod';

/**
 * User DTOs
 * 사용자 관련 데이터 전송 객체 및 Zod 스키마
 */

/**
 * 비밀번호 확인 요청 DTO
 * POST /users/check
 */
export const checkPasswordRequestSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type CheckPasswordRequestDto = z.infer<typeof checkPasswordRequestSchema>;

/**
 * 비밀번호 확인 응답 DTO
 */
export const checkPasswordResponseSchema = z.object({
  encryptedCurrentPassword: z.string(),
});

export type CheckPasswordResponseDto = z.infer<typeof checkPasswordResponseSchema>;

/**
 * 내 정보 수정 요청 DTO
 * PATCH /users/me
 */
export const updateProfileRequestSchema = z
  .object({
    imageUrl: z.string().nullable().optional(),
    phoneNumber: z.string().regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다'),
    employeeNumber: z.string().min(1, '사원번호를 입력해주세요'),
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(/[A-Za-z]/, '비밀번호는 최소 1개의 영문자를 포함해야 합니다')
      .regex(/[0-9]/, '비밀번호는 최소 1개의 숫자를 포함해야 합니다')
      .optional(),
    passwordConfirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      // password가 있으면 passwordConfirmation도 있어야 함
      if (data.password && !data.passwordConfirmation) {
        return false;
      }
      // 두 비밀번호가 일치해야 함
      if (data.password && data.password !== data.passwordConfirmation) {
        return false;
      }
      return true;
    },
    {
      message: '비밀번호가 일치하지 않습니다',
      path: ['passwordConfirmation'],
    },
  );

export type UpdateProfileRequestDto = z.infer<typeof updateProfileRequestSchema>;
