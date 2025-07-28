-- Create and use database
CREATE DATABASE IF NOT EXISTS asto_db;
USE asto_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL , -- Store hashed password
  role ENUM('customer', 'admin') DEFAULT 'customer',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users
ADD COLUMN last_login DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM users;

alter table users
add column reset_password_token varchar(255),
add column reset_password_expires_at DATETIME,
add column verification_token varchar(255);
alter table users
add column verification_token_expires_at DATETIME;

delete from users where id = 38;
select * from users;
-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  type ENUM('mouse', 'keyboard', 'headset', 'monitor', 'laptop', 'accessory') NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  stock INT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mouse Features Table
CREATE TABLE IF NOT EXISTS mouse_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  sensor VARCHAR(100),
  dpi INT,
  color VARCHAR(50),
  rgb BOOLEAN,
  connection VARCHAR(100),
  battery VARCHAR(50),
  weight_grams INT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Keyboard Features Table
CREATE TABLE IF NOT EXISTS keyboard_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  layout VARCHAR(50),
  switch_type VARCHAR(50),
  switch_brand VARCHAR(50),
  backlit BOOLEAN,
  connection VARCHAR(100),
  keycap_material VARCHAR(50),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Headset Features Table
CREATE TABLE IF NOT EXISTS headset_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  frequency_response VARCHAR(50),
  mic BOOLEAN,
  wireless BOOLEAN,
  connection VARCHAR(100),
  surround_sound BOOLEAN,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  user_name VARCHAR(100),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  shipping_address TEXT,
  total_price DECIMAL(10, 2),
  status ENUM('pending', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  method ENUM('cod', 'paypal', 'credit_card') NOT NULL,
  status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  paid_at DATETIME,
  transaction_id VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- User Tokens Table (reset/verify)
CREATE TABLE IF NOT EXISTS user_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(255) NOT NULL,
  type ENUM('reset', 'verify'),
  expires_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Show all tables
SHOW TABLES;
drop database asto_db;
