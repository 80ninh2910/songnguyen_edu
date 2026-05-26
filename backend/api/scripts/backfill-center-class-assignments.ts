/**
 * Backfill script: Tạo ClassAssignment cho các lớp LOP_TRUNG_TAM
 * chưa có ClassAssignment (được tạo trước khi có fix tự động).
 *
 * Chạy: npx ts-node scripts/backfill-center-class-assignments.ts
 * Hoặc: npx tsx scripts/backfill-center-class-assignments.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Backfill ClassAssignment cho LOP_TRUNG_TAM ===\n");

  // Tìm tất cả lớp trung tâm chưa có ClassAssignment
  const unassignedClasses = await prisma.class.findMany({
    where: {
      classType: "LOP_TRUNG_TAM",
      centerTeacherId: { not: null },
      assignment: null, // chưa có ClassAssignment
    },
    select: {
      id: true,
      title: true,
      centerTeacherId: true,
      createdById: true,
      centerTeacher: {
        select: { email: true, fullName: true },
      },
    },
  });

  if (unassignedClasses.length === 0) {
    console.log("✅ Không có lớp nào cần backfill.");
    return;
  }

  console.log(`Tìm thấy ${unassignedClasses.length} lớp cần backfill:\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const cls of unassignedClasses) {
    const teacherEmail = cls.centerTeacher?.email;
    const teacherName = cls.centerTeacher?.fullName ?? "?";

    if (!teacherEmail) {
      console.log(`  ⚠️  [SKIP] Lớp "${cls.title}" (${cls.id}) — không tìm được email giáo viên`);
      skipCount++;
      continue;
    }

    // Lookup Tutor account theo email
    const tutorAccount = await prisma.tutor.findUnique({
      where: { email: teacherEmail },
      select: { id: true },
    });

    if (!tutorAccount) {
      console.log(`  ⚠️  [SKIP] Lớp "${cls.title}" — không tìm thấy Tutor account cho ${teacherEmail}`);
      skipCount++;
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        // Tạo ClassAssignment
        await tx.classAssignment.create({
          data: {
            classId: cls.id,
            tutorId: tutorAccount.id,
            assignedById: cls.createdById,
          },
        });

        // Đổi trạng thái lớp thành ASSIGNED (nếu đang OPEN)
        await tx.class.update({
          where: { id: cls.id },
          data: { status: "ASSIGNED" },
        });
      });

      console.log(`  ✅ [OK] Lớp "${cls.title}" → Giáo viên: ${teacherName} (${teacherEmail})`);
      successCount++;
    } catch (err) {
      console.log(`  ❌ [ERROR] Lớp "${cls.title}": ${err instanceof Error ? err.message : err}`);
      errorCount++;
    }
  }

  console.log(`\n=== Kết quả ===`);
  console.log(`✅ Thành công: ${successCount}`);
  console.log(`⚠️  Bỏ qua:    ${skipCount}`);
  console.log(`❌ Lỗi:        ${errorCount}`);
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
