# Dear Carmate Backend API 명세서

프론트엔드 코드 분석을 통해 추출한 백엔드 API 명세서입니다.

## 📋 개요

### Base Configuration
- **Base URL**: `{NEXT_PUBLIC_BASE_URL}`
- **Timeout**: 300초 (5분)
- **인증 방식**: Bearer Token (JWT)
- **Content-Type**: `application/json` (기본), `multipart/form-data` (파일 업로드)

### 인증 시스템
- **Access Token**: 1시간 유효
- **Refresh Token**: 7일 유효
- **자동 갱신**: 401 응답 시 자동으로 토큰 갱신
- **저장 방식**: HTTP-only 쿠키 (Secure, SameSite=strict)

---

## 🔐 Authentication API

### 1. 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "user@example.com",
    "employeeNumber": "EMP001",
    "phoneNumber": "010-1234-5678",
    "imageUrl": "https://example.com/profile.jpg",
    "company": {
      "id": 1,
      "companyCode": "COMP001",
      "companyName": "딜러카메이트"
    }
  }
}
```

### 2. 토큰 갱신
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👤 User Management API

### 1. 회원가입
```http
POST /users
Content-Type: application/json

{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirmation": "password123",
  "employeeNumber": "EMP001",
  "phoneNumber": "010-1234-5678",
  "companyCode": "COMP001",
  "companyName": "딜러카메이트"
}
```

**Response (201)**
```json
{
  "id": 1,
  "name": "홍길동",
  "email": "user@example.com",
  "employeeNumber": "EMP001",
  "phoneNumber": "010-1234-5678",
  "imageUrl": null,
  "company": {
    "id": 1,
    "companyCode": "COMP001",
    "companyName": "딜러카메이트"
  }
}
```

### 2. 내 정보 조회
```http
GET /users/me
Authorization: Bearer {accessToken}
```

**Response (200)**: 동일한 UserInfo 구조

### 3. 비밀번호 확인
```http
POST /users/check
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "password": "current_password"
}
```

**Response (200)**
```json
{
  "encryptedCurrentPassword": "encrypted_password_string"
}
```

### 4. 내 정보 수정
```http
PATCH /users/me
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "imageUrl": "https://example.com/new-profile.jpg",
  "phoneNumber": "010-9876-5432",
  "employeeNumber": "EMP002",
  "currentPassword": "encrypted_current_password",
  "password": "new_password",
  "passwordConfirmation": "new_password"
}
```

**Response (200)**: 업데이트된 UserInfo

### 5. 사용자 삭제
```http
DELETE /users/{userId}
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "message": "사용자가 성공적으로 삭제되었습니다."
}
```

### 6. 회사 사용자 목록 조회
```http
GET /companies/users?page=1&pageSize=8&searchBy=name&keyword=홍길동
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "홍길동",
      "email": "user@example.com",
      "employeeNumber": "EMP001",
      "phoneNumber": "010-1234-5678",
      "imageUrl": "https://example.com/profile.jpg",
      "company": {
        "id": 1,
        "companyCode": "COMP001",
        "companyName": "딜러카메이트"
      }
    }
  ],
  "totalCount": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

---

## 🚗 Car Management API

### 1. 차량 목록 조회
```http
GET /cars?page=1&pageSize=8&searchBy=model&keyword=소나타&status=possession
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page`: 페이지 번호 (기본값: 1)
- `pageSize`: 페이지 크기 (기본값: 8)
- `searchBy`: `carNumber` | `model`
- `keyword`: 검색 키워드
- `status`: `total` | `possession` | `contractProceeding` | `contractCompleted`

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "carNumber": "12가3456",
      "manufacturer": "현대",
      "model": "소나타",
      "manufacturingYear": 2022,
      "mileage": 15000,
      "price": 25000000,
      "accidentCount": 0,
      "explanation": "무사고 차량입니다.",
      "accidentDetails": "",
      "status": "possession",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  ],
  "totalCount": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

