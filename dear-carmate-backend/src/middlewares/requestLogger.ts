import morgan from 'morgan';
import type { Request, Response } from 'express';
import { logger } from '@/config/logger.js';

// Morgan 스트림을 Winston으로 연결
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// 개발/프로덕션 환경에 따라 다른 포맷 사용
const morganFormat =
  process.env.NODE_ENV === 'production'
    ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    : ':method :url :status :response-time ms - :res[content-length]';

// Morgan 미들웨어 설정
export const requestLogger = morgan(morganFormat, {
  stream,
  skip: (req: Request, res: Response) => {
    // Health check 엔드포인트는 로깅 스킵 (노이즈 감소)
    if (req.path === '/health' && res.statusCode === 200) {
      return true;
    }
    return false;
  },
});
