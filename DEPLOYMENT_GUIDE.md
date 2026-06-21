# Hướng dẫn triển khai production — SongNguyen Education

> Cập nhật: 2026-06-19
>
> Đối chiếu với mã nguồn tại commit: `1ae2f08`
>
> Hạ tầng mục tiêu: VPS Ubuntu LTS + Coolify + Cloudflare

Tài liệu này là runbook triển khai cho trạng thái hiện tại của repository. Khi cấu trúc dự án, biến môi trường hoặc schema Prisma thay đổi, phải cập nhật tài liệu cùng pull request.

## 1. Kiến trúc thực tế

```text
Người dùng
   |
Cloudflare DNS/WAF/TLS
   |
Coolify proxy (HTTPS)
   |-- songnguyen.edu.vn       -> frontend-main:3001
   |-- admin.songnguyen.edu.vn -> frontend-admin:3002
   `-- api.songnguyen.edu.vn   -> api:3000
                                      |
                         +------------+------------+
                         |                         |
                    PostgreSQL:5432             Redis:6379
                    (internal only)          (internal only)
```

Các thành phần được xác nhận từ mã nguồn:

| Thành phần | Đường dẫn | Công nghệ | Cổng container |
|---|---|---|---:|
| Web chính | `frontend/main` | Next.js `^15.2.4` (lock hiện cài 15.5.18) | 3001 |
| Web quản trị | `frontend/admin/next-app` | Next.js 16.2.6 | 3002 |
| API | `backend/api` | Fastify 5 + TypeScript + Prisma 6 | 3000 |
| Database | service hạ tầng | PostgreSQL | 5432, không public |
| Cache/token store | service hạ tầng | Redis | 6379, không public |

Không dùng Express hoặc MySQL. Không dùng đường dẫn cũ `frontend/user/next-app` hay `backend/` làm build context.

## 2. Quy ước domain và biến URL

Runbook dùng các domain sau; thay nếu domain production thực tế khác:

| Mục đích | URL |
|---|---|
| Web chính | `https://songnguyen.edu.vn` |
| Admin | `https://admin.songnguyen.edu.vn` |
| API origin | `https://api.songnguyen.edu.vn` |
| API base mà frontend sử dụng | `https://api.songnguyen.edu.vn/api/v1` |

`NEXT_PUBLIC_API_BASE_URL` phải có `/api/v1`. Nếu chỉ đặt `https://api.songnguyen.edu.vn`, các request frontend sẽ sai route.

## 3. Điều kiện trước khi triển khai

### 3.1 VPS

Tối thiểu theo tài liệu Coolify hiện hành: 2 CPU, 2 GB RAM và 30 GB trống. Với hai lần build Next.js, API, PostgreSQL và Redis trên cùng máy, nên dùng ít nhất 4 vCPU, 8 GB RAM, 80 GB SSD và có swap.

Khuyến nghị:

- Ubuntu 24.04 LTS AMD64.
- SSD và snapshot cấp nhà cung cấp.
- Không đặt dịch vụ khác trên cùng VPS khi bắt đầu.
- Có nơi lưu backup ngoài VPS, ví dụ S3 hoặc Cloudflare R2.

### 3.2 Chuẩn bị máy chủ

```bash
apt update && apt upgrade -y
apt install -y curl git ufw fail2ban unattended-upgrades

adduser deployer
usermod -aG sudo deployer
```

Thiết lập SSH key cho `deployer`, kiểm tra đăng nhập thành công trong terminal thứ hai rồi mới tắt password login. Coolify cần quyền quản lý máy chủ; không vô hiệu hóa root/key access trước khi xác nhận cách Coolify kết nối vào server.

### 3.3 Firewall: lưu ý bắt buộc với Docker

Docker published ports có thể đi vòng qua rule UFW vì Docker xử lý NAT trước các chain mà UFW thường dùng. Vì vậy:

- Không coi `ufw status` là bằng chứng duy nhất rằng port container đã được chặn.
- Không khai báo `ports:` cho PostgreSQL, Redis hoặc các application service trong Compose.
- Chỉ Coolify proxy được publish 80/443.
- Dùng firewall của nhà cung cấp VPS và/hoặc rule `DOCKER-USER` nếu cần giới hạn origin chỉ nhận traffic Cloudflare.
- Không đặt `iptables=false` trong Docker daemon; Docker cảnh báo cấu hình này có thể phá networking.

Ban đầu chỉ mở các port thật sự cần thiết:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH - đổi theo SSH port thực tế'
ufw allow 80/tcp comment 'HTTP for Coolify proxy and ACME'
ufw allow 443/tcp comment 'HTTPS for Coolify proxy'
ufw enable
ufw status verbose
```

Port dashboard Coolify phải giới hạn theo IP quản trị hoặc đóng sau khi đã gán domain bảo mật cho dashboard. Kiểm tra port yêu cầu trên trang cài đặt Coolify tại thời điểm triển khai, không sao chép một danh sách port cũ.

### 3.4 Cài Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

Ngay khi cài xong:

1. Truy cập URL installer cung cấp và tạo admin đầu tiên ngay lập tức.
2. Đặt mật khẩu mạnh và MFA nếu phiên bản đang dùng hỗ trợ.
3. Xác nhận server connection và proxy đang healthy.
4. Kết nối GitHub App hoặc deploy key chỉ có quyền đọc repository.
5. Cấu hình notification cho deploy failure, disk và backup failure.

Không chỉnh `/etc/docker/daemon.json` và restart Docker tùy tiện sau khi Coolify đã chạy. Nếu cần thay đổi daemon, phải có maintenance window và backup trước.

## 4. Các file container cần có trong repository

Các file dưới đây đã được tạo trong repository. Nội dung trong file thực tế là nguồn chuẩn; các đoạn trích ở tài liệu dùng để giải thích thiết kế.

### 4.1 `backend/api/Dockerfile`

```dockerfile
FROM node:22-bookworm-slim AS build
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# prisma.config.ts bắt buộc DATABASE_URL tồn tại khi generate.
# Giá trị build-only này không kết nối database và bị runtime env ghi đè.
ARG DATABASE_URL=postgresql://sne:build-only@localhost:5432/sne
ENV DATABASE_URL=$DATABASE_URL

RUN npm run prisma:generate
RUN npm run build

FROM build AS migration
ENV NODE_ENV=production
CMD ["npm", "run", "prisma:deploy"]

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

Giải thích các điểm không được bỏ:

- Backend là TypeScript; entrypoint đúng là `dist/server.js` thông qua `npm start`.
- `prisma/schema.prisma` và migrations phải có trong image.
- `prisma.config.ts` đọc `DATABASE_URL` ngay khi Prisma CLI khởi động; build stage cần URL giả hợp lệ dù `prisma generate` không kết nối database.
- Target `migration` giữ Prisma CLI và chạy đúng một lần trước API.
- Target `runtime` chỉ cài production dependencies; không để mọi API replica tự chạy migration.

### 4.2 `backend/api/.dockerignore`

```text
node_modules
dist
.env
.env.*
coverage
.git
*.log
```

### 4.3 `frontend/main/Dockerfile`

```dockerfile
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build
RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
USER node
EXPOSE 3001
CMD ["npm", "start", "--", "-p", "3001"]
```

### 4.4 `frontend/admin/next-app/Dockerfile`

```dockerfile
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_ADMIN_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ADMIN_API_BASE_URL=$NEXT_PUBLIC_ADMIN_API_BASE_URL

RUN npm run build
RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3002
CMD ["npm", "start"]
```

### 4.5 `.dockerignore` cho hai frontend

Hai file `frontend/main/.dockerignore` và `frontend/admin/next-app/.dockerignore` dùng cùng nội dung:

```text
node_modules
.next
.env
.env.*
coverage
.git
*.log
```

Không dùng `.next/standalone` khi `next.config.mjs` chưa khai báo `output: "standalone"`. Các Dockerfile trên chạy bằng `next start`, phù hợp với cấu hình hiện tại.

### 4.6 `docker-compose.yml` tại root

