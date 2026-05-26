# BA - Nhận xét gia sư theo buổi học

> Dự án: Song Nguyen EDU
> Ngày: 2026-05-26
> Phạm vi: Gia sư trung tâm tạo buổi học và nhận xét học sinh theo buổi; Admin xem nhận xét theo lớp/buổi.

## 1. Mục tiêu
- Ghi nhận đánh giá của gia sư sau mỗi buổi học theo từng học sinh.
- Cho phép admin xem danh sách nhận xét theo lớp và theo buổi học.

## 2. Phạm vi
### Bao gồm
- Gia sư trung tâm tạo buổi học (session) cho lớp trung tâm đang được phân công.
- Sau khi tạo buổi học, hệ thống hiển thị form nhận xét theo từng học sinh trong lớp.
- Lưu nhận xét theo từng học sinh, theo từng buổi.
- Admin xem danh sách buổi học của lớp và xem nhận xét của từng buổi.

### Không bao gồm
- Thông báo tự động cho phụ huynh/học sinh.
- Tổng hợp báo cáo tiến độ dài hạn.
- Nhận xét cho lớp gia sư (lớp ngoài trung tâm).

## 3. Tác nhân
- Gia sư trung tâm (Center Tutor)
- Admin

## 4. User story (ngắn)
1. Gia sư trung tâm tạo buổi học để ghi nhận thông tin buổi dạy.
2. Gia sư trung tâm nhập nhận xét cho từng học sinh trong buổi học.
3. Admin xem danh sách buổi học của lớp trung tâm và danh sách nhận xét của từng buổi.

## 5. Luồng nghiệp vụ (tóm tắt)
1. Admin tạo lớp trung tâm và tạo học viên cho lớp (ví dụ: 1 học viên → tạo 1 lần, 3 học viên → tạo 3 lần) trước khi bấm tạo lớp.
2. Khi có yêu cầu học trung tâm, admin chọn lớp trung tâm có sẵn để thêm học viên vào lớp (không tạo lớp mới).
3. Gia sư trung tâm vào lớp được phân công → bấm "Tạo buổi học".
4. Hệ thống tạo buổi học và hiển thị form nhận xét theo danh sách học sinh của lớp.
5. Gia sư trung tâm nhập nhận xét cho từng học sinh → lưu.
6. Admin vào lớp → xem danh sách buổi học → chọn buổi để xem danh sách nhận xét.

## 6. Dữ liệu nhận xét (tối thiểu)
- Năng lực (thang điểm 1-5) → ánh xạ `comprehensionScore`.
- Thái độ (thang điểm 1-5) → ánh xạ `attitudeScore`.
- Hạn chế (chuỗi) → ánh xạ `weaknesses`.
- Nhận xét chữ (chuỗi) → ánh xạ `overallComment`.

## 7. Quy tắc nghiệp vụ
- Mỗi học sinh có tối đa 1 nhận xét cho mỗi buổi học.
- Chỉ gia sư trung tâm được phân công lớp mới tạo buổi học và ghi nhận xét.
- Form nhận xét chỉ hiển thị với lớp trung tâm; lớp gia sư không có form nhận xét.
- Admin chỉ xem được theo lớp/buổi, không sửa nhận xét.
- Lớp trung tâm phải có ít nhất 1 học viên trước khi tạo lớp thành công.
- Yêu cầu học trung tâm được xử lý bằng cách thêm học viên vào lớp trung tâm có sẵn, không tạo lớp mới.

## 8. Business logic trọng tâm
- Lớp trung tâm có thể có nhiều học sinh, danh sách học sinh là dữ liệu bắt buộc để hiển thị form nhận xét.
- Khi admin tạo lớp trung tâm, cần thao tác tạo học viên trước khi lưu lớp.
- Chỉ tài khoản gia sư trung tâm mới có chức năng nhận xét theo buổi.
- Khi duyệt yêu cầu học trung tâm, admin chọn lớp trung tâm phù hợp để thêm học viên.

## 9. Ghi chú ERD và thay đổi cần có (tham chiếu ERD hiện có)
- `class_members` đã tồn tại và phù hợp để lưu danh sách học viên của lớp trung tâm.
- Cần phân biệt lớp trung tâm và lớp gia sư trong bảng `classes` (ví dụ: thêm trường `classType` hoặc `isCenterClass`).
- Cần phân biệt tài khoản gia sư trung tâm để cấp quyền nhận xét (ví dụ: flag trên `tutors` hoặc role).

## 10. Phân chia phase triển khai
### Phase 1 - Nền tảng dữ liệu và API tối thiểu
- Bổ sung phân loại lớp trung tâm và phân quyền gia sư trung tâm.
- Bổ sung bảng buổi học và nhận xét theo buổi.
- API tạo buổi học, lưu nhận xét theo buổi, xem nhận xét theo lớp/buổi.
- Ràng buộc lớp trung tâm phải có học viên trước khi tạo.

Checklist Phase 1
- [ ] Thêm trường phân loại lớp trung tâm trong `classes`.
- [ ] Thêm trường/role phân biệt gia sư trung tâm.
- [ ] Tạo bảng `class_sessions`.
- [ ] Tạo bảng `session_feedbacks`.
- [ ] Tạo API tạo buổi học.
- [ ] Tạo API lưu nhận xét theo buổi.
- [ ] Tạo API xem danh sách buổi theo lớp.
- [ ] Tạo API xem nhận xét theo buổi.
- [ ] Validate lớp trung tâm phải có >= 1 học viên.

### Phase 2 - Tutor flow
- UI tạo buổi học cho lớp trung tâm.
- Form nhận xét hiển thị danh sách học viên của lớp.
- Lưu nhận xét theo từng học viên của buổi.

Checklist Phase 2
- [ ] Màn danh sách buổi học theo lớp trung tâm.
- [ ] Màn tạo buổi học.
- [ ] Form nhận xét theo danh sách học viên.
- [ ] Submit nhận xét theo buổi.
- [ ] Ràng buộc chỉ gia sư trung tâm thấy form nhận xét.

### Phase 3 - Admin flow
- UI admin tạo lớp trung tâm kèm tạo học viên.
- UI admin duyệt yêu cầu học trung tâm và chọn lớp có sẵn để thêm học viên.
- Màn xem danh sách buổi học theo lớp.
- Màn xem danh sách nhận xét theo buổi.

Checklist Phase 3
- [ ] Form tạo lớp trung tâm có bước tạo học viên.
- [ ] Validate số lượng học viên trước khi tạo lớp.
- [ ] Duyệt yêu cầu học trung tâm và chọn lớp có sẵn để thêm học viên.
- [ ] Màn danh sách buổi học theo lớp.
- [ ] Màn danh sách nhận xét theo buổi.

## 11. API dự kiến (tham chiếu tài liệu hiện có)
- `POST /tutor/classes/:classId/sessions`
- `POST /tutor/sessions/:sessionId/feedbacks`
- `GET /admin/classes/:classId/sessions`
- `GET /admin/sessions/:sessionId/feedbacks`

## 12. Tiêu chí nghiệm thu (ngắn)
1. Admin chỉ tạo được lớp trung tâm khi đã tạo ít nhất 1 học viên.
2. Gia sư trung tâm tạo buổi học và nhập nhận xét cho từng học sinh thành công.
3. Lớp gia sư không hiển thị form nhận xét.
4. Hệ thống không cho ghi 2 nhận xét cho cùng một học sinh trong cùng buổi.
5. Admin xem được danh sách buổi học của lớp và nhận xét theo buổi.
6. Yêu cầu học trung tâm được xử lý bằng cách thêm học viên vào lớp có sẵn.
