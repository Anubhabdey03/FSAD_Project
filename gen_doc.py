"""
Generate eBaazee_Code_Explanation.docx
Run: python3 gen_doc.py
"""
from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUT = "/Users/I750852/Desktop/FSAD_Project/eBaazee/eBaazee_Code_Explanation.docx"

doc = Document()

# ── Page margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

# ── Style helpers ─────────────────────────────────────────────────────────────
def h1(text):
    p = doc.add_heading(text, level=1)
    p.runs[0].font.color.rgb = RGBColor(0x4f, 0x46, 0xe5)
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after  = Pt(6)
    return p

def h2(text):
    p = doc.add_heading(text, level=2)
    p.runs[0].font.color.rgb = RGBColor(0x1e, 0x40, 0xaf)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after  = Pt(4)
    return p

def h3(text):
    p = doc.add_heading(text, level=3)
    p.runs[0].font.color.rgb = RGBColor(0x0f, 0x76, 0x6e)
    return p

def body(text):
    p = doc.add_paragraph(text)
    p.paragraph_format.space_after = Pt(6)
    return p

def code(text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent  = Inches(0.3)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after  = Pt(2)
    # light grey shading
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'F3F4F6')
    pPr.append(shd)
    run = p.add_run(text)
    run.font.name = 'Courier New'
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(0x1f, 0x29, 0x37)
    return p

def bullet(text, level=0):
    p = doc.add_paragraph(text, style='List Bullet')
    p.paragraph_format.left_indent = Inches(0.25 + 0.25 * level)
    p.paragraph_format.space_after = Pt(2)
    return p

def note(text):
    p = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'FEF9C3')
    pPr.append(shd)
    run = p.add_run('Note: ' + text)
    run.font.size = Pt(9)
    run.font.italic = True
    p.paragraph_format.space_after = Pt(6)
    return p

def hr():
    doc.add_paragraph('─' * 80)

# ══════════════════════════════════════════════════════════════════════════════
# TITLE PAGE
# ══════════════════════════════════════════════════════════════════════════════
title_para = doc.add_paragraph()
title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title_para.add_run('eBaazee — End-to-End Code Explanation')
run.font.size = Pt(26)
run.font.bold = True
run.font.color.rgb = RGBColor(0x4f, 0x46, 0xe5)

doc.add_paragraph()
sub = doc.add_paragraph()
sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = sub.add_run('FSAD Assignment 2 — Project KT_eBaazee.Com_021\n'
                'Rituparna Debnath (2025SL70015)  ·  Anubhab Dey (2025SL70030)\n'
                'Full-Stack Application Development')
r.font.size = Pt(12)
r.font.color.rgb = RGBColor(0x64, 0x74, 0x8b)

doc.add_paragraph()
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS (manual)
# ══════════════════════════════════════════════════════════════════════════════
h1('Table of Contents')
sections_toc = [
    '1. Project Overview & Architecture',
    '2. Tech Stack',
    '3. Database Entities & Relationships',
    '4. Repository Layer',
    '5. JWT Authentication — How It Works',
    '6. Spring Security Configuration',
    '7. REST API Layer — Controllers & Services',
    '8. Bean Validation',
    '9. The Bid Flow — Step by Step',
    '10. WebSocket & STOMP — Live Bid Stats',
    '11. Auction Lifecycle (ACTIVE → FROZEN → CLOSED)',
    '12. Frontend Architecture',
    '13. Frontend API Layer & Axios Interceptors',
    '14. Error Handling',
    '15. Email Notifications',
    '16. Testing Strategy',
    '17. Professor Q&A — Likely Questions',
]
for s in sections_toc:
    bullet(s)
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 1. PROJECT OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
h1('1. Project Overview & Architecture')
body('eBaazee is an online auction platform where sellers list products with a minimum and maximum '
     'bid range, buyers place sealed bids, and an admin controls the auction lifecycle. The key '
     'business rule is sealed bidding — each buyer can place exactly ONE bid per product, so '
     'strategy matters.')

h2('High-Level Flow')
bullet('Seller logs in → creates product listing with min/max bid range and category')
bullet('Admin reviews → freezes auction (status: ACTIVE → FROZEN)')
bullet('Admin declares winner → highest bidder can purchase (status: FROZEN → CLOSED)')
bullet('Winning buyer logs in → sees "Purchase Now" button → completes purchase')
bullet('Winner receives congratulations email from admin')

h2('User Roles')
bullet('BUYER  — browse products, place bids, view own bids, purchase won items')
bullet('SELLER — create/edit their own product listings, view bid reports')
bullet('ADMIN  — freeze/unfreeze auctions, declare winners, view all users & products')

body('The project uses a monorepo structure:')
code('/eBaazee\n'
     '  /ebaazee-backend   Spring Boot 4 / Java 21\n'
     '  /ebaazee-frontend  React 18 + Vite 5')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 2. TECH STACK
# ══════════════════════════════════════════════════════════════════════════════
h1('2. Tech Stack')

h2('Backend')
bullet('Spring Boot 4 / Java 21 — application framework')
bullet('Spring Security 6 — JWT-based stateless authentication')
bullet('Spring Data JPA + Hibernate — ORM layer')
bullet('MySQL 8 — production database (H2 for tests)')
bullet('JJWT 0.12.6 — JWT generation & validation (HMAC-SHA384)')
bullet('Spring WebSocket + STOMP — real-time bid stats push')
bullet('Spring Mail — email notifications via Gmail SMTP')
bullet('Lombok — boilerplate reduction (@Data, @Builder, @RequiredArgsConstructor)')
bullet('Bean Validation (Hibernate Validator) — DTO validation')

