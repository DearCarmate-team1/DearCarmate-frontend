# Dear Carmate Prisma Database Schema

Node.js + TypeScript + Express + Prisma + PostgreSQL 기술 스택을 위한 데이터베이스 스키마 설계입니다.

## 📋 개요

### 기술 스택
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **Framework**: Express.js

### 데이터베이스 특징
- Multi-tenant 아키텍처 (회사별 데이터 분리)
- JWT 토큰 기반 인증
- 계약 상태 워크플로우 관리
- 파일 업로드 지원
- 감사 로그 (created_at, updated_at)

---

## 🗃️ Prisma Schema

### schema.prisma
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ma/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//////////////////////////////////
// Company Management
//////////////////////////////////

model Company {
  id          Int      @id @default(autoincrement())
  companyCode String   @unique @db.VarChar(50)
  companyName String   @db.VarChar(200)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  users               User[]
  cars                Car[]
  customers           Customer[]
  contracts           Contract[]
  contractDocuments   ContractDocument[]
  refreshTokens       RefreshToken[]
  uploadedImages      UploadedImage[]
  notifications       Notification[]
  notificationSettings NotificationSettings?

  @@map("companies")
}

//////////////////////////////////
// User Management & Authentication
//////////////////////////////////

model User {
  id             Int     @id @default(autoincrement())
  name           String  @db.VarChar(100)
  email          String  @unique @db.VarChar(255)
  passwordHash   String  @map("password_hash") @db.Text
  employeeNumber String  @map("employee_number") @db.VarChar(50)
  phoneNumber    String  @map("phone_number") @db.VarChar(20)
  imageUrl       String? @map("image_url") @db.Text
  companyId      Int     @map("company_id")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // Relations
  company       Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)
  contracts     Contract[]
  refreshTokens RefreshToken[]

  // Indexes
  @@index([companyId])
  @@index([email])
  @@unique([employeeNumber, companyId], name: "unique_employee_per_company")
  @@map("users")
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  token     String   @unique @db.Text
  userId    Int      @map("user_id")
  companyId Int      @map("company_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId])
  @@index([expiresAt])
  @@map("refresh_tokens")
}

//////////////////////////////////
// Car Management
//////////////////////////////////

enum CarStatus {
  POSSESSION           @map("possession")
  CONTRACT_PROCEEDING  @map("contractProceeding")
  CONTRACT_COMPLETED   @map("contractCompleted")

  @@map("CarStatus")
}

model Car {
  id                Int       @id @default(autoincrement())
  carNumber         String    @map("car_number") @db.VarChar(20)
  manufacturer      String    @db.VarChar(50)
  model             String    @db.VarChar(100)
  manufacturingYear Int       @map("manufacturing_year")
  mileage           Int
  price             Int       @db.Integer
  accidentCount     Int       @map("accident_count") @default(0)
  explanation       String    @db.Text @default("")
  accidentDetails   String    @map("accident_details") @db.Text @default("")
  status            CarStatus @default(POSSESSION)
  companyId         Int       @map("company_id")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relations
  company   Company    @relation(fields: [companyId], references: [id], onDelete: Cascade)
  contracts Contract[]

  // Indexes
  @@index([companyId])
  @@index([status])
  @@index([manufacturer])
  @@index([model])
  @@unique([carNumber, companyId], name: "unique_car_per_company")
  @@map("cars")
}

model CarModel {
  id           Int    @id @default(autoincrement())
  manufacturer String @db.VarChar(50)
  model        String @db.VarChar(100)

  // Indexes
  @@unique([manufacturer, model])
  @@index([manufacturer])
  @@map("car_models")
}

//////////////////////////////////
// Customer Management
//////////////////////////////////

enum Gender {
  MALE   @map("male")
  FEMALE @map("female")

  @@map("Gender")
}

enum AgeGroup {
  TEENS    @map("10대")
  TWENTIES @map("20대")
  THIRTIES @map("30대")
  FORTIES  @map("40대")
  FIFTIES  @map("50대")
  SIXTIES  @map("60대")
  SEVENTIES @map("70대")
  EIGHTIES  @map("80대")

