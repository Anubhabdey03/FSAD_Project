# eBaazee.com — Design Spec

**Project Code:** KT_eBaazee.Com_021  
**Course:** FSAD (Full Stack Application Development) — Assignment 1  
**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)  
**Date:** 2026-10-28

---

## 1. Abstract

eBaazee.com is an online auction platform that enables registered users to buy and sell products through a competitive bidding system. Sellers list products with a minimum and maximum bid price and an auction time window. Buyers place a single bid per product. The administrator monitors and freezes auctions. The highest bidder at freeze time wins the right to purchase the product. The platform provides real-time bid statistics and role-based dashboards for all user types.

---

## 2. Problem Statement

Traditional product selling lacks competitive pricing discovery. eBaazee.com solves this by enabling auction-based selling: sellers get market-driven prices, buyers compete transparently, and administrators maintain control over auction lifecycle. The system enforces fairness through one-bid-per-user rules, time-bounded auctions, and admin-controlled freeze.

---

## 3. Actors & Roles

| Role | Description |
|---|---|
| **Buyer/Bidder** | Registers, browses product categories, places one bid per product, views bid statistics, purchases won auctions |
| **Seller** | Registers, lists products for auction with min/max bid and duration, views auction outcomes |
| **Admin** | Manages all users, freezes/closes auctions, generates reports |

---

## 4. Functional Requirements

### 4.1 Login & Registration Module
- FR1: Any visitor can register as a Buyer or Seller (role selected at registration)
- FR2: Registered users can log in with email + password
- FR3: Authenticated users can view and update their profile
- FR4: Admin account is pre-seeded (not self-registered)

### 4.2 Bidder Module
- FR5: Buyers can browse products by category
- FR6: Buyers can view product details including current bid count, average bid price, and highest bid price
- FR7: Buyers can place exactly one bid per product; amount must be between product's min_bid and max_bid
- FR8: A buyer cannot bid on their own product
- FR9: Bidding is only allowed while auction status is ACTIVE
- FR10: Buyers can view their personal bid history
- FR11: The highest bidder can purchase the product once auction is FROZEN

### 4.3 Seller Module
- FR12: Sellers can list a new product for auction (title, description, image, category, min_bid, max_bid, duration in hours)
- FR13: Sellers can view all their listed products with current auction status and top bid
- FR14: Sellers cannot bid on their own products

### 4.4 Admin Module
- FR15: Admin can view all products and their auction status
- FR16: Admin can freeze (stop bidding on) any ACTIVE auction
- FR17: Admin can view all registered users
- FR18: Admin can generate reports per product: bidder list, bid amounts, highest bid, lowest bid, average bid

### 4.5 Reports Module
- FR19: Report per product shows: product details, total bidder count, all bid amounts, highest bid, lowest bid, average bid
- FR20: Reports are accessible to Admin; sellers can view reports for their own products

---

## 5. Non-Functional Requirements

- NFR1: JWT-based stateless authentication; tokens expire after 24 hours
- NFR2: Passwords stored as bcrypt hashes (never plaintext)
- NFR3: All bid placement and auction freeze operations are transactional
- NFR4: React frontend communicates with backend exclusively via REST/JSON over HTTPS
- NFR5: MySQL unique constraint enforces one-bid-per-user-per-product at the database level
- NFR6: WebSocket (STOMP/SockJS) delivers real-time bid stats to product detail page viewers

---

## 6. Database Design

### 6.1 Entity-Relationship Summary

- **User** lists many **Products** (as seller)
- **User** places many **Bids** (as buyer)
- **Product** belongs to one **Category**
- **Product** receives many **Bids**
- **Product** has at most one **Purchase** (the winner)
- **Bid** is unique per (user_id, product_id)

### 6.2 Table Definitions

#### `user`
| Column | Type | Constraints |
|---|---|---|
| user_id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | NOT NULL |
| role | ENUM('BUYER','SELLER','ADMIN') | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### `category`
| Column | Type | Constraints |
|---|---|---|
| category_id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| description | VARCHAR(255) | |

#### `product`
| Column | Type | Constraints |
|---|---|---|
| product_id | BIGINT | PK, AUTO_INCREMENT |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| image_url | VARCHAR(500) | |
| min_bid | DECIMAL(12,2) | NOT NULL |
| max_bid | DECIMAL(12,2) | NOT NULL |
| start_time | TIMESTAMP | NOT NULL |
| end_time | TIMESTAMP | NOT NULL |
| status | ENUM('ACTIVE','FROZEN','CLOSED') | NOT NULL, DEFAULT 'ACTIVE' |
| seller_id | BIGINT | FK → user(user_id) |
| category_id | BIGINT | FK → category(category_id) |

