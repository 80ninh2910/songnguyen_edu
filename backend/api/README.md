# SNE API (Phase 0 Skeleton)

This folder contains the backend skeleton for the SNE system using Fastify + Prisma.

## Scope in this phase

- Domain-first folder layout.
- Shared config, plugin, and error boundaries.
- Route groups for auth/public/tutor/admin.
- Health endpoint.
- Foundation auth flow with Prisma + JWT + Redis:
  - `POST /api/v1/auth/admin/login`
  - `POST /api/v1/auth/tutor/login`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`

## Run locally

1. Install dependencies.
2. Copy .env.example to .env and fill values.
3. Prepare Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Run:

```bash
npm run dev
```

## Seed credentials

- Admin:
  - email: `admin@sne.vn`
  - password: `Admin@123`
- Tutor approved:
  - email: `tutor.approved@sne.vn`
  - password: `Tutor@123`

## Next phase

- Implement admin core transactions and audit logging.
- Implement public/tutor business endpoints.
- Add Cloudinary + Resend integrations.
