Phân Quyền Giáo Viên Trung Tâm (GIAO_VIEN_TRUNG_TAM)
Mô tả vấn đề
Admin tạo lớp trung tâm và assign cho giáo viên qua ClassAssignment, nhưng giáo viên trung tâm không thấy lớp đã được phân công vì "Lớp của Tôi" đang gọi sai endpoint (/tutor/applications — lấy lịch sử ứng tuyển thay vì lớp được assign).

Đồng thời, giáo viên trung tâm vẫn thấy và có thể gửi yêu cầu nhận lớp qua trang "Danh Sách Lớp" — vi phạm nghiệp vụ nghiêm trọng.

Phân tích hiện trạng
Database (OK — không cần migration)
ClassAssignment đã có tutorId → Tutor.id
Khi admin tạo giáo viên trung tâm, hệ thống tạo đồng thời bản ghi CenterTeacher và Tutor (với tutorType = GIAO_VIEN_TRUNG_TAM)
Admin assign lớp qua POST /admin/classes/:id/assign → tạo ClassAssignment với tutorId của Tutor account
Backend đã có getAssignedClassOrThrow() kiểm tra GIAO_VIEN_TRUNG_TAM
Backend — Vấn đề cần sửa
Endpoint	Vấn đề
GET /tutor/classes	Trả về lớp OPEN cho mọi tutor, không chặn GIAO_VIEN_TRUNG_TAM
POST /tutor/classes/:id/apply	Không chặn GIAO_VIEN_TRUNG_TAM gửi yêu cầu nhận lớp
(thiếu) GET /tutor/my-assigned-classes	Endpoint trả về danh sách lớp đã được assign — chưa tồn tại
Frontend — Vấn đề cần sửa
File	Vấn đề
lop-cua-toi/page.tsx	Gọi /tutor/applications — sai với GIAO_VIEN_TRUNG_TAM
danh-sach-lop/page.tsx	Hiển thị và cho phép apply lớp với mọi loại tutor
Sidebar.tsx	Hiển thị "Danh Sách Lớp" cho mọi tutor — kể cả giáo viên trung tâm
Proposed Changes
Backend — tutor.route.ts
[MODIFY] 
tutor.route.ts
1. Chặn GIAO_VIEN_TRUNG_TAM tại GET /tutor/classes

Trong handler của GET /tutor/classes, sau khi lấy thông tin tutor, thêm:

typescript

if (tutor.tutorType === 'GIAO_VIEN_TRUNG_TAM') {
  throw new AppError('FORBIDDEN', 403, 'Center teachers cannot browse class listings');
}
2. Chặn GIAO_VIEN_TRUNG_TAM tại POST /tutor/classes/:classId/apply

Ngay sau khi tutorExists được lấy về, thêm:

typescript

if (tutorExists.tutorType === 'GIAO_VIEN_TRUNG_TAM') {
  throw new AppError('FORBIDDEN', 403, 'Center teachers cannot apply to classes');
}
3. Thêm endpoint GET /tutor/my-assigned-classes (MỚI)

Endpoint dành riêng cho GIAO_VIEN_TRUNG_TAM, trả về các lớp đã được admin phân công:

typescript

app.get('/my-assigned-classes', {
  preHandler: requireTutorWithPassword,
  // ...
}, async (request, reply) => {
  const tutorId = request.user!.sub;
  await ensureCenterTutor(tutorId);
  const assignments = await prisma.classAssignment.findMany({
    where: { tutorId },
    orderBy: { createdAt: 'desc' },
    select: {
      createdAt: true,
      note: true,
      class: {
        select: {
          id: true,
          title: true,
          subject: true,
          grade: true,
          district: true,
          feePerHour: true,
          schedule: true,
          status: true,
          classType: true,
        },
      },
    },
  });
  const mapped = assignments.map(a => ({
    assignedAt: a.createdAt,
    note: a.note,
    ...a.class,
  }));
  void reply.send(success(mapped));
});
Frontend — Sidebar.tsx
[MODIFY] 
Sidebar.tsx
Sidebar cần đọc tutorType từ ProfileContext để ẩn điều kiện menu:

typescript

import { useProfile } from '@/context/ProfileContext';
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useProfile();
  const isCenterTeacher = profile.tutorType === 'GIAO_VIEN_TRUNG_TAM';
  // ...
  // Ẩn link "Danh Sách Lớp" nếu là giáo viên trung tâm:
  {!isCenterTeacher && (
    <Link href="/tai-khoan-gia-su/danh-sach-lop" ...>Danh Sách Lớp</Link>
  )}
}
IMPORTANT

Sidebar hiện không dùng context. Cần import useProfile và thêm 'use client' nếu chưa có (đã có).

