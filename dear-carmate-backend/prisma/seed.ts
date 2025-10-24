import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. 기존 데이터 삭제 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Cleaning up existing data...');
    await prisma.notification.deleteMany();
    await prisma.contractDocument.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.car.deleteMany();
    await prisma.carModel.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
  }

  // 2. 플랫폼 관리자 생성
  console.log('👤 Creating platform admin...');
  const adminPassword = await bcrypt.hash('admin1234', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dearcarmate.com',
      password: adminPassword,
      name: 'Platform Admin',
      employeeNumber: 'ADMIN001',
      phoneNumber: '010-0000-0000',
      isAdmin: true,
      companyId: null,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 3. 테스트 회사 생성
  console.log('🏢 Creating test companies...');
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        companyName: 'Seoul Motors',
        companyCode: 'SEOUL2024',
      },
    }),
    prisma.company.create({
      data: {
        companyName: 'Busan Car Dealers',
        companyCode: 'BUSAN2024',
      },
    }),
  ]);
  console.log(`✅ Created ${companies.length} companies`);

  // 4. 차량 모델 마스터 데이터 생성
  console.log('🚗 Creating car models master data...');
  const carModels = [
    // 현대
    { manufacturer: '현대', modelName: '아반떼', category: '중형' },
    { manufacturer: '현대', modelName: '소나타', category: '중형' },
    { manufacturer: '현대', modelName: '그랜저', category: '대형' },
    { manufacturer: '현대', modelName: '투싼', category: 'SUV' },
    { manufacturer: '현대', modelName: '싼타페', category: 'SUV' },
    { manufacturer: '현대', modelName: '팰리세이드', category: 'SUV' },
    // 기아
    { manufacturer: '기아', modelName: 'K3', category: '중형' },
    { manufacturer: '기아', modelName: 'K5', category: '중형' },
    { manufacturer: '기아', modelName: 'K7', category: '대형' },
    { manufacturer: '기아', modelName: 'K9', category: '대형' },
    { manufacturer: '기아', modelName: '스포티지', category: 'SUV' },
    { manufacturer: '기아', modelName: '쏘렌토', category: 'SUV' },
    { manufacturer: '기아', modelName: '카니발', category: 'SUV' },
    // 쌍용
    { manufacturer: '쌍용', modelName: '티볼리', category: 'SUV' },
    { manufacturer: '쌍용', modelName: '코란도', category: 'SUV' },
    { manufacturer: '쌍용', modelName: '렉스턴', category: 'SUV' },
    // 제네시스
    { manufacturer: '제네시스', modelName: 'G70', category: '대형' },
    { manufacturer: '제네시스', modelName: 'G80', category: '대형' },
    { manufacturer: '제네시스', modelName: 'G90', category: '대형' },
    { manufacturer: '제네시스', modelName: 'GV70', category: 'SUV' },
    { manufacturer: '제네시스', modelName: 'GV80', category: 'SUV' },
  ];

  await prisma.carModel.createMany({
    data: carModels,
  });
  console.log(`✅ Created ${carModels.length} car models`);

  // 5. 각 회사별 테스트 데이터 생성
  for (const company of companies) {
    console.log(`\n📦 Seeding data for ${company.name}...`);

    // 직원 생성
    const password = await bcrypt.hash('user1234', 12);
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: `admin@${company.companyCode.toLowerCase()}.com`,
          password,
          name: `${company.companyName} Manager`,
          employeeNumber: 'MGR001',
          phoneNumber: '010-1111-1111',
          isAdmin: false,
          companyId: company.id,
        },
      }),
      prisma.user.create({
        data: {
          email: `user1@${company.companyCode.toLowerCase()}.com`,
          password,
          name: `${company.companyName} Staff 1`,
          employeeNumber: 'STF001',
          phoneNumber: '010-2222-2222',
          isAdmin: false,
          companyId: company.id,
        },
      }),
    ]);
    console.log(`  ✅ Created ${users.length} users`);

    // 차량 생성
    const cars = await Promise.all([
      prisma.car.create({
        data: {
          carNumber: '12가3456',
          manufacturer: '현대',
          model: '아반떼',
          manufacturingYear: 2022,
          mileage: 15000,
          price: 15000000,
          accidentCount: 0,
          status: 'possession',
          type: '중형',
          companyId: company.id,
        },
      }),
      prisma.car.create({
        data: {
          carNumber: '34나5678',
          manufacturer: '기아',
          model: 'K5',
          manufacturingYear: 2021,
          mileage: 25000,
          price: 18000000,
          accidentCount: 1,
          accidentDetails: '경미한 접촉 사고',
          status: 'possession',
          type: '중형',
          companyId: company.id,
        },
      }),
    ]);
    console.log(`  ✅ Created ${cars.length} cars`);

    // 고객 생성
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          name: '김철수',
          gender: 'male',
          phoneNumber: '010-1234-5678',
          ageGroup: 'THIRTIES',
          region: 'SEOUL',
          email: 'chulsoo@example.com',
          companyId: company.id,
        },
      }),
      prisma.customer.create({
        data: {
          name: '이영희',
          gender: 'female',
          phoneNumber: '010-9876-5432',
          ageGroup: 'TWENTIES',
          region: 'GYEONGGI',
          email: 'younghee@example.com',
          companyId: company.id,
        },
      }),
    ]);
    console.log(`  ✅ Created ${customers.length} customers`);

    // 계약 생성
    const contract = await prisma.contract.create({
      data: {
        carId: cars[0]!.id,
        customerId: customers[0]!.id,
        userId: users[0]!.id,
        status: 'priceNegotiation',
        meetings: [
          {
            date: new Date(Date.now() + 86400000 * 3).toISOString(),
            alarms: ['0', '1'],
          },
        ],
        companyId: company.id,
      },
    });
    console.log(`  ✅ Created 1 contract`);
  }

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
