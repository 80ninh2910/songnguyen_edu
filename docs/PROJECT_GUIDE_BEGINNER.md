# Cẩm nang dự án SongNguyen Education cho người mới

> Cập nhật: 2026-06-19  
> Mục tiêu: giúp người chưa biết lập trình hiểu dự án làm gì, các bộ phận kết nối với nhau thế nào, một task sẽ liên quan đến file nào và cần hỏi lập trình viên điều gì.

## 1. Dự án này là gì?

SongNguyen Education là một hệ thống quản lý hoạt động gia sư. Có thể hình dung nó như một văn phòng trung tâm gia sư được chuyển thành phần mềm.

Hệ thống phục vụ ba nhóm người:

1. **Khách truy cập/phụ huynh**
   - Xem thông tin trung tâm.
   - Xem lớp đang tuyển gia sư.
   - Gửi yêu cầu tìm gia sư.
   - Xem danh sách gia sư.

2. **Gia sư**
   - Đăng ký và gửi hồ sơ.
   - Đăng nhập sau khi được duyệt.
   - Xem và ứng tuyển lớp.
   - Xem lớp đã được giao.
   - Tạo buổi học, điểm danh, nhận xét học sinh.
   - Gửi thông tin thanh toán.

3. **Nhân viên quản trị**
   - Duyệt hoặc từ chối gia sư.
   - Xử lý yêu cầu tìm gia sư của phụ huynh.
   - Tạo và quản lý lớp.
   - Ghép gia sư với lớp.
   - Theo dõi buổi học, nhận xét, thanh toán.
   - Quản lý tài khoản admin và nhật ký hoạt động.

## 2. Cách hình dung hệ thống đơn giản nhất

Hệ thống có năm bộ phận chính:

```text
┌─────────────────────────────────────────────────────────────┐
│ Người sử dụng                                               │
│ Phụ huynh / Gia sư / Nhân viên quản trị                    │
└───────────────────────────────┬─────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        Web chính                         Web quản trị
        frontend/main                     frontend/admin
                │                               │
                └───────────────┬───────────────┘
                                │ gửi yêu cầu HTTP
                              API
                         backend/api
                                │
                   ┌────────────┴────────────┐
                   │                         │
              PostgreSQL                  Redis
              dữ liệu lâu dài             phiên đăng nhập/cache
```

Ví dụ khi admin bấm “Duyệt gia sư”:

1. Trang admin hiển thị nút.
2. Khi bấm, frontend gửi request đến API.
3. API kiểm tra admin đã đăng nhập và có quyền hay chưa.
4. API cập nhật trạng thái gia sư trong PostgreSQL.
5. API ghi một dòng audit log.
6. API trả kết quả cho frontend.
7. Frontend cập nhật màn hình.

Nếu một task có thay đổi cả giao diện, quy tắc xử lý và dữ liệu, task đó thường chạm cả frontend, backend và database.

## 3. Từ điển thuật ngữ tối thiểu

| Thuật ngữ | Giải thích dễ hiểu |
|---|---|
| Frontend | Phần người dùng nhìn thấy và bấm trên trình duyệt. |
| Backend/API | Phần nhận yêu cầu, kiểm tra quyền, xử lý quy tắc và làm việc với database. |
| Database | Nơi lưu dữ liệu lâu dài, tương tự kho hồ sơ điện tử. |
| PostgreSQL | Phần mềm database dự án đang dùng. |
| Redis | Bộ nhớ nhanh dùng cho refresh token/cache; dữ liệu ở đây không phải hồ sơ nghiệp vụ chính. |
| Route/API endpoint | Một “địa chỉ chức năng” của backend, ví dụ `POST /api/v1/auth/tutor/login`. |
| Request | Yêu cầu frontend gửi đến backend. |
| Response | Kết quả backend trả lại frontend. |
| Schema | Quy định dữ liệu được phép có hình dạng như thế nào. |
| Prisma | Công cụ để code TypeScript đọc/ghi PostgreSQL. |
| Migration | File mô tả cách thay đổi cấu trúc database theo thời gian. |
| JWT | Chuỗi ký tên dùng để chứng minh người gọi API đã đăng nhập. |
| Access token | Vé ngắn hạn để gọi API. |
| Refresh token | Vé dài hạn để xin access token mới. |
| CORS | Quy tắc domain frontend nào được phép gọi API. |
| Docker | Cách đóng gói ứng dụng và dependency thành container nhất quán. |
| Coolify | Công cụ trên VPS dùng để build, chạy và quản lý container. |
| Cloudflare | Lớp DNS, HTTPS, CDN và bảo vệ phía trước VPS. |
| CI | Máy kiểm tra tự động code có build/lint/typecheck được hay không. |

## 4. Bản đồ thư mục gốc

