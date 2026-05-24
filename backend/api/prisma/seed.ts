import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_REQUEST_ID = "11111111-1111-1111-1111-111111111001";
const SEED_CLASS_ID = "11111111-1111-1111-1111-111111111002";
const SEED_PAYMENT_ID = "11111111-1111-1111-1111-111111111003";
const SEED_MEMBER_ID = "11111111-1111-1111-1111-111111111004";

async function main(): Promise<void> {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 12);
  const tutorPasswordHash = await bcrypt.hash("Tutor@123", 12);

  const adminSeeds = [
    {
      email: "admin@sne.vn",
      fullName: "SNE Admin",
      role: "SUPERADMIN" as const,
    },
    {
      email: "admin.ops@sne.vn",
      fullName: "SNE Ops",
      role: "ADMIN" as const,
    },
    {
      email: "admin.manager@sne.vn",
      fullName: "SNE Manager",
      role: "ADMIN" as const,
    },
  ];

  const admins = await Promise.all(
    adminSeeds.map((seed) =>
      prisma.admin.upsert({
        where: { email: seed.email },
        update: {
          fullName: seed.fullName,
          passwordHash: adminPasswordHash,
          role: seed.role,
        },
        create: {
          email: seed.email,
          fullName: seed.fullName,
          passwordHash: adminPasswordHash,
          role: seed.role,
        },
      }),
    ),
  );

  const admin = admins[0];

  const tutorSeeds = [
    {
      email: "tutor.free@sne.vn",
      fullName: "Tutor Gia Su Tu Do",
      phone: "0911222333",
      status: "APPROVED" as const,
      subjects: ["Toan", "Ly"],
      districts: ["Quan 7", "Quan 4"],
    },
    {
      email: "tutor.training@sne.vn",
      fullName: "Tutor Gia Su Dao Tao",
      phone: "0988999777",
      status: "APPROVED" as const,
      subjects: ["Anh Van", "Sinh"],
      districts: ["Quan 1", "Quan 3"],
    },
    {
      email: "tutor.center@sne.vn",
      fullName: "Tutor GV Trung Tam",
      phone: "0933444555",
      status: "APPROVED" as const,
      subjects: ["Hoa", "Toan"],
      districts: ["Quan 10", "Quan 11"],
    },
  ];

  const tutors = await Promise.all(
    tutorSeeds.map((seed, index) =>
      prisma.tutor.upsert({
        where: { email: seed.email },
        update: {
          fullName: seed.fullName,
          phone: seed.phone,
          passwordHash: tutorPasswordHash,
          status: seed.status,
          subjects: seed.subjects,
          districts: seed.districts,
          approvedAt: new Date(),
          approvedById: admins[index % admins.length].id,
        },
        create: {
          email: seed.email,
          fullName: seed.fullName,
          phone: seed.phone,
          passwordHash: tutorPasswordHash,
          status: seed.status,
          subjects: seed.subjects,
          districts: seed.districts,
          approvedAt: new Date(),
          approvedById: admins[index % admins.length].id,
        },
      }),
    ),
  );

  const approvedTutor = tutors[0];

  const request = await prisma.classRequest.upsert({
    where: { id: SEED_REQUEST_ID },
    update: {
      parentName: "Nguyen Van A",
      parentPhone: "0901234567",
      parentEmail: "parent@example.com",
      subject: "Toan",
      grade: "Lop 12",
      district: "District 7",
      budgetPerHour: 300000,
      note: "Can tutor for exam preparation",
      status: "PENDING",
      processedAt: null,
      processedById: null,
    },
    create: {
      id: SEED_REQUEST_ID,
      parentName: "Nguyen Van A",
      parentPhone: "0901234567",
      parentEmail: "parent@example.com",
      subject: "Toan",
      grade: "Lop 12",
      district: "District 7",
      budgetPerHour: 300000,
      note: "Can tutor for exam preparation",
      status: "PENDING",
    },
  });

  const seededClass = await prisma.class.upsert({
    where: { id: SEED_CLASS_ID },
    update: {
      title: "Toan Lop 12 - Luyen Thi",
      subject: "Toan",
      grade: "Lop 12",
      district: "District 7",
      feePerHour: 320000,
      schedule: "Mon/Wed/Fri 19:00",
      status: "OPEN",
      sourceRequestId: request.id,
      createdById: admin.id,
      closedAt: null,
    },
    create: {
      id: SEED_CLASS_ID,
      title: "Toan Lop 12 - Luyen Thi",
      subject: "Toan",
      grade: "Lop 12",
      district: "District 7",
      feePerHour: 320000,
      schedule: "Mon/Wed/Fri 19:00",
      status: "OPEN",
      sourceRequestId: request.id,
      createdById: admin.id,
    },
  });

  await prisma.classApplication.upsert({
    where: {
      classId_tutorId: {
        classId: seededClass.id,
        tutorId: approvedTutor.id,
      },
    },
    update: {
      status: "PENDING",
      note: "I can handle intensive exam prep",
    },
    create: {
      classId: seededClass.id,
      tutorId: approvedTutor.id,
      status: "PENDING",
      note: "I can handle intensive exam prep",
    },
  });

  await prisma.classMember.upsert({
    where: { id: SEED_MEMBER_ID },
    update: {
      requestId: request.id,
      classId: seededClass.id,
      studentName: "Tran Minh Khoa",
      studentGrade: "Lop 12",
      parentName: request.parentName,
      parentPhone: request.parentPhone,
      parentEmail: request.parentEmail,
      address: "Quan 7, TP.HCM",
    },
    create: {
      id: SEED_MEMBER_ID,
      requestId: request.id,
      classId: seededClass.id,
      studentName: "Tran Minh Khoa",
      studentGrade: "Lop 12",
      parentName: request.parentName,
      parentPhone: request.parentPhone,
      parentEmail: request.parentEmail,
      address: "Quan 7, TP.HCM",
    },
  });

  await prisma.payment.upsert({
    where: { id: SEED_PAYMENT_ID },
    update: {
      tutorId: approvedTutor.id,
      classId: seededClass.id,
      attemptCount: 1,
      amount: 1500000,
      billImageUrl: "https://example.com/bill-seed-001.jpg",
      status: "PENDING",
      note: "April tuition payout",
      reviewedById: null,
      reviewedAt: null,
    },
    create: {
      id: SEED_PAYMENT_ID,
      tutorId: approvedTutor.id,
      classId: seededClass.id,
      attemptCount: 1,
      amount: 1500000,
      billImageUrl: "https://example.com/bill-seed-001.jpg",
      status: "PENDING",
      note: "April tuition payout",
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: "landing.seo" },
    update: {
      category: "SEO",
      value: {
        title: "SNE - Trung tam gia su",
        description: "Nen tang ket noi phu huynh va gia su uy tin.",
      },
      description: "Cau hinh SEO landing page",
      updatedById: admin.id,
    },
    create: {
      key: "landing.seo",
      category: "SEO",
      value: {
        title: "SNE - Trung tam gia su",
        description: "Nen tang ket noi phu huynh va gia su uy tin.",
      },
      description: "Cau hinh SEO landing page",
      updatedById: admin.id,
    },
  });

  const centerTeacherSeeds = [
    {
      email: "center.teacher.1@sne.vn",
      fullName: "GV Trung Tam 1",
      phone: "0901002001",
      subjects: ["Toan", "Ly"],
      districts: ["Quan 7"],
    },
    {
      email: "center.teacher.2@sne.vn",
      fullName: "GV Trung Tam 2",
      phone: "0901002002",
      subjects: ["Anh Van"],
      districts: ["Quan 1", "Quan 3"],
    },
    {
      email: "center.teacher.3@sne.vn",
      fullName: "GV Trung Tam 3",
      phone: "0901002003",
      subjects: ["Hoa", "Sinh"],
      districts: ["Quan 10"],
    },
  ];

  const centerTeachers = await Promise.all(
    centerTeacherSeeds.map((seed, index) =>
      prisma.centerTeacher.upsert({
        where: { email: seed.email },
        update: {
          fullName: seed.fullName,
          phone: seed.phone,
          subjects: seed.subjects,
          districts: seed.districts,
          status: "ACTIVE",
          createdById: admins[index % admins.length].id,
        },
        create: {
          email: seed.email,
          fullName: seed.fullName,
          phone: seed.phone,
          subjects: seed.subjects,
          districts: seed.districts,
          status: "ACTIVE",
          createdById: admins[index % admins.length].id,
        },
      }),
    ),
  );

  const classSeeds = [
    {
      id: "11111111-1111-1111-1111-111111112001",
      title: "[SEED] Toan 10 - Gia su tu do 1",
      subject: "Toan",
      grade: "Lop 10",
      district: "Quan 7",
      feePerHour: 180000,
      classType: "LOP_GIA_SU_TU_DO" as const,
      tutorType: "GIA_SU_TU_DO" as const,
      schedule: "T2, T4, T6",
    },
    {
      id: "11111111-1111-1111-1111-111111112002",
      title: "[SEED] Ly 11 - Gia su tu do 2",
      subject: "Ly",
      grade: "Lop 11",
      district: "Quan 4",
      feePerHour: 200000,
      classType: "LOP_GIA_SU_TU_DO" as const,
      tutorType: "GIA_SU_TU_DO" as const,
      schedule: "T3, T5",
    },
    {
      id: "11111111-1111-1111-1111-111111112003",
      title: "[SEED] Hoa 12 - Gia su tu do 3",
      subject: "Hoa",
      grade: "Lop 12",
      district: "Quan 10",
      feePerHour: 250000,
      classType: "LOP_GIA_SU_TU_DO" as const,
      tutorType: "GIA_SU_TU_DO" as const,
      schedule: "T2, T7",
    },
    {
      id: "11111111-1111-1111-1111-111111112004",
      title: "[SEED] Anh 9 - Gia su tu do 4",
      subject: "Anh Van",
      grade: "Lop 9",
      district: "Quan 1",
      feePerHour: 170000,
      classType: "LOP_GIA_SU_TU_DO" as const,
      tutorType: "GIA_SU_TU_DO" as const,
      schedule: "T4, CN",
    },
    {
      id: "11111111-1111-1111-1111-111111112005",
      title: "[SEED] Van 8 - Gia su tu do 5",
      subject: "Van",
      grade: "Lop 8",
      district: "Quan 3",
      feePerHour: 160000,
      classType: "LOP_GIA_SU_TU_DO" as const,
      tutorType: "GIA_SU_TU_DO" as const,
      schedule: "T3, T6",
    },
    {
      id: "11111111-1111-1111-1111-111111112006",
      title: "[SEED] Toan 10 - Gia su dao tao 1",
      subject: "Toan",
      grade: "Lop 10",
      district: "Quan 7",
      feePerHour: 210000,
      classType: "LOP_GIA_SU_DAO_TAO" as const,
      tutorType: "GIA_SU_DAO_TAO" as const,
      schedule: "T2, T4, T6",
    },
    {
      id: "11111111-1111-1111-1111-111111112007",
      title: "[SEED] Sinh 11 - Gia su dao tao 2",
      subject: "Sinh",
      grade: "Lop 11",
      district: "Quan 1",
      feePerHour: 220000,
      classType: "LOP_GIA_SU_DAO_TAO" as const,
      tutorType: "GIA_SU_DAO_TAO" as const,
      schedule: "T3, T5",
    },
    {
      id: "11111111-1111-1111-1111-111111112008",
      title: "[SEED] Ly 12 - Gia su dao tao 3",
      subject: "Ly",
      grade: "Lop 12",
      district: "Quan 4",
      feePerHour: 260000,
      classType: "LOP_GIA_SU_DAO_TAO" as const,
      tutorType: "GIA_SU_DAO_TAO" as const,
      schedule: "T2, T7",
    },
    {
      id: "11111111-1111-1111-1111-111111112009",
      title: "[SEED] Anh 9 - Gia su dao tao 4",
      subject: "Anh Van",
      grade: "Lop 9",
      district: "Quan 3",
      feePerHour: 190000,
      classType: "LOP_GIA_SU_DAO_TAO" as const,
      tutorType: "GIA_SU_DAO_TAO" as const,
      schedule: "T4, CN",
    },
    {
      id: "11111111-1111-1111-1111-111111112010",
      title: "[SEED] Van 8 - Gia su dao tao 5",
      subject: "Van",
      grade: "Lop 8",
      district: "Quan 10",
      feePerHour: 180000,
      classType: "LOP_GIA_SU_DAO_TAO" as const,
      tutorType: "GIA_SU_DAO_TAO" as const,
      schedule: "T3, T6",
    },
    {
      id: "11111111-1111-1111-1111-111111112011",
      title: "[SEED] Toan 10 - Lop trung tam 1",
      subject: "Toan",
      grade: "Lop 10",
      district: "Quan 7",
      feePerHour: 230000,
      classType: "LOP_TRUNG_TAM" as const,
      tutorType: "GIAO_VIEN_TRUNG_TAM" as const,
      schedule: "T2, T4, T6",
      centerTeacherId: centerTeachers[0].id,
    },
    {
      id: "11111111-1111-1111-1111-111111112012",
      title: "[SEED] Anh 11 - Lop trung tam 2",
      subject: "Anh Van",
      grade: "Lop 11",
      district: "Quan 1",
      feePerHour: 240000,
      classType: "LOP_TRUNG_TAM" as const,
      tutorType: "GIAO_VIEN_TRUNG_TAM" as const,
      schedule: "T3, T5",
      centerTeacherId: centerTeachers[1].id,
    },
    {
      id: "11111111-1111-1111-1111-111111112013",
      title: "[SEED] Hoa 12 - Lop trung tam 3",
      subject: "Hoa",
      grade: "Lop 12",
      district: "Quan 10",
      feePerHour: 280000,
      classType: "LOP_TRUNG_TAM" as const,
      tutorType: "GIAO_VIEN_TRUNG_TAM" as const,
      schedule: "T2, T7",
      centerTeacherId: centerTeachers[2].id,
    },
    {
      id: "11111111-1111-1111-1111-111111112014",
      title: "[SEED] Sinh 9 - Lop trung tam 4",
      subject: "Sinh",
      grade: "Lop 9",
      district: "Quan 3",
      feePerHour: 210000,
      classType: "LOP_TRUNG_TAM" as const,
      tutorType: "GIAO_VIEN_TRUNG_TAM" as const,
      schedule: "T4, CN",
      centerTeacherId: centerTeachers[0].id,
    },
    {
      id: "11111111-1111-1111-1111-111111112015",
      title: "[SEED] Van 8 - Lop trung tam 5",
      subject: "Van",
      grade: "Lop 8",
      district: "Quan 11",
      feePerHour: 200000,
      classType: "LOP_TRUNG_TAM" as const,
      tutorType: "GIAO_VIEN_TRUNG_TAM" as const,
      schedule: "T3, T6",
      centerTeacherId: centerTeachers[1].id,
    },
  ];

  await Promise.all(
    classSeeds.map((seed, index) =>
      prisma.class.upsert({
        where: { id: seed.id },
        update: {
          title: seed.title,
          subject: seed.subject,
          grade: seed.grade,
          district: seed.district,
          feePerHour: seed.feePerHour,
          classType: seed.classType,
          tutorType: seed.tutorType,
          schedule: seed.schedule,
          centerTeacherId: seed.centerTeacherId ?? null,
          status: "OPEN",
          createdById: admins[index % admins.length].id,
        },
        create: {
          id: seed.id,
          title: seed.title,
          subject: seed.subject,
          grade: seed.grade,
          district: seed.district,
          feePerHour: seed.feePerHour,
          classType: seed.classType,
          tutorType: seed.tutorType,
          schedule: seed.schedule,
          centerTeacherId: seed.centerTeacherId ?? null,
          status: "OPEN",
          createdById: admins[index % admins.length].id,
        },
      }),
    ),
  );

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorName: admin.fullName,
      action: "SEED_INITIALIZED",
      targetType: "SYSTEM",
      targetId: "seed",
      payload: {
        adminIds: admins.map((item) => item.id),
        tutorIds: tutors.map((item) => item.id),
        centerTeacherIds: centerTeachers.map((item) => item.id),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
