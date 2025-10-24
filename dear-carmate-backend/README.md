# Dear Carmate Backend

**중고차 계약 관리 서비스의 백엔드 API 서버**

---

## 📋 프로젝트 개요

Dear Carmate는 중고차 딜러들을 위한 통합 계약 관리 플랫폼입니다. Multi-tenant 아키텍처를 통해 여러 중고차 회사가 독립적으로 차량, 고객, 계약을 관리할 수 있습니다.

### 🎯 주요 기능
- **Multi-tenant 회사 관리**: 회사별 완전 분리된 데이터 관리
- **계약 워크플로우**: 7단계 계약 진행 상태 관리
- **칸반 보드**: 드래그 앤 드롭으로 계약 상태 변경
- **파일 관리**: 계약서 업로드/다운로드, 이미지 처리
- **대용량 업로드**: CSV를 통한 차량/고객 데이터 일괄 등록
- **통계 대시보드**: 매출, 계약 현황 실시간 분석
- **알림 시스템**: 미팅 리마인더, 계약서 자동 이메일 발송

---

## 🚀 기술 스택

### **Backend**
- **Runtime**: Node.js 22.x + TypeScript 5.x
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 15.x + Prisma ORM 5.x
- **Authentication**: JWT + HTTP-only Cookies

### **Key Libraries**
- **Security**: bcryptjs, helmet, express-rate-limit
- **File Upload**: multer, sharp
- **Email**: nodemailer, handlebars
- **Validation**: joi, express-validator
- **Testing**: jest, supertest
- **Logging**: winston, morgan

---

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────┐
│              Frontend App               │
│         (Next.js + TypeScript)         │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST API
┌─────────────────▼───────────────────────┐
│             Express Server              │
├─────────────────────────────────────────┤
│  Controllers │ Services │ Repositories  │
├─────────────────────────────────────────┤
│              Prisma ORM                 │
├─────────────────────────────────────────┤
│            PostgreSQL DB                │
└─────────────────────────────────────────┘
```

### **Multi-Tenant Architecture**
- 모든 데이터 엔티티에 `companyId` 필드 포함
- JWT 토큰에서 회사 정보 추출하여 자동 필터링
- 회사 간 데이터 완전 격리

---

## 📁 프로젝트 구조

```
dear-carmate-backend/
├── docs/                     # 프로젝트 문서
│   ├── TECH-STACK.md        # 기술 스택 상세 설명
│   ├── REQUIREMENTS.md      # 요구사항 명세서
│   └── IMPLEMENTATION-PLAN.md # 개발 계획서
├── src/
│   ├── controllers/         # HTTP 요청 처리
│   ├── services/           # 비즈니스 로직
│   ├── repositories/       # 데이터 접근 계층
│   ├── middlewares/        # Express 미들웨어
│   ├── utils/             # 유틸리티 함수
│   ├── types/             # TypeScript 타입 정의
│   ├── config/            # 설정 파일
│   └── app.ts             # Express 앱 설정
├── prisma/
│   ├── schema.prisma      # 데이터베이스 스키마
│   ├── migrations/        # DB 마이그레이션
│   └── seed.ts           # 시드 데이터
├── uploads/               # 업로드된 파일 저장소
├── tests/                # 테스트 파일
└── README.md
```

---

## 🔧 개발 환경 설정

### **필수 요구사항**
- Node.js 18.x 이상
- PostgreSQL 15.x 이상
- npm 또는 yarn

### **설치 및 실행**

1. **저장소 클론**
```bash
git clone <repository-url>
cd dear-carmate-backend
```

2. **의존성 설치**
```bash
npm install
```

3. **환경변수 설정**
```bash
cp .env.example .env
# .env 파일을 열어 필요한 값들을 설정
```

4. **데이터베이스 설정**
```bash
# PostgreSQL 데이터베이스 생성
createdb dear_carmate

# Prisma 마이그레이션 실행
npx prisma migrate dev

# 시드 데이터 생성
npx prisma db seed
```

5. **개발 서버 시작**
```bash
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

---

## 🌍 환경변수 설정

`.env` 파일에 다음 변수들을 설정해주세요:

```env
# 서버 설정
PORT=3001
NODE_ENV=development

# 데이터베이스
DATABASE_URL="postgresql://username:password@localhost:5432/dear_carmate"

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# 쿠키 설정
COOKIE_SECRET=your-cookie-secret

# 이메일 설정 (선택사항)
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

---

## 🗃️ 데이터베이스 구조

### **주요 엔티티**
- **Company**: 중고차 회사 정보
- **User**: 사용자 (관리자/직원)
- **Car**: 차량 정보
- **Customer**: 고객 정보
- **Contract**: 계약 정보
- **ContractDocument**: 계약서 문서
- **Notification**: 알림 관리

### **계약 워크플로우**
```
차량 확인 → 가격 협의 → 계약 초안 → 계약 성공
                    ↘               ↗
                      계약 실패