```text
songnguyen_edu/
├── backend/
│   └── api/                         Backend Fastify
├── frontend/
│   ├── main/                        Web công khai + khu vực gia sư
│   └── admin/next-app/              Web quản trị
├── packages/
│   └── contracts/                   Một số type dùng chung
├── docs/                            Tài liệu nghiệp vụ/kỹ thuật
├── .github/workflows/ci.yml         Kiểm tra tự động trên GitHub
├── docker-compose.yml               Ghép các container production
├── .env.example                     Mẫu biến môi trường production
└── DEPLOYMENT_GUIDE.md              Hướng dẫn đưa hệ thống lên VPS
```

### Những thư mục không nên nhầm

- `node_modules`: thư viện tải về; không sửa trực tiếp.
- `.next`: kết quả Next.js build; không sửa và không commit.
- `dist`: kết quả TypeScript backend build; không sửa trực tiếp.
- `prisma/migrations`: lịch sử thay đổi database; không xóa hoặc sửa migration đã chạy production.

## 5. Frontend chính — `frontend/main`

Frontend chính vừa là website công khai vừa là cổng làm việc của gia sư.

### 5.1 Các file nền tảng

| File | Vai trò |
|---|---|
| `src/app/layout.tsx` | Khung chung toàn website: font, theme, navbar, contact dock. |
| `src/app/globals.css` | CSS chung toàn website. |
| `src/lib/api.ts` | Nơi frontend chính gọi API, gắn token và refresh khi bị 401. |
| `src/context/ProfileContext.tsx` | Giữ dữ liệu hồ sơ gia sư cho các trang con. |
| `src/components/` | Các khối giao diện tái sử dụng. |
| `next.config.mjs` | Cấu hình Next.js và redirect URL cũ. |
| `.env.local.example` | Mẫu địa chỉ API khi chạy local. |
| `package.json` | Lệnh chạy/build và danh sách thư viện. |

### 5.2 Quy tắc route của Next.js

Trong Next.js App Router, thư mục quyết định URL:

```text
src/app/gia-su/page.tsx
→ /gia-su

src/app/tai-khoan-gia-su/lop-cua-toi/page.tsx
→ /tai-khoan-gia-su/lop-cua-toi

src/app/.../[classId]/page.tsx
→ URL có ID thay đổi, ví dụ /.../abc-123
```

`page.tsx` là nội dung trang. `layout.tsx` là khung bọc nhiều trang con.

### 5.3 Các trang công khai

| URL | File chính | Ý nghĩa |
|---|---|---|
| `/` | `src/app/page.tsx` | Trang chủ. |
| `/ve-chung-toi` | `src/app/ve-chung-toi/page.tsx` | Giới thiệu trung tâm. |
| `/gia-su` | `src/app/gia-su/page.tsx` | Danh sách/giới thiệu gia sư. |
| `/lop-moi` | `src/app/lop-moi/page.tsx` | Lớp mới cần gia sư. |
| `/hoc-phi` | `src/app/hoc-phi/page.tsx` | Học phí. |
| `/hoi-dap-gia-su` | `src/app/hoi-dap-gia-su/page.tsx` | Hỏi đáp. |
| `/dang-nhap-gia-su` | `src/app/dang-nhap-gia-su/page.tsx` | Đăng nhập gia sư. |

### 5.4 Các trang khu vực gia sư

Tất cả được bọc bởi:

`src/app/tai-khoan-gia-su/layout.tsx`

Layout này thêm sidebar/khu vực gia sư và `ProfileProvider`.

| Chức năng | File |
|---|---|
| Tổng quan tài khoản | `tai-khoan-gia-su/page.tsx` |
| Hồ sơ | `tai-khoan-gia-su/ho-so/page.tsx` |
| Đổi mật khẩu | `tai-khoan-gia-su/doi-mat-khau/page.tsx` |
| Danh sách lớp có thể ứng tuyển | `tai-khoan-gia-su/danh-sach-lop/page.tsx` |
| Chi tiết lớp công khai | `tai-khoan-gia-su/chi-tiet-lop/[id]/page.tsx` |
| Lớp được giao | `tai-khoan-gia-su/lop-cua-toi/page.tsx` |
| Chi tiết lớp được giao | `tai-khoan-gia-su/lop-cua-toi/[classId]/page.tsx` |
| Tạo buổi học | `.../[classId]/buoi-hoc/tao-moi/page.tsx` |
| Chi tiết buổi học | `.../[classId]/buoi-hoc/[sessionId]/page.tsx` |
| Nhận xét buổi học | `.../[sessionId]/nhan-xet/page.tsx` |
| Tiến độ học sinh | `.../[classId]/hoc-sinh/[memberId]/page.tsx` |

