# eBaazee Assignment 2 — UI Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the eBaazee frontend with Tailwind CSS, a toast notification system, client-side validation, loading skeletons, a profile page, and a landing page — covering all 20 FRs from the SRS — without changing any backend code.

**Architecture:** All styling is migrated from inline `style={{}}` props to Tailwind utility classes. A `ToastContext` provides app-wide success/error/info notifications. An Axios response interceptor handles 401 auto-logout. Two FR gaps from the prototype are closed: a `ProfilePage` (FR3) and a Seller report link (FR20).

**Tech Stack:** React 18, Vite 5, Tailwind CSS v3, PostCSS, Autoprefixer, Axios, React Router v6, SockJS + STOMP (unchanged), Spring Boot backend (unchanged)

**Spec:** `docs/superpowers/specs/2026-11-21-assignment2-ui-rebuild-design.md`

## Global Constraints

- Tailwind v3 only (not v4 — still in beta)
- No new React libraries beyond Tailwind/PostCSS/Autoprefixer
- No backend Java files modified
- All existing API contracts and routes preserved exactly
- `sessionStorage` for JWT token (not localStorage) — matches prototype
- Backend runs on `http://localhost:8080`, frontend on `http://localhost:5173`
- Currency symbol: ₹ throughout
- Status badge colours: ACTIVE=emerald-500, FROZEN=amber-500, CLOSED=red-500
- Primary colour: indigo-600 (`#4f46e5`)
- All form validation runs client-side before API call
- Toast auto-dismiss: success=3s, error=5s, info=3s

## Review Focus

- **Bid form shown to seller on their own product** — seller visiting their own product detail should not see the bid form (backend blocks it at 403, but UI should hide it proactively)
- **Purchase button shown to non-highest-bidder on FROZEN product** — only the highest bidder should see "Purchase Now"; others should see a message explaining they didn't win
- **Token expiry mid-session** — 401 from any API call should trigger auto-logout and redirect to `/login`, not leave the user on a broken page
- **minBid ≥ maxBid in listing form** — submitting a listing where minBid equals or exceeds maxBid must be caught client-side before the API call
- **Edit product page loaded for a product that already has bids** — the backend rejects the update, but the frontend should show a clear error rather than a silent failure

---

## File Map

### New files
| Path | Responsibility |
|---|---|
| `ebaazee-frontend/tailwind.config.js` | Tailwind v3 config with custom `primary` colour alias |
| `ebaazee-frontend/postcss.config.js` | PostCSS pipeline (tailwindcss + autoprefixer) |
| `ebaazee-frontend/src/context/ToastContext.jsx` | Global toast state + `useToast()` hook |
| `ebaazee-frontend/src/components/Toast.jsx` | Toast UI: stacked bottom-right, auto-dismiss |
| `ebaazee-frontend/src/components/Skeleton.jsx` | Shimmer skeleton block component |
| `ebaazee-frontend/src/api/interceptors.js` | Axios 401 interceptor wired to logout + navigate |
| `ebaazee-frontend/src/pages/HomePage.jsx` | Landing page for unauthenticated users |
| `ebaazee-frontend/src/pages/ProfilePage.jsx` | View/edit profile for BUYER and SELLER (FR3) |

