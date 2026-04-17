# Ownership and branching

## Ownership

- Backend API: backend/api (you)
- Admin FE: frontend/admin (you)
- Public + Tutor FE: frontend/main (teammate)
- Shared contracts: packages/contracts (you as API owner)

## Branches created

- chore/phase-0-admin-be-setup
- feat/be-phase-1-foundation-auth
- feat/be-phase-2-admin-core
- feat/fe-admin-phase-1-shell
- feat/fe-admin-phase-2-p0
- integration/admin-be-staging

## Merge order

1. Merge phase-0 structure cleanup.
2. Merge backend phase-1 auth foundation.
3. Merge backend phase-2 admin core.
4. Merge admin FE phase-1 shell.
5. Merge admin FE phase-2 P0 screens.
6. Merge integration branch for staging test.

## Branch safety checklist

- Pull latest main before branching.
- Open PR per phase.
- Require review before merge.
- No direct pushes to main.
