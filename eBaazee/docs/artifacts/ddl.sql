-- eBaazee.com DDL — PostgreSQL (production) / MySQL 8.x (spec target)
-- Team: Rituparna Debnath (2025SL70015) & Anubhab Dey (2025SL70030)

CREATE TABLE users (
    user_id      BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role         VARCHAR(10)   NOT NULL CHECK (role IN ('BUYER','SELLER','ADMIN')),
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
    category_id  BIGSERIAL PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL UNIQUE,
    description  VARCHAR(255)
);

CREATE TABLE product (
    product_id   BIGSERIAL PRIMARY KEY,
    title        VARCHAR(200)  NOT NULL,
    description  TEXT,
    image_url    VARCHAR(500),
    min_bid      DECIMAL(12,2) NOT NULL,
    max_bid      DECIMAL(12,2) NOT NULL,
    start_time   TIMESTAMP     NOT NULL,
    end_time     TIMESTAMP     NOT NULL,
    status       VARCHAR(10)   NOT NULL DEFAULT 'ACTIVE'
                               CHECK (status IN ('ACTIVE','FROZEN','CLOSED')),
    seller_id    BIGINT        NOT NULL REFERENCES users(user_id),
    category_id  BIGINT        NOT NULL REFERENCES category(category_id)
);

CREATE TABLE bid (
    bid_id       BIGSERIAL PRIMARY KEY,
    amount       DECIMAL(12,2) NOT NULL,
    bid_time     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id      BIGINT        NOT NULL REFERENCES users(user_id),
    product_id   BIGINT        NOT NULL REFERENCES product(product_id),
    UNIQUE (user_id, product_id)
);

CREATE TABLE purchase (
    purchase_id   BIGSERIAL PRIMARY KEY,
    purchase_time TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount_paid   DECIMAL(12,2) NOT NULL,
    user_id       BIGINT        NOT NULL REFERENCES users(user_id),
    product_id    BIGINT        NOT NULL UNIQUE REFERENCES product(product_id)
);

-- Seed data
INSERT INTO category (name, description) VALUES
    ('Electronics',    'Gadgets, devices, and accessories'),
    ('Fashion',        'Clothing, footwear, and accessories'),
    ('Books',          'Fiction, non-fiction, textbooks'),
    ('Home & Garden',  'Furniture, décor, and outdoor');

-- Admin user (password: Admin@123, BCrypt hash)
INSERT INTO users (name, email, password_hash, role) VALUES
    ('Admin', 'admin@ebaazee.com',
     '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36W1eFSCbJnRKK7Jl3xCiGy',
     'ADMIN');
