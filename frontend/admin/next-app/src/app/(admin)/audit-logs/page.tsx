import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export default function AuditLogsPage() {
  return (
    <AdminSectionPlaceholder
      title="Audit Logs"
      subtitle="Theo dõi toàn bộ thao tác nhạy cảm của admin."
      checklist={[
        "Filter action, target type, actor, date range.",
        "Sort mặc định theo created_at giảm dần.",
        "Mở payload JSON để debug thay đổi dữ liệu.",
      ]}
    />
  );
}