```yaml
services:
  postgres:
    image: postgres:16-bookworm
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-sne}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-sne}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s

  redis:
    image: redis:7-bookworm
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 10

  migrate:
    build:
      context: ./backend/api
      dockerfile: Dockerfile
      target: migration
    restart: "no"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-sne}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-sne}
    depends_on:
      postgres:
        condition: service_healthy

  api:
    build:
      context: ./backend/api
      dockerfile: Dockerfile
      target: runtime
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${POSTGRES_USER:-sne}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-sne}
      USE_REDIS: "true"
      REDIS_URL: redis://redis:6379
      TRUST_PROXY: ${TRUST_PROXY:-true}
      ENABLE_API_DOCS: ${ENABLE_API_DOCS:-false}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      JWT_ACCESS_EXPIRES: ${JWT_ACCESS_EXPIRES:-15m}
      JWT_REFRESH_EXPIRES: ${JWT_REFRESH_EXPIRES:-7d}
      FRONTEND_URL: ${FRONTEND_URL}
      ADMIN_URL: ${ADMIN_URL}
      RATE_LIMIT_WINDOW_MS: ${RATE_LIMIT_WINDOW_MS:-900000}
      RATE_LIMIT_MAX_API: ${RATE_LIMIT_MAX_API:-200}
      RATE_LIMIT_MAX_LOGIN: ${RATE_LIMIT_MAX_LOGIN:-10}
      RATE_LIMIT_MAX_PUBLIC: ${RATE_LIMIT_MAX_PUBLIC:-20}
      RESEND_API_KEY: ${RESEND_API_KEY:-}
      EMAIL_FROM: ${EMAIL_FROM:-no-reply@songnguyen.edu.vn}
      SETTINGS_CACHE_PREFIX: ${SETTINGS_CACHE_PREFIX:-settings}
    depends_on:
      migrate:
        condition: service_completed_successfully
      redis:
        condition: service_healthy
    expose:
      - "3000"
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3000/health/ready').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  frontend-main:
    build:
      context: ./frontend/main
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    expose:
      - "3001"
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3001').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  frontend-admin:
    build:
      context: ./frontend/admin/next-app
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}
        NEXT_PUBLIC_ADMIN_API_BASE_URL: ${NEXT_PUBLIC_ADMIN_API_BASE_URL}
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    expose:
      - "3002"
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3002').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

volumes:
  postgres_data:
  redis_data:
```

Không thêm `ports:` cho bất kỳ service nào trong file trên. Domain được Coolify proxy tới port nội bộ qua `expose`.

## 5. Biến môi trường production

Tạo secret bằng giá trị URL-safe để `DATABASE_URL` không bị lỗi parse:

```bash
openssl rand -hex 32  # POSTGRES_PASSWORD
openssl rand -hex 64  # JWT_SECRET
openssl rand -hex 64  # JWT_REFRESH_SECRET
```

Thiết lập trong Coolify:

```dotenv
POSTGRES_USER=sne
POSTGRES_PASSWORD=<64 ký tự hex hoặc secret URL-safe>
POSTGRES_DB=sne

JWT_SECRET=<ít nhất 16 ký tự, khuyến nghị 128 ký tự hex>
JWT_REFRESH_SECRET=<secret khác JWT_SECRET>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

FRONTEND_URL=https://songnguyen.edu.vn
ADMIN_URL=https://admin.songnguyen.edu.vn

NEXT_PUBLIC_API_BASE_URL=https://api.songnguyen.edu.vn/api/v1
NEXT_PUBLIC_ADMIN_API_BASE_URL=https://api.songnguyen.edu.vn/api/v1

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_API=200
RATE_LIMIT_MAX_LOGIN=10
RATE_LIMIT_MAX_PUBLIC=20

RESEND_API_KEY=<Resend API key, nếu gửi email>
EMAIL_FROM=no-reply@songnguyen.edu.vn
SETTINGS_CACHE_PREFIX=settings
```

Quy tắc:

