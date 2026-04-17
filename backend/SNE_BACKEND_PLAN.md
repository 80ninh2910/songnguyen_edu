# SNE — Backend System Design Plan
> Tài liệu tổng hợp: thiết kế toàn hệ thống, stack quyết định, roadmap thực thi.
> Owner: Backend + Admin FE
> Phạm vi: Backend core (80%) + Admin FE vận hành (20%)

---

## 1. Stack quyết định

| Layer | Công nghệ | Lý do |
|-------|-----------|-------|
| **Backend runtime** | Node.js 20 LTS | Stable, LTS support |
| **HTTP framework** | **Fastify 4** | 2-3x nhanh hơn Express, schema-first, plugin ecosystem tốt |
| **ORM** | **Prisma 5** | Type-safe, migration tốt, relation query rõ ràng |
| **Database** | **PostgreSQL 16** | Array type cho subjects/grades/districts, ACID transaction |
| **Auth** | **JWT** (jsonwebtoken) + **bcrypt** | Access token 15m + Refresh token 7d lưu Redis |
| **Cache / Token store** | **Redis** (Upstash trên prod) | Lưu refresh token, upload token, rate limit |
| **File storage** | **Cloudinary** | Free tier đủ dùng, SDK đơn giản, URL transform |
| **Email** | **Resend** | API-first, free 3k email/tháng, template HTML dễ |
| **Validation** | **Zod** | Type inference tốt, tích hợp Fastify schema |
| **Admin FE** | **Next.js 14** App Router | SSR + RSC, fetch trực tiếp từ API |
| **Admin UI** | **shadcn/ui** + **TailwindCSS** | Không cần design system riêng |
| **Deploy BE** | **Railway** | Auto-deploy từ Git, Postgres + Redis addon sẵn |
| **Deploy FE** | **Vercel** | Zero-config Next.js |
| **API Docs** | **Scalar** (thay Swagger UI) | Tích hợp Fastify, UI đẹp hơn |

---

## 2. Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                      │
│  Public Website (Next.js)  │  Admin Panel (Next.js) │
└──────────────┬─────────────┴──────────┬─────────────┘
               │ HTTPS                  │ HTTPS
               ▼                        ▼