  @@map("AgeGroup")
}

enum Region {
  SEOUL       @map("서울")
  GYEONGGI    @map("경기")
  INCHEON     @map("인천")
  GANGWON     @map("강원")
  CHUNGBUK    @map("충북")
  CHUNGNAM    @map("충남")
  DAEJEON     @map("대전")
  GYEONGBUK   @map("경북")
  GYEONGNAM   @map("경남")
  DAEGU       @map("대구")
  ULSAN       @map("울산")
  BUSAN       @map("부산")
  JEONBUK     @map("전북")
  JEONNAM     @map("전남")
  GWANGJU     @map("광주")
  JEJU        @map("제주")

  @@map("Region")
}

model Customer {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(100)
  gender      Gender
  phoneNumber String    @map("phone_number") @db.VarChar(20)
  ageGroup    AgeGroup? @map("age_group")
  region      Region?
  email       String    @db.VarChar(255)
  memo        String    @db.Text @default("")
  companyId   Int       @map("company_id")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  company   Company    @relation(fields: [companyId], references: [id], onDelete: Cascade)
  contracts Contract[]

  // Indexes
  @@index([companyId])
  @@index([name])
  @@index([email])
  @@index([phoneNumber])
  @@map("customers")
}

//////////////////////////////////
// Contract Management
//////////////////////////////////

enum ContractStatus {
  CONTACT_RECEIVED           @map("contactReceived")
  FIRST_MEETING_SCHEDULED    @map("firstMeetingScheduled")
  FIRST_MEETING_COMPLETED    @map("firstMeetingCompleted")
  CAR_INSPECTION_SCHEDULED   @map("carInspectionScheduled")
  CAR_INSPECTION_COMPLETED   @map("carInspectionCompleted")
  CONTRACT_IN_PROGRESS       @map("contractInProgress")
  CONTRACT_COMPLETED         @map("contractCompleted")

  @@map("ContractStatus")
}

model Contract {
  id             Int            @id @default(autoincrement())
  meetings       Json           @default("[]") // Array of Meeting objects
  contractPrice  Int?           @map("contract_price")
  resolutionDate DateTime?      @map("resolution_date")
  status         ContractStatus @default(CONTACT_RECEIVED)
  carId          Int            @map("car_id")
  customerId     Int            @map("customer_id")
  userId         Int?           @map("user_id")
  companyId      Int            @map("company_id")
  createdAt      DateTime       @default(now()) @map("created_at")
  updatedAt      DateTime       @updatedAt @map("updated_at")

  // Relations
  car               Car                @relation(fields: [carId], references: [id], onDelete: Restrict)
  customer          Customer           @relation(fields: [customerId], references: [id], onDelete: Restrict)
  user              User?              @relation(fields: [userId], references: [id], onDelete: SetNull)
  company           Company            @relation(fields: [companyId], references: [id], onDelete: Cascade)
  contractDocuments ContractDocument[]
  notifications     Notification[]

  // Indexes
  @@index([companyId])
  @@index([status])
  @@index([carId])
  @@index([customerId])
  @@index([userId])
  @@index([createdAt])
  @@map("contracts")
}

//////////////////////////////////
// Contract Document Management
//////////////////////////////////

model ContractDocument {
  id           Int       @id @default(autoincrement())
  contractName String    @map("contract_name") @db.VarChar(255)
  originalName String    @map("original_name") @db.VarChar(255)
  filePath     String    @map("file_path") @db.Text
  fileSize     Int       @map("file_size")
  mimeType     String    @map("mime_type") @db.VarChar(100)
  contractId   Int?      @map("contract_id") // Nullable for draft documents
  companyId    Int       @map("company_id")
  isDraft      Boolean   @map("is_draft") @default(false)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  contract Contract? @relation(fields: [contractId], references: [id], onDelete: SetNull)
  company  Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([companyId])
  @@index([contractId])
  @@index([isDraft])
  @@map("contract_documents")
}

