import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export default function TutorsPage() {
  return (
    <AdminSectionPlaceholder
      title="Tutors"
      subtitle="Duyệt hồ sơ gia sư và quản lý trạng thái phê duyệt."
      checklist={[
        "Filter theo status + search theo email/tên.",
        "Trang chi tiết có giấy tờ và lịch sử thao tác.",
        "Approve/reject với lý do và cập nhật audit log.",
      ]}
    />
  );
}
