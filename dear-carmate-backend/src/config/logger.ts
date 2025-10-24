import winston from 'winston';
import { env } from './env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// 로그 포맷 정의
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${message}`;

  // 추가 메타데이터가 있으면 포함
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }

  // 스택 트레이스가 있으면 포함
  if (stack) {
    log += `\n${stack}`;
  }

  return log;
});

// Winston 로거 생성
export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // 에러 로그 파일
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // 전체 로그 파일
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// 개발 환경에서는 더 많은 로그 출력
if (env.NODE_ENV === 'development') {
  logger.debug('Logger initialized in development mode');
}