h2('Frontend')
bullet('React 18 — component library')
bullet('Vite 5 — dev server and bundler (port 5173)')
bullet('React Router v6 — SPA routing with ProtectedRoute wrapper')
bullet('Axios — HTTP client with request/response interceptors')
bullet('@stomp/stompjs + sockjs-client — WebSocket/STOMP for live bid stats')
bullet('Tailwind CSS v3 — utility-first styling with custom primary color (#4f46e5)')
bullet('React Context API — global auth state and toast notifications')

h2('Dev Tools')
bullet('Maven — Java build & dependency management')
bullet('DBeaver — GUI database client for MySQL')
bullet('python-docx — this document generation')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 3. DATABASE ENTITIES
# ══════════════════════════════════════════════════════════════════════════════
h1('3. Database Entities & Relationships')

body('All entities live in com.ebaazee.model. Hibernate auto-creates the MySQL tables via '
     'spring.jpa.hibernate.ddl-auto=update.')

h2('User  (users table)')
code('id           BIGINT PK auto_increment\n'
     'name         VARCHAR NOT NULL\n'
     'email        VARCHAR UNIQUE NOT NULL\n'
     'password_hash VARCHAR NOT NULL   -- BCrypt hash\n'
     'role         ENUM(BUYER, SELLER, ADMIN)\n'
     'created_at   DATETIME  -- set by @PrePersist in entity')

h2('Category  (category table)')
code('id           BIGINT PK\n'
     'name         VARCHAR UNIQUE NOT NULL\n'
     'description  VARCHAR')
body('Seeded at startup via data.sql: Electronics, Fashion, Books, Home & Garden.')

h2('Product  (product table)')
code('id           BIGINT PK\n'
     'title        VARCHAR NOT NULL\n'
     'description  TEXT\n'
     'min_bid      DECIMAL(19,2)   -- minimum allowed bid\n'
     'max_bid      DECIMAL(19,2)   -- ceiling bid\n'
     'status       ENUM(ACTIVE, FROZEN, CLOSED)\n'
     'seller_id    FK → users.id\n'
     'category_id  FK → category.id\n'
     'image_url    VARCHAR\n'
     'created_at   DATETIME')

h2('Bid  (bid table)')
code('id           BIGINT PK\n'
     'amount       DECIMAL(19,2)\n'
     'placed_at    DATETIME\n'
     'user_id      FK → users.id\n'
     'product_id   FK → products.id\n'
     'UNIQUE KEY (user_id, product_id)  -- ONE bid per buyer per product')

note('The UNIQUE constraint on (user_id, product_id) is the database-level enforcement of '
     'sealed bidding. The service layer also checks this, but the DB constraint is the safety net.')

h2('Purchase  (purchase table)')
code('id           BIGINT PK\n'
     'purchased_at DATETIME\n'
     'buyer_id     FK → users.id\n'
     'product_id   FK → products.id  (UNIQUE — one purchase per product)')

h2('Entity Relationships')
bullet('User 1→N Product (seller has many listings)')
bullet('User 1→N Bid (buyer has many bids across products)')
bullet('Product 1→N Bid (product has many bids from different buyers)')
bullet('Product 1→1 Purchase (once closed, one purchase record)')
bullet('Category 1→N Product')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 4. REPOSITORY LAYER
# ══════════════════════════════════════════════════════════════════════════════
h1('4. Repository Layer')

body('All repositories extend JpaRepository<Entity, Long> and live in com.ebaazee.repository. '
     'Spring Data JPA auto-implements them — no SQL needed.')

h2('UserRepository')
code('Optional<User> findByEmail(String email);\n'
     'boolean existsByEmail(String email);')
body('findByEmail is used by AuthService (login) and JwtAuthFilter (token validation). '
     'existsByEmail prevents duplicate registrations.')

h2('ProductRepository')
code('List<Product> findByCategory(Category category);\n'
     'List<Product> findBySeller(User seller);')
body('findByCategory powers the category filter on the Browse page. '
     'findBySeller returns a seller\'s own listings for the Seller Dashboard.')

h2('BidRepository')
code('Optional<Bid> findByUserAndProduct(User user, Product product);\n'
     'List<Bid>     findByProduct(Product product);\n'
     'long          countByProduct(Product product);\n'
     'List<Bid>     findByUser(User user);')
body('findByUserAndProduct is the sealed-bid check — if it returns a value, the buyer already bid. '
     'countByProduct powers the bid count shown on product cards. '
     'findByUser populates the Buyer Dashboard "My Bids" tab.')

h2('CategoryRepository')
body('Standard JpaRepository<Category, Long> — no custom queries needed.')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 5. JWT AUTHENTICATION
# ══════════════════════════════════════════════════════════════════════════════
h1('5. JWT Authentication — How It Works')

body('JWT (JSON Web Token) is a stateless way to prove identity. The backend issues a token '
     'at login; the frontend sends it with every subsequent request.')

h2('JwtUtil.java  —  Token generation and validation')
body('Located at: com.ebaazee.config.JwtUtil')
body('The secret key (ebaazeeSecretKeyForJWTThatIsAtLeast32CharactersLong) is loaded from '
     'application.properties and converted to an HMAC-SHA384 signing key.')

code('// Generate a token at login\npublic String generateToken(User user) {\n'
     '    return Jwts.builder()\n'
     '        .subject(user.getEmail())\n'
     '        .claim("role",   user.getRole().name())\n'
     '        .claim("name",   user.getName())\n'
     '        .claim("userId", user.getId())\n'
     '        .issuedAt(new Date())\n'
     '        .expiration(new Date(System.currentTimeMillis() + expiryMs))\n'
     '        .signWith(key)   // HMAC-SHA384\n'
     '        .compact();\n'
     '}')

body('The token encodes: email (subject), role, name, userId, issued-at, expiry (24 hours). '
     'It is signed with HMAC-SHA384 so the backend can verify it was not tampered with.')