### Modified files
| Path | Changes |
|---|---|
| `ebaazee-frontend/src/index.css` | Replace content with Tailwind directives only |
| `ebaazee-frontend/src/main.jsx` | Wrap in `<ToastProvider>` |
| `ebaazee-frontend/src/App.jsx` | Add `/` → `<HomePage>`, `/profile` → `<ProfilePage>` routes |
| `ebaazee-frontend/src/api/axios.js` | Import interceptors |
| `ebaazee-frontend/src/context/AuthContext.jsx` | Add `updateProfile` function |
| `ebaazee-frontend/src/components/Navbar.jsx` | Full redesign with Tailwind |
| `ebaazee-frontend/src/components/ProductCard.jsx` | Tailwind card |
| `ebaazee-frontend/src/components/BidStatsPanel.jsx` | Tailwind stat grid |
| `ebaazee-frontend/src/components/CountdownTimer.jsx` | Colour-coded urgency |
| `ebaazee-frontend/src/pages/LoginPage.jsx` | Tailwind card form + validation + toast |
| `ebaazee-frontend/src/pages/RegisterPage.jsx` | Tailwind card form + validation + toast |
| `ebaazee-frontend/src/pages/BrowsePage.jsx` | Search bar + skeleton grid + empty state |
| `ebaazee-frontend/src/pages/ProductDetailPage.jsx` | Hero layout + bid panel + seller-own-product guard |
| `ebaazee-frontend/src/pages/SellerDashboardPage.jsx` | Stats row + report link + Tailwind |
| `ebaazee-frontend/src/pages/NewProductPage.jsx` | Validated form + toast |
| `ebaazee-frontend/src/pages/EditProductPage.jsx` | Validated form + toast |
| `ebaazee-frontend/src/pages/AdminDashboardPage.jsx` | Stat cards + search/filter + freeze confirm |
| `ebaazee-frontend/src/pages/AdminReportPage.jsx` | Stat tiles + bid table + Tailwind |
| `ebaazee-frontend/src/pages/BuyerBidsPage.jsx` | Status badge per bid + Tailwind |
| `ebaazee-frontend/src/pages/BuyerPurchasesPage.jsx` | Receipt card + Tailwind |

### Backend — no changes
No Java files are modified. The existing `GlobalExceptionHandler` already returns `{message}` JSON for 4xx/5xx. The report endpoint already allows SELLER access.

---

## Task 1: Tailwind CSS Setup

**Files:**
- Create: `ebaazee-frontend/tailwind.config.js`
- Create: `ebaazee-frontend/postcss.config.js`
- Modify: `ebaazee-frontend/src/index.css`
- Modify: `ebaazee-frontend/package.json` (dev deps)

**Interfaces:**
- Produces: Tailwind utility classes available in all JSX files; `text-primary`, `bg-primary`, `border-primary` resolve to indigo-600

- [ ] **Step 1: Install Tailwind v3 and its peer deps**

```bash
cd ebaazee-frontend
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Configure `tailwind.config.js`**

Set `content` to `["./index.html", "./src/**/*.{js,jsx}"]`. Add `theme.extend.colors.primary` with value `"#4f46e5"` (indigo-600).

- [ ] **Step 3: Replace `src/index.css` with Tailwind directives**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

*, *::before, *::after { box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; }
```

- [ ] **Step 4: Verify build succeeds**

```bash
npm run build
```
Expected: build completes without errors, `dist/assets/index-*.css` contains Tailwind reset classes.

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: server starts on port 5173 with no console errors.

- [ ] **Step 6: Commit**

```bash
git add ebaazee-frontend/tailwind.config.js ebaazee-frontend/postcss.config.js ebaazee-frontend/src/index.css ebaazee-frontend/package.json ebaazee-frontend/package-lock.json
git commit -m "feat: add Tailwind CSS v3 with custom primary colour"
```

---

## Task 2: Toast System + Skeleton + Axios Interceptor

**Files:**
- Create: `ebaazee-frontend/src/context/ToastContext.jsx`
- Create: `ebaazee-frontend/src/components/Toast.jsx`
- Create: `ebaazee-frontend/src/components/Skeleton.jsx`
- Create: `ebaazee-frontend/src/api/interceptors.js`
- Modify: `ebaazee-frontend/src/main.jsx`
- Modify: `ebaazee-frontend/src/api/axios.js`

**Interfaces:**
- Produces:
  - `useToast()` → `{ showToast(message: string, type: 'success'|'error'|'info'): void }`
  - `<Skeleton className="..." />` — renders a shimmer div with the given className for sizing
  - Axios 401 responses auto-call `logout()` and redirect to `/login`

- [ ] **Step 1: Create `ToastContext.jsx`**

State: `toasts` array of `{ id, message, type }`. Max 3 visible (remove oldest when 4th arrives).
- `showToast(message, type)`: add `{ id: Date.now(), message, type }` to state; set timeout to remove it after 3000ms (success/info) or 5000ms (error).
- Export `ToastProvider` component wrapping `{children}` with context value `{ showToast }`.
- Export `useToast` hook returning `useContext(ToastContext)`.