Frontend — lop-cua-toi/page.tsx
[MODIFY] 
page.tsx
Trang này cần phân nhánh theo tutorType:

GIAO_VIEN_TRUNG_TAM → gọi /tutor/my-assigned-classes, hiển thị trực tiếp danh sách lớp được assign, nút "Xem Lịch Dạy"
Các loại khác → giữ nguyên gọi /tutor/applications
Luồng mới cho GIAO_VIEN_TRUNG_TAM:

typescript

const { profile } = useProfile();
const isCenterTeacher = profile.tutorType === 'GIAO_VIEN_TRUNG_TAM';
// Trong useEffect:
const endpoint = isCenterTeacher ? '/tutor/my-assigned-classes' : '/tutor/applications';
apiRequestWithAuth(endpoint).then(...)
UI cho GIAO_VIEN_TRUNG_TAM:

Mỗi lớp hiển thị: tên lớp, môn, trình độ, quận, lịch học
Badge: ASSIGNED (màu xanh)
Nút duy nhất: "Xem Lịch Dạy" → /tai-khoan-gia-su/lop-cua-toi/${cls.id}
Không hiển thị trạng thái ứng tuyển (PENDING/ACCEPTED/REJECTED)
Frontend — danh-sach-lop/page.tsx
[MODIFY] 
page.tsx
Thêm guard đầu trang: nếu là GIAO_VIEN_TRUNG_TAM, redirect về /tai-khoan-gia-su/lop-cua-toi:

typescript

const { profile } = useProfile();
useEffect(() => {
  if (profile.tutorType === 'GIAO_VIEN_TRUNG_TAM') {
    window.location.replace('/tai-khoan-gia-su/lop-cua-toi');
  }
}, [profile.tutorType]);
NOTE

Redirect phía frontend là lớp bảo vệ UX. Backend đã được chặn ở API level (GET /tutor/classes → 403 cho GIAO_VIEN_TRUNG_TAM), nên người dùng không thể bypass bằng cách gọi API trực tiếp.

Sơ đồ luồng sau khi fix

GIAO_VIEN_TRUNG_TAM đăng nhập
    │
    ├─ Sidebar: Ẩn "Danh Sách Lớp"
    │
    ├─ Truy cập /danh-sach-lop → Redirect về /lop-cua-toi
    │
    └─ /lop-cua-toi
           └─ Gọi GET /tutor/my-assigned-classes
                  └─ Query ClassAssignment WHERE tutorId = currentUser
                         └─ Hiển thị danh sách lớp được phân công
                                └─ Nút "Xem Lịch Dạy" → /lop-cua-toi/:classId
Open Questions
IMPORTANT

Q1: Khi profile.tutorType chưa load (string rỗng), trang "Danh Sách Lớp" sẽ render trong tích tắc trước khi redirect. Có cần thêm loading state để ẩn toàn bộ nội dung cho đến khi profile được load? → Đề xuất: thêm isLoadingProfile state.

NOTE

Q2: Trang page.tsx của lop-cua-toi hiện có tabs "Chờ Duyệt / Đã Duyệt / Từ Chối" dành cho ứng tuyển viên. Với GIAO_VIEN_TRUNG_TAM chỉ có 1 trạng thái (ASSIGNED), các tabs này có cần ẩn đi không? → Đề xuất: ẩn tabs khi là GIAO_VIEN_TRUNG_TAM.

NOTE

Q3: Lớp được assign nhưng trạng thái là OPEN hay ASSIGNED? Trong DB, ClassStatus có OPEN, ASSIGNED, CLOSED. Khi admin gọi POST /admin/classes/:id/assign, status lớp có tự chuyển sang ASSIGNED không? Cần kiểm tra logic assignClassHandler để đảm bảo badge hiển thị đúng.

Verification Plan
Automated (API level)
GIAO_VIEN_TRUNG_TAM gọi GET /tutor/classes → phải nhận 403
GIAO_VIEN_TRUNG_TAM gọi POST /tutor/classes/:id/apply → phải nhận 403
GIAO_VIEN_TRUNG_TAM gọi GET /tutor/my-assigned-classes → phải nhận 200 với danh sách lớp đúng
Tutor loại khác gọi GET /tutor/my-assigned-classes → phải nhận 403
Manual (UI)
Đăng nhập tài khoản giáo viên trung tâm → kiểm tra Sidebar không có "Danh Sách Lớp"
Truy cập thủ công /tai-khoan-gia-su/danh-sach-lop → tự redirect về lop-cua-toi
Admin assign lớp cho giáo viên → giáo viên F5 trang lop-cua-toi → lớp xuất hiện ngay
Nhấn "Xem Lịch Dạy" → vào đúng trang quản lý buổi học