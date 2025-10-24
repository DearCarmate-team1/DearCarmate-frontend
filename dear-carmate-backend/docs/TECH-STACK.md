# Dear Carmate Backend - 기술 스택

## 📋 개요

**Dear Carmate**는 중고차 계약 관리 서비스의 백엔드 API 서버입니다.
Multi-tenant 아키텍처를 통해 여러 중고차 회사가 독립적으로 데이터를 관리할 수 있습니다.

---

## 🚀 핵심 기술 스택

### **Runtime & Language**
- **Node.js**: 18.x LTS
- **TypeScript**: 5.x
- **패키지 매니저**: npm

### **웹 프레임워크**
- **Express.js**: 4.x
- **CORS**: 크로스 오리진 요청 처리
- **Helmet**: 보안 헤더 설정
- **Morgan**: HTTP 요청 로깅

### **데이터베이스**
- **PostgreSQL**: 15.x
- **Prisma ORM**: 5.x
  - Type-safe 데이터베이스 접근
  - 마이그레이션 관리
  - 스키마 중심 개발

### **인증 & 보안**
- **JSON Web Token (JWT)**: 토큰 기반 인증
- **bcryptjs**: 비밀번호 해싱
- **cookie-parser**: 쿠키 기반 토큰 저장
- **express-rate-limit**: API 요청 제한

### **파일 처리**
- **Multer**: 파일 업로드 처리
- **Sharp**: 이미지 리사이징/최적화
- **CSV-parser**: CSV 파일 파싱

### **이메일 서비스**
- **Nodemailer**: 이메일 발송
- **Handlebars**: 이메일 템플릿 엔진

### **유효성 검사**
- **Joi**: 요청 데이터 유효성 검사
- **express-validator**: Express 미들웨어 기반 검증

### **로깅 & 모니터링**
- **Winston**: 구조화된 로깅
- **Morgan**: HTTP 요청 로깅

### **개발 도구**
- **Nodemon**: 개발 시 자동 재시작
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks 관리
- **Jest**: 단위 테스트 프레임워크
- **Supertest**: API 테스트

### **배포 & 인프라**
- **Docker**: 컨테이너화
- **PM2**: 프로덕션 프로세스 관리
- **환경변수**: dotenv를 통한 설정 관리

---

## 🏗️ 아키텍처 패턴

### **Layered Architecture**
```
┌─────────────────┐
│   Controllers   │ ← HTTP 요청/응답 처리
├─────────────────┤
│    Services     │ ← 비즈니스 로직
├─────────────────┤
│   Repositories  │ ← 데이터 접근 층
├─────────────────┤
│   Prisma ORM    │ ← 데이터베이스 추상화
└─────────────────┘
```

### **Multi-Tenant 데이터 격리**
- 모든 주요 엔티티에 `companyId` 필드
- Prisma 미들웨어를 통한 자동 필터링
- 회사별 데이터 완전 분리

### **에러 처리**
- 커스텀 에러 클래스 계층구조
- 중앙집중식 에러 핸들링 미들웨어
- 구조화된 에러 응답

---

## 📁 프로젝트 구조

```
dear-carmate-backend/
├── src/
│   ├── controllers/        # HTTP 요청 처리
│   ├── services/          # 비즈니스 로직
│   ├── repositories/      # 데이터 접근 계층
│   ├── middlewares/       # Express 미들웨어
│   ├── utils/            # 유틸리티 함수
│   ├── types/            # TypeScript 타입 정의
│   ├── config/           # 설정 파일
│   └── app.ts            # Express 앱 설정
├── prisma/
│   ├── schema.prisma     # Prisma 스키마
│   ├── migrations/       # 데이터베이스 마이그레이션
│   └── seed.ts          # 시드 데이터
├── uploads/              # 업로드된 파일
├── tests/               # 테스트 파일
├── docs/                # 문서
├── docker-compose.yml   # Docker 구성
├── Dockerfile          # Docker 이미지
└── package.json        # 의존성 및 스크립트
```

---

## 🔧 개발 환경 설정

### **필수 요구사항**
- Node.js 18.x 이상
- PostgreSQL 15.x 이상
- npm 또는 yarn

### **환경변수**
```env
# 서버 설정
PORT=3001
NODE_ENV=development

# 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/dear_carmate"

# JWT 설정
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# 쿠키 설정
COOKIE_SECRET=your-cookie-secret

# 이메일 설정
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 파일 업로드
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB

# 프론트엔드 URL (CORS)
FRONTEND_URL=http://localhost:3000
```

### **개발 명령어**
```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시드 데이터 생성
npx prisma db seed

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 테스트 실행
npm test

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format
```

---

## 🔒 보안 고려사항

### **인증 & 인가**
- JWT 토큰을 HTTP-only 쿠키에 저장
- Access Token (1시간) + Refresh Token (7일) 구조
- 토큰 자동 갱신 메커니즘

### **데이터 보호**
- bcrypt를 통한 비밀번호 해싱 (라운드 12)
- Prisma의 타입 안전성을 통한 SQL 인젝션 방지
- 입력 데이터 유효성 검사

### **API 보안**
- CORS 정책 설정
- Rate limiting (분당 100회 요청 제한)
- Helmet을 통한 보안 헤더 설정
- 민감한 데이터 로깅 제외

### **Multi-Tenant 보안**
- 모든 데이터 조회 시 companyId 자동 필터링
- 회사 간 데이터 접근 차단
- 관리자 권한 분리

---

## 📊 성능 최적화

### **데이터베이스**
- 적절한 인덱스 설정
- 연관 데이터 일괄 조회 (N+1 문제 해결)
- 페이지네이션 구현
- 트랜잭션을 통한 데이터 무결성

### **API 응답**
- 필요한 필드만 조회하는 selective loading
- 압축 미들웨어 적용
- 적절한 HTTP 캐시 헤더 설정

### **파일 처리**
- 파일 크기 제한
- 이미지 최적화 및 리사이징
- 청크 단위 파일 업로드

---

## 🧪 테스트 전략

### **단위 테스트**
- Service 계층 로직 테스트
- Utility 함수 테스트
- Jest + TypeScript 설정

### **통합 테스트**
- API 엔드포인트 테스트
- 데이터베이스 통합 테스트
- Supertest 활용

### **E2E 테스트**
- 주요 사용자 플로우 테스트
- 프론트엔드와 백엔드 통합 시나리오

---

## 📈 모니터링 & 로깅

### **로깅 전략**
- Winston을 통한 구조화된 로깅
- 로그 레벨별 분류 (error, warn, info, debug)
- 요청/응답 로깅
- 에러 추적을 위한 컨텍스트 정보 포함

### **모니터링**
- API 응답 시간 측정
- 에러율 추적
- 데이터베이스 쿼리 성능 모니터링

---

## 🚀 배포 고려사항

### **Docker 컨테이너화**
- Multi-stage 빌드를 통한 이미지 최적화
- 환경별 Docker Compose 설정
- 건강 상태 체크 엔드포인트

### **CI/CD**
- GitHub Actions를 통한 자동 테스트
- 코드 품질 검사 자동화
- 자동 배포 파이프라인

### **프로덕션 설정**
- PM2를 통한 프로세스 관리
- 로드 밸런싱 고려
- 환경별 설정 분리
- 백업 및 복구 전략

이 기술 스택은 Dear Carmate 서비스의 요구사항을 충족하면서도 확장성과 유지보수성을 고려한 현대적인 백엔드 아키텍처입니다.