//////////////////////////////////
// Dashboard & Analytics
//////////////////////////////////

// This view will be created manually for dashboard analytics
// CREATE VIEW dashboard_metrics AS ...

//////////////////////////////////
// Notification System
//////////////////////////////////

enum NotificationType {
  MEETING_REMINDER_YESTERDAY @map("meeting_reminder_yesterday")
  MEETING_REMINDER_TODAY     @map("meeting_reminder_today")
  CONTRACT_STATUS_UPDATE     @map("contract_status_update")
  DOCUMENT_UPLOAD           @map("document_upload")

  @@map("NotificationType")
}

enum NotificationStatus {
  PENDING   @map("pending")
  SENT      @map("sent")
  DELIVERED @map("delivered")
  FAILED    @map("failed")

  @@map("NotificationStatus")
}

model NotificationTemplate {
  id           Int              @id @default(autoincrement())
  type         NotificationType @unique
  subject      String           @db.VarChar(255)
  emailBody    String           @map("email_body") @db.Text
  smsBody      String?          @map("sms_body") @db.Text
  variables    Json             @default("[]") // 템플릿 변수 목록
  isActive     Boolean          @map("is_active") @default(true)
  createdAt    DateTime         @default(now()) @map("created_at")
  updatedAt    DateTime         @updatedAt @map("updated_at")

  // Relations
  notifications Notification[]

  @@map("notification_templates")
}