### 5.5 Khi task nói “sửa website”

Hãy xác định task thuộc loại nào:

- Chỉ đổi chữ/màu/bố cục: thường sửa `page.tsx`, component hoặc CSS.
- Hiển thị thêm dữ liệu đã có: sửa page/component và type response.
- Dữ liệu chưa có từ API: phải sửa cả frontend lẫn backend.
- Thêm trạng thái mới: có thể phải sửa frontend, API schema, service, Prisma schema và migration.

## 6. Frontend quản trị — `frontend/admin/next-app`

Đây là website riêng dành cho nhân viên. URL production dự kiến là `admin.songnguyen.edu.vn`.

### 6.1 Các file nền tảng

| File | Vai trò |
|---|---|
| `src/app/layout.tsx` | Khung HTML/font chung của admin. |
| `src/app/(admin)/layout.tsx` | Bọc các trang cần đăng nhập bằng `AdminAuthGuard` và `AdminShell`. |
| `src/components/admin/AdminAuthGuard.tsx` | Chặn người chưa đăng nhập vào trang quản trị. |
| `src/components/admin/AdminShell.tsx` | Sidebar, topbar và khung giao diện admin. |
| `src/lib/adminApi.ts` | Type và toàn bộ hàm gọi admin API. |
| `src/lib/adminAuth.ts` | Đọc/ghi token và thông tin admin trong trình duyệt. |
| `src/components/admin/AdminIcon.tsx` | Bộ icon nội bộ của admin. |
| `src/app/globals.css` | CSS chung admin. |

Tên thư mục `(admin)` và `(auth)` là route group để tổ chức code; dấu ngoặc không xuất hiện trên URL.

### 6.2 Các trang admin

| URL | File | Chức năng |
|---|---|---|
| `/login` | `(auth)/login/page.tsx` | Đăng nhập admin. |
| `/dashboard` | `(admin)/dashboard/page.tsx` | Chỉ số tổng quan. |
| `/tutors` | `(admin)/tutors/page.tsx` | Danh sách gia sư. |
| `/tutors/new` | `(admin)/tutors/new/page.tsx` | Tạo gia sư. |
| `/tutors/[id]` | `(admin)/tutors/[id]/page.tsx` | Chi tiết/duyệt/từ chối/reset mật khẩu. |
| `/requests` | `(admin)/requests/page.tsx` | Yêu cầu tìm gia sư từ phụ huynh. |
| `/classes` | `(admin)/classes/page.tsx` | Quản lý lớp và ghép gia sư. |
| `/classes/statistics` | `(admin)/classes/statistics/page.tsx` | Thống kê lớp. |
| `/classes/[id]/sessions` | Trang sessions theo class | Danh sách buổi học. |
| `/audit-logs` | `(admin)/audit-logs/page.tsx` | Nhật ký thao tác. |
| `/settings` | `(admin)/settings/page.tsx` | Cấu hình hệ thống. |
| `/admin-accounts` | `(admin)/admin-accounts/page.tsx` | Quản lý tài khoản admin. |

### 6.3 ADMIN và SUPERADMIN

Database có hai vai trò admin:

- `ADMIN`: vận hành thông thường.
- `SUPERADMIN`: quyền cao hơn, đặc biệt với quản lý tài khoản admin.

Khi thêm một chức năng nhạy cảm, phải hỏi rõ:

1. ADMIN có được dùng không?
2. Chỉ SUPERADMIN được dùng?
3. Có cần ghi audit log không?
4. Có được tự thao tác lên chính tài khoản của mình không?

## 7. Backend API — `backend/api`

Backend dùng Fastify + TypeScript. Đây là nơi đặt quy tắc nghiệp vụ và kiểm soát quyền.

### 7.1 Điểm bắt đầu

```text
src/server.ts
    ↓ đọc env và mở cổng 3000
src/app.ts
    ↓ tạo Fastify, plugin, healthcheck, route
src/modules/*
    ↓ xử lý từng nhóm nghiệp vụ
PostgreSQL / Redis / email / upload
```

Các file quan trọng:

| File | Vai trò |
|---|---|
| `src/server.ts` | Khởi động HTTP server. |
| `src/app.ts` | Lắp các plugin và module vào ứng dụng. |
| `src/config/env.ts` | Đọc và kiểm tra biến môi trường. |
| `src/config/prisma.ts` | Tạo kết nối PostgreSQL qua Prisma. |
| `src/plugins/auth.plugin.ts` | JWT và xác thực request. |
| `src/plugins/cors.plugin.ts` | Cho phép main/admin domain gọi API. |
| `src/plugins/rateLimit.plugin.ts` | Giới hạn số request. |
| `src/plugins/helmet.plugin.ts` | Security headers. |
| `src/services/cache.service.ts` | Redis/cache/refresh token. |
| `src/services/email.service.ts` | Gửi email. |
| `src/services/upload.service.ts` | Xử lý upload. |
| `src/services/auditLog.service.ts` | Ghi nhật ký quản trị. |

