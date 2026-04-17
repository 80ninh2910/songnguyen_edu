import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export default function ClassesPage() {
  return (
    <AdminSectionPlaceholder
      title="Classes"
      subtitle="Tạo, chỉnh sửa và phân lớp cho gia sư."
      checklist={[
        "Bảng classes có filter status/subject/district.",
        "Action create, close class và mở trang assign.",
        "Hiển thị applicant count và assignment status rõ ràng.",
      ]}
    />
  );
}
