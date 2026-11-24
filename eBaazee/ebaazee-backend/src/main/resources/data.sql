-- Seed categories
INSERT IGNORE INTO category (name, description) VALUES ('Electronics', 'Electronic gadgets and devices');
INSERT IGNORE INTO category (name, description) VALUES ('Fashion', 'Clothing and accessories');
INSERT IGNORE INTO category (name, description) VALUES ('Books', 'Books and literature');
INSERT IGNORE INTO category (name, description) VALUES ('Home & Garden', 'Home decor and garden supplies');

-- Seed admin user (password: Admin@123, BCrypt hash)
INSERT IGNORE INTO users (name, email, password_hash, role, created_at)
VALUES ('Administrator', 'admin@ebaazee.com',
        '$2a$12$S7Wde2bZ7A3cFZldqXy3HuajTs6VSmxMjcmbRPB0iHecnBd6VmB9e',
        'ADMIN', NOW());