- Đánh dấu `NEXT_PUBLIC_*` là build variable nếu giao diện Coolify phân biệt build-time và runtime.
- Thay đổi `NEXT_PUBLIC_*` bắt buộc rebuild frontend; restart container không đủ.
- Không commit secret hoặc file `.env`.
- Không đặt `NEXTJS_REVALIDATE_URL`/`NEXTJS_REVALIDATE_SECRET` trước khi frontend có endpoint revalidation tương ứng. Mã nguồn hiện chưa có endpoint này.
- Không đặt biến optional URL thành chuỗi rỗng; Zod sẽ coi chuỗi rỗng là URL không hợp lệ.
- `USE_REDIS`, `TRUST_PROXY` và `ENABLE_API_DOCS` chỉ nhận chính xác `"true"` hoặc `"false"`.

## 6. Cấu hình Coolify

1. Tạo Project và Environment `production`.
2. Add Resource từ Git repository, branch `main` hoặc branch release riêng.
3. Chọn Docker Compose, base directory `/`, file `/docker-compose.yml`.
4. Nhập toàn bộ biến môi trường ở mục 5.
5. Gán domain:

| Service | Domain | Port đích |
|---|---|---:|
| `frontend-main` | `https://songnguyen.edu.vn` | 3001 |
| `frontend-admin` | `https://admin.songnguyen.edu.vn` | 3002 |
| `api` | `https://api.songnguyen.edu.vn` | 3000 |
| `postgres` | không gán | — |
| `redis` | không gán | — |

6. Không bật public port cho PostgreSQL hoặc Redis.
7. Deploy và theo dõi build log của cả ba application image.

Service `migrate` chạy `prisma migrate deploy` đúng một lần. API chỉ khởi động khi migration hoàn tất. Nếu migration thất bại, không bỏ qua service này; kiểm tra `DATABASE_URL`, PostgreSQL và migration SQL.

### Seed production

Không chạy `npm run prisma:seed` tự động. Seed hiện tại tạo dữ liệu demo và tài khoản `admin@sne.vn` với mật khẩu cố định `Admin@123`. Đây không phải cơ chế bootstrap production an toàn.

Dùng command bootstrap một lần trong terminal của target `migration` hoặc môi trường có source/dependencies:

```bash
export BOOTSTRAP_ADMIN_CONFIRM=CREATE_SUPERADMIN
export BOOTSTRAP_ADMIN_EMAIL=admin@your-domain.vn
export BOOTSTRAP_ADMIN_FULL_NAME='Production Administrator'
export BOOTSTRAP_ADMIN_PASSWORD='<mật khẩu ngẫu nhiên ít nhất 16 ký tự>'
npm run admin:bootstrap
```

Command từ chối chạy nếu đã có SUPERADMIN, không tạo dữ liệu demo và không ghi mật khẩu ra log. Xóa các biến bootstrap khỏi môi trường ngay sau khi hoàn tất.

## 7. Cloudflare

### 7.1 DNS

Tạo các record:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | IP VPS | Proxied |
| A | `admin` | IP VPS | Proxied |
| A | `api` | IP VPS | Proxied |
| CNAME | `www` | `songnguyen.edu.vn` | Proxied |

Khi record bật Proxied, `dig songnguyen.edu.vn` trả về Cloudflare anycast IP, không trả về IP VPS. Cách kiểm tra đúng:

```bash
dig +short songnguyen.edu.vn
dig +short admin.songnguyen.edu.vn
dig +short api.songnguyen.edu.vn
```

Kết quả phải là IP Cloudflare. Xác minh origin riêng trong Cloudflare dashboard hoặc bằng DNS-only tạm thời trong maintenance window; không kết luận propagation lỗi chỉ vì không thấy IP VPS.

### 7.2 TLS

- Cloudflare SSL/TLS mode: **Full (strict)**.
- Gán domain `https://...` trong Coolify để origin có certificate hợp lệ.
- Minimum TLS: 1.2 hoặc cao hơn.
- Always Use HTTPS: bật sau khi cả ba domain hoạt động qua HTTPS.
- Không dùng Flexible; có thể gây redirect loop và không mã hóa đoạn Cloudflare → origin.

### 7.3 Cache và WAF