model Notification {
  id         Int                @id @default(autoincrement())
  type       NotificationType
  contractId Int                @map("contract_id")
  templateId Int                @map("template_id")
  recipients Json               // 수신자 정보 배열
  variables  Json               @default("{}") // 템플릿 변수 값들
  status     NotificationStatus @default(PENDING)
  scheduledAt DateTime          @map("scheduled_at")
  sentAt     DateTime?          @map("sent_at")
  deliveredAt DateTime?         @map("delivered_at")
  errorMessage String?          @map("error_message") @db.Text
  companyId  Int                @map("company_id")
  createdAt  DateTime           @default(now()) @map("created_at")
  updatedAt  DateTime           @updatedAt @map("updated_at")

  // Relations
  contract Contract           @relation(fields: [contractId], references: [id], onDelete: Cascade)
  template NotificationTemplate @relation(fields: [templateId], references: [id])
  company  Company            @relation(fields: [companyId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([contractId])
  @@index([status])
  @@index([scheduledAt])
  @@index([companyId])
  @@map("notifications")
}

model NotificationSettings {
  id              Int     @id @default(autoincrement())
  companyId       Int     @unique @map("company_id")
  emailEnabled    Boolean @map("email_enabled") @default(true)
  smsEnabled      Boolean @map("sms_enabled") @default(false)
  defaultAlarmHour Int    @map("default_alarm_hour") @default(9) // 기본 알림 시간 (24시간 형식)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("notification_settings")
}

//////////////////////////////////
// File Upload Metadata
//////////////////////////////////

model UploadedImage {
  id        Int      @id @default(autoincrement())
  imageUrl  String   @map("image_url") @db.Text
  filePath  String   @map("file_path") @db.Text
  fileSize  Int      @map("file_size")
  mimeType  String   @map("mime_type") @db.VarChar(100)
  companyId Int      @map("company_id")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([companyId])
  @@map("uploaded_images")
}

//////////////////////////////////
// Audit Log (Optional)
//////////////////////////////////

model AuditLog {
  id        Int      @id @default(autoincrement())
  tableName String   @map("table_name") @db.VarChar(50)
  recordId  Int      @map("record_id")
  action    String   @db.VarChar(20) // CREATE, UPDATE, DELETE
  oldData   Json?    @map("old_data")
  newData   Json?    @map("new_data")
  userId    Int?     @map("user_id")
  companyId Int      @map("company_id")
  createdAt DateTime @default(now()) @map("created_at")

  // Indexes
  @@index([tableName, recordId])
  @@index([userId])
  @@index([companyId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 📊 데이터베이스 마이그레이션

### Initial Migration
```sql
-- 1. 회사 테이블 생성
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_code VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. 사용자 테이블 생성
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    employee_number VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    image_url TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_number, company_id)
);

-- 3. 리프레시 토큰 테이블
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. 차량 상태 열거형
CREATE TYPE "CarStatus" AS ENUM ('possession', 'contractProceeding', 'contractCompleted');

-- 5. 차량 테이블
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    car_number VARCHAR(20) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturing_year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    price INTEGER NOT NULL,
    accident_count INTEGER NOT NULL DEFAULT 0,
    explanation TEXT NOT NULL DEFAULT '',
    accident_details TEXT NOT NULL DEFAULT '',
    status "CarStatus" NOT NULL DEFAULT 'possession',
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(car_number, company_id)
);

-- 6. 차량 모델 마스터 데이터
CREATE TABLE car_models (
    id SERIAL PRIMARY KEY,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE(manufacturer, model)
);

-- 7. 고객 관련 열거형들
CREATE TYPE "Gender" AS ENUM ('male', 'female');
CREATE TYPE "AgeGroup" AS ENUM ('10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대');
CREATE TYPE "Region" AS ENUM ('서울', '경기', '인천', '강원', '충북', '충남', '대전', '경북', '경남', '대구', '울산', '부산', '전북', '전남', '광주', '제주');

-- 8. 고객 테이블
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender "Gender" NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    age_group "AgeGroup",
    region "Region",
    email VARCHAR(255) NOT NULL,
    memo TEXT NOT NULL DEFAULT '',
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. 계약 상태 열거형
CREATE TYPE "ContractStatus" AS ENUM (
    'contactReceived', 
    'firstMeetingScheduled', 
    'firstMeetingCompleted',
    'carInspectionScheduled',
    'carInspectionCompleted',
    'contractInProgress',
    'contractCompleted'
);

-- 10. 계약 테이블
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    meetings JSONB NOT NULL DEFAULT '[]',
    contract_price INTEGER,
    resolution_date TIMESTAMP,
    status "ContractStatus" NOT NULL DEFAULT 'contactReceived',
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. 계약서 문서 테이블
CREATE TABLE contract_documents (
    id SERIAL PRIMARY KEY,
    contract_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    is_draft BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. 알림 시스템 테이블들
CREATE TYPE "NotificationType" AS ENUM (
    'meeting_reminder_yesterday',
    'meeting_reminder_today', 
    'contract_status_update',
    'document_upload'
);

CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'delivered', 'failed');

CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    type "NotificationType" UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_body TEXT NOT NULL,
    sms_body TEXT,
    variables JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    type "NotificationType" NOT NULL,
    contract_id INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    template_id INTEGER NOT NULL REFERENCES notification_templates(id),
    recipients JSONB NOT NULL,
    variables JSONB NOT NULL DEFAULT '{}',
    status "NotificationStatus" NOT NULL DEFAULT 'pending',
    scheduled_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_message TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_settings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER UNIQUE NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    sms_enabled BOOLEAN NOT NULL DEFAULT false,
    default_alarm_hour INTEGER NOT NULL DEFAULT 9,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. 업로드된 이미지 테이블
CREATE TABLE uploaded_images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. 감사 로그 테이블 (선택사항)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id INTEGER,
    company_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔍 인덱스 최적화

### 성능 최적화 인덱스
```sql
-- 회사별 데이터 조회 최적화
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_cars_company_id ON cars(company_id);
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_contracts_company_id ON contracts(company_id);

-- 검색 기능 최적화
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_manufacturer ON cars(manufacturer);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone_number);

-- 계약 워크플로우 최적화
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_car_id ON contracts(car_id);
CREATE INDEX idx_contracts_customer_id ON contracts(customer_id);
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);

-- 토큰 관리 최적화
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- 파일 관리 최적화
CREATE INDEX idx_contract_documents_company_id ON contract_documents(company_id);
CREATE INDEX idx_contract_documents_contract_id ON contract_documents(contract_id);
CREATE INDEX idx_contract_documents_is_draft ON contract_documents(is_draft);

-- 알림 시스템 최적화
CREATE INDEX idx_notifications_contract_id ON notifications(contract_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX idx_notifications_company_id ON notifications(company_id);
CREATE INDEX idx_notification_settings_company_id ON notification_settings(company_id);

-- 감사 로그 최적화
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- 복합 인덱스 (자주 사용되는 쿼리 패턴)
CREATE INDEX idx_cars_company_status ON cars(company_id, status);
CREATE INDEX idx_contracts_company_status ON contracts(company_id, status);
CREATE INDEX idx_customers_company_name ON customers(company_id, name);
```

---

## 🚀 Prisma Client 사용 예시

### 환경 설정
```typescript
// prisma/schema.prisma 설정 후
npm install prisma @prisma/client
npx prisma generate
npx prisma db push
```

### 기본 연결 설정
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 회사별 데이터 격리 미들웨어
```typescript
// middleware/prisma.ts
import { PrismaClient } from '@prisma/client'

export function createTenantPrisma(companyId: number) {
  const prisma = new PrismaClient()
  
  // 모든 쿼리에 companyId 필터 자동 추가
  prisma.$use(async (params, next) => {
    // SELECT 쿼리
    if (params.action === 'findMany' || params.action === 'findFirst' || params.action === 'findUnique') {
      if (params.model && ['User', 'Car', 'Customer', 'Contract'].includes(params.model)) {
        params.args.where = {
          ...params.args.where,
          companyId: companyId
        }
      }
    }
    
    // CREATE 쿼리
    if (params.action === 'create') {
      if (params.model && ['User', 'Car', 'Customer', 'Contract'].includes(params.model)) {
        params.args.data = {
          ...params.args.data,
          companyId: companyId
        }
      }
    }
    
    return next(params)
  })
  
  return prisma
}
```

### 주요 쿼리 예시
```typescript
// services/carService.ts
import { prisma } from '../lib/prisma'

export class CarService {
  // 페이지네이션된 차량 목록 조회
  async getCars(companyId: number, page = 1, pageSize = 8, filters?: {
    searchBy?: 'carNumber' | 'model'
    keyword?: string
    status?: 'total' | 'possession' | 'contractProceeding' | 'contractCompleted'
  }) {
    const where: any = { companyId }
    
    if (filters?.status && filters.status !== 'total') {
      where.status = filters.status.toUpperCase()
    }
    
    if (filters?.keyword && filters?.searchBy) {
      where[filters.searchBy === 'carNumber' ? 'carNumber' : 'model'] = {
        contains: filters.keyword,
        mode: 'insensitive'
      }
    }
    
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.car.count({ where })
    ])
    
    return {
      data: cars,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  }
  
  // 계약용 간소화된 차량 목록
  async getCarsForContract(companyId: number) {
    return prisma.car.findMany({
      where: {
        companyId,
        status: 'POSSESSION'
      },
      select: {
        id: true,
        carNumber: true,
        model: true,
        price: true
      }
    })
  }
}

// services/contractService.ts
export class ContractService {
  // 상태별로 그룹화된 계약 목록
  async getContractsByStatus(companyId: number, filters?: {
    searchBy?: 'customerName' | 'userName'
    keyword?: string
  }) {
    const where: any = { companyId }
    
    if (filters?.keyword && filters?.searchBy) {
      if (filters.searchBy === 'customerName') {
        where.customer = {
          name: { contains: filters.keyword, mode: 'insensitive' }
        }
      } else if (filters.searchBy === 'userName') {
        where.user = {
          name: { contains: filters.keyword, mode: 'insensitive' }
        }
      }
    }
    
    const contracts = await prisma.contract.findMany({
      where,
      include: {
        car: {
          select: { id: true, carNumber: true, model: true }
        },
        customer: {
          select: { id: true, name: true, phoneNumber: true }
        },
        user: {
          select: { id: true, name: true }
        },
        contractDocuments: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // 상태별로 그룹화
    return contracts.reduce((acc, contract) => {
      const status = contract.status
      if (!acc[status]) acc[status] = []
      acc[status].push(contract)
      return acc
    }, {} as Record<string, typeof contracts>)
  }
}

// services/dashboardService.ts
export class DashboardService {
  async getDashboardMetrics(companyId: number) {
    const currentMonth = new Date()
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    
    // 월별 매출액 계산 (완료된 계약 기준)
    const [currentMonthSales, lastMonthSales] = await Promise.all([
      this.getMonthlySales(companyId, currentMonth),
      this.getMonthlySales(companyId, lastMonth)
    ])
    
    // 계약 진행 현황
    const contractCounts = await prisma.contract.groupBy({
      by: ['status'],
      where: { companyId },
      _count: { status: true }
    })
    
    const proceedingStatuses = ['CONTACT_RECEIVED', 'FIRST_MEETING_SCHEDULED', 'FIRST_MEETING_COMPLETED', 'CAR_INSPECTION_SCHEDULED', 'CAR_INSPECTION_COMPLETED', 'CONTRACT_IN_PROGRESS']
    const proceedingCount = contractCounts
      .filter(c => proceedingStatuses.includes(c.status))
      .reduce((sum, c) => sum + c._count.status, 0)
    
    const completedCount = contractCounts
      .find(c => c.status === 'CONTRACT_COMPLETED')?._count.status || 0
    
    return {
      monthlySales: currentMonthSales,
      lastMonthSales: lastMonthSales,
      growthRate: lastMonthSales > 0 ? ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100 : 0,
      proceedingContractsCount: proceedingCount,
      completedContractsCount: completedCount
    }
  }
  
  private async getMonthlySales(companyId: number, month: Date) {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    
    const result = await prisma.contract.aggregate({
      where: {
        companyId,
        status: 'CONTRACT_COMPLETED',
        resolutionDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: { contractPrice: true }
    })
    
    return result._sum.contractPrice || 0
  }
}
```

---

## 🔒 보안 고려사항

### 1. Row Level Security (RLS) 대안
```typescript
// Prisma 미들웨어로 회사별 데이터 격리 구현
export const tenantMiddleware = (companyId: number) => {
  return async (params: any, next: any) => {
    // 모든 쿼리에 companyId 조건 자동 추가
    if (params.model && TENANT_MODELS.includes(params.model)) {
      if (params.action === 'findMany' || params.action === 'findFirst') {
        params.args.where = { ...params.args.where, companyId }
      }
      if (params.action === 'create') {
        params.args.data = { ...params.args.data, companyId }
      }
    }
    return next(params)
  }
}
```

### 2. 민감한 데이터 처리
```typescript
// 비밀번호 해싱
import bcrypt from 'bcryptjs'

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }
  
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
```

### 3. JWT 토큰 관리
```typescript
// 리프레시 토큰 정리 (크론 작업)
export async function cleanExpiredTokens() {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}
```

---

## 📈 성능 최적화 전략

### 1. Connection Pooling
```typescript
// prisma 연결 풀 설정
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=20&pool_timeout=20'
    }
  }
})
```

### 2. 쿼리 최적화
```typescript
// N+1 문제 해결을 위한 include 사용
const contractsWithRelations = await prisma.contract.findMany({
  include: {
    car: {
      select: { id: true, carNumber: true, model: true }
    },
    customer: {
      select: { id: true, name: true, phoneNumber: true }
    },
    user: {
      select: { id: true, name: true }
    }
  }
})
```

### 3. 캐싱 전략
```typescript
// Redis 캐싱 (차량 모델 마스터 데이터 등)
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCarModels() {
  const cached = await redis.get('car_models')
  if (cached) return JSON.parse(cached)
  
  const models = await prisma.carModel.findMany()
  await redis.setex('car_models', 3600, JSON.stringify(models)) // 1시간 캐시
  return models
}
```

이 스키마는 Dear Carmate 프론트엔드의 모든 API 요구사항을 충족하며, PostgreSQL과 Prisma의 장점을 최대한 활용한 설계입니다.