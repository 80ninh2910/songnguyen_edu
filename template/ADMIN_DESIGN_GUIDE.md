# Admin Design Guide (Aligned With Current Frontend)

## 1) Purpose

This document extracts the visual language already used in frontend/main and turns it into a practical admin design guide.

Goal:

- Keep admin pages visually consistent with existing tutor/user pages.
- Reuse proven color and component patterns from current CSS.
- Reduce design drift by using one clear token set.

Scope:

- Color, typography, spacing, radius, elevation, interaction states.
- Component recipes for sidebar, topbar, cards, badges, forms, tables/lists, and modals.
- Wireframe-level layout guidance for admin screens.

---

## 2) Source Of Truth

Primary implementation source (currently active UI language):

- frontend/main/public/css/global.css
- frontend/main/public/css/dashboard.css
- frontend/main/public/css/class-list.css
- frontend/main/public/css/class-detail.css
- frontend/main/public/css/my-classes.css
- frontend/main/public/css/profile.css
- frontend/main/public/css/login.css

Secondary system (exists in codebase, but not dominant in current screens):

- frontend/main/src/app/globals.css (OKLCH token system via Tailwind/shadcn)

Decision for admin consistency now:

- Follow the blue-centric CSS system in public/css as the main baseline.
- Keep globals.css as future migration path, not immediate visual source.

---

## 3) Visual DNA (What Is Repeated Most)