### 2. 차량 상세 조회
```http
GET /cars/{carId}
Authorization: Bearer {accessToken}
```

**Response (200)**: 단일 Car 객체

### 3. 차량 등록
```http
POST /cars
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "carNumber": "12가3456",
  "manufacturer": "현대",
  "model": "소나타",
  "manufacturingYear": 2022,
  "mileage": 15000,
  "price": 25000000,
  "accidentCount": 0,
  "explanation": "무사고 차량입니다.",
  "accidentDetails": ""
}
```

**Response (201)**: 생성된 Car 객체

### 4. 차량 수정
```http
PATCH /cars/{carId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "price": 24000000,
  "mileage": 16000,
  "explanation": "가격 조정된 무사고 차량입니다."
}
```

**Response (200)**: 수정된 Car 객체

### 5. 차량 삭제
```http
DELETE /cars/{carId}
Authorization: Bearer {accessToken}
```

**Response (204)**: No Content

### 6. 차량 모델 목록 조회
```http
GET /cars/models
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "manufacturer": "현대",
      "model": ["소나타", "아반떼", "그랜저"]
    },
    {
      "manufacturer": "기아",
      "model": ["K5", "K3", "K7"]
    }
  ]
}
```

### 7. 차량 벌크 업로드
```http
POST /cars/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: cars.csv
```

**Response (200)**
```json
{
  "message": "차량 데이터가 성공적으로 업로드되었습니다.",
  "successCount": 10,
  "errorCount": 0
}
```

---

## 👥 Customer Management API

### 1. 고객 목록 조회
```http
GET /customers?page=1&pageSize=8&searchBy=name&keyword=김고객
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page`: 페이지 번호 (기본값: 1)
- `pageSize`: 페이지 크기 (기본값: 8)
- `searchBy`: `name` | `email`
- `keyword`: 검색 키워드

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "김고객",
      "gender": "male",
      "phoneNumber": "010-1111-2222",
      "ageGroup": "30대",
      "region": "서울",
      "email": "customer@example.com",
      "memo": "VIP 고객",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  ],
  "totalCount": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

### 2. 고객 등록
```http
POST /customers
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "김고객",
  "gender": "male",
  "phoneNumber": "010-1111-2222",
  "ageGroup": "30대",
  "region": "서울",
  "email": "customer@example.com",
  "memo": "VIP 고객"
}
```

**Gender Options**: `male` | `female`
**Age Group Options**: `10대` | `20대` | `30대` | `40대` | `50대` | `60대` | `70대` | `80대` | `null`
**Region Options**: `서울` | `경기` | `인천` | `강원` | `충북` | `충남` | `대전` | `경북` | `경남` | `대구` | `울산` | `부산` | `전북` | `전남` | `광주` | `제주` | `null`

**Response (201)**: 생성된 Customer 객체

### 3. 고객 수정
```http
PATCH /customers/{customerId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "phoneNumber": "010-2222-3333",
  "memo": "프리미엄 고객으로 승급"
}
```

**Response (200)**: 수정된 Customer 객체

### 4. 고객 삭제
```http
DELETE /customers/{customerId}
Authorization: Bearer {accessToken}
```

**Response (204)**: No Content

### 5. 고객 벌크 업로드
```http
POST /customers/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: customers.csv
```

**Response (200)**
```json
{
  "message": "고객 데이터가 성공적으로 업로드되었습니다.",
  "successCount": 20,
  "errorCount": 0
}
```

---

## 📄 Contract Management API

