계약건
model Contract {
  id             Int       @id @default(autoincrement())
  carId          Int       @map("car_id") [치종]
  customerId     Int       @map("customer_id") [고개명]
  userId         Int       @map("user_id") 
  companyId      Int       @map("company_id")
  contractName   String    @map("contract_name") // A4[차종] - 김혜연[고객명]
  status         String    @default("carInspection") // carInspection
  resolutionDate DateTime? @map("resolution_date")
  contractPrice  Int       @map("contract_price")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  company   Company            @relation(fields: [companyId], references: [id], onDelete: Cascade)
  car       Car                @relation(fields: [carId], references: [id])
  customer  Customer           @relation(fields: [customerId], references: [id])
  user      User               @relation(fields: [userId], references: [id])
  meetings  Meeting[]
  documents ContractDocument[]

  @@map("contracts")

계약서

model ContractDocument {
  id         Int      @id @default(autoincrement())
  contractId Int      @map("contract_id")
  fileName   String   @map("file_name")
  fileUrl    String?  @map("file_url")
  fileSize   Int?     @map("file_size")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  contract Contract @relation(fields: [contractId], references: [id], onDelete: Cascade)

  @@map("contract_documents")
}

contractDocuments
: 
[{id: 227, fileName: "배포다이어그램.png"}]

/contracts/252

계약서 등록완료시 
{
    "currentPage": 1,
    "totalPages": 1,
    "totalItemCount": 3,
    "data": [
        {
            "id": 80,
            "contractName": "A4 - 전수아 고객님",
            "resolutionDate": "2024-05-01T16:47:24.072Z",
            "documentCount": 2,
            "userName": "행복카 대표",
            "carNumber": "54가1042",
            "documents": [
                {
                    "id": 120,
                    "fileName": "img0.jpg"
                },
                {
                    "id": 211,
                    "fileName": "codeit copy 2.svg"
                }
            ]
        },
        {
            "id": 72,
            "contractName": "A6 - 전민준 고객님",
            "resolutionDate": "2025-10-16T00:00:00.000Z",
            "documentCount": 1,
            "userName": "행복카 대표",
            "carNumber": "46가1034",
            "documents": [
                {
                    "id": 226,
                    "fileName": "배포다이어그램.png"
                }
            ]














계약건
model Contract {
  id             Int       @id @default(autoincrement())
  carId          Int       @map("car_id") [치종]
  customerId     Int       @map("customer_id") [고개명]
  userId         Int       @map("user_id") 
  companyId      Int       @map("company_id")
  contractName   String    @map("contract_name") // A4[차종] - 김혜연[고객명]
  status         String    @default("carInspection") // carInspection
  resolutionDate DateTime? @map("resolution_date")
  contractPrice  Int       @map("contract_price")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  company   Company            @relation(fields: [companyId], references: [id], onDelete: Cascade)
  car       Car                @relation(fields: [carId], references: [id])
  customer  Customer           @relation(fields: [customerId], references: [id])
  user      User               @relation(fields: [userId], references: [id])
  meetings  Meeting[]
  documents ContractDocument[]

  @@map("contracts")

계약서

model ContractDocument {
  id         Int      @id @default(autoincrement())
  contractId Int      @map("contract_id")
  fileName   String   @map("file_name")
  fileUrl    String?  @map("file_url")
  fileSize   Int?     @map("file_size")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  contract Contract @relation(fields: [contractId], references: [id], onDelete: Cascade)

  @@map("contract_documents")
}