### 7.2 Cấu trúc một module

Một module thường có các loại file:

```text
*.route.ts    Địa chỉ API, HTTP method, auth và schema tài liệu
*.schema.ts   Dữ liệu đầu vào nào hợp lệ
*.handler.ts  Nhận request và gọi service
*.service.ts  Quy tắc nghiệp vụ và database
*.types.ts    Type TypeScript của module
```

Không phải module nào hiện cũng tách hoàn hảo. Một số file route/service đang rất lớn; xem `TECHNICAL_DEBT.md`.

### 7.3 Prefix API

Các route được lắp trong `src/app.ts`:

| Nhóm | Prefix đầy đủ | Người dùng |
|---|---|---|
| Auth | `/api/v1/auth` | Admin và gia sư |
| Public | `/api/v1/public` | Không cần đăng nhập |
| Tutor | `/api/v1/tutor` | Gia sư đã đăng nhập |
| Admin | `/api/v1/admin` | Admin/SUPERADMIN |
| Settings | `/api/v1/admin/settings...` | Admin |

Ví dụ route `/tutors/:id/approve` trong module admin trở thành:

```text
PATCH /api/v1/admin/tutors/:id/approve
```

### 7.4 Nhóm Auth

File chính:

- `src/modules/auth/auth.route.ts`
- `src/modules/auth/auth.handler.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.schema.ts`

Endpoint:

| Method | Path | Ý nghĩa |
|---|---|---|
| POST | `/auth/admin/login` | Admin đăng nhập. |
| POST | `/auth/tutor/login` | Gia sư đăng nhập. |
| POST | `/auth/refresh` | Dùng refresh token xin access token mới. |
| POST | `/auth/logout` | Thu hồi refresh token trong Redis. |
| GET | `/auth/me` | Lấy người đang đăng nhập. |

### 7.5 Nhóm Public

File chính: `src/modules/public/public.route.ts`.

Chức năng:

- Xem lớp công khai.
- Xem chi tiết lớp.
- Xem gia sư công khai.
- Phụ huynh tạo yêu cầu tìm gia sư.
- Gia sư đăng ký.
- Gia sư tải tài liệu hồ sơ.

### 7.6 Nhóm Tutor

File chính: `src/modules/tutor/tutor.route.ts`.

Chức năng:

- Xem/sửa hồ sơ.
- Đổi mật khẩu.
- Xem lớp và ứng tuyển/hủy ứng tuyển.
- Xem đơn ứng tuyển.
- Xem lớp đã được giao.
- Tạo/sửa/hoàn thành buổi học.
- Gửi nhận xét học sinh.
- Xem tiến độ thành viên lớp.
- Gửi và xem thanh toán.

### 7.7 Nhóm Admin

Các file chính:

- `src/modules/admin/admin.route.ts`
- `src/modules/admin/admin.handler.ts`
- `src/modules/admin/admin.schema.ts`
- `src/modules/admin/admin.service.ts`

Chức năng:

- Dashboard.
- Gia sư và giáo viên trung tâm.
- Yêu cầu tìm gia sư.
- Lớp, thành viên, ứng viên và phân công.
- Buổi học, feedback và báo cáo tiến độ.
- Thanh toán.
- Audit log.
- Tài khoản admin.

`admin.service.ts` hiện là file rất lớn. Khi task thay đổi admin, phải yêu cầu lập trình viên kiểm tra kỹ ảnh hưởng chéo thay vì chỉ sửa dòng giao diện.

### 7.8 Settings

Settings cho phép lưu cấu hình hệ thống trong database thay vì hard-code trong code.

File:

- `src/modules/settings/settings.route.ts`
- `settings.handler.ts`
- `settings.service.ts`

Khi cập nhật setting, backend có cơ chế tùy chọn để yêu cầu Next.js revalidate. Tuy nhiên endpoint revalidation phía frontend chưa được triển khai; đây là technical debt còn mở.

## 8. Database — `backend/api/prisma`

### 8.1 Hai loại file

| File/thư mục | Vai trò |
|---|---|
| `schema.prisma` | Bản thiết kế database hiện tại. |
| `migrations/` | Lịch sử từng lần thay đổi database. |
| `seed.ts` | Tạo dữ liệu demo cho development. Không dùng production. |

### 8.2 Các bảng chính

