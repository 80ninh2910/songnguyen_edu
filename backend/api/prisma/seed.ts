import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_REQUEST_ID = "11111111-1111-1111-1111-111111111001";
const SEED_CLASS_ID = "11111111-1111-1111-1111-111111111002";
const SEED_PAYMENT_ID = "11111111-1111-1111-1111-111111111003";

async function main(): Promise<void> {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 12);
  const tutorPasswordHash = await bcrypt.hash("Tutor@123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@sne.vn" },
    update: {
      fullName: "SNE Admin",
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@sne.vn",
      fullName: "SNE Admin",
      passwordHash: adminPasswordHash,
    },
  });

  const approvedTutor = await prisma.tutor.upsert({
    where: { email: "tutor.approved@sne.vn" },
    update: {
      fullName: "Tutor Approved",
      passwordHash: tutorPasswordHash,
      status: "APPROVED",
      subjects: ["Toan", "Ly"],
      districts: ["District 7", "District 4"],
      approvedAt: new Date(),
      approvedById: admin.id,
    },
    create: {
      email: "tutor.approved@sne.vn",
      fullName: "Tutor Approved",
      passwordHash: tutorPasswordHash,
      status: "APPROVED",
      subjects: ["Toan", "Ly"],
      districts: ["District 7", "District 4"],
      approvedAt: new Date(),
      approvedById: admin.id,
    },
  });

  const pendingTutor = await prisma.tutor.upsert({
    where: { email: "tutor.pending@sne.vn" },
    update: {
      fullName: "Tutor Pending",
      passwordHash: tutorPasswordHash,
      status: "PENDING",
      subjects: ["Anh Van"],
      districts: ["District 1"],
      approvedAt: null,
      approvedById: null,
    },
    create: {
      email: "tutor.pending@sne.vn",
      fullName: "Tutor Pending",
      passwordHash: tutorPasswordHash,
      status: "PENDING",
      subjects: ["Anh Van"],
      districts: ["District 1"],
    },
  });

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

  await prisma.payment.upsert({
    where: { id: SEED_PAYMENT_ID },
    update: {
      tutorId: approvedTutor.id,
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
      amount: 1500000,
      billImageUrl: "https://example.com/bill-seed-001.jpg",
      status: "PENDING",
      note: "April tuition payout",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorName: admin.fullName,
      action: "SEED_INITIALIZED",
      targetType: "SYSTEM",
      targetId: "seed",
      payload: {
        adminId: admin.id,
        approvedTutorId: approvedTutor.id,
        pendingTutorId: pendingTutor.id,
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
