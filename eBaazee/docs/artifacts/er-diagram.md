# eBaazee.com — ER Diagram Description

**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)

---

## Entities and Attributes

### User
- **user_id** (PK)
- name
- email (UNIQUE)
- password_hash
- role: BUYER | SELLER | ADMIN
- created_at

### Category
- **category_id** (PK)
- name (UNIQUE)
- description

### Product
- **product_id** (PK)
- title
- description
- image_url
- min_bid
- max_bid
- start_time
- end_time
- status: ACTIVE | FROZEN | CLOSED
- *seller_id* (FK → User)
- *category_id* (FK → Category)

### Bid
- **bid_id** (PK)
- amount
- bid_time
- *user_id* (FK → User)
- *product_id* (FK → Product)
- UNIQUE CONSTRAINT on (user_id, product_id)

### Purchase
- **purchase_id** (PK)
- purchase_time
- amount_paid
- *user_id* (FK → User)
- *product_id* (FK → Product, UNIQUE)

---

## Relationships

| Relationship | Cardinality | Description |
|---|---|---|
| User **lists** Product | 1 : N | One seller can list many products |
| Category **contains** Product | 1 : N | One category holds many products |
| User **places** Bid | 1 : N | One buyer can bid on many products |
| Product **receives** Bid | 1 : N | One product receives many bids |
| User **makes** Purchase | 1 : N | One buyer can purchase multiple won auctions |
| Product **has** Purchase | 1 : 0..1 | Each product has at most one purchase (the winner) |

---

## Key Constraints

- A user may place **at most one bid** per product (enforced by UNIQUE on bid(user_id, product_id))
- A product may have **at most one purchase** (enforced by UNIQUE on purchase(product_id))
- A seller **cannot bid** on their own product (enforced in application layer)
- Bidding is only allowed when product status is **ACTIVE** and current time < end_time

---

## ASCII ER Diagram

```
+----------+       lists (1:N)       +-----------+   belongs to (N:1)   +----------+
|   User   |------------------------>|  Product  |--------------------->| Category |
+----------+                         +-----------+                       +----------+
| PK user_id|                        |PK product_id|
| name      |    places (1:N)        | title       |   receives (1:N)   +----------+
| email     |----------------------->| min_bid     |<-------------------|   Bid    |
| role      |                        | max_bid     |                    +----------+
+----------+   makes (1:N)           | status      |                    |PK bid_id |
     |                               | end_time    |    has (1:0..1)    | amount   |
     |         +-----------+         | seller_id(FK)|----------------->+----------+
     +-------->|  Purchase |         | category_id |                   | Purchase |
               +-----------+         +-----------+                     +----------+
               |PK purchase_id|                                        |PK purchase_id|
               | amount_paid  |                                        | amount_paid  |
               | user_id(FK)  |                                        | user_id(FK)  |
               | product_id(FK UNIQUE)|                                | product_id(UNIQUE)|
               +-----------+                                           +-----------+
```