h2('JwtAuthFilter.java  —  Per-request authentication')
body('Located at: com.ebaazee.config.JwtAuthFilter')
body('This is a Spring OncePerRequestFilter — it runs once per HTTP request, before the '
     'controller handles it.')

code('protected void doFilterInternal(...) {\n'
     '    String header = request.getHeader("Authorization");\n'
     '    if (header != null && header.startsWith("Bearer ")) {\n'
     '        String token = header.substring(7);  // strip "Bearer "\n'
     '        if (jwtUtil.isTokenValid(token)) {\n'
     '            String email = jwtUtil.extractEmail(token);\n'
     '            String role  = jwtUtil.extractRole(token);\n'
     '            userRepository.findByEmail(email).ifPresent(user -> {\n'
     '                // Build Spring Security auth object\n'
     '                var auth = new UsernamePasswordAuthenticationToken(\n'
     '                    user, null,\n'
     '                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));\n'
     '                SecurityContextHolder.getContext().setAuthentication(auth);\n'
     '            });\n'
     '        } else {\n'
     '            // Token present but expired/invalid — return 401 immediately\n'
     '            response.setStatus(401);\n'
     '            response.setContentType("application/json");\n'
     '            response.getWriter().write(\'{"error":"Token expired or invalid"}\');\n'
     '            return;  // do NOT continue the filter chain\n'
     '        }\n'
     '    }\n'
     '    chain.doFilter(request, response);  // proceed\n'
     '}')

body('Important: if no Authorization header is present, the filter simply continues — '
     'Spring Security handles public endpoints (like GET /api/products) without authentication.')

h2('Login Flow — Step by Step')
bullet('1. POST /api/auth/login  {email, password}')
bullet('2. AuthService finds user by email via userRepository.findByEmail()')
bullet('3. BCrypt.matches(password, storedHash) — verifies password')
bullet('4. jwtUtil.generateToken(user) creates the JWT')
bullet('5. Response: {token, role, name, userId}')
bullet('6. Frontend stores all 4 values in sessionStorage')
bullet('7. Every subsequent request: axios interceptor adds  Authorization: Bearer <token>')
bullet('8. JwtAuthFilter validates token → sets SecurityContext → controller runs')

h2('Token Claims')
code('{\n'
     '  "sub":    "buyer@example.com",   // email\n'
     '  "role":   "BUYER",\n'
     '  "name":   "Rituparna Debnath",\n'
     '  "userId": 3,\n'
     '  "iat":    1700000000,\n'
     '  "exp":    1700086400             // 24 hours later\n'
     '}')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 6. SPRING SECURITY CONFIG
# ══════════════════════════════════════════════════════════════════════════════
h1('6. Spring Security Configuration')

body('Located at: com.ebaazee.config.SecurityConfig')
body('Spring Security is configured as a stateless filter chain (no sessions, no cookies).')

code('@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n'
     '    return http\n'
     '        .csrf(AbstractHttpConfigurer::disable)        // REST API — no CSRF needed\n'
     '        .cors(cors -> cors.configurationSource(...)   // allow localhost:5173\n'
     '        .sessionManagement(s -> s\n'
     '            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n'
     '        .authorizeHttpRequests(auth -> auth\n'
     '            .requestMatchers("/api/auth/**").permitAll()          // login/register\n'
     '            .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()  // browse\n'
     '            .requestMatchers("/ws/**").permitAll()                // WebSocket\n'
     '            .anyRequest().authenticated())                        // everything else needs JWT\n'
     '        .addFilterBefore(jwtAuthFilter,\n'
     '            UsernamePasswordAuthenticationFilter.class)           // run JWT filter first\n'
     '        .build();\n'
     '}')

body('CORS allows requests from http://localhost:5173 (the Vite dev server) with any header '
     'and all HTTP methods. This is essential — without it, browsers block the React app from '
     'calling the Spring API.')

note('WebMvcConfig.java adds a second CORS config via WebMvcConfigurer. Both must be consistent; '
     'the SecurityConfig one governs preflight requests.')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 7. REST API — CONTROLLERS & SERVICES
# ══════════════════════════════════════════════════════════════════════════════
h1('7. REST API Layer — Controllers & Services')

h2('AuthController  (/api/auth)')
bullet('POST /api/auth/register  — creates new user (hashes password with BCrypt)')
bullet('POST /api/auth/login     — returns {token, role, name, userId}')
body('Both endpoints are public (no JWT required). The register endpoint uses @Valid to trigger '
     'bean validation on the AuthRequest DTO.')

h2('ProductController  (/api/products)  — Public')
bullet('GET /api/products          — list all products (optional ?category=ID filter)')
bullet('GET /api/products/{id}     — single product detail')
body('These are intentionally public so unauthenticated users can browse the marketplace. '
     'The optional category parameter calls productRepository.findByCategory().')

h2('BidController  (/api/products/{id}/bid)')
bullet('POST /api/products/{id}/bid  — BUYER only, place a bid')
bullet('GET  /api/products/{id}/bid/stats — public, returns {bidCount, highestBid, lowestBid}')
body('The bid endpoint is guarded with @PreAuthorize("hasRole(\'BUYER\')"). Spring checks the '
     'ROLE_BUYER authority set by JwtAuthFilter.')

