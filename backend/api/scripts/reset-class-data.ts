/**
 * Script xóa toàn bộ dữ liệu liên quan đến lớp học để test lại từ đầu.
 * Thứ tự xóa đúng theo foreign key constraint (con trước, cha sau).
 *
 * Chạy: npx tsx scripts/reset-class-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️  Bắt đầu xóa dữ liệu lớp học...\n");

  const results: Record<string, number> = {};

  // 1. SessionFeedback (con của ClassSession và ClassMember)
  const feedbacks = await prisma.sessionFeedback.deleteMany({});
  results["SessionFeedback"] = feedbacks.count;

  // 2. ClassSession (con của Class)
  const sessions = await prisma.classSession.deleteMany({});
  results["ClassSession"] = sessions.count;

  // 3. Payment liên quan đến lớp (set classId = null thay vì xóa để giữ lịch sử thanh toán)
  const payments = await prisma.payment.updateMany({
    where: { classId: { not: null } },
    data: { classId: null },
  });
  results["Payment (unlink classId)"] = payments.count;

  // 4. ClassAssignment (con của Class)
  const assignments = await prisma.classAssignment.deleteMany({});
  results["ClassAssignment"] = assignments.count;

  // 5. ClassApplication (con của Class)
  const applications = await prisma.classApplication.deleteMany({});
  results["ClassApplication"] = applications.count;

  // 6. ClassMember (con của Class và ClassRequest)
  const members = await prisma.classMember.deleteMany({});
  results["ClassMember"] = members.count;

  // 7. Class (bảng chính)
  const classes = await prisma.class.deleteMany({});
  results["Class"] = classes.count;

  // 8. ClassRequest (yêu cầu nhận lớp từ phụ huynh) — xóa luôn nếu muốn test hoàn toàn từ đầu
  const classRequests = await prisma.classRequest.deleteMany({});
  results["ClassRequest"] = classRequests.count;

  console.log("=== Kết quả xóa ===");
  for (const [table, count] of Object.entries(results)) {
    const icon = count > 0 ? "🗑️ " : "   ";
    console.log(`${icon} ${table.padEnd(30)}: ${count} bản ghi`);
  }
  console.log("\n✅ Hoàn tất! Database đã sẵn sàng để test lại từ đầu.");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