### 1. 계약 목록 조회
```http
GET /contracts?searchBy=customerName&keyword=김고객
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `searchBy`: `customerName` | `userName`
- `keyword`: 검색 키워드

**Response (200)**
```json
{
  "data": {
    "contactReceived": [
      {
        "id": 1,
        "meetings": [
          {
            "date": "2024-01-20T10:00:00Z",
            "alarms": [
              "2024-01-19T09:00:00Z",
              "2024-01-20T09:00:00Z"
            ]
          }
        ],
        "contractPrice": null,
        "resolutionDate": null,
        "status": "contactReceived",
        "car": {
          "id": 1,
          "carNumber": "12가3456",
          "model": "소나타"
        },
        "customer": {
          "id": 1,
          "name": "김고객",
          "phoneNumber": "010-1111-2222"
        },
        "user": {
          "id": 1,
          "name": "홍길동"
        },
        "contractDocuments": [],
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-01-15T09:00:00Z"
      }
    ],
    "firstMeetingScheduled": [],
    "firstMeetingCompleted": [],
    "carInspectionScheduled": [],
    "carInspectionCompleted": [],
    "contractInProgress": [],
    "contractCompleted": []
  }
}
```

**Contract Status Options**:
- `contactReceived`: 연락 접수
- `firstMeetingScheduled`: 1차 미팅 예정
- `firstMeetingCompleted`: 1차 미팅 완료
- `carInspectionScheduled`: 차량 점검 예정
- `carInspectionCompleted`: 차량 점검 완료
- `contractInProgress`: 계약 진행중
- `contractCompleted`: 계약 완료

### 2. 계약 등록
```http
POST /contracts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "meetings": [
    {
      "date": "2024-01-20T10:00:00Z",
      "alarms": [
        "2024-01-19T09:00:00Z",
        "2024-01-20T09:00:00Z"
      ]
    }
  ],
  "carId": 1,
  "customerId": 1,
  "userId": 1
}
```

**Response (201)**: 생성된 Contract 객체

### 3. 계약 수정
```http
PATCH /contracts/{contractId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "contractPrice": 24000000,
  "status": "contractInProgress",
  "meetings": [
    {
      "date": "2024-01-25T14:00:00Z",
      "alarms": ["2024-01-24T09:00:00Z"]
    }
  ]
}
```

**Response (200)**: 수정된 Contract 객체

### 4. 계약 상태 수정
```http
PATCH /contracts/{contractId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "contractCompleted",
  "resolutionDate": "2024-01-30T00:00:00Z"
}
```

**Response (200)**: 수정된 Contract 객체

### 5. 계약 삭제
```http
DELETE /contracts/{contractId}
Authorization: Bearer {accessToken}
```

**Response (204)**: No Content

### 6. 계약용 차량 목록
```http
GET /contracts/cars
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "carNumber": "12가3456",
      "model": "소나타",
      "price": 25000000
    }
  ]
}
```

### 7. 계약용 고객 목록
```http
GET /contracts/customers
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "김고객",
      "phoneNumber": "010-1111-2222"
    }
  ]
}
```

### 8. 계약용 사용자 목록
```http
GET /contracts/users
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "홍길동",
      "employeeNumber": "EMP001"
    }
  ]
}
```

---

## 🏢 Company Management API

### 1. 회사 목록 조회
```http
GET /companies?page=1&pageSize=8&searchBy=companyName&keyword=딜러
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page`: 페이지 번호 (기본값: 1)
- `pageSize`: 페이지 크기 (기본값: 8)
- `searchBy`: `companyName` | `companyCode`
- `keyword`: 검색 키워드

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "companyCode": "COMP001",
      "companyName": "딜러카메이트",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalCount": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

### 2. 회사 등록
```http
POST /companies
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "companyCode": "COMP002",
  "companyName": "새로운딜러"
}
```

**Response (201)**: 생성된 Company 객체

### 3. 회사 수정
```http
PATCH /companies/{companyId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "companyName": "수정된회사명"
}
```

**Response (200)**: 수정된 Company 객체

### 4. 회사 삭제
```http
DELETE /companies/{companyId}
Authorization: Bearer {accessToken}
```

**Response (204)**: No Content

---

## 📄 Contract Document API

### 1. 계약서 목록 조회
```http
GET /contractDocuments?page=1&pageSize=8&searchBy=contractName&keyword=계약서
Authorization: Bearer {accessToken}
```

**Query Parameters**
- `page`: 페이지 번호 (기본값: 1)
- `pageSize`: 페이지 크기 (기본값: 8)
- `searchBy`: `contractName` | `userName` | `carNumber`
- `keyword`: 검색 키워드

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "contractName": "차량 매매 계약서",
      "originalName": "contract_template.pdf",
      "filePath": "/uploads/contracts/contract_123.pdf",
      "contract": {
        "id": 1,
        "car": {
          "carNumber": "12가3456"
        },
        "customer": {
          "name": "김고객"
        },
        "user": {
          "name": "홍길동"
        }
      },
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ],
  "totalCount": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

### 2. 초안 목록 조회
```http
GET /contractDocuments/draft
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "contractName": "표준 매매 계약서 템플릿",
      "originalName": "standard_template.pdf"
    }
  ]
}
```

### 3. 계약서 다운로드
```http
GET /contractDocuments/{documentId}/download
Authorization: Bearer {accessToken}
```

**Response (200)**
- Content-Type: `application/pdf` 또는 파일의 MIME 타입
- Content-Disposition: `attachment; filename="contract.pdf"`
- Body: 파일 바이너리 데이터

---

## 📊 Dashboard API

### 1. 대시보드 데이터 조회
```http
GET /dashboard
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "monthlySales": 150000000,
  "lastMonthSales": 120000000,
  "growthRate": 25.0,
  "proceedingContractsCount": 8,
  "completedContractsCount": 15,
  "contractsByCarType": [
    {
      "carType": "중형차",
      "count": 12
    },
    {
      "carType": "소형차",
      "count": 8
    },
    {
      "carType": "대형차",
      "count": 3
    }
  ],
  "salesByCarType": [
    {
      "carType": "중형차",
      "count": 300000000
    },
    {
      "carType": "소형차",
      "count": 120000000
    },
    {
      "carType": "대형차",
      "count": 180000000
    }
  ]
}
```

---

## 🔔 Meeting & Notification API

### 1. 미팅 알림 전송
```http
POST /notifications/meetings/{contractId}/send
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "meetingId": "meeting-uuid-123",
  "alarmType": "today" | "yesterday",
  "recipients": ["customer", "manager"]
}
```

**Response (200)**
```json
{
  "message": "알림이 성공적으로 전송되었습니다.",
  "sentTo": ["customer@example.com", "manager@company.com"],
  "sentAt": "2024-01-19T09:00:00Z"
}
```

### 2. 알림 히스토리 조회
```http
GET /notifications/contracts/{contractId}/history
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "contractId": 1,
      "meetingDate": "2024-01-20T10:00:00Z",
      "alarmType": "yesterday",
      "sentAt": "2024-01-19T09:00:00Z",
      "recipients": ["customer@example.com"],
      "status": "delivered",
      "template": "meeting_reminder_yesterday"
    }
  ]
}
```

### 3. 알림 재발송
```http
POST /notifications/{notificationId}/resend
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "message": "알림이 재발송되었습니다.",
  "resentAt": "2024-01-19T09:15:00Z"
}
```

### 4. 알림 설정 조회
```http
GET /notifications/settings
Authorization: Bearer {accessToken}
```

**Response (200)**
```json
{
  "emailEnabled": true,
  "smsEnabled": false,
  "defaultAlarmTimes": [
    {
      "type": "yesterday",
      "time": "09:00"
    },
    {
      "type": "today", 
      "time": "09:00"
    }
  ],
  "templates": {
    "meeting_reminder_yesterday": {
      "subject": "[딜러카메이트] 내일 미팅 일정 안내",
      "emailTemplate": "email_meeting_reminder_yesterday.html",
      "smsTemplate": "내일 {{meetingTime}} 미팅이 예정되어 있습니다."
    },
    "meeting_reminder_today": {
      "subject": "[딜러카메이트] 오늘 미팅 일정 안내", 
      "emailTemplate": "email_meeting_reminder_today.html",
      "smsTemplate": "오늘 {{meetingTime}} 미팅이 예정되어 있습니다."
    }
  }
}
```

### 5. 알림 설정 업데이트
```http
PATCH /notifications/settings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "emailEnabled": true,
  "smsEnabled": true,
  "defaultAlarmTimes": [
    {
      "type": "yesterday",
      "time": "09:00"
    },
    {
      "type": "today",
      "time": "09:00"
    }
  ]
}
```

**Response (200)**: 업데이트된 설정 객체

---

## 📁 File Upload API

### 1. 계약서 파일 업로드
```http
POST /contractDocuments/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: contract.pdf
contractName: "차량 매매 계약서"
contractId: 1
```

**Response (200)**
```json
{
  "contractDocumentId": 1
}
```

### 2. 이미지 업로드
```http
POST /images/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: profile.jpg
```

**파일 제한사항**
- 최대 크기: 5MB
- 지원 형식: JPG, JPEG, PNG, GIF

**Response (200)**
```json
{
  "imageUrl": "https://example.com/uploads/images/profile_123.jpg"
}
```

---

## 🔧 Error Responses

### 공통 에러 응답 형식
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

### HTTP 상태 코드별 에러
- **400 Bad Request**: 잘못된 요청 파라미터
- **401 Unauthorized**: 인증 토큰 없음 또는 만료
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스를 찾을 수 없음
- **409 Conflict**: 중복된 데이터 (이메일, 차량번호 등)
- **422 Unprocessable Entity**: 유효성 검사 실패
- **500 Internal Server Error**: 서버 내부 오류

### 토큰 갱신 관련
- **401** 응답 시 프론트엔드에서 자동으로 `/auth/refresh` 호출
- Refresh Token이 만료된 경우 로그아웃 처리

---

## 📋 데이터 타입 정의

### UserInfo
```typescript
interface UserInfo {
  id: number
  name: string
  email: string
  employeeNumber: string
  phoneNumber: string
  imageUrl: string | null
  company: {
    id: number
    companyCode: string
    companyName: string
  }
}
```

### Car
```typescript
interface Car {
  id: number
  carNumber: string
  manufacturer: string
  model: string
  manufacturingYear: number
  mileage: number
  price: number
  accidentCount: number
  explanation: string
  accidentDetails: string
  status: 'possession' | 'contractProceeding' | 'contractCompleted'
  createdAt: string
  updatedAt: string
}
```

### Customer
```typescript
interface Customer {
  id: number
  name: string
  gender: 'male' | 'female'
  phoneNumber: string
  ageGroup: '10대' | '20대' | '30대' | '40대' | '50대' | '60대' | '70대' | '80대' | null
  region: '서울' | '경기' | '인천' | '강원' | '충북' | '충남' | '대전' | '경북' | '경남' | '대구' | '울산' | '부산' | '전북' | '전남' | '광주' | '제주' | null
  email: string
  memo: string
  createdAt: string
  updatedAt: string
}
```

### Contract
```typescript
interface Contract {
  id: number
  meetings: {
    date: string
    alarms: string[] // ISO 8601 형식의 알림 시간 배열
  }[]
  contractPrice: number | null
  resolutionDate: string | null
  status: 'contactReceived' | 'firstMeetingScheduled' | 'firstMeetingCompleted' | 'carInspectionScheduled' | 'carInspectionCompleted' | 'contractInProgress' | 'contractCompleted'
  car: {
    id: number
    carNumber: string
    model: string
  }
  customer: {
    id: number
    name: string
    phoneNumber: string
  }
  user: {
    id: number
    name: string
  }
  contractDocuments: DocumentType[]
  createdAt: string
  updatedAt: string
}
```

### 페이지네이션 응답
```typescript
interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
}
```