h2('BidService — The core bid logic')
code('public BidResponse placeBid(Long productId, BigDecimal amount, User buyer) {\n'
     '    Product product = productRepository.findById(productId)\n'
     '        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));\n'
     '\n'
     '    // Check 1: product must be ACTIVE\n'
     '    if (product.getStatus() != Status.ACTIVE)\n'
     '        throw new ResponseStatusException(FORBIDDEN, "Auction is not active");\n'
     '\n'
     '    // Check 2: buyer cannot bid on their own product\n'
     '    if (product.getSeller().getId().equals(buyer.getId()))\n'
     '        throw new ResponseStatusException(FORBIDDEN, "Cannot bid on your own product");\n'
     '\n'
     '    // Check 3: sealed bidding — one bid only\n'
     '    if (bidRepository.findByUserAndProduct(buyer, product).isPresent())\n'
     '        throw new ResponseStatusException(CONFLICT, "Already placed a bid on this product");\n'
     '\n'
     '    // Check 4: amount within allowed range\n'
     '    if (amount.compareTo(product.getMinBid()) < 0 ||\n'
     '        amount.compareTo(product.getMaxBid()) > 0)\n'
     '        throw new ResponseStatusException(BAD_REQUEST,\n'
     '            "Bid must be between " + product.getMinBid() + " and " + product.getMaxBid());\n'
     '\n'
     '    // Save bid\n'
     '    Bid bid = new Bid();\n'
     '    bid.setUser(buyer); bid.setProduct(product); bid.setAmount(amount);\n'
     '    bid.setPlacedAt(LocalDateTime.now());\n'
     '    bidRepository.save(bid);\n'
     '\n'
     '    // Broadcast live stats via WebSocket\n'
     '    messagingTemplate.convertAndSend(\n'
     '        "/topic/products/" + productId,\n'
     '        getBidStats(productId));\n'
     '\n'
     '    return new BidResponse(...);\n'
     '}')

h2('SellerController  (/api/seller/products)')
bullet('POST /api/seller/products       — create listing')
bullet('GET  /api/seller/products       — list own products')
bullet('PUT  /api/seller/products/{id}  — edit listing (blocked if bids exist)')
body('@PreAuthorize("hasRole(\'SELLER\')") at class level protects all endpoints.')
body('SellerService enforces: minBid < maxBid on creation; seller cannot edit a product that '
     'already has bids (would change the rules mid-auction).')

h2('BuyerController  (/api/buyer)')
bullet('GET  /api/buyer/bids            — my bid history')
bullet('GET  /api/buyer/purchases       — my purchased items')
bullet('POST /api/products/{id}/purchase — buy the item (only for FROZEN winner)')
body('purchaseProduct in BuyerService checks: product status is FROZEN, finds the highest bid, '
     'verifies the requesting buyer IS the highest bidder, then saves a Purchase record.')

h2('AdminController  (/api/admin)')
bullet('GET  /api/admin/products               — all products')
bullet('POST /api/admin/products/{id}/freeze   — ACTIVE → FROZEN')
bullet('POST /api/admin/products/{id}/unfreeze — FROZEN → ACTIVE')
bullet('POST /api/admin/products/{id}/declare-winner — declare highest bidder, send email')
bullet('GET  /api/admin/users                  — all users')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 8. BEAN VALIDATION
# ══════════════════════════════════════════════════════════════════════════════
h1('8. Bean Validation')

body('Spring Boot includes Hibernate Validator (JSR-380). Annotations on DTOs declare rules; '
     '@Valid on controller parameters triggers validation. Invalid input → 400 Bad Request.')

h2('AuthRequest.java')
code('@NotBlank(message = "Name is required")\nprivate String name;\n\n'
     '@NotBlank @Email(message = "Valid email required")\nprivate String email;\n\n'
     '@NotBlank @Size(min = 6, message = "Password must be at least 6 characters")\nprivate String password;')

h2('ProductRequest.java')
code('@NotBlank private String title;\n'
     '@NotNull  private Long categoryId;\n'
     '@Positive private BigDecimal minBid;    // must be > 0\n'
     '@Positive private BigDecimal maxBid;\n'
     '@Min(1)   private Integer quantity;')

h2('BidRequest.java')
code('@NotNull @Positive private BigDecimal amount;')

h2('GlobalExceptionHandler — Turning validation errors into clean JSON')
code('@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n'
     '    @ExceptionHandler(MethodArgumentNotValidException.class)\n'
     '    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {\n'
     '        String msg = ex.getBindingResult().getFieldErrors().stream()\n'
     '            .map(e -> e.getField() + ": " + e.getDefaultMessage())\n'
     '            .collect(Collectors.joining(", "));\n'
     '        return ResponseEntity.badRequest().body(Map.of("error", msg));\n'
     '    }\n\n'
     '    @ExceptionHandler(ResponseStatusException.class)\n'
     '    public ResponseEntity<?> handleResponseStatus(ResponseStatusException ex) {\n'
     '        return ResponseEntity.status(ex.getStatusCode())\n'
     '            .body(Map.of("error", ex.getReason()));\n'
     '    }\n'
     '}')

body('All error responses follow the shape {"error": "..."} — the frontend checks '
     'err.response.data.error consistently.')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 9. BID FLOW
# ══════════════════════════════════════════════════════════════════════════════
h1('9. The Bid Flow — Step by Step')

body('This is the most important flow to understand for the demo. Walk through it end-to-end.')

h2('Frontend (ProductDetailPage.jsx)')
code('const handleBid = async () => {\n'
     '    const amount = parseFloat(bidAmount);\n'
     '    // Client-side range check (UX only — server also checks)\n'
     '    if (amount < product.minBid || amount > product.maxBid) {\n'
     '        showToast(`Bid must be between ₹${product.minBid} and ₹${product.maxBid}`);\n'
     '        return;\n'
     '    }\n'
     '    try {\n'
     '        await placeBid(product.id, { amount });\n'
     '        showToast("Bid placed successfully!", "success");\n'
     '        setHasBid(true);\n'
     '    } catch (err) {\n'
     '        showToast(err.response?.data?.error || "Failed to place bid.", "error");\n'
     '    }\n'
     '};')

