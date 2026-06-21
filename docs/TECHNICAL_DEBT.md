# Technical debt register

> Baseline: 2026-06-19, commit gốc `1ae2f08`

Tài liệu này chỉ ghi các khoản nợ có bằng chứng và hướng xử lý cụ thể. Không dùng nó thay issue tracker; mỗi mục khi được ưu tiên phải có owner và pull request riêng.

## Mức cao

### Auth token nằm trong localStorage

- Phạm vi: `frontend/main/src/lib/api.ts`, `frontend/admin/next-app/src/lib/adminAuth.ts`.
- Rủi ro: XSS có thể đọc access token và refresh token; refresh token tồn tại lâu hơn nên tác động lớn.
- Hướng xử lý: chuyển refresh token sang cookie `HttpOnly`, `Secure`, `SameSite`; access token giữ trong memory hoặc dùng BFF/session cookie. Bổ sung CSRF protection nếu dùng cookie cross-site.
- Loại: quyết định kiến trúc bảo mật, không nên sửa từng điểm rời rạc.

### Chưa có integration test với PostgreSQL/Redis

- Hiện CI kiểm tra build/type/lint và Docker image, chưa chạy luồng login, migration, refresh-token hoặc restore.
- Hướng xử lý: thêm test container PostgreSQL/Redis, chạy `prisma migrate deploy`, bootstrap fixture riêng và smoke test HTTP.

### Module quá lớn, nhiều trách nhiệm

Các điểm nóng đo được:

| File | Số dòng xấp xỉ |
|---|---:|
| `backend/api/src/modules/admin/admin.service.ts` | 3.245 |
| `frontend/main/src/app/page.tsx` | 2.335 |
| `frontend/admin/next-app/src/app/(admin)/classes/page.tsx` | 1.949 |
| `frontend/admin/next-app/src/app/(admin)/requests/page.tsx` | 1.800 |
| `backend/api/src/modules/tutor/tutor.route.ts` | 1.560 |
| `frontend/admin/next-app/src/lib/adminApi.ts` | 1.084 |

Rủi ro: khó review, khó test cô lập, dễ tạo conflict và regression. Tách theo use case/domain; không chia cơ học chỉ để giảm số dòng.

## Mức trung bình

### React effect/state trên admin

- ESLint ghi nhận 26 cảnh báo `react-hooks/set-state-in-effect` trên các màn hình cũ.
- Rule được giữ ở mức warning, không bị tắt, để có baseline mà chưa làm thay đổi đồng loạt luồng tải dữ liệu.
- Hướng xử lý: chuyển fetch/state sang data hook thống nhất; dùng derived state thay các effect đồng bộ; refactor từng màn hình kèm test.

### Frontend warnings

- Main còn 22 warnings: unused code, `<img>` chưa tối ưu và dependency của hook.
- Admin còn 29 warnings, chủ yếu effect/state và một số unused symbol.
- Không có lint error tại baseline mới.

### Dependency audit

- API: 4 cảnh báo (1 low, 3 moderate).
- Main: 6 cảnh báo (1 low, 4 moderate, 1 high), high hiện nằm ở dependency bắc cầu `hono`.
- Admin: 5 cảnh báo (1 low, 4 moderate).
- Hướng xử lý: xác định dependency path và khả năng khai thác trước khi nâng; không dùng `npm audit fix --force` vì có thể downgrade/major-change sai.

### Revalidation contract chưa hoàn chỉnh

- Backend có `NEXTJS_REVALIDATE_URL` và secret nhưng frontend chưa có endpoint tương ứng.
- Hướng xử lý: hoặc triển khai route có xác thực secret, hoặc xóa feature/config chết.

## Đã giảm trong đợt hardening này

- Build/typecheck của API, main và admin đã xanh.
- Dependency `@types/pg` và phiên bản Next/ESLint đã đồng bộ.
- Helmet, proxy trust có cấu hình, API docs mặc định đóng ở production.
- Tách liveness/readiness; readiness kiểm tra PostgreSQL và Redis.
- Boolean/optional env được parse rõ ràng.
- Demo seed không còn là cách bootstrap production; có command tạo SUPERADMIN một lần.
- Migration được tách thành Compose job, không chạy trên mọi API replica.
- Cấu hình Prisma deprecated trong `package.json` đã được xóa; `prisma.config.ts` là nguồn duy nhất.
- Có Dockerfiles, Compose, env examples và CI baseline.

## Nguyên tắc không làm nợ phình thêm

1. Không merge khi build/typecheck/lint có error.
2. Warning mới phải được giải thích trong PR; tổng warning không được tăng.
3. Feature mới phải có test ở tầng phù hợp.
4. File service/page vượt khoảng 500 dòng cần giải thích hoặc kế hoạch tách.
5. Migration phải backward-compatible và có phương án restore.
6. Không thêm secret, credential mẫu dùng được hoặc token vào Git.