- Chỉ cache asset immutable như `/_next/static/*` lâu dài.
- Bypass cache cho `api.songnguyen.edu.vn/*`.
- Không cache HTML admin, request có Authorization hoặc API response chứa dữ liệu người dùng.
- Bật Free Managed Rules và Bot Fight Mode nếu phù hợp plan.
- Rate limit ưu tiên các endpoint login và public form; test để không chặn traffic hợp lệ.
- Không dùng biểu thức Enterprise-only như `cf.bot_management.score` trên Free plan.

## 8. Kiểm tra sau deploy

### 8.1 Health và routing

```bash
curl -fsS https://api.songnguyen.edu.vn/health/live
curl -fsS https://api.songnguyen.edu.vn/health/ready
curl -I https://songnguyen.edu.vn
curl -I https://admin.songnguyen.edu.vn
```

Health API hợp lệ có dạng:

```json
{"success":true,"data":{"status":"ok"}}
```

### 8.2 Functional smoke test

Thực hiện tối thiểu:

1. Web chính tải asset không có lỗi 404.
2. Frontend gọi đúng `https://api.songnguyen.edu.vn/api/v1/...`.
3. Admin login và gọi API không bị CORS.
4. Tutor login/refresh/logout hoạt động; Redis lưu và thu hồi refresh token.
5. Một API đọc database hoạt động sau migration.
6. PostgreSQL 5432 và Redis 6379 không truy cập được từ Internet.
7. Redeploy không làm mất volume PostgreSQL/Redis.

### 8.3 Kiểm tra container

Trong Coolify terminal hoặc qua SSH:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker stats --no-stream
docker system df
```

Không được thấy `0.0.0.0:5432` hoặc `0.0.0.0:6379`.

## 9. Backup và khôi phục

### 9.1 Nguyên tắc

- Backup PostgreSQL hằng ngày và lưu bản sao ngoài VPS.
- Mã hóa bucket, bật retention/versioning nếu có.
- Backup Coolify config riêng với database ứng dụng.
- Redis chủ yếu giữ cache/refresh token; volume giúp giảm gián đoạn nhưng PostgreSQL là dữ liệu cần ưu tiên.
- Kiểm thử restore định kỳ; file backup chưa restore thử không được coi là backup đáng tin cậy.

### 9.2 Backup PostgreSQL thủ công

Xác định đúng container trước khi chạy, đặc biệt khi VPS có nhiều project:

```bash
POSTGRES_CONTAINER=$(docker ps \
  --filter label=com.docker.compose.service=postgres \
  --format '{{.ID}}' | head -1)

test -n "$POSTGRES_CONTAINER" || { echo 'PostgreSQL container not found'; exit 1; }

docker exec "$POSTGRES_CONTAINER" \
  pg_dump -U sne -d sne -Fc > sne_$(date +%Y%m%d_%H%M%S).dump
```

Sau đó upload file `.dump` ra S3/R2 và kiểm tra upload thành công trước khi xóa bản local. Không ghi password vào command line hoặc log.

### 9.3 Restore vào môi trường test trước

```bash
createdb -h <test-host> -U <test-user> sne_restore_test
pg_restore \
  --clean --if-exists --no-owner --no-acl \
  -h <test-host> -U <test-user> \
  -d sne_restore_test sne_YYYYMMDD_HHMMSS.dump
```

Sau restore:

1. Chạy API test với database vừa restore.
2. Kiểm tra các bảng và số lượng record quan trọng.
3. Kiểm tra login và một transaction nghiệp vụ.
4. Chỉ restore production khi có maintenance window và rollback plan.

## 10. Cập nhật và rollback

Quy trình release:

1. Backup database và xác nhận backup mới có thể đọc được.
2. Review migration mới trong `backend/api/prisma/migrations`.
3. Deploy commit cố định, không deploy một working tree chưa commit.
4. Theo dõi migration, healthcheck và error log.
5. Chạy smoke test mục 8.

Rollback code bằng commit/image trước đó. Không tự động rollback database bằng cách xóa migration hoặc chạy `migrate dev`. Migration production phải forward-compatible; nếu cần hoàn tác dữ liệu/schema, tạo migration khắc phục đã review và có backup.

Không dùng trong production:

```bash
prisma migrate dev
prisma migrate reset
prisma db push
```

Lệnh production đúng là:

```bash
npm run prisma:deploy
```

## 11. Monitoring và bảo trì

Cấu hình external uptime monitor cho:

- `https://songnguyen.edu.vn`
- `https://admin.songnguyen.edu.vn/login` hoặc route admin tồn tại
- `https://api.songnguyen.edu.vn/health/ready`

