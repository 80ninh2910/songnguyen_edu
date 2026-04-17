# Domain structure (Phase 0)

## Goal

Separate ownership and reduce merge conflicts between:

- FE public + tutor (teammate)
- FE admin (you)
- Backend API (you)

## Current workspace boundaries

- frontend/main: public and tutor surfaces (existing app)
- frontend/admin/next-app: admin app (new isolated app)
- backend/api: backend Fastify app (new skeleton)
- packages/contracts: shared API contract package

## Backend domain layout

- src/modules/auth
- src/modules/public
- src/modules/tutor
- src/modules/admin
- src/common
- src/plugins
- src/services

## Admin FE domain layout

- src/app/(auth)
- src/app/(admin)
- src/components/admin
- src/features/admin

## Conflict prevention rules

1. Do not add admin UI code under frontend/main.
2. Do not add public/tutor UI code under frontend/admin.
3. Keep all API changes in backend/api.
4. Keep request/response shapes in packages/contracts.
5. Use branch-per-phase workflow only; never push directly to main.
