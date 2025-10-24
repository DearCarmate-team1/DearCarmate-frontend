import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import router from './routes/index.js';

/**
 * Express 애플리케이션 생성 및 설정
 */
export function createApp() {
  const app = express();

  // ============================================
  // Security Middlewares
  // ============================================

  // Helmet - 보안 헤더 설정
  app.use(helmet());

  // CORS - Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Rate Limiting - API 요청 제한
  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // ============================================
  // Body Parsing Middlewares
  // ============================================

  // JSON body parser
  app.use(express.json({ limit: '10mb' }));

  // URL-encoded body parser
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser
  app.use(cookieParser(env.COOKIE_SECRET));

  // ============================================
  // Logging Middleware
  // ============================================

  app.use(requestLogger);

  // ============================================
  // Routes
  // ============================================

  // Mount all routes
  app.use('/', router);

  // ============================================
  // Error Handling
  // ============================================

  // 404 Not Found handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}