| Model | Ý nghĩa đời thực |
|---|---|
| `Admin` | Nhân viên quản trị. |
| `Tutor` | Gia sư. |
| `TutorDocument` | Tài liệu/chứng chỉ của gia sư. |
| `CenterTeacher` | Giáo viên thuộc trung tâm. |
| `ClassRequest` | Yêu cầu tìm gia sư từ phụ huynh. |
| `Class` | Một lớp học đã được trung tâm quản lý. |
| `ClassApplication` | Gia sư ứng tuyển vào lớp. |
| `ClassAssignment` | Quyết định giao lớp cho gia sư/giáo viên. |
| `ClassMember` | Học sinh/thành viên thuộc lớp. |
| `ClassSession` | Một buổi học cụ thể. |
| `SessionFeedback` | Điểm danh và nhận xét học sinh trong buổi học. |
| `Payment` | Yêu cầu/thông tin thanh toán. |
| `SystemSetting` | Cấu hình hệ thống. |
| `AuditLog` | Ai đã làm gì, với đối tượng nào và lúc nào. |

### 8.3 Quan hệ nghiệp vụ quan trọng

```text
Phụ huynh gửi ClassRequest
        ↓ admin xử lý/convert
      Class
        ├── ClassMember (học sinh)
        ├── ClassApplication (gia sư ứng tuyển)
        ├── ClassAssignment (gia sư được giao)
        ├── ClassSession (các buổi học)
        │       └── SessionFeedback
        └── Payment
```

### 8.4 Khi nào task cần migration?

Cần migration nếu task nói những việc như:

- Thêm một trường phải lưu lâu dài.
- Thêm trạng thái mới vào enum.
- Tạo loại dữ liệu/bảng mới.
- Thay quan hệ giữa lớp, gia sư, học sinh.
- Đổi kiểu dữ liệu hoặc bắt buộc/không bắt buộc.

Không cần migration nếu chỉ đổi màu, chữ, bố cục hoặc cách hiển thị dữ liệu đã có.

Không được sửa migration đã chạy production. Thay đổi mới phải tạo migration mới.

## 9. Luồng đăng nhập hiện tại

### 9.1 Đăng nhập

```text
Người dùng nhập email + mật khẩu
        ↓
Frontend gọi API login
        ↓
Backend tìm Admin/Tutor trong PostgreSQL
        ↓
Backend so sánh password hash
        ↓
Backend tạo access token + refresh token
        ↓
Refresh token được đánh dấu hợp lệ trong Redis
        ↓
Frontend lưu token trong localStorage
```

### 9.2 Gọi API cần đăng nhập

Frontend thêm header:

```text
Authorization: Bearer <access-token>
```

Backend kiểm tra chữ ký, thời hạn và role trong token.

### 9.3 Khi access token hết hạn

1. API trả HTTP 401.
2. Frontend lấy refresh token trong localStorage.
3. Frontend gọi `/auth/refresh`.
4. Backend kiểm tra JWT và kiểm tra token còn trong Redis.
5. Backend trả access token mới.
6. Frontend gọi lại request ban đầu.

### 9.4 Điểm cần biết

Refresh/access token hiện nằm trong `localStorage`. Đây là technical debt bảo mật vì JavaScript độc hại từ XSS có thể đọc token. Hướng tương lai là refresh token bằng HttpOnly cookie. Không nên giao task này như một thay đổi nhỏ ở một file; nó ảnh hưởng cả hai frontend, auth backend, CORS, CSRF và tests.

## 10. Các luồng nghiệp vụ chính

### 10.1 Phụ huynh yêu cầu tìm gia sư

```text
Form website
→ POST /api/v1/public/class-requests
→ tạo ClassRequest trạng thái PENDING
→ admin thấy tại /requests
→ admin reject hoặc convert thành Class
→ audit log được ghi
```

Task liên quan thường chạm:

- Form/component frontend main.
- `public.route.ts` hoặc schema public.
- `admin` request page/API/service.
- `ClassRequest` trong Prisma nếu thêm dữ liệu.

### 10.2 Gia sư đăng ký và được duyệt

```text
Gia sư gửi form đăng ký
→ POST /public/tutors/register
→ Tutor trạng thái PENDING
→ có thể upload TutorDocument
→ admin xem hồ sơ
→ approve hoặc reject
→ khi APPROVED mới đăng nhập được
```

### 10.3 Gia sư ứng tuyển và được giao lớp

```text
Gia sư xem lớp OPEN
→ gửi ClassApplication
→ admin xem applicants
→ admin reject hoặc assign
→ tạo ClassAssignment
→ gia sư thấy lớp trong “Lớp của tôi”
```

### 10.4 Buổi học và nhận xét

```text
Gia sư mở lớp được giao
→ tạo ClassSession
→ cập nhật/hoàn thành buổi học
→ gửi SessionFeedback cho từng ClassMember
→ admin xem feedback/report/progress
```

