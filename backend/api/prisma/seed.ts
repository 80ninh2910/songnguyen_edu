import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  await prisma.tutor.upsert({
    where: { email: "tutor.approved@sne.vn" },
    update: {
      fullName: "Tutor Approved",
      passwordHash: tutorPasswordHash,
      status: "APPROVED",
      approvedAt: new Date(),
      approvedById: admin.id,
    },
    create: {
      email: "tutor.approved@sne.vn",
      fullName: "Tutor Approved",
      passwordHash: tutorPasswordHash,
      status: "APPROVED",
      approvedAt: new Date(),
      approvedById: admin.id,
    },
  });

  await prisma.tutor.upsert({
    where: { email: "tutor.pending@sne.vn" },
    update: {
      fullName: "Tutor Pending",
      passwordHash: tutorPasswordHash,
      status: "PENDING",
      approvedAt: null,
      approvedById: null,
    },
    create: {
      email: "tutor.pending@sne.vn",
      fullName: "Tutor Pending",
      passwordHash: tutorPasswordHash,
      status: "PENDING",
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
