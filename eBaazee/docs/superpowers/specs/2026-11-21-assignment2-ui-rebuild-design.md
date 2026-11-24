# eBaazee — Assignment 2 UI Rebuild Design Doc
**Date:** 2026-11-21  
**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)

---

## Intent & Why

The prototype established a fully working backend and a functional but unstyled frontend (all inline styles, no design system, no validation feedback, no error boundaries). Assignment 2 is graded on: UI friendliness, FR completeness, modular/clean code, exception handling, input validations, and a live demo. This rebuild upgrades the frontend layer to meet those criteria without changing any backend logic, routes, or the database.

---

## Goals

- Replace all inline styles with Tailwind CSS utility classes — consistent spacing, color, and typography throughout
- Add a reusable `Toast` notification system (success / error / info) used by every action
- Add client-side form validation with field-level error messages (before the API call)
- Add loading skeletons on all data-fetching pages
- Add a global Axios response interceptor: 401 → auto logout + redirect to `/login`
- Polish every page to SaaS-product quality (Navbar, Browse, ProductDetail, Seller, Admin, Buyer, Auth forms)
- Add a `HomePage` / landing that unauthenticated users see at `/`
- Keep all backend code, API contracts, routes, and auth logic identical

---

## Non-Goals

- No change to Spring Boot backend (controllers, services, entities, DTOs)
- No change to DB schema or data.sql
- No new React libraries beyond Tailwind CSS (no shadcn, no headless UI, no framer-motion)
- No new API endpoints
- No change to WebSocket logic (BidStatsPanel / CountdownTimer internals stay)
- No switch from PostgreSQL to MySQL (deferred)

---

## Anti-Goals

- Do not add features not already in the prototype (no new FRs invented mid-rebuild)
- Do not introduce a component library that would require ejecting Vite config significantly

---

## Approaches Considered

### A — Tailwind CSS + design tokens (chosen)
Install Tailwind v3 via `npm install -D tailwindcss postcss autoprefixer`. Configure `tailwind.config.js` with a custom `primary` color (indigo-600 `#4f46e5`) and `brand` accent. Replace all inline styles across every file with Tailwind classes. Add a `Toast` context + component. Add an Axios interceptor file. This keeps the bundle lean (Tailwind purges unused classes), is fully reviewable as a diff, and matches what the assignment graders will run.

### B — CSS Modules per component
No new dependency. Write `.module.css` files alongside each component. More verbose, produces many small files, harder to keep consistent, no JIT purging. Rejected: more work for a worse result, and the question was already answered — Tailwind is fine.

### C — Full component library (shadcn/ui or MUI)
Fast to build, but: adds many deps, requires substantial config, and the components look like shadcn/MUI, not like the team's work. Rejected: overkill for this scope.

**Decision: Option A.**

---

## Design System (Tailwind config)

```
primary:   indigo-600  (#4f46e5)   — CTAs, active states, links
success:   emerald-500 (#10b981)   — ACTIVE badge, success toasts
warning:   amber-500   (#f59e0b)   — FROZEN badge, caution toasts
danger:    red-500     (#ef4444)   — CLOSED badge, error toasts, errors
neutral:   slate-*                 — text, backgrounds, borders (slate-50 bg, slate-800 text)
```

Font: system-ui (already set). No custom font import needed.

---

## What Gets Built — File by File

### New files
| File | Purpose |
|---|---|
| `ebaazee-frontend/tailwind.config.js` | Tailwind config with custom colors |
| `ebaazee-frontend/postcss.config.js` | PostCSS config (required by Tailwind) |
| `ebaazee-frontend/src/context/ToastContext.jsx` | Global toast state + `useToast()` hook |
| `ebaazee-frontend/src/components/Toast.jsx` | Toast UI: stacked bottom-right notifications, auto-dismiss 3s |
| `ebaazee-frontend/src/components/Skeleton.jsx` | Reusable shimmer skeleton block |
| `ebaazee-frontend/src/pages/HomePage.jsx` | Landing page for unauthenticated users |
| `ebaazee-frontend/src/api/interceptors.js` | Axios 401 interceptor (auto-logout) |