### 10.5 Thanh toán

```text
Gia sư gửi Payment
→ trạng thái chờ xử lý
→ admin xem chi tiết
→ confirm hoặc reject
→ audit log
```

## 11. Response và lỗi API

API thành công thường có dạng:

```json
{
  "success": true,
  "data": {}
}
```

API thất bại thường có dạng:

```json
{
  "success": false,
  "error": {
    "code": "SOME_ERROR_CODE",
    "message": "Thông báo dễ hiểu"
  }
}
```

Các file lỗi chung:

- `src/common/errors/AppError.ts`
- `src/common/errors/errorCodes.ts`
- `src/common/errors/errorHandler.ts`
- `src/common/errors/zodErrorMap.ts`

Nếu frontend chỉ hiện “Có lỗi xảy ra”, cần kiểm tra cả response API và cách frontend đọc `error.message`.

## 12. Biến môi trường

Biến môi trường là cấu hình nằm ngoài code, ví dụ mật khẩu database và domain.

Nguồn mẫu:

- Root production: `.env.example`
- Backend local: `backend/api/.env.example`
- Main local: `frontend/main/.env.local.example`
- Admin local: `frontend/admin/next-app/.env.example`

Nhóm quan trọng:

| Nhóm | Ví dụ | Ý nghĩa |
|---|---|---|
| Database | `DATABASE_URL` | Cách API kết nối PostgreSQL. |
| Redis | `USE_REDIS`, `REDIS_URL` | Bật và kết nối Redis. |
| JWT | `JWT_SECRET`, `JWT_REFRESH_SECRET` | Khóa ký token; tuyệt đối không công khai. |
| Domain | `FRONTEND_URL`, `ADMIN_URL` | Domain được CORS cho phép. |
| Frontend build | `NEXT_PUBLIC_API_BASE_URL` | Địa chỉ API được đóng vào JavaScript frontend lúc build. |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` | Gửi email. |
| Security | `TRUST_PROXY`, `ENABLE_API_DOCS` | Tin proxy và bật/tắt tài liệu API. |

Không commit file `.env` thật. Các biến `NEXT_PUBLIC_*` không phải secret vì chúng xuất hiện trong trình duyệt.

## 13. Chạy và build

Mỗi ứng dụng Node có `package.json` riêng.

### Backend

```bash
cd backend/api
npm ci
npm run prisma:generate
npm run typecheck
npm run build
npm run dev
```

Backend local cần PostgreSQL, Redis và file `.env` hợp lệ.

### Frontend chính

```bash
cd frontend/main
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

Dev server mặc định dùng cổng 3001.

### Admin

