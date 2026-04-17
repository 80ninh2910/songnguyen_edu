import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export default function DashboardPage() {
  return (
    <AdminSectionPlaceholder
      title="Dashboard"
      subtitle="Tổng quan vận hành dành cho admin."
      checklist={[
        "KPI cards: pending tutors, open classes, pending payments.",
        "Recent activity timeline từ audit logs.",
        "Quick actions cho approve/reject luồng chính.",
      ]}
    />
  );
}