┌─────────────────────────────────────────────────────┐
│              FASTIFY API SERVER                     │
│                                                     │
│  /api/v1/public/*   /api/v1/auth/*                  │
│  /api/v1/tutor/*    /api/v1/admin/*                 │
│                                                     │
│  Plugins:  JWT · Rate-limit · Multipart · CORS      │
│  Hooks:    onRequest (auth) · onSend (log)          │
└──────┬──────────────┬───────────────┬───────────────┘
       │              │               │
       ▼              ▼               ▼
  PostgreSQL        Redis          Cloudinary
  (Prisma)     (token store)    (file storage)
                                     │
                                  Resend
                               (email service)
```

### Layered architecture (mỗi module)

```
Router (Fastify route)
  └── Handler (validate input, gọi service)
        └── Service (business logic, transaction)
              └── Prisma (DB access)
```

Quy tắc cứng:
- Handler **không** gọi Prisma trực tiếp
- Service **không** biết về HTTP request/response
- Mọi lỗi business logic → throw `AppError` (custom class)
- Mọi DB error → bắt tại global error handler

---

## 3. Cấu trúc thư mục

```
sne-backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── server.ts               ← Fastify instance, register plugins, listen
│   ├── app.ts                  ← createApp() factory, mount routes
│   │
│   ├── config/
│   │   ├── env.ts              ← Zod validate process.env → typed config object
│   │   ├── prisma.ts           ← PrismaClient singleton
│   │   └── redis.ts            ← Redis singleton (ioredis)
│   │
│   ├── plugins/                ← Fastify plugins (fp wrapped)
│   │   ├── auth.plugin.ts      ← JWT verify hook, gắn request.user
│   │   ├── cors.plugin.ts
│   │   ├── multipart.plugin.ts ← @fastify/multipart cho file upload
│   │   ├── rateLimit.plugin.ts ← @fastify/rate-limit
│   │   └── scalar.plugin.ts    ← API docs tại /docs
│   │
│   ├── common/
│   │   ├── errors/
│   │   │   ├── AppError.ts     ← class AppError(code, statusCode, message)
│   │   │   ├── errorCodes.ts   ← enum tất cả error codes
│   │   │   └── errorHandler.ts ← Fastify setErrorHandler global
│   │   │
│   │   └── utils/
│   │       ├── response.ts     ← success() / successList() helpers
│   │       ├── pagination.ts   ← parsePagination(), buildMeta()
│   │       ├── password.ts     ← hashPassword(), comparePassword(), generateTempPassword()
│   │       └── auditLog.ts     ← createAuditLog() helper
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.handler.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts   ← Zod + Fastify JSON Schema
│   │   │   └── jwt.service.ts
│   │   │
│   │   ├── public/
│   │   │   ├── public.route.ts
│   │   │   ├── public.handler.ts
│   │   │   ├── public.service.ts
│   │   │   └── public.schema.ts
│   │   │
│   │   ├── tutor/
│   │   │   ├── tutor.route.ts
│   │   │   ├── tutor.handler.ts
│   │   │   ├── tutor.service.ts
│   │   │   └── tutor.schema.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.route.ts
│   │       ├── admin.handler.ts
│   │       ├── admin.service.ts
│   │       └── admin.schema.ts
│   │
│   ├── services/               ← Shared infrastructure services
│   │   ├── upload.service.ts   ← Cloudinary upload/delete
│   │   ├── email.service.ts    ← Resend send + templates
│   │   └── auditLog.service.ts ← Ghi audit_logs table
│   │
│   └── types/
│       ├── fastify.d.ts        ← Extend FastifyRequest: user, tutor
│       └── index.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 4. Database schema (Prisma)

> File đầy đủ đã có ở `prisma/schema.prisma`. Phần này mô tả thêm bảng mới.

### 4.1 Bảng mới cần thêm: `audit_logs`

```prisma
model AuditLog {
  id         String   @id @default(uuid())
  actorId    String   @map("actor_id")        // admin.id
  actorName  String   @map("actor_name")      // denormalize để không mất khi xoá admin
  action     String                           // "APPROVE_TUTOR" | "REJECT_TUTOR" | ...
  targetType String   @map("target_type")     // "TUTOR" | "CLASS" | "PAYMENT" | ...
  targetId   String   @map("target_id")       // id của record bị tác động
  payload    Json?                            // snapshot data trước/sau khi thay đổi
  createdAt  DateTime @default(now()) @map("created_at")

  @@index([actorId])
  @@index([targetType, targetId])
  @@index([createdAt(sort: Desc)])
  @@map("audit_logs")
}
```

**Các action cần log:**

| action | targetType | Khi nào |
|--------|-----------|---------|
| `APPROVE_TUTOR` | TUTOR | Admin duyệt gia sư |
| `REJECT_TUTOR` | TUTOR | Admin từ chối gia sư |
| `CREATE_CLASS` | CLASS | Admin tạo lớp |
| `UPDATE_CLASS` | CLASS | Admin sửa lớp |
| `CLOSE_CLASS` | CLASS | Admin đóng lớp |
| `CONVERT_REQUEST` | CLASS_REQUEST | Admin chuyển yêu cầu PH thành lớp |
| `REJECT_REQUEST` | CLASS_REQUEST | Admin từ chối yêu cầu PH |
| `ASSIGN_CLASS` | CLASS_ASSIGNMENT | Admin phân lớp cho gia sư |
| `CONFIRM_PAYMENT` | PAYMENT | Admin xác nhận thanh toán |
| `REJECT_PAYMENT` | PAYMENT | Admin từ chối bill |

### 4.2 Enums (giữ nguyên từ thiết kế cũ)

```
TutorStatus:       PENDING | APPROVED | REJECTED
ClassStatus:       OPEN | ASSIGNED | CLOSED
ApplicationStatus: PENDING | ACCEPTED | REJECTED
RequestStatus:     PENDING | CONVERTED | REJECTED
PaymentStatus:     PENDING | CONFIRMED | REJECTED
```

### 4.3 Indexes cần tạo

```sql
-- Hay query nhất, cần index:
CREATE INDEX tutors_status_idx       ON tutors(status);
CREATE INDEX tutors_subjects_gin     ON tutors USING GIN(subjects);
CREATE INDEX classes_status_idx      ON classes(status);
CREATE INDEX classes_filter_idx      ON classes(status, subject, district);
CREATE INDEX applications_class_idx  ON class_applications(class_id);
CREATE INDEX applications_tutor_idx  ON class_applications(tutor_id);
CREATE INDEX audit_logs_actor_idx    ON audit_logs(actor_id);
CREATE INDEX audit_logs_target_idx   ON audit_logs(target_type, target_id);
```

---

## 5. API Contract — tất cả endpoints

> Base URL: `https://api.sne.vn/api/v1`
> Auth header: `Authorization: Bearer <access_token>`

### Response envelope (thống nhất)

```json
// Success
{ "success": true, "data": { ... } }

// Success list
{ "success": true, "data": [...], "meta": { "page": 1, "limit": 20, "total": 48, "totalPages": 3 } }

// Error
{ "success": false, "error": { "code": "TUTOR_NOT_FOUND", "message": "...", "details": null } }

// Validation error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [{ "field": "email", "message": "..." }] } }
```

---

### AUTH `/api/v1/auth`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/admin/login` | Public | Admin đăng nhập → accessToken + refreshToken |
| POST | `/tutor/login` | Public | Tutor đăng nhập (chỉ APPROVED) |
| POST | `/refresh` | Public | Đổi refreshToken → accessToken mới |
| POST | `/logout` | JWT | Revoke refreshToken khỏi Redis |
| GET | `/me` | JWT | Trả thông tin user đang đăng nhập |

---

### PUBLIC `/api/v1/public`

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/classes` | Public | Danh sách lớp OPEN, filter: subject/grade/district/minFee/maxFee |
| GET | `/classes/:id` | Public | Chi tiết lớp OPEN |
| GET | `/tutors` | Public | Danh sách gia sư tiêu biểu (APPROVED, chỉ fields public) |
| POST | `/class-requests` | Public | Phụ huynh gửi yêu cầu tìm gia sư |
| POST | `/tutors/register` | Public | Gia sư đăng ký hồ sơ bước 1 → trả uploadToken |
| POST | `/tutors/:id/documents` | uploadToken | Upload CCCD + bằng cấp bước 2 |

---

### TUTOR `/api/v1/tutor` — yêu cầu JWT + status=APPROVED

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/profile` | Xem hồ sơ cá nhân |
| PATCH | `/profile` | Cập nhật bio, subjects, districts, experience |
| GET | `/classes` | Danh sách lớp OPEN kèm myApplication status |
| POST | `/classes/:classId/apply` | Đăng ký nhận lớp |
| DELETE | `/classes/:classId/apply` | Huỷ đăng ký (chỉ khi PENDING) |
| GET | `/applications` | Danh sách lớp đã đăng ký + trạng thái |
| POST | `/payments` | Upload bill chuyển khoản (multipart) |
| GET | `/payments` | Lịch sử thanh toán |

---

### ADMIN `/api/v1/admin` — yêu cầu JWT + role=ADMIN

#### Dashboard
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/dashboard` | Stats + recent activity |

#### Quản lý gia sư
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/tutors` | Danh sách, filter: status/search/subject |
| GET | `/tutors/:id` | Chi tiết + URLs giấy tờ + stats |
| PATCH | `/tutors/:id/approve` | Duyệt → tạo account + gửi email mật khẩu |
| PATCH | `/tutors/:id/reject` | Từ chối + lý do |

#### Quản lý yêu cầu phụ huynh
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/class-requests` | Danh sách, filter: status |
| GET | `/class-requests/:id` | Chi tiết |
| POST | `/class-requests/:id/convert` | Chuyển thành lớp (transaction) |
| PATCH | `/class-requests/:id/reject` | Từ chối + lý do |

#### Quản lý lớp học
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/classes` | Danh sách, filter: status/subject/district |
| POST | `/classes` | Tạo lớp trực tiếp |
| GET | `/classes/:id` | Chi tiết + sourceRequest + assignment |
| PATCH | `/classes/:id` | Sửa (chỉ OPEN/ASSIGNED) |
| PATCH | `/classes/:id/close` | Đóng lớp |
| GET | `/classes/:id/applicants` | DS gia sư đăng ký |
| POST | `/classes/:id/assign` | Phân lớp (ACID transaction) |

#### Quản lý thanh toán
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/payments` | Danh sách, filter: status |
| GET | `/payments/:id` | Chi tiết + ảnh bill |
| PATCH | `/payments/:id/confirm` | Xác nhận |
| PATCH | `/payments/:id/reject` | Từ chối + lý do |

#### Audit log
| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/audit-logs` | Lịch sử thao tác admin, filter: action/targetType/actorId |

---

## 6. Business logic — các transaction cần thực hiện atomic

### TX1: Approve gia sư

```
Input: adminId, tutorId

1. Check tutor.status === PENDING
2. generateTempPassword()
3. hashPassword(temp)
4. prisma.$transaction:
   a. tutors.update → status=APPROVED, passwordHash, approvedAt, approvedById
   b. audit_logs.create → action=APPROVE_TUTOR
5. [Sau TX] resend.send(tutorApprovedEmail)
6. [Sau TX] Return success
```

### TX2: Convert yêu cầu PH → lớp

```
Input: adminId, requestId, classData

1. Check request.status === PENDING
2. prisma.$transaction:
   a. classes.create → status=OPEN, sourceRequestId, createdById
   b. class_requests.update → status=CONVERTED, processedAt, processedById
   c. audit_logs.create → action=CONVERT_REQUEST
3. Return { classId }
```

### TX3: Phân lớp cho gia sư (QUAN TRỌNG NHẤT)

```
Input: adminId, classId, tutorId, note

Validation (ngoài TX):
1. Check class.status === OPEN
2. Check application tồn tại cho (classId, tutorId)

prisma.$transaction([
   a. class_assignments.create(classId, tutorId, adminId, note)
   b. class_applications.update(selected) → ACCEPTED
   c. class_applications.updateMany(others) → REJECTED
   d. classes.update → status=ASSIGNED
   e. audit_logs.create → action=ASSIGN_CLASS
])

[Sau TX] resend.send(classAssignedEmail)
```

---

## 7. Phân quyền (RBAC)

```
PUBLIC   → không cần token
TUTOR    → JWT valid + role=TUTOR + status=APPROVED
ADMIN    → JWT valid + role=ADMIN
```

Fastify hook thực hiện:

```typescript
// preHandler hook cho từng route group
fastify.addHook('preHandler', async (request, reply) => {
  await request.jwtVerify()                    // verify JWT
  if (request.user.role !== 'ADMIN')          // check role
    throw Errors.forbidden()
})
```

---

## 8. Audit Log service

Mọi thao tác write của admin đều ghi log. Gọi cuối mỗi transaction hoặc sau khi thao tác thành công.

```typescript
// src/services/auditLog.service.ts

async function createAuditLog(params: {
  actorId:    string
  actorName:  string
  action:     string
  targetType: string
  targetId:   string
  payload?:   object
}) {
  await prisma.auditLog.create({ data: params })
}
```

---

## 9. Email service (Resend)

```typescript
// src/services/email.service.ts

const resend = new Resend(config.resend.apiKey)

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({ from: 'SNE <no-reply@sne.vn>', to, subject, html })
  } catch (err) {
    console.error('[Email] Failed:', err) // không throw — email là side effect
  }
}

// 4 templates:
sendTutorApproved(to, fullName, tempPassword)
sendTutorRejected(to, fullName, reason)
sendClassAssigned(to, fullName, classInfo)
sendClassRejected(to, fullName, classInfo)
```

---

## 10. Roadmap thực thi

### Giai đoạn 1 — Foundation (Tuần 1)
**Mục tiêu:** Server chạy được, DB có dữ liệu, auth hoạt động.

| Task | File | Ước tính |
|------|------|---------|
| Setup Fastify project, tsconfig, package.json | root | 2h |
| `config/env.ts` — validate env với Zod | config/ | 1h |
| `config/prisma.ts` + `config/redis.ts` | config/ | 1h |
| `prisma/schema.prisma` — 8 models (thêm audit_logs) | prisma/ | 1h |
| `prisma migrate dev` + `prisma/seed.ts` | prisma/ | 2h |
| `plugins/auth.plugin.ts` — JWT fastify-jwt | plugins/ | 1h |
| `plugins/cors, rateLimit, multipart, scalar` | plugins/ | 2h |
| `common/errors/` — AppError, errorCodes, errorHandler | common/ | 2h |
| `common/utils/` — response, pagination, password | common/ | 1h |
| `modules/auth/` — login admin/tutor, refresh, logout, me | modules/auth/ | 3h |
| `server.ts` + `app.ts` | root | 1h |
| **Kiểm tra:** health check + 5 auth endpoints | — | 1h |

**Checklist giai đoạn 1:**
- [ ] `GET /health` → 200
- [ ] `POST /auth/admin/login` → tokens
- [ ] `POST /auth/tutor/login` (APPROVED) → tokens
- [ ] `POST /auth/tutor/login` (PENDING) → TUTOR_NOT_APPROVED
- [ ] `GET /auth/me` có token → user info
- [ ] `GET /auth/me` không token → AUTH_REQUIRED
- [ ] `POST /auth/refresh` → new accessToken
- [ ] `POST /auth/logout` → refresh token bị revoke

---

### Giai đoạn 2 — Admin core (Tuần 2)
**Mục tiêu:** Admin có thể duyệt gia sư, quản lý lớp, phân lớp.

| Task | File | Ước tính |
|------|------|---------|
| `services/upload.service.ts` — Cloudinary | services/ | 2h |
| `services/email.service.ts` + 4 templates | services/ | 3h |
| `services/auditLog.service.ts` | services/ | 1h |
| `modules/admin/admin.schema.ts` — Zod schemas | admin/ | 2h |
| `modules/admin/admin.service.ts` — tất cả business logic | admin/ | 8h |
| `modules/admin/admin.handler.ts` | admin/ | 3h |
| `modules/admin/admin.route.ts` — mount tất cả routes | admin/ | 1h |
| **Kiểm tra:** 22 admin endpoints | — | 2h |

**Checklist giai đoạn 2:**
- [ ] `GET /admin/dashboard` → đúng stats
- [ ] `GET /admin/tutors?status=PENDING` → list
- [ ] `PATCH /admin/tutors/:id/approve` → email gửi + status=APPROVED
- [ ] `PATCH /admin/tutors/:id/reject` → status=REJECTED
- [ ] `GET /admin/class-requests` → list
- [ ] `POST /admin/class-requests/:id/convert` → lớp tạo + request CONVERTED (1 transaction)
- [ ] `POST /admin/classes` → lớp mới
- [ ] `PATCH /admin/classes/:id/close` → status=CLOSED
- [ ] `POST /admin/classes/:id/assign` → 4-bước transaction OK
- [ ] Mọi action admin → có record trong audit_logs
- [ ] `GET /admin/audit-logs` → list đúng thứ tự

---

### Giai đoạn 3 — Public + Tutor (Tuần 3)
**Mục tiêu:** Gia sư đăng ký được, xem lớp, apply, upload bill.

| Task | File | Ước tính |
|------|------|---------|
| `modules/public/` — 6 endpoints | public/ | 5h |
| `modules/tutor/` — 8 endpoints | tutor/ | 5h |
| Test end-to-end full flow | — | 3h |

**Checklist giai đoạn 3:**
- [ ] Phụ huynh gửi yêu cầu → admin thấy
- [ ] Gia sư đăng ký → upload CCCD → admin duyệt → email có mật khẩu
- [ ] Gia sư login → xem lớp → apply → admin phân → email thông báo
- [ ] Gia sư upload bill → admin xác nhận

---

### Giai đoạn 4 — Admin FE (Tuần 4)
**Mục tiêu:** Giao diện đủ dùng để vận hành thật, không cần đẹp.

| Màn hình | Route Next.js | Ưu tiên |
|----------|--------------|---------|
| Login | `/login` | P0 |
| Dashboard tổng quan | `/dashboard` | P0 |
| Danh sách gia sư | `/tutors` | P0 |
| Chi tiết + duyệt gia sư | `/tutors/[id]` | P0 |
| Danh sách yêu cầu PH | `/requests` | P0 |
| Chi tiết + convert yêu cầu | `/requests/[id]` | P0 |
| Danh sách lớp | `/classes` | P0 |
| Tạo / sửa lớp | `/classes/new`, `/classes/[id]` | P0 |
| Phân lớp | `/classes/[id]/assign` | P0 |
| Danh sách thanh toán | `/payments` | P1 |
| Audit log | `/audit-logs` | P1 |

**Yêu cầu UX tối thiểu cho mỗi màn:**
- Loading state khi fetch
- Empty state khi không có data
- Error state khi API fail (toast message)
- Confirm dialog trước mọi action không thể undo (approve, reject, assign, close)

---

### Giai đoạn 5 — Hardening (Tuần 5)
**Mục tiêu:** Production-ready.

| Task | Ước tính |
|------|---------|
| OpenAPI/Scalar docs hoàn chỉnh | 3h |
| Rate limiting fine-tune | 1h |
| Security: helmet, CSRF check | 1h |
| Dockerfile + Railway config | 2h |
| Vercel config cho Admin FE | 1h |
| Smoke test toàn bộ trên staging | 3h |

---

## 11. Package.json dependencies

```json
{
  "dependencies": {
    "fastify": "^4.28.1",
    "@fastify/jwt": "^9.0.0",
    "@fastify/cors": "^9.0.1",
    "@fastify/rate-limit": "^9.1.0",
    "@fastify/multipart": "^8.3.0",
    "@fastify/helmet": "^11.1.1",
    "@scalar/fastify-api-reference": "^1.25.0",
    "@prisma/client": "^5.14.0",
    "ioredis": "^5.4.1",
    "cloudinary": "^2.3.1",
    "resend": "^3.2.0",
    "bcrypt": "^5.1.1",
    "zod": "^3.23.8",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "fastify-plugin": "^4.5.1",
    "prisma": "^5.14.0",
    "typescript": "^5.5.3",
    "ts-node-dev": "^2.0.0",
    "@types/node": "^20.14.10",
    "@types/bcrypt": "^5.0.2",
    "vitest": "^2.0.3"
  }
}
```

---

## 12. Environment variables

```env
# App
NODE_ENV=development
PORT=3000
FRONTEND_URL=https://sne.vn
ADMIN_URL=https://admin.sne.vn

# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/sne

# JWT
JWT_SECRET=<64-char hex>
JWT_REFRESH_SECRET=<64-char hex>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Redis (Upstash trên prod)
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=sne

# Resend
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=SNE Gia Sư <no-reply@sne.vn>

# Rate limit
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_LOGIN=10
RATE_LIMIT_MAX_API=200
RATE_LIMIT_MAX_PUBLIC=20

# Upload
MAX_FILE_SIZE_MB=5
```

---

## 13. Fastify vs Express — điểm khác biệt cần biết

| Khái niệm | Express | Fastify |
|-----------|---------|---------|
| Middleware | `app.use(fn)` | `fastify.addHook('preHandler', fn)` |
| Error handler | `app.use((err,req,res,next)=>)` | `fastify.setErrorHandler((err, request, reply)=>)` |
| Route handler | `(req, res) => void` | `(request, reply) => Promise<void>` |
| Body | `req.body` | `request.body` |
| Params | `req.params` | `request.params` |
| Auth user | `req.user` | `request.user` (cần extend type) |
| Plugin | `express-*` | `@fastify/*` hoặc `fastify-plugin` |
| Schema validation | Manual / Joi / Zod | Built-in JSON Schema hoặc Zod |

**Extend FastifyRequest:**

```typescript
// src/types/fastify.d.ts
import { Role } from '@prisma/client'

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; role: Role }
    tutor?: { id: string; status: string; fullName: string }
  }
}
```

---

## 14. Checklist "Xong việc" — định nghĩa done

### Backend done khi:
- [ ] Tất cả 42 endpoints trả đúng response theo API contract
- [ ] Mọi input được validate (Zod) — không có unhandled exception
- [ ] JWT auth + RBAC hoạt động đúng cho 3 role: PUBLIC / TUTOR / ADMIN
- [ ] 3 ACID transaction (approve tutor, convert request, assign class) atomic
- [ ] Mọi thao tác admin ghi audit_log
- [ ] Email gửi đúng 4 loại sự kiện
- [ ] File upload lên Cloudinary, lưu URL vào DB
- [ ] Rate limit chặn abuse trên login + public form
- [ ] `/docs` (Scalar) show đúng API spec
- [ ] Seed data chạy được, có đủ dữ liệu để test mọi flow

### Admin FE done khi:
- [ ] Login/logout hoạt động, token lưu httpOnly cookie
- [ ] 9 màn P0 render được với loading/empty/error state
- [ ] Confirm dialog trước mọi action không thể undo
- [ ] Phân lớp flow end-to-end: chọn gia sư → confirm → email gửi → class status = ASSIGNED
- [ ] Không có console error trên các màn P0

### API contract done khi:
- [ ] Scalar docs accessible tại `/docs`
- [ ] Postman collection export được (từ Scalar)
- [ ] FE team (public website) có thể gọi API mà không cần hỏi BE

---

## 15. Separation of concerns với team

| Phần | Owner | Ghi chú |
|------|-------|---------|
| `prisma/schema.prisma` | **Bạn** | Mọi thay đổi schema cần báo team |
| `/api/v1/admin/*` | **Bạn** | Full ownership |
| `/api/v1/auth/*` | **Bạn** | Full ownership |
| `/api/v1/tutor/*` | **Bạn** | Full ownership |
| `/api/v1/public/*` | **Bạn** | Full ownership |
| Admin FE | **Bạn** | Chỉ cần đủ dùng |
| Public website FE | Team khác | Họ gọi API của bạn |
| API contract (`/docs`) | **Bạn** cung cấp | Team khác đọc, không sửa |

**Quy tắc không chờ nhau:**
1. BE không chờ FE public — mock data trong seed đủ để test
2. FE public không chờ BE — dùng API contract để mock
3. Breaking change phải báo trước 1 ngày, tạo version mới nếu cần

---

## 16. Deploy architecture

```
                    Railway Project
                    ┌─────────────────────┐
                    │  Fastify API        │ ← port 3000
                    │  (Node.js service)  │
                    ├─────────────────────┤
                    │  PostgreSQL 16      │ ← addon
                    ├─────────────────────┤
                    │  Redis              │ ← addon
                    └─────────────────────┘
                              ▲
                              │ API calls
                    ┌─────────┴──────────┐
                    │    Vercel          │
                    │  Admin FE (Next.js)│
                    └────────────────────┘

Domain:
  api.sne.vn   → Railway (custom domain)
  admin.sne.vn → Vercel (custom domain)
  sne.vn       → Vercel public site (team khác)
```

**Railway setup:**
```bash
# Procfile hoặc railway.toml
[deploy]
  startCommand = "node dist/server.js"
  healthcheckPath = "/health"
  healthcheckTimeout = 30

[build]
  buildCommand = "npm run build && npx prisma migrate deploy"
```