### Modified files (styling + UX upgrades)
| File | Changes |
|---|---|
| `src/index.css` | Reset only — Tailwind base/components/utilities directives |
| `src/main.jsx` | Wrap app in `<ToastProvider>` |
| `src/App.jsx` | Add `/` → `<HomePage>` route |
| `src/api/axios.js` | Import interceptors |
| `src/components/Navbar.jsx` | Full redesign: logo, role pill, user avatar initial, mobile menu |
| `src/components/ProductCard.jsx` | Tailwind card: image, status badge, bid count, hover shadow |
| `src/components/BidStatsPanel.jsx` | Stat grid with Tailwind |
| `src/components/CountdownTimer.jsx` | Colour-coded urgency (red when < 1h) |
| `src/pages/LoginPage.jsx` | Centered card, field validation, loading state, toast on error |
| `src/pages/RegisterPage.jsx` | Same as Login + password min-length validation |
| `src/pages/BrowsePage.jsx` | Search bar + category pills + skeleton grid + empty state |
| `src/pages/ProductDetailPage.jsx` | Hero layout, bid panel card, clear CTA hierarchy |
| `src/pages/SellerDashboardPage.jsx` | Stats row (total / active / frozen / closed), table polish |
| `src/pages/NewProductPage.jsx` | Validated form: minBid < maxBid check, required fields, toast |
| `src/pages/EditProductPage.jsx` | Same as NewProduct |
| `src/pages/AdminDashboardPage.jsx` | Stat cards + search/filter + freeze confirmation |
| `src/pages/AdminReportPage.jsx` | Stat tiles, bid table, back-link |
| `src/pages/BuyerBidsPage.jsx` | Status badge per bid, link to product |
| `src/pages/BuyerPurchasesPage.jsx` | Purchase receipt card style |

### Backend — minimal additions
| File | Change |
|---|---|
| `GlobalExceptionHandler.java` | Verify it returns JSON `{message: ...}` for all 4xx/5xx — already does, no change needed |
| `AuthController.java` / `AuthService.java` | Verify error responses use consistent `{error: ...}` key — already does |

No new endpoints. No entity changes.

---

## Validation Rules (client-side, before API)

| Form | Rules |
|---|---|
| Login | email format, password non-empty |
| Register | name ≥ 2 chars, email format, password ≥ 6 chars |
| New/Edit Listing | title ≥ 3 chars, minBid > 0, maxBid > minBid, duration 1–720h |
| Bid | amount is number, within [minBid, maxBid] |

---

## Toast Usage

Every user action that calls the API uses `useToast()`:
- Success: green toast, auto-dismiss 3s
- Error: red toast with the API's error message, auto-dismiss 5s  
- Info: neutral, auto-dismiss 3s

---

## HomePage (landing)

Shown at `/` when not logged in (or redirect logged-in users to their dashboard). Content:
- Hero: "eBaazee — Bid. Win. Own." tagline + CTA buttons (Browse Auctions / Register)
- Three-column feature highlight: Sealed Bidding / Live Stats / Admin Control
- No external images needed (pure CSS/SVG placeholders)

---

## Implementation Order

1. Install Tailwind, configure `tailwind.config.js` + `postcss.config.js`, update `index.css`
2. Add `ToastContext` + `Toast` component + `Skeleton` component
3. Add Axios interceptor
4. `Navbar` — highest visibility, sets the tone for everything else
5. `LoginPage` + `RegisterPage` — first thing graders will see in the demo
6. `BrowsePage` + `ProductCard` — the main browsing experience
7. `ProductDetailPage` — core auction interaction
8. `SellerDashboardPage` + `NewProductPage` + `EditProductPage`
9. `AdminDashboardPage` + `AdminReportPage`
10. `BuyerBidsPage` + `BuyerPurchasesPage`
11. `HomePage`
12. Final pass: `BidStatsPanel`, `CountdownTimer`

---

## Builder's Calls (decisions made without asking)

- Tailwind v3 (not v4 — v4 is still in beta, Vite integration is simpler with v3)
- No dark mode toggle (not in scope, adds complexity)
- Toast stack limited to 3 visible at once, oldest dismissed first
- Product image fallback: a gradient placeholder div with the category initial, not an emoji
- `sessionStorage` stays (not switching to `localStorage`) — consistent with prototype
- Sidebar nav not used — top navbar is sufficient for 3 roles and this page count