```bash
cd frontend/admin/next-app
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

Dev server mặc định dùng cổng 3002.

## 14. Production và triển khai

### 14.1 Các container

`docker-compose.yml` có:

1. `postgres`
2. `redis`
3. `migrate`
4. `api`
5. `frontend-main`
6. `frontend-admin`

Thứ tự quan trọng:

```text
PostgreSQL healthy
→ migration chạy thành công
→ Redis healthy
→ API khởi động và ready
→ hai frontend khởi động
```

### 14.2 Domain dự kiến

| Service | Domain |
|---|---|
| Main | `songnguyen.edu.vn` |
| Admin | `admin.songnguyen.edu.vn` |
| API | `api.songnguyen.edu.vn` |

Cloudflare đứng trước Coolify. Coolify/Traefik route domain đến đúng cổng container.

### 14.3 Healthcheck

- `/health/live`: process API đang sống.
- `/health/ready`: PostgreSQL và Redis đều sẵn sàng.

Nếu live OK nhưng ready fail, lỗi nằm ở dependency/kết nối chứ không nhất thiết ở process Node.

### 14.4 CI

`.github/workflows/ci.yml` chạy khi push main hoặc mở pull request:

- Cài dependency sạch.
- Prisma generate.
- Lint/typecheck/build.
- Audit critical.
- Validate Compose.
- Build Docker images.

CI xanh không có nghĩa nghiệp vụ chắc chắn đúng; nó chỉ chứng minh code vượt qua các kiểm tra kỹ thuật đã cấu hình.

## 15. Task nào thì bắt đầu từ file nào?

### Bảng tra nhanh

| Task | Bắt đầu kiểm tra | Có thể liên quan thêm |
|---|---|---|
| Đổi nội dung trang chủ | `frontend/main/src/app/page.tsx` | component/CSS/assets |
| Đổi menu/navbar website | `frontend/main/src/components/SiteNavbar.tsx` | root layout, CSS |
| Sửa trang danh sách lớp | Main page tương ứng | `src/lib/api.ts`, public/tutor API |
| Sửa đăng nhập gia sư | Trang `dang-nhap-gia-su` | main `api.ts`, auth backend, Redis |
| Sửa hồ sơ gia sư | Main `ho-so/page.tsx` | `ProfileContext`, tutor routes, Prisma Tutor |
| Sửa dashboard admin | Admin dashboard page | `adminApi.ts`, admin dashboard service |
| Sửa duyệt gia sư | Admin tutor page/detail | `adminApi.ts`, admin route/service, audit |
| Thêm trường yêu cầu phụ huynh | Form main | public schema/route, Prisma `ClassRequest`, migration, admin request page |
| Sửa quy trình ghép lớp | Admin classes page | admin route/service, `ClassApplication`, `ClassAssignment` |
| Sửa buổi học/feedback | Tutor pages | tutor/admin routes, session models |
| Sửa thanh toán | Tutor/admin pages | tutor/admin payment routes, `Payment` model |
| Thêm setting | Admin settings page | settings module, `SystemSetting` |
| Sửa quyền admin | Admin guard/UI | auth plugin, admin route authorization, `AdminRole` |
| Sửa email | `email.service.ts` | env, nơi gọi service, template |
| Sửa upload tài liệu | registration/profile UI | public/tutor route, upload service, `TutorDocument` |
| Thêm field database | `schema.prisma` | migration, service, schema API, frontend type/UI |
| Sửa domain/API URL | env/Coolify | CORS, `NEXT_PUBLIC_*`, Cloudflare |
| Deploy lỗi | Coolify logs/Compose | Dockerfile, env, healthcheck, migration |

### Cách tìm file từ URL

Nếu lỗi ở URL frontend, chuyển URL thành đường dẫn thư mục trong `src/app`.

Nếu lỗi từ API, xem Network tab để lấy method/path rồi tìm chuỗi route trong `backend/api/src/modules`.

Ví dụ:

```text
PATCH /api/v1/admin/tutors/123/approve
→ prefix /api/v1/admin được lắp trong app.ts
→ tìm /tutors/:id/approve
→ backend/api/src/modules/admin/admin.route.ts
→ handler/service tương ứng
```

## 16. Cách mô tả task để lập trình viên không hiểu sai

Một task tốt nên trả lời:

1. **Ai sử dụng?** Phụ huynh, gia sư, ADMIN hay SUPERADMIN?
2. **Bắt đầu từ đâu?** Trang/URL nào?
3. **Hành động gì?** Bấm nút, gửi form, tự động chạy?
4. **Dữ liệu vào là gì?** Field nào bắt buộc, định dạng nào?
5. **Kết quả mong muốn?** Màn hình và database thay đổi ra sao?
6. **Trường hợp lỗi?** Trùng dữ liệu, không có quyền, trạng thái sai?
7. **Có thông báo/audit/email không?**
8. **Có ảnh hưởng dữ liệu cũ không?**
9. **Tiêu chí nghiệm thu là gì?**

Ví dụ task mơ hồ:

> Thêm trạng thái tạm dừng lớp.

Ví dụ task đủ rõ:

> ADMIN và SUPERADMIN có thể tạm dừng một lớp OPEN từ trang `/classes`. Khi tạm dừng, lớp không xuất hiện trong danh sách public và gia sư không thể ứng tuyển mới. Các assignment hiện tại vẫn giữ nguyên. Phải lưu người thao tác, thời gian và lý do vào audit log. Admin có thể mở lại lớp. Dữ liệu lớp cũ không thay đổi.

Từ mô tả này, lập trình viên biết cần xem enum/status database, migration, public filter, tutor apply rule, admin UI/API và audit log.

## 17. Checklist nghiệm thu một task

### Nếu task chỉ là giao diện

- Đúng desktop và mobile?
- Chữ, màu, khoảng cách đúng?
- Loading/empty/error state có chưa?
- Link và nút hoạt động?
- Không làm hỏng trang khác dùng cùng component?

### Nếu task có API

- Người không đăng nhập bị chặn?
- Role sai bị chặn?
- Input sai có thông báo rõ?
- API trả đúng status code?
- Frontend hiển thị lỗi từ API?
- Thao tác lặp lại có gây tạo dữ liệu trùng?

### Nếu task có database

- Có migration mới?
- Migration chạy được trên database có dữ liệu?
- Dữ liệu cũ có giá trị mặc định hợp lý?
- Có rollback/backup plan?
- Không sửa migration đã chạy production?

### Nếu task nhạy cảm

- Có audit log?
- Có lộ secret/token/password trong log?
- Có giới hạn file upload?
- Có rate limit?
- Có kiểm thử quyền ADMIN/SUPERADMIN/TUTOR?

## 18. Khi có lỗi, nên hỏi và kiểm tra gì?

### Trang không mở

1. Domain/DNS có đúng không?
2. Frontend container có healthy không?
3. Build log có lỗi không?
4. Browser Console có lỗi JavaScript không?

### Trang mở nhưng không có dữ liệu

1. Browser Network có request API không?
2. URL API có đúng `/api/v1` không?
3. Response là 200, 401, 403, 404 hay 500?
4. API log nói gì?
5. Database có record tương ứng không?

### 401 Unauthorized

- Token thiếu/hết hạn/sai?
- Refresh token còn trong Redis?
- `JWT_SECRET` có thay đổi sau deploy không?
- Frontend đang đọc token của main hay admin?

### 403 Forbidden

- Người dùng đăng nhập nhưng không có đúng role/quyền.
- Gia sư có thể chưa APPROVED.
- Gia sư có thể không được assign vào lớp.

### API 500

- Xem API log và error code.
- Kiểm tra migration đã chạy.
- Kiểm tra PostgreSQL/Redis.
- Kiểm tra biến môi trường.

### Deploy dừng ở migrate

- Không bỏ qua migration để ép API chạy.
- Kiểm tra SQL migration, `DATABASE_URL` và quyền database.
- Xác nhận backup trước khi sửa migration production.

## 19. Những file/vùng không nên tự sửa nếu chưa hiểu kỹ

- `backend/api/prisma/migrations/*`
- `backend/api/src/modules/admin/admin.service.ts`
- `backend/api/src/modules/tutor/tutor.route.ts`
- Auth token/JWT/Redis flow.
- `docker-compose.yml` và production env.
- `.github/workflows/ci.yml`
- Permission/role checks.
- Backup/restore commands.

Bạn vẫn có thể đọc các file này để hiểu. Nhưng trước khi thay đổi cần yêu cầu lập trình viên giải thích tác động, test và rollback plan.

## 20. Technical debt cần biết khi giao task

Xem danh sách đầy đủ tại `docs/TECHNICAL_DEBT.md`.

Các điểm ảnh hưởng trực tiếp đến cách giao việc:

1. Token đang nằm trong localStorage; task auth cần coi là dự án bảo mật riêng.
2. Chưa có integration test tự động đầy đủ với PostgreSQL/Redis.
3. Một số file rất lớn; thay đổi nhỏ có thể ảnh hưởng nhiều chức năng.
4. Admin còn nhiều effect/state pattern cũ.
5. Dependency audit còn cảnh báo cần triage.
6. Revalidation settings chưa hoàn chỉnh.

Không nên yêu cầu “sửa nhanh” ở các vùng này mà không có test và review.

## 21. Thứ tự đọc dự án dành cho người mới

Không cần đọc mọi dòng code. Đọc theo thứ tự:

1. Tài liệu này để hiểu bản đồ.
2. `backend/api/prisma/schema.prisma` để biết hệ thống lưu những gì.
3. Danh sách page trong hai `frontend/*/src/app` để biết người dùng thấy gì.
4. `backend/api/src/app.ts` để biết API chia module thế nào.
5. Route file của đúng module khi có task.
6. Frontend page và API wrapper tương ứng.
7. Service/database logic chỉ khi task liên quan nghiệp vụ.
8. `DEPLOYMENT_GUIDE.md` khi task liên quan server/deploy.
9. `TECHNICAL_DEBT.md` trước khi lên kế hoạch refactor.

## 22. Mẫu phiếu phân tích task

Có thể sao chép mẫu này khi giao việc:

```text
Tên task:

Người dùng/role:
Trang hoặc URL:
Vấn đề hiện tại:
Kết quả mong muốn:

Dữ liệu đầu vào:
Dữ liệu đầu ra:
Quy tắc nghiệp vụ:
Trường hợp lỗi:
Quyền truy cập:
Audit/email/notification:

Có thay database không:
Có ảnh hưởng dữ liệu cũ không:
Có cần migration không:

Tiêu chí nghiệm thu:
1.
2.
3.

Ảnh/video/file tham chiếu:
```

## 23. Tóm tắt một trang

- `frontend/main`: website công khai và cổng gia sư.
- `frontend/admin/next-app`: hệ thống cho nhân viên quản trị.
- `backend/api`: API, quyền và quy tắc nghiệp vụ.
- `schema.prisma`: bản đồ dữ liệu.
- PostgreSQL: lưu dữ liệu nghiệp vụ lâu dài.
- Redis: refresh token và cache.
- `docker-compose.yml`: cách các service chạy cùng nhau.
- `DEPLOYMENT_GUIDE.md`: cách deploy.
- `TECHNICAL_DEBT.md`: các khoản nợ/rủi ro còn lại.
- Khi có task, bắt đầu từ người dùng + URL + hành động + dữ liệu + quyền, sau đó dùng bảng mục 15 để tìm đúng file.