h2('Step-by-step network journey')
bullet('1. User types a bid amount and clicks "Place Bid"')
bullet('2. handleBid() calls placeBid(productId, {amount}) from src/api/bids.js')
bullet('3. Axios sends:  POST http://localhost:8080/api/products/{id}/bid')
bullet('   Headers:  Content-Type: application/json,  Authorization: Bearer <JWT>')
bullet('   Body:     {"amount": 1500}')
bullet('4. JwtAuthFilter validates JWT → extracts email + role → sets SecurityContext')
bullet('5. Spring Security checks ROLE_BUYER on BidController.placeBid() — passes')
bullet('6. BidService.placeBid() runs all 4 business rule checks')
bullet('7. bidRepository.save(bid) → MySQL INSERT into bid table')
bullet('8. messagingTemplate.convertAndSend("/topic/products/{id}", stats) → WebSocket push')
bullet('9. HTTP response 200: {id, amount, placedAt, productId, buyerEmail}')
bullet('10. Frontend toast: "Bid placed successfully!"')
bullet('11. BidStatsPanel receives the WebSocket message → updates bid count + highest bid live')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 10. WEBSOCKET & STOMP
# ══════════════════════════════════════════════════════════════════════════════
h1('10. WebSocket & STOMP — Live Bid Stats')

body('WebSocket provides a persistent TCP connection so the server can push data to the browser '
     'without the browser polling. STOMP (Simple Text Oriented Message Protocol) is a '
     'messaging protocol layered on top of WebSocket, adding topics and subscriptions.')

h2('Backend: WebSocketConfig.java')
code('@Configuration\n@EnableWebSocketMessageBroker\npublic class WebSocketConfig\n'
     '        implements WebSocketMessageBrokerConfigurer {\n\n'
     '    @Override\n    public void registerStompEndpoints(StompEndpointRegistry reg) {\n'
     '        reg.addEndpoint("/ws")           // connect here\n'
     '            .setAllowedOriginPatterns("*")\n'
     '            .withSockJS();               // fallback for browsers without WS\n'
     '    }\n\n'
     '    @Override\n    public void configureMessageBroker(MessageBrokerRegistry reg) {\n'
     '        reg.enableSimpleBroker("/topic"); // in-memory message broker\n'
     '        reg.setApplicationDestinationPrefixes("/app");\n'
     '    }\n'
     '}')

h2('Backend: Broadcasting (BidService.java)')
code('// After saving the bid:\nmessagingTemplate.convertAndSend(\n'
     '    "/topic/products/" + productId,\n'
     '    new BidStatsResponse(bidCount, highestBid, lowestBid)\n'
     ');')

body('messagingTemplate is a SimpMessagingTemplate — Spring\'s WebSocket messaging helper. '
     'All clients subscribed to /topic/products/{id} instantly receive the new stats.')

h2('Frontend: BidStatsPanel.jsx')
code('useEffect(() => {\n'
     '    const socket = new SockJS("http://localhost:8080/ws");  // SockJS transport\n'
     '    const stompClient = new Client({ webSocketFactory: () => socket });\n\n'
     '    stompClient.onConnect = () => {\n'
     '        stompClient.subscribe(\n'
     '            `/topic/products/${productId}`,   // subscribe to this product\'s topic\n'
     '            (frame) => {\n'
     '                const stats = JSON.parse(frame.body);\n'
     '                setStats(stats);  // React state update → re-render\n'
     '            }\n'
     '        );\n'
     '    };\n\n'
     '    stompClient.activate();\n'
     '    return () => stompClient.deactivate();  // cleanup on unmount\n'
     '}, [productId]);')

h2('What the user sees')
bullet('BidStatsPanel shows: Total Bids, Highest Bid, Lowest Bid')
bullet('AnimatedNumber component animates the number change (count-up effect)')
bullet('When ANY buyer places a bid, ALL currently-viewing users see the stats update instantly')
bullet('No page refresh needed — the WebSocket connection is always open')

h2('SockJS Fallback')
body('SockJS automatically falls back to HTTP long-polling if WebSockets are blocked (some '
     'corporate proxies do this). The API stays identical — only the transport changes.')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 11. AUCTION LIFECYCLE
# ══════════════════════════════════════════════════════════════════════════════
h1('11. Auction Lifecycle  (ACTIVE → FROZEN → CLOSED)')

body('The auction lifecycle is controlled entirely by the Admin. Each status change is a '
     'deliberate transition with specific business rules.')

h2('ACTIVE')
bullet('Default status when a Seller creates a product listing')
bullet('Buyers can place bids (sealed — one per buyer)')
bullet('Seller can still edit the product (but not if bids exist)')
bullet('Admin can see all bids via the report endpoint')

h2('ACTIVE → FROZEN  (Admin freezes the auction)')
code('POST /api/admin/products/{id}/freeze')
body('AdminService changes status to FROZEN. Bidding is now closed — BidService rejects '
     'any new bids with "Auction is not active".')
body('The highest bidder can now see a "Purchase Now" button on the product page. '
     'Other buyers still see the product but cannot bid.')

h2('FROZEN → ACTIVE  (Admin unfreezes if needed)')
code('POST /api/admin/products/{id}/unfreeze')
body('Reverts to ACTIVE, re-opening bidding. Existing bids remain. Used if the admin '
     'needs to allow more bids.')

h2('Admin Declares Winner')
code('POST /api/admin/products/{id}/declare-winner')
body('AdminService finds the highest bid (via findByProduct → max by amount), '
     'marks the product status as CLOSED, and sends a winner email via Spring Mail '
     'in a new Thread (async, so it doesn\'t block the HTTP response).')