- [ ] **Step 2: Create `Toast.jsx`**

Fixed `div` bottom-right (`fixed bottom-6 right-6 z-50 flex flex-col gap-2`). Maps `toasts` from context. Each toast: rounded card with left border colour by type (emerald for success, red for error, indigo for info), message text, and an `×` close button that removes it immediately. Consumes `ToastContext` directly (not via `useToast`) to access both `toasts` and a `removeToast` function — add `removeToast(id)` to context.

- [ ] **Step 3: Create `Skeleton.jsx`**

```jsx
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}
```

- [ ] **Step 4: Create `interceptors.js`**

Import `api` from `./axios`. Register `api.interceptors.response.use` with a rejection handler: if `error.response?.status === 401`, call `sessionStorage.clear()` and `window.location.href = '/login'`, then return `Promise.reject(error)`. For all other errors, return `Promise.reject(error)`.

Note: use `window.location.href` not React Router `navigate` — this file is outside the React tree.

- [ ] **Step 5: Update `axios.js` to import interceptors**

Add `import './interceptors'` at the bottom of `src/api/axios.js`.

- [ ] **Step 6: Update `main.jsx`**

Wrap `<App />` with `<ToastProvider>`. Import `Toast` and render it inside `ToastProvider` alongside `<App />`.

```jsx
<ToastProvider>
  <App />
  <Toast />
</ToastProvider>
```

- [ ] **Step 7: Verify dev server starts and no console errors**

```bash
npm run dev
```
Open browser. No console errors. Navigate to `/login` — page loads.

- [ ] **Step 8: Commit**

```bash
git add ebaazee-frontend/src/context/ToastContext.jsx ebaazee-frontend/src/components/Toast.jsx ebaazee-frontend/src/components/Skeleton.jsx ebaazee-frontend/src/api/interceptors.js ebaazee-frontend/src/api/axios.js ebaazee-frontend/src/main.jsx
git commit -m "feat: toast notification system, skeleton component, 401 interceptor"
```

---

## Task 3: Navbar

**Files:**
- Modify: `ebaazee-frontend/src/components/Navbar.jsx`

**Interfaces:**
- Consumes: `useAuth()` → `{ auth: { name, role } | null, logout }`
- Produces: visible top nav used by all pages

- [ ] **Step 1: Rewrite `Navbar.jsx` with Tailwind**

Structure:
```
<nav class="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
    <left: logo + role-aware links>
    <right: user pill (name + role badge) + logout button, OR login/register links>
  </div>
</nav>
```

Logo: `eBaazee` in `text-xl font-bold text-primary`. Role badge pill on user name: BUYER=emerald, SELLER=indigo, ADMIN=red — `text-xs font-semibold px-2 py-0.5 rounded-full`.

Nav links by role (same destinations as prototype):
- No auth: Browse, Login, Register
- BUYER: Browse, My Bids, My Purchases, Profile
- SELLER: Browse, My Listings, + New Listing, Profile
- ADMIN: Dashboard, Profile

Logout: `text-sm text-slate-500 hover:text-red-500 cursor-pointer`.

- [ ] **Step 2: Verify visually**

Start dev server. Check nav renders correctly for logged-out state at `/browse`. Confirm no broken layout.

- [ ] **Step 3: Commit**

```bash
git add ebaazee-frontend/src/components/Navbar.jsx
git commit -m "feat: redesign Navbar with Tailwind — logo, role pills, user pill"
```

---

## Task 4: Auth Pages (Login + Register)

**Files:**
- Modify: `ebaazee-frontend/src/pages/LoginPage.jsx`
- Modify: `ebaazee-frontend/src/pages/RegisterPage.jsx`
- Modify: `ebaazee-frontend/src/context/AuthContext.jsx`

**Interfaces:**
- Consumes: `useAuth()` → `{ login(token, role, name, userId) }`, `useToast()` → `{ showToast }`
- Produces: polished centered-card auth forms with field validation

- [ ] **Step 1: Add `updateProfile` to `AuthContext.jsx`**

Add `updateProfile(name)` to context: updates `sessionStorage.setItem('name', name)` and calls `setAuth(prev => ({ ...prev, name }))`. Export in context value.

