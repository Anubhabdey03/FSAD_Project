# eBaazee.com — PPT Outline (Assignment 1 Presentation)

**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)  
**Course:** FSAD — Assignment 1  
**Project:** KT_eBaazee.Com_021

---

## Slide 1 — Title Slide
- **eBaazee.com**
- Online Auction Platform
- Team: Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)
- FSAD Assignment 1 · 2026

---

## Slide 2 — Abstract / Problem Statement
- Traditional e-commerce lacks competitive pricing
- eBaazee solves this with time-bounded sealed auctions
- Sellers get market-driven prices; buyers compete transparently
- Admin maintains control over auction lifecycle

---

## Slide 3 — Key Features
| Feature | Description |
|---|---|
| Role-based access | BUYER, SELLER, ADMIN with dedicated dashboards |
| Live bid stats | WebSocket (STOMP/SockJS) real-time updates |
| Auction timer | Server-enforced end_time; live countdown in UI |
| Admin freeze | Admin stops bidding; highest bidder purchases |
| Email notification | Winner notified on auction freeze |
| Secure auth | JWT stateless tokens + BCrypt passwords |

---

## Slide 4 — Tech Stack
**Frontend:** React 18, Vite, React Router v6, Axios, SockJS + STOMP  
**Backend:** Spring Boot 4.0, Spring MVC, Spring Security, Spring Data JPA / Hibernate  
**Database:** PostgreSQL 15 (dev) / MySQL 8.x (target)  
**Auth:** JWT (jjwt 0.12.6, HS256, 24h expiry)  
**Build:** Maven (backend), npm + Vite (frontend)  
**Java:** Java 21

---

## Slide 5 — Application Architecture Diagram
*(Insert architecture-diagram.md ASCII diagram as an image or formatted text)*

Three tiers:
1. **Client:** React SPA (browser)
2. **Application:** Spring Boot REST API + WebSocket
3. **Data:** PostgreSQL/MySQL

Communication: REST/JSON + JWT; WebSocket for live stats

---

## Slide 6 — ER Diagram
*(Insert er-diagram.md diagram)*

- 5 tables: users, category, product, bid, purchase
- Key constraints: 1 bid per user per product (UNIQUE), 1 purchase per product (UNIQUE)
- Auction lifecycle: ACTIVE → FROZEN → CLOSED

---

## Slide 7 — Database Design (DDL Summary)
- 5 tables with proper PK, FK, UNIQUE constraints
- ENUM-equivalent for role (BUYER/SELLER/ADMIN) and status (ACTIVE/FROZEN/CLOSED)
- Seed: 4 categories + 1 admin user
- Full DDL in `docs/artifacts/ddl.sql`

---

## Slide 8 — REST API Design
*(Selected highlights)*

| Method | Endpoint | Role |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/products` | Public |
| POST | `/api/products/{id}/bid` | BUYER |
| POST | `/api/products/{id}/purchase` | BUYER |
| PUT | `/api/admin/products/{id}/freeze` | ADMIN |
| GET | `/api/reports/products/{id}` | ADMIN/SELLER |

---

## Slide 9 — UI Wireframes
*(Show screens from ui-wireframes.md)*

- Browse page with category filter
- Product detail with live bid stats + bid form
- Seller dashboard + new listing form
- Admin dashboard with freeze + report links

---

## Slide 10 — Prototype Demo Flow
1. Register as SELLER → list a product (Electronics, ₹500–₹2000, 24h)
2. Register as BUYER → browse → open product → place bid ₹1500
3. Open product in another tab → bid stats update live via WebSocket
4. Login as ADMIN → freeze auction → highest bidder sees "Purchase Now"
5. BUYER purchases → email notification sent → product status: CLOSED
6. ADMIN generates report → sees all bids, stats, winner

---

## Slide 11 — Special Features Deep-Dive
**WebSocket Real-Time Bid Stats**
- Every new bid triggers `SimpMessagingTemplate.convertAndSend("/topic/products/{id}", stats)`
- Frontend connects via SockJS and subscribes on product detail page load
- Stats update without page refresh: count, highest, lowest, average

**Bid Validation Chain (ordered)**
1. Product exists → 404
2. Buyer ≠ Seller → 403
3. Status ACTIVE + not expired → 400
4. Amount within [minBid, maxBid] → 400
5. Not already bid → 409 Conflict
6. Save + broadcast

---

## Slide 12 — Future Enhancements
- Image upload (S3/MinIO) instead of URL
- Multi-image gallery per product
- Bid retraction window (seller configurable)
- Watchlist / notifications for favorite products
- Seller reputation / ratings
- Payment gateway integration (Razorpay/Stripe)
- Mobile app (React Native)

---

## Slide 13 — Summary
- Complete auction platform with 3 roles, 5 DB tables, 16 REST endpoints
- 24/24 backend tests passing
- Full React frontend: auth, browse, bid, purchase, seller, admin, reports
- Real-time WebSocket bid stats
- Ready for Assignment 1 submission

---

*Thank you!*