h2('FROZEN → CLOSED  (Winning buyer purchases)')
code('POST /api/products/{id}/purchase')
body('BuyerService.purchaseProduct() runs the final checks:')
bullet('Product status must be FROZEN (not CLOSED, not ACTIVE)')
bullet('Find highest bid from bidRepository.findByProduct()')
bullet('The requesting user must be the highest bidder')
bullet('Save a Purchase record → product status becomes CLOSED')

h2('Status Summary Table')
code('Status  | Bidding | Purchase | Edit Listing\n'
     '--------|---------|----------|--------------\n'
     'ACTIVE  |   YES   |    NO    |   YES (if no bids)\n'
     'FROZEN  |    NO   |   YES*   |    NO\n'
     'CLOSED  |    NO   |    NO    |    NO\n'
     '\n* Only by the highest bidder')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 12. FRONTEND ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
h1('12. Frontend Architecture')

body('The frontend is a React Single-Page Application (SPA). All pages render in the browser; '
     'the backend only serves JSON — no HTML from Spring.')

h2('App.jsx — Root routing')
code('function App() {\n'
     '  return (\n'
     '    <BrowserRouter>\n'
     '      <ToastProvider>\n'
     '        <AuthProvider>\n'
     '          <Routes>\n'
     '            <Route path="/login"    element={<LoginPage />} />\n'
     '            <Route path="/register" element={<RegisterPage />} />\n'
     '            <Route path="/browse"   element={<ProtectedRoute role="BUYER"><BrowsePage /></ProtectedRoute>} />\n'
     '            <Route path="/products/:id" element={<ProtectedRoute role="BUYER"><ProductDetailPage /></ProtectedRoute>} />\n'
     '            <Route path="/seller/dashboard" element={<ProtectedRoute role="SELLER"><SellerDashboardPage /></ProtectedRoute>} />\n'
     '            <Route path="/admin/dashboard"  element={<ProtectedRoute role="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />\n'
     '            <Route path="/buyer/dashboard"  element={<ProtectedRoute role="BUYER"><BuyerDashboardPage /></ProtectedRoute>} />\n'
     '          </Routes>\n'
     '        </AuthProvider>\n'
     '      </ToastProvider>\n'
     '    </BrowserRouter>\n'
     '  );\n'
     '}')

h2('ProtectedRoute.jsx — Role-based access control')
code('function ProtectedRoute({ children, role }) {\n'
     '    const { auth } = useAuth();\n'
     '    if (!auth) return <Navigate to="/login" replace />;\n'
     '    if (role && auth.role !== role) return <Navigate to="/" replace />;\n'
     '    return children;\n'
     '}')
body('If not logged in: redirect to /login. If wrong role (e.g. a BUYER trying to visit '
     '/seller/dashboard): redirect to /. This is client-side only — the backend enforces roles too.')

h2('AuthContext.jsx — Global auth state')
code('const AuthContext = createContext(null);\n\n'
     'export function AuthProvider({ children }) {\n'
     '    const [auth, setAuth] = useState(() => {\n'
     '        // Restore from sessionStorage on page refresh\n'
     '        const token = sessionStorage.getItem("token");\n'
     '        return token ? {\n'
     '            token, role:   sessionStorage.getItem("role"),\n'
     '            name:  sessionStorage.getItem("name"),\n'
     '            userId: sessionStorage.getItem("userId")\n'
     '        } : null;\n'
     '    });\n\n'
     '    const login = (token, role, name, userId) => {\n'
     '        sessionStorage.setItem("token", token);\n'
     '        sessionStorage.setItem("role",  role);\n'
     '        sessionStorage.setItem("name",  name);\n'
     '        sessionStorage.setItem("userId", userId);\n'
     '        setAuth({ token, role, name, userId });\n'
     '    };\n'
     '    const logout = () => { sessionStorage.clear(); setAuth(null); };\n\n'
     '    return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;\n'
     '}')

note('sessionStorage is cleared when the browser tab closes. This is intentional — users must '
     'log in again per session. If the user opens a new tab, they start fresh.')

h2('ToastContext.jsx — Global notifications')
code('// showToast(message, type, duration)\n'
     '// type: "success" | "error" | "info"\n'
     '// error toasts stay 5 seconds; others 3 seconds\n'
     '// Max 3 toasts visible at once')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 13. FRONTEND API LAYER
# ══════════════════════════════════════════════════════════════════════════════
h1('13. Frontend API Layer & Axios Interceptors')

h2('src/api/axios.js — Configured Axios instance')
code('import axios from "axios";\n\n'
     'const api = axios.create({\n'
     '    baseURL: "http://localhost:8080/api",\n'
     '});\n\n'
     '// Request interceptor: attach JWT to every request\n'
     'api.interceptors.request.use(config => {\n'
     '    const token = sessionStorage.getItem("token");\n'
     '    if (token) config.headers.Authorization = `Bearer ${token}`;\n'
     '    return config;\n'
     '});\n\n'
     '// Response interceptor: handle 401 (expired/invalid token)\n'
     'api.interceptors.response.use(\n'
     '    res => res,\n'
     '    err => {\n'
     '        if (err.response?.status === 401) {\n'
     '            sessionStorage.clear();\n'
     '            window.location.href = "/login";\n'
     '        }\n'
     '        return Promise.reject(err);\n'
     '    }\n'
     ');\n\n'
     'export default api;')

body('The request interceptor runs before EVERY axios call in the app — no need to manually '
     'add headers. The response interceptor auto-logs the user out if the JWT expires.')

h2('src/api/bids.js')
code('export const placeBid      = (productId, data) => api.post(`/products/${productId}/bid`, data);\n'
     'export const purchaseProduct = (productId)    => api.post(`/products/${productId}/purchase`);\n'
     'export const getBidStats   = (productId)       => api.get(`/products/${productId}/bid/stats`);\n'
     'export const getMyBids     = ()                => api.get("/buyer/bids");\n'
     'export const getMyPurchases = ()               => api.get("/buyer/purchases");')