#### `bid`
| Column | Type | Constraints |
|---|---|---|
| bid_id | BIGINT | PK, AUTO_INCREMENT |
| amount | DECIMAL(12,2) | NOT NULL |
| bid_time | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| user_id | BIGINT | FK → user(user_id) |
| product_id | BIGINT | FK → product(product_id) |
| | | UNIQUE (user_id, product_id) |

#### `purchase`
| Column | Type | Constraints |
|---|---|---|
| purchase_id | BIGINT | PK, AUTO_INCREMENT |
| purchase_time | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| amount_paid | DECIMAL(12,2) | NOT NULL |
| user_id | BIGINT | FK → user(user_id) |
| product_id | BIGINT | FK → product(product_id), UNIQUE |

---

## 7. Application Architecture

### 7.1 Architectural Style
Three-tier REST architecture: React SPA (client) ↔ Spring Boot REST API (application) ↔ MySQL (data).

### 7.2 Tier Breakdown

```
┌──────────────────────────────────────────────┐
│                CLIENT TIER                    │
│  React 18 + Vite + React Router v6 + Axios   │
│  Pages:                                       │
│    /login  /register                          │
│    /browse  /products/:id                     │
│    /buyer/bids  /buyer/purchases              │
│    /seller/dashboard  /seller/products/new    │
│    /admin/dashboard  /admin/reports/:id       │
└────────────────┬─────────────────────────────┘
                 │ REST/JSON + JWT header
                 │ WebSocket (STOMP/SockJS) for bid stats
┌────────────────▼─────────────────────────────┐
│            APPLICATION TIER                   │
│  Spring Boot 3.x                             │
│  ├── AuthController  → AuthService           │
│  ├── ProductController → ProductService      │
│  ├── BidController   → BidService            │
│  ├── BuyerController → BuyerService          │
│  ├── SellerController → SellerService        │
│  ├── AdminController → AdminService          │
│  ├── ReportController → ReportService        │
│  ├── WebSocketController (STOMP)             │
│  └── Spring Security (JWT filter)            │
└────────────────┬─────────────────────────────┘
                 │ Spring Data JPA / Hibernate
┌────────────────▼─────────────────────────────┐
│                DATA TIER                      │
│  MySQL 8.x                                   │
│  Tables: user, category, product, bid,       │
│          purchase                             │
└──────────────────────────────────────────────┘
```

### 7.3 REST API Endpoints

| Module | Method | Endpoint | Auth Required |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | No |
| Auth | POST | `/api/auth/login` | No |
| Products | GET | `/api/products` | No |
| Products | GET | `/api/products?category={id}` | No |
| Products | GET | `/api/products/{id}` | No |
| Bid stats | GET | `/api/products/{id}/bids/stats` | No |
| Place bid | POST | `/api/products/{id}/bid` | BUYER |
| Purchase | POST | `/api/products/{id}/purchase` | BUYER |
| Buyer | GET | `/api/buyer/bids` | BUYER |
| Buyer | GET | `/api/buyer/purchases` | BUYER |
| Seller | POST | `/api/seller/products` | SELLER |
| Seller | GET | `/api/seller/products` | SELLER |
| Admin | GET | `/api/admin/users` | ADMIN |
| Admin | GET | `/api/admin/products` | ADMIN |
| Admin | PUT | `/api/admin/products/{id}/freeze` | ADMIN |
| Reports | GET | `/api/reports/products/{id}` | ADMIN/SELLER |

### 7.4 Security
- Spring Security with JWT (HS256, 24h expiry)
- Role-based endpoint protection via `@PreAuthorize`
- Passwords hashed with BCrypt (strength 12)
- CORS configured for React dev server origin

---

## 8. Special Features

| Feature | Implementation |
|---|---|
| Real-time bid stats | WebSocket (STOMP over SockJS) — server broadcasts bid count, avg, and highest bid to `/topic/products/{id}` on every new bid |
| Auction countdown timer | `end_time` stored server-side; frontend computes countdown; backend rejects bids past `end_time` |
| Role-based UI | JWT payload carries role; React Router guards redirect unauthorized roles |
| Email notification | JavaMailSender sends win notification to highest bidder on auction freeze |

---

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios, SockJS + STOMP |
| Backend | Spring Boot 3.x, Spring MVC, Spring Security, Spring Data JPA |
| ORM | Hibernate (via Spring Data JPA) |
| Database | MySQL 8.x |
| Auth | JWT (jjwt library) |
| Email | JavaMailSender (Spring Mail) |
| Build | Maven (backend), npm/Vite (frontend) |
| Java | Java 17+ |

---

## 10. Assignment 1 Artifacts Checklist

| Artifact | Status |
|---|---|
| DB Design (ER + DDL) | Defined in §6 |
| Architecture Diagram | Defined in §7.2 |
| SRS Document | This document |
| UI Design (wireframes) | To be produced |
| Abstract | §1 |
| PPT | To be produced |
| Prototype (basic) | Login + Browse + Bid flow |