- [ ] **Step 2: Rewrite `LoginPage.jsx`**

Layout: full-height centered card `max-w-md mx-auto mt-20 bg-white rounded-2xl shadow-lg p-8`.

Client-side validation before API call (set field-level error state):
- email: must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- password: non-empty

On API error: `showToast(err.response?.data?.error || 'Login failed', 'error')`.
On success: `showToast('Welcome back!', 'success')` then navigate.

Loading state: button shows spinner text `Signing in…` and `disabled` while request in flight.

- [ ] **Step 3: Rewrite `RegisterPage.jsx`**

Same card layout as Login.

Client-side validation:
- name: length ≥ 2
- email: same regex as Login
- password: length ≥ 6

Role selector: two styled radio cards side by side — "Buyer" and "Seller" — not a plain `<select>`.

On API error: `showToast(err.response?.data?.error || 'Registration failed', 'error')`.
On success: `showToast('Account created!', 'success')` then navigate.

- [ ] **Step 4: Verify both pages render and navigate correctly**

Manual check: load `/login` and `/register`. Check field errors appear on submit with empty fields. Verify layout on a narrow viewport.

- [ ] **Step 5: Commit**

```bash
git add ebaazee-frontend/src/pages/LoginPage.jsx ebaazee-frontend/src/pages/RegisterPage.jsx ebaazee-frontend/src/context/AuthContext.jsx
git commit -m "feat: redesign Login and Register pages — Tailwind cards, field validation, toast"
```

---

## Task 5: Browse Page + ProductCard

**Files:**
- Modify: `ebaazee-frontend/src/pages/BrowsePage.jsx`
- Modify: `ebaazee-frontend/src/components/ProductCard.jsx`

**Interfaces:**
- Consumes: `getProducts(categoryId)` → `Promise<{ data: ProductResponse[] }>`
- Consumes: `<Skeleton className="h-48 w-full" />`
- Produces: main catalogue view used by all roles

**ProductResponse shape:** `{ productId, title, imageUrl, minBid, maxBid, status, endTime, bidCount, categoryName }`

- [ ] **Step 1: Rewrite `ProductCard.jsx` with Tailwind**

Card: `bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer`.

Image area (160px height): if `imageUrl` truthy, `<img className="w-full h-full object-cover" />`. Else: gradient placeholder `bg-gradient-to-br from-indigo-100 to-slate-200` with the first letter of `categoryName` centred in `text-3xl font-bold text-indigo-300`.

Status badge (top-right overlay on image): `absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full` — ACTIVE: `bg-emerald-100 text-emerald-700`, FROZEN: `bg-amber-100 text-amber-700`, CLOSED: `bg-red-100 text-red-700`.

Body: title (truncate), `₹{minBid} – ₹{maxBid}`, bid count badge, timeLeft string.

- [ ] **Step 2: Rewrite `BrowsePage.jsx` with Tailwind**

Add search `<input>` above category pills — filters `products` list client-side by title (case-insensitive includes match). Placeholder: `Search auctions…`.

Category pills: same logic as prototype, Tailwind styled.

Loading state: render `12` skeleton cards in the same grid layout (use `<Skeleton className="h-64 rounded-xl" />`).

Empty state (no results after filter): centred illustration area — large `🔍` emoji, "No auctions found", subdued text.

- [ ] **Step 3: Verify Browse page**

Start dev server. With backend running, confirm products load, skeletons show briefly, search filters the list, category filter works.

- [ ] **Step 4: Commit**

```bash
git add ebaazee-frontend/src/pages/BrowsePage.jsx ebaazee-frontend/src/components/ProductCard.jsx
git commit -m "feat: Browse page with search, skeletons, empty state; Tailwind ProductCard"
```

---

## Task 6: Product Detail Page

**Files:**
- Modify: `ebaazee-frontend/src/pages/ProductDetailPage.jsx`
- Modify: `ebaazee-frontend/src/components/BidStatsPanel.jsx`
- Modify: `ebaazee-frontend/src/components/CountdownTimer.jsx`

