# eBaazee.com — UI Wireframes

**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)

---

## Screen 1: Login Page (`/login`)

```
┌─────────────────────────────────────────────────┐
│  eBaazee.com                             [Login] │  ← Navbar
├─────────────────────────────────────────────────┤
│                                                   │
│              ┌──────────────────────┐            │
│              │   Sign In            │            │
│              │                      │            │
│              │  Email               │            │
│              │  [____________________]           │
│              │                      │            │
│              │  Password            │            │
│              │  [____________________]           │
│              │                      │            │
│              │  [    Sign In    ]   │            │
│              │                      │            │
│              │  Don't have an account?           │
│              │  [Register here]     │            │
│              └──────────────────────┘            │
└─────────────────────────────────────────────────┘
```

---

## Screen 2: Register Page (`/register`)

```
┌─────────────────────────────────────────────────┐
│  eBaazee.com                          [Register] │
├─────────────────────────────────────────────────┤
│              ┌──────────────────────┐            │
│              │   Create Account     │            │
│              │  Name [___________]  │            │
│              │  Email [__________]  │            │
│              │  Password [________] │            │
│              │  I am a:             │            │
│              │  ( ) Buyer  ( ) Seller            │
│              │  [   Register   ]    │            │
│              └──────────────────────┘            │
└─────────────────────────────────────────────────┘
```

---

## Screen 3: Browse Page (`/browse`) — Buyer/Public

```
┌─────────────────────────────────────────────────────────────┐
│  eBaazee.com    Browse | My Bids | My Purchases    [Logout]  │
├─────────────────────────────────────────────────────────────┤
│  Browse Auctions                                             │
│                                                              │
│  [All] [Electronics] [Fashion] [Books] [Home & Garden]       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  [img]   │  │  [img]   │  │  [img]   │  │  [img]   │   │
│  │ Title    │  │ Title    │  │ Title    │  │ Title    │   │
│  │ ₹500–₹2k │  │ ₹100–₹1k │  │ ₹200–₹5k │  │ ₹50–₹300 │   │
│  │ 3 bids   │  │ 1 bid    │  │ 7 bids   │  │ 0 bids   │   │
│  │ 2h 30m   │  │ 5h 12m   │  │ 1h 8m    │  │ 23h 45m  │   │
│  │ ACTIVE   │  │ ACTIVE   │  │ FROZEN   │  │ ACTIVE   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 4: Product Detail Page (`/products/:id`)

```
┌──────────────────────────────────────────────────────────────┐
│  eBaazee.com                                      [Logout]   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐   ┌─────────────────────────────────┐  │
│  │                 │   │ Live Bid Stats           ● LIVE  │  │
│  │   Product Image │   │ Total bids:  7                   │  │
│  │                 │   │ Highest:     ₹1,800              │  │
│  │                 │   │ Lowest:      ₹600                │  │
│  │                 │   │ Average:     ₹1,142.86           │  │
│  └─────────────────┘   └─────────────────────────────────┘  │
│                                                               │
│  Vintage Camera                    [ACTIVE]                  │
│  "A beautifully maintained…"                                  │
│                                                               │
│  Category: Electronics                                        │
│  Seller:   John Doe                                           │
│  Bid Range: ₹500 – ₹2,000                                    │
│  Ends in:   2h 30m 14s   ← live countdown                   │
│                                                               │
│  ┌──────────────────────────────────────────────┐           │
│  │  Place a Bid                                  │           │
│  │  [  500  ] ─────────────────────── [  Bid  ] │           │
│  └──────────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────┘
```

---

## Screen 5: Seller Dashboard (`/seller/dashboard`)

```
┌──────────────────────────────────────────────────────────────┐
│  eBaazee.com    Browse | My Listings | New Listing  [Logout] │
├──────────────────────────────────────────────────────────────┤
│  My Listings                              [+ New Listing]    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Vintage Camera    Electronics · ₹500–₹2k · 7 bids   ACTIVE  │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Old Bicycle       Fashion · ₹100–₹500 · 2 bids      FROZEN  │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Java Textbook     Books · ₹50–₹200 · 0 bids         CLOSED  │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Screen 6: New Auction Listing (`/seller/products/new`)

```
┌─────────────────────────────────────────────────┐
│  New Auction Listing                             │
│                                                   │
│  Title      [_________________________________]  │
│  Description [________________________________]  │
│  Image URL  [_________________________________]  │
│  Category   [Electronics ▼]                      │
│  Min Bid    [________]  Max Bid [___________]    │
│  Duration   [  24  ] hours                       │
│                                                   │
│             [     Create Listing     ]           │
└─────────────────────────────────────────────────┘
```

---

## Screen 7: Admin Dashboard (`/admin/dashboard`)

```
┌──────────────────────────────────────────────────────────────┐
│  eBaazee.com                        Admin Dashboard  [Logout]│
├──────────────────────────────────────────────────────────────┤
│  Admin Dashboard                                              │
│                                                               │
│  [Auctions (12)]  [Users (34)]                               │
│  ─────────────────────────────────────────────              │
│  │ Vintage Camera   John · Elec · 7 bids  ACTIVE [Freeze] [Report] │
│  │ Old Bicycle      Jane · Fashion · 2b   FROZEN          [Report] │
│  │ Java Textbook    Bob  · Books  · 0b    CLOSED          [Report] │
└──────────────────────────────────────────────────────────────┘
```

---

## Screen 8: Auction Report (`/admin/reports/:id`)

```
┌──────────────────────────────────────────────────────────────┐
│  ← Admin Dashboard                                           │
│  Auction Report — Vintage Camera                             │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Total    │  │ Highest  │  │  Lowest  │  │ Average  │   │
│  │ Bids: 7  │  │ ₹1,800   │  │  ₹600   │  │₹1,142.86 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  All Bids                                                    │
│  Bidder          Amount    Time                              │
│  Alice Kumar     ₹1,800    28 Oct 2026, 10:23               │
│  Ravi Sharma     ₹1,500    28 Oct 2026, 09:45               │
│  …                                                            │
└──────────────────────────────────────────────────────────────┘
```
