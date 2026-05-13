# Responsive Notes

## Scope
- Applies to the public landing page and shared floating contact dock.
- Baseline widths used during review: 320px, 375px, 430px.

## Current Breakpoints
- <= 360px: tighten hero typography, button padding, and small text sizes in the home page.
- <= 480px: move the floating contact dock to bottom-right and reduce its size to avoid covering content on large phones (e.g., Pro Max line).

## Files Touched
- frontend/main/src/app/page.tsx
- frontend/main/src/components/ui/background-lines.tsx
- frontend/main/src/components/PublicContactDock.tsx

## What To Check
- Hero header and CTA stay readable without overlap at 320px.
- Floating contact dock does not obscure section headings/forms at 375px-480px.
- Form day buttons and time slots remain tappable on small screens.
