# eBaazee.com — Application Architecture Diagram

**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)

---

## Three-Tier Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║                        CLIENT TIER                               ║
║  Browser — React 18 SPA (Vite, React Router v6)                 ║
║                                                                   ║
║  ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ ║
║  │  Login / │ │ Browse /     │ │ Seller       │ │ Admin      │ ║
║  │ Register │ │ Product      │ │ Dashboard    │ │ Dashboard  │ ║
║  │  Pages   │ │ Detail       │ │ New Listing  │ │ + Reports  │ ║
║  └──────────┘ └──────────────┘ └──────────────┘ └────────────┘ ║
║       ↑                ↑ WebSocket (STOMP/SockJS)                ║
║       │   Axios        │ Live bid stats /topic/products/{id}     ║
║       └────────────────┴─────────────────────────────────────── ║
║             REST/JSON + Authorization: Bearer <JWT>              ║
╚══════════════════════════════════════════════════════════════════╝
                               │
                    HTTP/HTTPS (port 8080)
                               │
╔══════════════════════════════▼═══════════════════════════════════╗
║                     APPLICATION TIER                             ║
║  Spring Boot 4.x (Java 21)                                      ║
║                                                                   ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │               Spring Security                              │  ║
║  │  JwtAuthFilter → SecurityContextHolder → @PreAuthorize    │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║  Controllers          Services              Repositories          ║
║  ┌────────────┐       ┌────────────┐        ┌────────────────┐  ║
║  │ AuthCtrl   │──────>│ AuthService│──────>│ UserRepo       │  ║
║  │ ProductCtrl│       │ ProductSvc │        │ ProductRepo    │  ║
║  │ BidCtrl    │       │ BidService │        │ BidRepo        │  ║
║  │ BuyerCtrl  │       │ BuyerSvc   │        │ PurchaseRepo   │  ║
║  │ SellerCtrl │       │ SellerSvc  │        │ CategoryRepo   │  ║
║  │ AdminCtrl  │       │ AdminSvc   │        └────────────────┘  ║
║  │ ReportCtrl │       │ ReportSvc  │                             ║
║  └────────────┘       └────────────┘                             ║
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │  WebSocketConfig (STOMP Broker)                         │    ║
║  │  /ws endpoint → /topic/products/{id} broadcasts        │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │  JavaMailSender — email notification on purchase        │    ║
║  └─────────────────────────────────────────────────────────┘    ║
╚════════════════════════════════════════════════════════════╤═════╝
                                                             │
                                          Spring Data JPA / Hibernate
                                                             │
╔════════════════════════════════════════════════════════════▼═════╗
║                        DATA TIER                                  ║
║  PostgreSQL 15 (dev) / MySQL 8.x (spec)                          ║
║                                                                   ║
║  ┌────────┐  ┌──────────┐  ┌─────────┐  ┌────────────────────┐ ║
║  │ users  │  │ category │  │ product │  │ bid  | purchase     │ ║
║  └────────┘  └──────────┘  └─────────┘  └────────────────────┘ ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Component Interaction Flow (Place Bid)

```
Browser                Spring Boot               PostgreSQL
  │                         │                         │
  │──POST /api/products/{id}/bid  (JWT + amount)──>  │
  │                         │── validate token ──>    │
  │                         │── BidService ──────>    │
  │                         │   check product status  │
  │                         │   check bid range       │
  │                         │   check not seller      │
  │                         │── INSERT bid ─────>     │
  │                         │<─ saved Bid ──────      │
  │                         │── broadcast stats ──>   │
  │                         │   /topic/products/{id}  │
  │<── 200 BidResponse ─────│                         │
  │                         │                         │
  │<══ WebSocket stats push ═══════════════════════   │
  │   {count, highest, avg, lowest}                   │
```

---

## Security Architecture

```
Request → JwtAuthFilter
              │
              ├── Header present? ──No──> Anonymous (public endpoints pass)
              │
              └── Yes → verify HS256 signature + expiry
                            │
                            ├── Invalid → 401
                            │
                            └── Valid → set SecurityContext(email, ROLE_X)
                                            │
                                            └── @PreAuthorize("hasRole('BUYER')")
                                                        │
                                                        ├── Match → execute
                                                        └── No match → 403
```
