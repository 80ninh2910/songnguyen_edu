import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export default function PaymentsPage() {
  return (
    <AdminSectionPlaceholder
      title="Payments"
      subtitle="Kiểm duyệt bill và xác nhận thanh toán cho gia sư."
      checklist={[
        "Bộ lọc theo status PENDING/CONFIRMED/REJECTED.",
        "Preview ảnh bill và thông tin chuyển khoản.",
        "Confirm/reject action kèm ghi chú nội bộ.",
      ]}
    />
  );
}