**Interfaces:**
- Consumes: `useAuth()` → `{ auth: { role, userId } }`
- Consumes: `placeBid(id, amount)`, `purchaseProduct(id)`, `getProduct(id)`
- Consumes: `useToast()` → `{ showToast }`
- Produces: main auction interaction page

**Seller-own-product guard (Review Focus #1):** if `auth?.role === 'SELLER'` and `product.sellerId === auth.userId`, do not render the bid form. Show a neutral info banner instead: "You listed this product."

**Purchase button guard (Review Focus #2):** on a FROZEN product, only render the Purchase button if `auth?.userId` matches the highest bidder. Add `highestBidderId` to the `BidStatsPanel` data or fetch it separately. The `BidStatsResponse` from the backend only has aggregate stats — add a separate `GET /api/products/{id}/bids/stats` check is not needed; instead show "Auction frozen — purchase available to the highest bidder" for buyers who are not the winner.

Note: the backend's `BidStatsResponse` does not include `highestBidderId`. To identify the winner without a new endpoint, call `getMyBids()` from the buyer context and check if any bid matches this product — if the buyer has a bid AND the auction is FROZEN AND their bid amount equals the `highest` stat, they are the likely winner. This is a client-side heuristic; the backend enforces the real check at purchase time.

- [ ] **Step 1: Rewrite `CountdownTimer.jsx`**

Under 1 hour remaining: `text-red-500 font-bold`. Under 24 hours: `text-amber-600`. Otherwise: `text-slate-600`. Format: `Xh Ym Zs` (include seconds). When ended: `Ended`.

- [ ] **Step 2: Rewrite `BidStatsPanel.jsx` with Tailwind**

Grid of 4 stat tiles (Bids / Highest / Lowest / Average). Each tile: `bg-slate-50 rounded-xl border border-slate-200 p-4 text-center`. Stat value: `text-2xl font-bold text-slate-800`. Label: `text-xs text-slate-500 mt-1`. Show `—` for null values. Live WebSocket subscription preserved from prototype.

- [ ] **Step 3: Rewrite `ProductDetailPage.jsx`**

Two-column layout on desktop (`grid grid-cols-1 md:grid-cols-2 gap-8`), single column on mobile.

Left column:
- Image (300px, rounded-xl, gradient fallback)
- Title, description, metadata table (Category / Seller / Bid range / Status badge / Ends countdown)

Right column:
- `<BidStatsPanel productId={id} />`
- Bid form (BUYER only, ACTIVE only, not own product): input + button, inline field validation, `showToast` on success/error
- "Bid placed" confirmation state (same logic as prototype)
- Purchase button (BUYER, FROZEN): winner heuristic check; non-winner sees info message
- Seller own-product banner
- Login prompt for unauthenticated users

On bid success: `showToast('Bid placed successfully!', 'success')`.
On bid error: `showToast(message, 'error')`.
On purchase success: `showToast('Purchase confirmed! Check your email.', 'success')`.

- [ ] **Step 4: Verify Product Detail page**

Manual check with backend running: load a product, check bid stats panel renders, countdown ticks, bid form appears for buyer, seller sees banner on own product.

- [ ] **Step 5: Commit**

```bash
git add ebaazee-frontend/src/pages/ProductDetailPage.jsx ebaazee-frontend/src/components/BidStatsPanel.jsx ebaazee-frontend/src/components/CountdownTimer.jsx
git commit -m "feat: redesign ProductDetail — hero layout, bid panel, seller guard, toast"
```

---

## Task 7: Seller Pages

**Files:**
- Modify: `ebaazee-frontend/src/pages/SellerDashboardPage.jsx`
- Modify: `ebaazee-frontend/src/pages/NewProductPage.jsx`
- Modify: `ebaazee-frontend/src/pages/EditProductPage.jsx`

**Interfaces:**
- Consumes: `getMyProducts()`, `listProduct(data)`, `updateProduct(id, data)`
- Consumes: `useToast()` → `{ showToast }`
- Produces: seller's product management flow

**FR20 gap:** Each listing row must include a "Report" link → `/admin/reports/{productId}` (the report page is accessible to SELLER per the backend's `ReportController`).

- [ ] **Step 1: Rewrite `SellerDashboardPage.jsx`**

Stats row at top (4 stat tiles): Total Listings / Active / Frozen / Closed — computed from `products` array. Same tile style as `BidStatsPanel`.

Listing rows: `bg-white rounded-xl border border-slate-200 p-4` card per product. Show: title (link to product detail), category, bid range, bid count, status badge, countdown (if ACTIVE), "Edit" button (ACTIVE + 0 bids only), "Report" link (always).

Loading state: 3 skeleton rows.
Empty state: "No listings yet. Create your first auction!" with a "+ New Listing" CTA.

- [ ] **Step 2: Add client-side validation to `NewProductPage.jsx`**

Validation rules (run before API call, set per-field error strings):
- title: length ≥ 3
- minBid: must be > 0
- maxBid: must be > minBid (error: "Max bid must be greater than min bid")
- durationHours: 1–720

On success: `showToast('Listing created!', 'success')` then navigate.
On error: `showToast(err.response?.data?.message || 'Failed to create listing', 'error')`.

Rewrite form with Tailwind: `max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8`.
Field error messages: `text-xs text-red-500 mt-1`.

- [ ] **Step 3: Apply same validation and Tailwind to `EditProductPage.jsx`**

Same validation rules as NewProduct. Same toast pattern.
Pre-populate form from `getProduct(id)` as prototype does.
On load error: `showToast('Product not found', 'error')` then navigate back.

- [ ] **Step 4: Verify seller flow**

Manual check: seller dashboard loads with stat tiles, new listing form validates before submit, edit form pre-populates correctly.

- [ ] **Step 5: Commit**

```bash
git add ebaazee-frontend/src/pages/SellerDashboardPage.jsx ebaazee-frontend/src/pages/NewProductPage.jsx ebaazee-frontend/src/pages/EditProductPage.jsx
git commit -m "feat: redesign Seller pages — stats row, FR20 report link, form validation, toast"
```

---

## Task 8: Admin Pages

**Files:**
- Modify: `ebaazee-frontend/src/pages/AdminDashboardPage.jsx`
- Modify: `ebaazee-frontend/src/pages/AdminReportPage.jsx`

**Interfaces:**
- Consumes: `getAllProducts()`, `getAllUsers()`, `freezeProduct(id)`, `unfreezeProduct(id)`, `getReport(id)`
- Consumes: `useToast()` → `{ showToast }`
- Produces: admin control and reporting interface

- [ ] **Step 1: Rewrite `AdminDashboardPage.jsx`**

Stat cards row: Total Auctions / Active / Frozen / Closed / Total Users — computed from loaded data.

Products tab:
- Search input above the list — filters by title or seller name client-side.
- Each row: product title (link to detail), seller name, category, bid count, status badge, Freeze/Unfreeze button, Report link.
- Freeze/Unfreeze: on click, show inline `window.confirm('Freeze auction for [title]?')` before calling API. On success: `showToast('Auction frozen', 'success')`. On error: `showToast(message, 'error')`.

Users tab: table with Name / Email / Role badge. Role badge colours: ADMIN=red, SELLER=indigo, BUYER=emerald.

Loading state: skeleton rows.

- [ ] **Step 2: Rewrite `AdminReportPage.jsx`**

4 stat tiles (same style as BidStatsPanel): Total Bids / Highest / Lowest / Average.

Bid table: Rank column (1st, 2nd…), Bidder name, Amount (highest bid highlighted with `font-bold text-emerald-600`), Time.

Back link: `← Back to Dashboard` styled as `text-sm text-slate-500 hover:text-slate-800`.

Loading skeleton: 4 skeleton tiles + skeleton table rows.

- [ ] **Step 3: Verify admin flow**

Manual check: dashboard loads with stat cards, search filters product list, freeze confirm dialog works, report page shows stat tiles and bid table.

- [ ] **Step 4: Commit**

```bash
git add ebaazee-frontend/src/pages/AdminDashboardPage.jsx ebaazee-frontend/src/pages/AdminReportPage.jsx
git commit -m "feat: redesign Admin pages — stat cards, search, freeze confirm, report table"
```

---

## Task 9: Buyer Pages

**Files:**
- Modify: `ebaazee-frontend/src/pages/BuyerBidsPage.jsx`
- Modify: `ebaazee-frontend/src/pages/BuyerPurchasesPage.jsx`

**Interfaces:**
- Consumes: `getMyBids()`, `getMyPurchases()`
- Produces: buyer history views

- [ ] **Step 1: Rewrite `BuyerBidsPage.jsx`**

Each bid row card: product title (link to detail), status badge (use `product.status` — add `productStatus` to `BidResponse` DTO check; if not available from backend, omit status badge and show bid time + amount only), bid amount (`text-xl font-bold`), bid time (formatted `toLocaleDateString + toLocaleTimeString`).

Loading skeleton: 4 skeleton rows.
Empty state: "You haven't placed any bids yet." with Browse link.

- [ ] **Step 2: Rewrite `BuyerPurchasesPage.jsx`**

Each purchase card: product title, purchase time, amount paid (`text-xl font-bold text-emerald-600`), "Purchase confirmed" badge.

Loading skeleton: 3 skeleton rows.
Empty state: "No purchases yet." with Browse link.

- [ ] **Step 3: Verify buyer pages**

Manual check: both pages render correctly with mock data from backend. Empty states show when no data.

- [ ] **Step 4: Commit**

```bash
git add ebaazee-frontend/src/pages/BuyerBidsPage.jsx ebaazee-frontend/src/pages/BuyerPurchasesPage.jsx
git commit -m "feat: redesign Buyer Bids and Purchases pages — Tailwind, skeletons, empty states"
```

---

## Task 10: Profile Page (FR3)

**Files:**
- Create: `ebaazee-frontend/src/pages/ProfilePage.jsx`
- Modify: `ebaazee-frontend/src/App.jsx` (add `/profile` route)

**Interfaces:**
- Consumes: `useAuth()` → `{ auth: { name, email, role }, updateProfile(name) }`
- Produces: view/edit profile for BUYER and SELLER

Note: The backend has no profile update endpoint in the prototype. For the demo, profile "update" is handled client-side only (updates `sessionStorage` and `AuthContext` state via `updateProfile(name)`). The name field is editable; email and role are read-only display.

- [ ] **Step 1: Create `ProfilePage.jsx`**

Layout: `max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-sm border border-slate-200 p-8`.

Top: avatar circle (first letter of name, `bg-primary text-white text-3xl font-bold`, 80px), name, role badge.

Form section: "Name" editable input (pre-filled from `auth.name`), "Email" read-only input (`bg-slate-50 cursor-not-allowed`), "Role" read-only badge display.

Save button: on click, validate name ≥ 2 chars, call `updateProfile(newName)`, `showToast('Profile updated', 'success')`.

- [ ] **Step 2: Add route in `App.jsx`**

```jsx
<Route path="/profile" element={
  <ProtectedRoute><ProfilePage /></ProtectedRoute>
} />
```

`ProtectedRoute` without a role prop should allow any authenticated user — verify this is how `ProtectedRoute` works; if it requires a role, pass `role={null}` or update `ProtectedRoute` to handle no-role case.

- [ ] **Step 3: Verify profile page**

Manual check: navigate to `/profile`, verify name is pre-filled, save updates the navbar display name.

- [ ] **Step 4: Commit**

```bash
git add ebaazee-frontend/src/pages/ProfilePage.jsx ebaazee-frontend/src/App.jsx
git commit -m "feat: add Profile page — FR3 view and edit name, read-only email/role"
```

---

## Task 11: Home Page + App.jsx Route Wiring

**Files:**
- Create: `ebaazee-frontend/src/pages/HomePage.jsx`
- Modify: `ebaazee-frontend/src/App.jsx`

**Interfaces:**
- Consumes: `useAuth()` → `{ auth }`
- Produces: landing page; authenticated users are redirected to their dashboard

- [ ] **Step 1: Create `HomePage.jsx`**

Redirect if authenticated: `if (auth) return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : role === 'SELLER' ? '/seller/dashboard' : '/browse'} />`.

Hero section:
```
bg-gradient-to-br from-indigo-600 to-indigo-800 text-white
Heading: "Bid. Win. Own."  (text-5xl font-extrabold)
Sub: "eBaazee — The online auction platform where every bid tells a story."
CTAs: "Browse Auctions" (white bg, indigo text) + "Create Account" (indigo outline)
```

Three-column features row (below hero, white bg):
- "Sealed Bidding" — one bid per buyer per product, fair competition
- "Live Bid Stats" — real-time WebSocket updates on every bid
- "Admin Control" — freeze auctions, generate reports, manage users

- [ ] **Step 2: Update `App.jsx` route for `/`**

Change `<Route path="/" element={<Navigate to="/browse" replace />} />` to `<Route path="/" element={<HomePage />} />`.

- [ ] **Step 3: Verify HomePage**

Manual check: visit `/`, hero renders, unauthenticated user sees CTAs, authenticated user is redirected.

- [ ] **Step 4: Commit**

```bash
git add ebaazee-frontend/src/pages/HomePage.jsx ebaazee-frontend/src/App.jsx
git commit -m "feat: add landing HomePage with hero and feature highlights"
```

---

## Task 12: Final Build Verification + Memory Update

**Files:**
- No code changes — verification only

- [ ] **Step 1: Production build**

```bash
cd ebaazee-frontend && npm run build
```
Expected: build completes, no errors, CSS bundle present.

- [ ] **Step 2: Check for leftover inline styles**

```bash
grep -r "style={{" ebaazee-frontend/src --include="*.jsx" | grep -v "// keep"
```
Expected: zero or only intentional exceptions (e.g. dynamic width on progress bar). Fix any found.

- [ ] **Step 3: Verify all 20 FRs are reachable in the running app**

Checklist:
- [ ] FR1 Register (Buyer + Seller) — `/register`
- [ ] FR2 Login — `/login`
- [ ] FR3 View/update profile — `/profile`
- [ ] FR4 Admin pre-seeded — login with `admin@ebaazee.com`
- [ ] FR5 Browse by category — `/browse`
- [ ] FR6 Bid stats visible — product detail BidStatsPanel
- [ ] FR7 Place one bid — product detail bid form
- [ ] FR8 Cannot bid own product — seller visits own product
- [ ] FR9 Bid only when ACTIVE — form hidden on FROZEN/CLOSED
- [ ] FR10 Buyer bid history — `/buyer/bids`
- [ ] FR11 Highest bidder purchases — product detail Purchase button
- [ ] FR12 Seller list product — `/seller/products/new`
- [ ] FR13 Seller view listings + bid stats — `/seller/dashboard`
- [ ] FR14 Seller can't bid own product — same as FR8
- [ ] FR15 Admin views all products — `/admin/dashboard` products tab
- [ ] FR16 Admin freeze auction — freeze button on dashboard
- [ ] FR17 Admin views all users — `/admin/dashboard` users tab
- [ ] FR18 Admin generates report — Report link on each product row
- [ ] FR19 Report shows bids/stats — `/admin/reports/{id}`
- [ ] FR20 Seller views own product report — Report link on seller dashboard

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: Assignment 2 UI rebuild — all 20 FRs verified, Tailwind, toast, validation"
```

---

## Self-Review Notes

**Spec coverage:** All 20 FRs covered. FR3 → Task 10. FR20 → Task 7 (report link on seller dashboard).

**Step scan:** Each step names one file and one action. No "handle edge cases" vagueness. Code blocks are limited to exact structures the implementer cannot infer from the description.

**Type consistency:** `showToast(message: string, type: 'success'|'error'|'info')` used consistently across Tasks 2–11. `useAuth()` returns `{ auth, login, logout, updateProfile }` after Task 4.

**Review Focus coverage:**
- #1 (seller bid form guard) → Task 6 Step 3 explicit instruction
- #2 (purchase button for non-winner) → Task 6 Step 3 winner heuristic instruction
- #3 (401 auto-logout) → Task 2 Step 4 interceptors
- #4 (minBid ≥ maxBid) → Task 7 Step 2 explicit validation rule
- #5 (edit product with bids error) → Task 7 Step 3 toast on API error

**Proportion:** Plan describes interfaces and decisions; implementer writes bodies.