Cảnh báo tối thiểu:

- HTTP health fail hoặc container restart loop.
- Disk > 80%, RAM > 90% kéo dài.
- PostgreSQL backup fail hoặc backup cũ hơn 25 giờ.
- TLS certificate sắp hết hạn.
- Login failure/rate-limit tăng bất thường.

Bảo trì hàng tháng:

```bash
apt update && apt upgrade
df -h
free -h
docker stats --no-stream
docker system df
```

Không chạy `docker system prune --volumes`. Không xóa volume theo tên đoán. Dùng cleanup của Coolify và luôn kiểm tra resource trước khi xóa.

## 12. Checklist go-live

### Repository

- [ ] Dockerfile của API, main và admin đã được commit/review.
- [ ] `docker-compose.yml` đã được commit/review.
- [ ] Build cả ba image thành công.
- [ ] Không có secret trong Git.
- [ ] Migration production đã được review.

### Hạ tầng

- [ ] Coolify admin được bảo vệ, notification hoạt động.
- [ ] Firewall đã kiểm tra cả UFW/provider firewall và Docker published ports.
- [ ] PostgreSQL/Redis không public.
- [ ] Volume PostgreSQL tồn tại và sống qua redeploy.
- [ ] Backup offsite và restore test thành công.

### Ứng dụng

- [ ] Ba domain có TLS hợp lệ, Cloudflare Full (strict).
- [ ] API `/health/live` và `/health/ready` trả 200.
- [ ] Main và admin dùng API base có `/api/v1`.
- [ ] CORS cho cả `FRONTEND_URL` và `ADMIN_URL` hoạt động.
- [ ] Login, refresh token và logout hoạt động với Redis.
- [ ] Tài khoản seed mặc định không còn dùng trên production.
- [ ] Uptime monitor và cảnh báo backup đã bật.

## 13. Nguồn chính thức

- [Coolify — Installation](https://coolify.io/docs/get-started/installation)
- [Coolify — Docker Compose](https://coolify.io/docs/knowledge-base/docker/compose)
- [Coolify — Environment variables](https://coolify.io/docs/knowledge-base/environment-variables)
- [Coolify — Backup and restore](https://coolify.io/docs/knowledge-base/how-to/backup-restore-coolify)
- [Docker — Packet filtering and firewalls](https://docs.docker.com/engine/network/packet-filtering-firewalls/)
- [Cloudflare — Proxy status](https://developers.cloudflare.com/dns/proxy-status/)
- [Cloudflare — SSL/TLS encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [Prisma — Development and production migrations](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production)
- [PostgreSQL — pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL — pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)

## 14. Các việc còn phải xử lý trong code trước production

Tài liệu không che giấu các khoảng trống hiện tại:

1. Ba Dockerfile và Compose đã có, nhưng vẫn phải build image và chạy smoke test trên Docker daemon/Linux trước go-live.
2. API, frontend chính và admin đã build thành công ngày 2026-06-19.
3. Lint không còn error; vẫn còn warning được theo dõi trong `docs/TECHNICAL_DEBT.md`.
4. Dependency audit còn cảnh báo cần triage; không chạy `npm audit fix --force` mù quáng.
5. Bootstrap SUPERADMIN production đã tách thành `npm run admin:bootstrap`; demo seed vẫn tuyệt đối không dùng production.
6. Backend có biến revalidation nhưng frontend chưa có endpoint tương ứng.
7. Chưa có automated integration/smoke test cho deployment và restore.

Không đánh dấu go-live hoàn tất cho đến khi các mục ảnh hưởng deployment ở trên được giải quyết hoặc có quyết định chấp nhận rủi ro bằng văn bản.