```

---

## 🔐 인증 시스템

### **사용자 유형**
1. **플랫폼 관리자**: 전체 시스템 관리 권한
2. **회사 직원**: 소속 회사 데이터만 접근 가능

### **토큰 구조**
- **Access Token**: 1시간 유효, API 인증용
- **Refresh Token**: 7일 유효, 토큰 갱신용
- **저장 방식**: HTTP-only 쿠키 (보안)

### **인증 플로우**
1. 로그인 → Access + Refresh Token 발급
2. API 요청 시 Access Token 검증
3. 토큰 만료 시 자동 갱신
4. Refresh Token 만료 시 재로그인 필요

---

## 📡 API 엔드포인트

### **인증 관련**
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신

### **사용자 관리**
- `POST /users` - 회원가입
- `GET /users/me` - 내 정보 조회
- `PATCH /users/me` - 내 정보 수정
- `DELETE /users/me` - 회원 탈퇴

### **회사 관리** (관리자 전용)
- `POST /companies` - 회사 등록
- `GET /companies` - 회사 목록
- `PATCH /companies/{id}` - 회사 수정
- `DELETE /companies/{id}` - 회사 삭제

### **차량 관리**
- `POST /cars` - 차량 등록
- `GET /cars` - 차량 목록 조회
- `GET /cars/{id}` - 차량 상세 조회
- `PATCH /cars/{id}` - 차량 수정
- `DELETE /cars/{id}` - 차량 삭제
- `POST /cars/upload` - 차량 대용량 업로드

### **고객 관리**
- `POST /customers` - 고객 등록
- `GET /customers` - 고객 목록 조회
- `PATCH /customers/{id}` - 고객 수정
- `DELETE /customers/{id}` - 고객 삭제
- `POST /customers/upload` - 고객 대용량 업로드

### **계약 관리**
- `POST /contracts` - 계약 등록
- `GET /contracts` - 계약 목록 조회 (칸반)
- `PATCH /contracts/{id}` - 계약 수정
- `DELETE /contracts/{id}` - 계약 삭제

### **파일 관리**
- `POST /images/upload` - 이미지 업로드
- `POST /contractDocuments/upload` - 계약서 업로드
- `GET /contractDocuments/{id}/download` - 문서 다운로드

### **통계**
- `GET /dashboard` - 대시보드 통계

---

## 🧪 테스트

### **테스트 실행**
```bash
# 전체 테스트
npm test

# 테스트 감시 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage
```

### **테스트 구조**
- **단위 테스트**: Service 계층 비즈니스 로직
- **통합 테스트**: API 엔드포인트 전체 플로우
- **목표 커버리지**: 80% 이상

---

## 📊 개발 스크립트

```bash
# 개발 서버 (자동 재시작)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format

# 데이터베이스 마이그레이션
npx prisma migrate dev

# Prisma 스튜디오 (DB GUI)
npx prisma studio

# 시드 데이터 재생성
npx prisma db seed
```

---

## 🔍 개발 가이드

### **코딩 컨벤션**
- **언어**: TypeScript 엄격 모드
- **스타일**: Prettier + ESLint 설정 준수
- **네이밍**: camelCase (변수/함수), PascalCase (클래스/인터페이스)
- **파일명**: kebab-case

### **Git 워크플로우**
1. `main` 브랜치에서 feature 브랜치 생성
2. 기능 개발 및 테스트 작성
3. Pull Request 생성
4. 코드 리뷰 후 병합

### **브랜치 네이밍**
- `feature/auth-system`
- `bugfix/fix-login-error`
- `hotfix/security-patch`

---

## 🚀 배포

### **Docker 사용**
```bash
# Docker 이미지 빌드
docker build -t dear-carmate-backend .

# Docker Compose로 전체 스택 실행
docker-compose up -d
```

### **프로덕션 체크리스트**
- [ ] 환경변수 설정 확인
- [ ] 데이터베이스 마이그레이션 실행
- [ ] SSL 인증서 설정
- [ ] 로깅 및 모니터링 설정
- [ ] 백업 전략 수립

---

## 📚 문서

- **[기술 스택 상세](./docs/TECH-STACK.md)**: 사용된 기술들의 자세한 설명
- **[요구사항 명세](./docs/REQUIREMENTS.md)**: 전체 기능 요구사항
- **[구현 계획](./docs/IMPLEMENTATION-PLAN.md)**: 단계별 개발 계획

---

## 🤝 기여하기

1. 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다
3. 변경사항을 커밋합니다
4. 브랜치에 푸시합니다
5. Pull Request를 생성합니다

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 🆘 문제 해결

### **자주 발생하는 문제**

1. **데이터베이스 연결 오류**
   ```bash
   # PostgreSQL 서비스 상태 확인
   brew services list | grep postgresql
   
   # 서비스 시작
   brew services start postgresql
   ```

2. **Prisma 마이그레이션 오류**
   ```bash
   # 데이터베이스 리셋
   npx prisma migrate reset
   
   # 새로운 마이그레이션 생성
   npx prisma migrate dev --name init
   ```

3. **포트 충돌**
   - 다른 서비스가 3001 포트를 사용 중인지 확인
   - `.env` 파일에서 PORT 변경

### **로그 확인**
```bash
# 개발 환경 로그
npm run dev

# 프로덕션 로그
pm2 logs dear-carmate
```

---

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

- **이슈 생성**: [GitHub Issues](링크)
- **문서**: [프로젝트 위키](링크)

---

**Happy Coding! 🚗💨**