- Primary brand color: #3B82F6
- Core neutral border: #e5e7eb
- Page background: #F9FAFB
- Card background: #ffffff
- Primary text: #1f2937
- Secondary text: #6b7280
- Tertiary text/labels: #9ca3af
- Repeated gradient: linear-gradient(135deg, #3B82F6, #5870D5)
- Success/Warning/Error badges:
  - Success: bg #dcfce7, text #16a34a
  - Warning: bg #fef3c7, text #d97706
  - Error: bg #fee2e2, text #ef4444

---

## 4) Admin Token Set (Recommended)

### 4.1 Color Tokens

Use these tokens for all admin pages.

```css
:root {
  /* Brand */
  --admin-primary: #3b82f6;
  --admin-primary-hover: #2563eb;
  --admin-primary-soft: #eff6ff;
  --admin-primary-gradient: linear-gradient(135deg, #3b82f6, #5870d5);

  /* Semantic */
  --admin-success: #16a34a;
  --admin-success-bg: #dcfce7;
  --admin-warning: #d97706;
  --admin-warning-bg: #fef3c7;
  --admin-danger: #ef4444;
  --admin-danger-bg: #fee2e2;

  /* Neutrals */
  --admin-bg-page: #f9fafb;
  --admin-bg-card: #ffffff;
  --admin-bg-hover: #fafbfc;
  --admin-border: #e5e7eb;
  --admin-border-subtle: #f3f4f6;
  --admin-text-primary: #1f2937;
  --admin-text-secondary: #6b7280;
  --admin-text-tertiary: #9ca3af;
  --admin-text-disabled: #d1d5db;

  /* Overlay */
  --admin-overlay: rgba(0, 0, 0, 0.5);
}
```

### 4.2 Interaction Tokens

```css
:root {
  --admin-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.1);
  --admin-shadow-hover: 0 4px 20px rgba(59, 130, 246, 0.1);
  --admin-shadow-float: 0 8px 30px rgba(59, 130, 246, 0.1);
  --admin-shadow-modal: 0 10px 40px rgba(0, 0, 0, 0.1);

  --admin-transition-fast: all 0.2s ease;
  --admin-transition-base: all 0.3s ease;
}
```

### 4.3 Typography Tokens

```css
:root {
  --admin-font-heading: "Manrope", sans-serif;
  --admin-font-body: "Inter", sans-serif;

  --admin-text-10: 10px;
  --admin-text-11: 11px;
  --admin-text-12: 12px;
  --admin-text-13: 13px;
  --admin-text-14: 14px;
  --admin-text-15: 15px;
  --admin-text-16: 16px;
  --admin-text-20: 20px;
  --admin-text-28: 28px;

  --admin-weight-regular: 400;
  --admin-weight-medium: 500;
  --admin-weight-semibold: 600;
  --admin-weight-bold: 700;
  --admin-weight-xbold: 800;
}
```

### 4.4 Spacing + Radius Tokens

```css
:root {
  --space-4: 4px;
  --space-8: 8px;
  --space-12: 12px;
  --space-16: 16px;
  --space-20: 20px;
  --space-24: 24px;
  --space-32: 32px;

  --radius-8: 8px;
  --radius-10: 10px;
  --radius-12: 12px;
  --radius-14: 14px;
  --radius-16: 16px;
  --radius-20: 20px;
  --radius-full: 9999px;
}
```

---

## 5) Layout Blueprint For Admin

### 5.1 App Shell

- Sidebar width: 210px (fixed left).
- Topbar height pattern: compact with 16px vertical + 32px horizontal padding.
- Main content offset by sidebar width.
- Page content padding: 32px.

Admin shell defaults:

- Sidebar bg: #ffffff, right border 1px solid #e5e7eb.
- Topbar bg: #ffffff, bottom border 1px solid #e5e7eb.
- Page bg: #F9FAFB.

### 5.2 Grid Guidance

- Dashboard overview cards: 3 columns, gap 16px.
- Two-block action area: 2 columns, gap 16px.
- Detail pages: main + side column (ex: 1fr + 300px).
- Dense management forms: 2 columns for desktop, single column on <= 768px.

---

## 6) Component Recipes

### 6.1 Sidebar Navigation

- Item padding: 10px 14px.
- Item radius: 10px.
- Default text: #6b7280.
- Hover/active bg: #eff6ff.
- Hover/active text: #3B82F6.
- Active weight: 600.

### 6.2 Topbar

- Search input bg: #F9FAFB.
- Search input border: #e5e7eb.
- Icon button hover: bg #eff6ff, text #3B82F6.
- Avatar style can reuse primary gradient #3B82F6 -> #5870D5.

### 6.3 Cards

Base card:

- bg #ffffff
- border 1px solid #e5e7eb
- radius 16px
- padding 20px to 24px
- transition all 0.3s

Hover card:

- translateY(-2px)
- shadow 0 4px 20px rgba(59,130,246,0.1)

### 6.4 Buttons

Primary:

- bg #3B82F6
- hover #2563eb
- text #ffffff
- radius 12px to 14px
- weight 700

Outline:

- bg #ffffff
- border #e5e7eb
- text #3B82F6
- hover bg #eff6ff, border #3B82F6

Text button:

- bg none
- text #6b7280
- hover text #3B82F6

Danger action:

- text #ef4444 or filled red variant when action is destructive and final.

### 6.5 Status Badges

Shared format:

- font 11px, uppercase, letter spacing 0.5px
- radius 20px
- padding 3px 10px (or 4px 12px)

Variants:

- Approved: bg #dcfce7, text #16a34a
- Pending: bg #fef3c7, text #d97706
- Rejected: bg #fee2e2, text #ef4444

### 6.6 Form Fields

Input wrapper:

- bg #F9FAFB
- radius 14px
- input text #1f2937
- placeholder #9ca3af

Focus:

- bg #ffffff
- border/accent #3B82F6
- ring 0 0 0 3px rgba(59,130,246,0.08 to 0.12)

Labels:

- 12px uppercase labels for metadata-heavy forms.
- Keep heading style with Manrope where section context is needed.

### 6.7 Data List / Table-Like Rows

Row container:

- bg #ffffff
- border 1px solid #e5e7eb
- radius 16px

Row item:

- padding 20px 24px
- bottom border #f3f4f6
- hover bg #fafbfc

Row actions:

- compact buttons with 8px vertical + 18 to 20px horizontal.

### 6.8 Modal

- Overlay: rgba(0,0,0,0.5)
- Container bg #ffffff
- Radius 20px
- Shadow 0 10px 40px rgba(0,0,0,0.1)
- Header bg #F9FAFB + border-bottom #e5e7eb
- Enter motion: fade + translateY(-20px -> 0), 0.3s ease

---

## 7) Motion Rules

- Hover and color transitions: 0.2s ease.
- Lift/entry and card hover depth: 0.3s ease.
- Use subtle translateY(-1px) or (-2px), avoid aggressive movement.
- Use opacity and slight movement for modal/dropdown entry.

---

## 8) Consistency Rules (Important)

### 8.1 Do

- Keep #3B82F6 as the admin primary action color.
- Keep white cards + light gray borders + soft blue hover states.
- Use Manrope for headings and Inter for body/UI text.
- Keep rounded UI language (10 to 20px) consistent.

### 8.2 Do Not

- Do not mix a new primary hue into admin without token update.
- Do not switch some pages to OKLCH tokens while others stay hardcoded hex (unless migration is complete).
- Do not use hard black shadows for regular cards.
- Do not introduce sharp-corner components that break existing visual rhythm.

---

## 9) Known Inconsistencies In Current Frontend (And Admin Fix)

Current inconsistencies:

- Dual system: public/css hex system vs globals.css OKLCH system.
- Radius differs by page (10/12/14/16/20/50px patterns mixed).
- Shadow style differs by component (blue-tinted vs black in some places).

Admin fix strategy:

- Use this guide as canonical admin standard immediately.
- Keep admin tokens centralized in one stylesheet or token module.
- If migration to OKLCH is needed later, migrate by token alias, not page-by-page ad hoc values.

---

## 10) Wireframe Guidance (No Code)

### 10.1 Admin Dashboard Wireframe

```
+------------------+----------------------------------------------+
| Sidebar (210)    | Topbar                                       |
| - Brand          +----------------------------------------------+
| - Nav group      | KPI Cards: [Card][Card][Card]                |
| - Utilities      |                                              |
|                  | Quick Actions: [Action][Action]              |
|                  |                                              |
|                  | Updates / Activity List                       |
+------------------+----------------------------------------------+
```

Guidance:

- Keep first fold focused on KPI cards + immediate actions.
- Keep visual hierarchy: title -> KPI -> operational queue.

### 10.2 Admin List Management Wireframe

```
+------------------+----------------------------------------------+
| Sidebar          | Topbar                                       |
+------------------+----------------------------------------------+
|                  | Page Title + Secondary Actions               |
|                  |                                              |
|                  | Filter Bar (search + select + range/date)    |
|                  |                                              |
|                  | Data List/Table Card                          |
|                  | - Row                                         |
|                  | - Row                                         |
|                  | - Row                                         |
|                  |                                              |
|                  | Pagination                                    |
+------------------+----------------------------------------------+
```

Guidance:

- Filter bar should be a card-like block (radius 20, border #e5e7eb).
- Row actions stay right aligned and compact.

### 10.3 Admin Detail Wireframe

```
+------------------+----------------------------------------------+
| Sidebar          | Topbar                                       |
+------------------+----------------------------------------------+
|                  | Entity Header (title + status badges)        |
|                  |                                              |
|                  | Main Content (1fr)      | Side Panel (300)   |
|                  | - Info cards            | - Summary card     |
|                  | - Timeline/History      | - Primary actions  |
|                  | - Notes/Attachments     | - Secondary notes  |
+------------------+----------------------------------------------+
```

Guidance:

- Keep side panel actionable (approval, assignment, state changes).
- Main area focuses context and history.

### 10.4 Admin Create/Edit Form Wireframe

```
+------------------+----------------------------------------------+
| Sidebar          | Topbar                                       |
+------------------+----------------------------------------------+
|                  | Form Title + Breadcrumb                      |
|                  |                                              |
|                  | Form Card                                    |
|                  | [Section heading]                            |
|                  | [2-col inputs ............][...............] |
|                  | [2-col inputs ............][...............] |
|                  | [full width textarea......................]  |
|                  |                                              |
|                  | Footer actions: [Cancel] [Save Draft] [Save]|
+------------------+----------------------------------------------+
```

Guidance:

- Section labels can use uppercase metadata style.
- Place destructive actions away from primary save button.

---

## 11) Fast Mapping: Existing -> Admin

- Existing .status-badge variants -> Reuse directly for admin status chips.
- Existing .card pattern -> Use as base container for dashboard/list/detail.
- Existing .input-wrap focus style -> Use as admin form field baseline.
- Existing sidebar/topbar visual language -> Keep for role continuity.
- Existing modal shell -> Reuse overlay + radius + shadow behavior.

---

## 12) Rollout Checklist

Before shipping any new admin page:

1. Primary actions use #3B82F6 and hover #2563eb.
2. Border color is #e5e7eb (not random gray variations).
3. Status badges use semantic trio (success/warning/error).
4. Headings use Manrope; body and controls use Inter.
5. Card radius and input radius follow token ranges (16 and 14 defaults).
6. Hover/focus states are present and consistent.
7. Layout follows shell: sidebar + topbar + padded content.
8. Mobile behavior collapses grids to 1 column where needed.

---

## 13) Future Upgrade Note

If the team later wants to fully align with globals.css OKLCH theme:

- Create a token alias layer first (admin-\* -> system tokens).
- Migrate per token, not per component.
- Keep this guide as behavioral UI reference while color engine is migrated.
