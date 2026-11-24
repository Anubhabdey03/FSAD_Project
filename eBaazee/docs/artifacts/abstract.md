# eBaazee.com — Abstract

**Project:** KT_eBaazee.Com_021  
**Course:** FSAD (Full Stack Application Development) — Assignment 1  
**Team:** Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)

---

eBaazee.com is a web-based online auction platform that allows registered users to buy and sell products through a competitive bidding mechanism. Sellers list products for auction with a defined minimum bid, maximum bid, and auction duration. Buyers browse products by category and place a single sealed bid per product within the allowed price range. The system administrator monitors all active auctions and can freeze an auction to stop further bidding, at which point the highest bidder gets the option to purchase the product.

The platform is built on a three-tier architecture: a React 18 single-page application communicates with a Spring Boot REST API backed by a relational database. Authentication is stateless using JWT tokens. Real-time bid statistics (total bids, highest, lowest, average) are pushed to connected clients via WebSocket (STOMP over SockJS) whenever a new bid is placed. Role-based access control distinguishes the BUYER, SELLER, and ADMIN personas, with dedicated dashboards for each. The prototype demonstrates the complete auction lifecycle: user registration and login, product listing, bidding, auction freeze, and purchase completion with email notification.