h2('src/api/products.js')
code('export const getProducts = (categoryId) =>\n'
     '    api.get("/products", { params: categoryId ? { category: categoryId } : {} });\n'
     'export const getProduct  = (id) => api.get(`/products/${id}`);')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 14. ERROR HANDLING
# ══════════════════════════════════════════════════════════════════════════════
h1('14. Error Handling')

h2('Backend error response format')
code('// All errors return JSON: {"error": "human-readable message"}\n'
     '{"error": "Already placed a bid on this product"}\n'
     '{"error": "Bid must be between 100 and 5000"}\n'
     '{"error": "Auction is not active"}\n'
     '{"error": "Token expired or invalid"}')

h2('HTTP Status Codes Used')
code('200 OK          — success\n'
     '400 Bad Request  — validation failure, bid out of range\n'
     '401 Unauthorized — expired or invalid JWT\n'
     '403 Forbidden    — wrong role, bid on own product\n'
     '404 Not Found    — product/user does not exist\n'
     '409 Conflict     — already placed a bid (sealed bid rule)')

h2('Frontend error display')
code('// ProductDetailPage.jsx\ntry {\n'
     '    await placeBid(product.id, { amount });\n'
     '    showToast("Bid placed successfully!", "success");\n'
     '} catch (err) {\n'
     '    // Check .error first (backend format), fallback to .message, then generic\n'
     '    showToast(\n'
     '        err.response?.data?.error ||\n'
     '        err.response?.data?.message ||\n'
     '        "Failed to place bid.",\n'
     '        "error"\n'
     '    );\n'
     '}')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 15. EMAIL
# ══════════════════════════════════════════════════════════════════════════════
h1('15. Email Notifications')

body('Spring Boot\'s spring-boot-starter-mail provides JavaMailSender. It is configured in '
     'application.properties to use Gmail SMTP.')

code('spring.mail.host=smtp.gmail.com\n'
     'spring.mail.port=587\n'
     'spring.mail.username=ebaazee.noreply@gmail.com\n'
     'spring.mail.password=<app-password>\n'
     'spring.mail.properties.mail.smtp.auth=true\n'
     'spring.mail.properties.mail.smtp.starttls.enable=true')

h2('AdminService.java — Sending the winner email')
code('private void sendWinnerEmail(User winner, Product product, BigDecimal amount) {\n'
     '    new Thread(() -> {  // async — do not block HTTP response\n'
     '        try {\n'
     '            SimpleMailMessage msg = new SimpleMailMessage();\n'
     '            msg.setTo(winner.getEmail());\n'
     '            msg.setSubject("Congratulations! You won the auction for " + product.getTitle());\n'
     '            msg.setText("Hi " + winner.getName() + ",\\n\\n"\n'
     '                + "You won the auction for \'" + product.getTitle() + "\' "\n'
     '                + "with a bid of ₹" + amount + ".\\n\\n"\n'
     '                + "Log in to eBaazee to complete your purchase.\\n\\n"\n'
     '                + "Team eBaazee");\n'
     '            mailSender.send(msg);\n'
     '        } catch (Exception e) {\n'
     '            // Email failure must not break the declare-winner flow\n'
     '            e.printStackTrace();\n'
     '        }\n'
     '    }).start();\n'
     '}')

note('The email is sent in a new Thread to avoid blocking the HTTP response. If Gmail SMTP '
     'is not configured (changeme password), the email silently fails but the auction still closes.')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 16. TESTING
# ══════════════════════════════════════════════════════════════════════════════
h1('16. Testing Strategy')

body('The backend has 28 unit/integration tests using Spring Boot Test. Tests run against H2 '
     '(in-memory database) so MySQL is not needed during test runs.')

h2('Test configuration')
code('# src/test/resources/application.properties\n'
     'spring.datasource.url=jdbc:h2:mem:testdb\n'
     'spring.datasource.driver-class-name=org.h2.Driver\n'
     'spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect\n'
     'spring.jpa.hibernate.ddl-auto=create-drop')

h2('Test classes')
bullet('AuthServiceTest — register, login, duplicate email rejection')
bullet('BidServiceTest  — place bid, sealed bid check, range check, frozen check')
bullet('ProductServiceTest — list, filter by category, getById')
bullet('AdminServiceTest  — freeze, unfreeze, declare winner')
bullet('@SpringBootTest with MockMvc for controller-level integration tests')

h2('Running tests')
code('cd ebaazee-backend\nmvn test')

doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 17. PROFESSOR Q&A
# ══════════════════════════════════════════════════════════════════════════════
h1('17. Professor Q&A — Likely Questions')

h2('Q: Why did you use JWT instead of sessions?')
body('JWT is stateless — the server does not store session data. This scales horizontally '
     '(any server instance can verify any token) and is industry standard for REST APIs. '
     'The token is self-contained: it carries the user\'s role and email, so the server '
     'doesn\'t need a database lookup to authorize every request.')

h2('Q: How does sealed bidding work?')
body('Two layers of enforcement: (1) The service layer calls '
     'bidRepository.findByUserAndProduct(buyer, product) — if a result exists, it throws '
     'CONFLICT 409. (2) The database has a UNIQUE constraint on (user_id, product_id) in the '
     'bid table — even if the service check is bypassed, the DB will reject the duplicate INSERT.')

h2('Q: What is STOMP and why do you use it over raw WebSockets?')
body('Raw WebSockets are just a persistent TCP connection — you get bytes. STOMP adds '
     'a publish/subscribe protocol on top: topics (like /topic/products/5) and subscriptions. '
     'Spring\'s @EnableWebSocketMessageBroker understands STOMP natively, making it easy to '
     'broadcast to all subscribers of a topic with one line: messagingTemplate.convertAndSend().')

