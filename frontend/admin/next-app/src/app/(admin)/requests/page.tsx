import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export default function RequestsPage() {
  return (
    <AdminSectionPlaceholder
      title="Class Requests"
      subtitle="Quản lý yêu cầu phụ huynh và chuyển thành lớp học."
      checklist={[
        "Bộ lọc theo status: PENDING, CONVERTED, REJECTED.",
        "Chi tiết từng request với thông tin phụ huynh và nhu cầu.",
        "Action convert hoặc reject kèm confirm dialog.",
      ]}
    />
  );
}