h2('Q: What does SockJS do?')
body('SockJS is a JavaScript library that provides a WebSocket-like API but falls back to '
     'HTTP long-polling if WebSockets are blocked. This ensures the live stats work even in '
     'environments with restrictive network policies (like some university networks).')

h2('Q: Why BCrypt for passwords?')
body('BCrypt is a one-way hashing function designed specifically for passwords. It incorporates '
     'a salt (random data) automatically, so two users with the same password get different '
     'hashes. The work factor (cost: 12 in our config) makes brute-force attacks computationally '
     'expensive. We never store plain-text passwords.')

h2('Q: How does Spring Security know who is logged in inside a controller?')
body('JwtAuthFilter sets the authentication in SecurityContextHolder. Inside any controller, '
     'you can get the current user with: (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal(). '
     'The @PreAuthorize("hasRole(\'BUYER\')") annotation checks the ROLE_BUYER authority that '
     'JwtAuthFilter added when it built the UsernamePasswordAuthenticationToken.')

h2('Q: What happens if two buyers bid at exactly the same time?')
body('The @Transactional annotation on placeBid() ensures the entire check-and-insert is '
     'atomic. The database UNIQUE constraint on (user_id, product_id) is the final safety net. '
     'Two different buyers can both bid simultaneously — only the same buyer bidding twice '
     'is blocked. The highest bid among all buyers wins.')

h2('Q: Why MySQL instead of PostgreSQL?')
body('The FSAD Assignment 2 specification required MySQL. We migrated from PostgreSQL by: '
     '(1) replacing the postgresql dependency with mysql-connector-j in pom.xml, '
     '(2) updating application.properties with the MySQL JDBC URL, '
     '(3) changing data.sql from PostgreSQL-specific INSERT ... WHERE NOT EXISTS syntax to '
     'MySQL\'s INSERT IGNORE. Hibernate handled the DDL automatically.')

h2('Q: Explain the CORS configuration.')
body('CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks a webpage '
     'from making requests to a different domain than it was served from. Our React app runs on '
     'http://localhost:5173 (Vite) and calls http://localhost:8080 (Spring) — different ports = '
     'different origins. We configure Spring Security\'s CORS to allow requests from '
     'localhost:5173 with any headers and all HTTP methods. Without this, every API call '
     'from the React app would be blocked by the browser with a CORS error.')

h2('Q: How does the Purchase flow work?')
body('After Admin freezes the auction: BuyerController.purchaseProduct() → BuyerService. '
     'Service checks: (1) product is FROZEN, (2) finds highest bid via '
     'findByProduct().stream().max(comparingBigDecimal), (3) verifies requesting buyer IS the '
     'highest bidder (otherwise 403), (4) saves Purchase entity, (5) sets product status to CLOSED. '
     'The winning buyer sees the "Purchase Now" button only when status=FROZEN and they are the '
     'highest bidder — ProductDetailPage checks both conditions.')

h2('Q: What is Lombok?')
body('Lombok is a Java annotation processor that generates boilerplate code at compile time. '
     '@Data generates getters, setters, equals, hashCode, toString. '
     '@Builder generates a builder pattern. '
     '@RequiredArgsConstructor generates a constructor for all final fields. '
     '@Slf4j generates a logger. This keeps entity and service classes concise.')

h2('Q: Walk me through registering a new user.')
bullet('1. POST /api/auth/register  {name, email, password}')
bullet('2. @Valid triggers Bean Validation on AuthRequest DTO')
bullet('3. AuthService.register(): existsByEmail check → throw 400 if duplicate')
bullet('4. BCryptPasswordEncoder.encode(password) — hash the password')
bullet('5. new User(...) with role=BUYER (default for self-registration)')
bullet('6. userRepository.save(user) → INSERT into users table')
bullet('7. generateToken(user) → JWT')
bullet('8. Response: {token, role, name, userId}')
bullet('9. Frontend: login(token, role, name, userId) → sessionStorage → navigate to /browse')

# ══════════════════════════════════════════════════════════════════════════════
# APPENDIX: Demo Data
# ══════════════════════════════════════════════════════════════════════════════
doc.add_page_break()
h1('Appendix: Demo Accounts & Data')

h2('User Accounts (all passwords: Admin@123)')
code('Role    | Name               | Email\n'
     '--------|--------------------|-----------------------\n'
     'ADMIN   | Administrator      | admin@ebaazee.com\n'
     'SELLER  | Anubhab Dey        | Anubhab@gmail.com\n'
     'SELLER  | Priya Patel        | Priya@gmail.com\n'
     'BUYER   | Rituparna Debnath  | Rituparna@gmail.com\n'
     'BUYER   | Rahul Sharma       | Rahul@gmail.com')

h2('Demo Script for Presentation')
bullet('1. Login as Seller 1 (Anubhab) → show Seller Dashboard → products listed')
bullet('2. Login as Buyer 2 (Rahul) → Browse → place bid on a product → WebSocket updates live stats')
bullet('3. Open another tab as Buyer 1 (Rituparna) → same product page → see Rahul\'s bid in BidStatsPanel')
bullet('4. Rituparna places a higher bid → both tabs update instantly via WebSocket')
bullet('5. Login as Admin → freeze the auction → declare winner (Rituparna)')
bullet('6. Rituparna logs back in → sees "Purchase Now" → completes purchase')
bullet('7. Product is now CLOSED — nobody can bid anymore')

h2('Running the Application')
code('# Terminal 1 — Backend\ncd ebaazee-backend\nmvn spring-boot:run\n\n'
     '# Terminal 2 — Frontend\ncd ebaazee-frontend\nnpm run dev\n\n'
     '# Open browser\nhttp://localhost:5173')

doc.save(OUT)
print(f"Saved: {OUT}")
