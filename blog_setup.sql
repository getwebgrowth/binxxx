-- MySQL Setup Script for CC Bins Blog & Admin Panel
-- Run this script in your MySQL Database to initialize tables.

-- Create database if not exists (Optional, uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS bx_bin_db;
-- USE bx_bin_db;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- SHA-256 hashed password
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `role` VARCHAR(20) NOT NULL DEFAULT 'editor', -- 'admin', 'editor'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `posts`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` TEXT NOT NULL,
  `summary` VARCHAR(500) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'General',
  `tags` VARCHAR(255) DEFAULT '',
  `views` INT DEFAULT 0,
  `author_id` INT NOT NULL,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Seed Initial Admin User
-- Default credentials: Username 'admin', Password 'adminpassword'
-- SHA-256 for 'adminpassword' is: '749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70'
-- --------------------------------------------------------
INSERT IGNORE INTO `users` (`id`, `username`, `password`, `email`, `role`) VALUES
(1, 'admin', '749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70', 'contact@ccbins.co', 'admin');

-- --------------------------------------------------------
-- Seed Sample Posts
-- --------------------------------------------------------
INSERT IGNORE INTO `posts` (`id`, `title`, `slug`, `content`, `summary`, `category`, `tags`, `views`, `author_id`, `published_at`) VALUES
(1, 'Understanding BIN Numbers: The Core of Credit Card Intelligence', 'understanding-bin-numbers', '# Understanding BIN Numbers: The Core of Credit Card Intelligence\n\nBank Identification Numbers (BINs) are the first six to eight digits of a payment card number. They play a critical role in payment processing, fraud prevention, and transaction routing.\n\n## What is a BIN?\n\nA BIN identifies the issuing institution for the card. For example, when a customer swipes a Visa card, the BIN tells the system which bank issued that card and where to send the transaction authorization request.\n\n### Why is BIN Intelligence Important?\n\n1. **Fraud Detection:** Checking if the card country matches the IP country.\n2. **Payment Optimization:** Routing transactions through local networks to save fees.\n3. **Cardholder Insights:** Identifying whether a card is Credit, Debit, Prepaid, Gold, Platinum, etc.\n\nIn our next post, we will explore how card routing and cross-border transactions are managed using BIN databases.', 'Learn the fundamentals of Bank Identification Numbers (BINs), why they are critical for merchant payment processing, and how BIN databases optimize routing and reduce fraud.', 'Fintech', 'BIN,Payments,Fraud', 105, 1, NOW()),
(2, 'The Future of Payment Security: 3D Secure and Beyond', 'future-of-payment-security', '# The Future of Payment Security: 3D Secure and Beyond\n\nPayment security is evolving rapidly. With the rise of online shopping, secure payment gateways are more critical than ever. In this post, we discuss the implementation of 3D Secure (3DS) and other modern authentication standards.\n\n## Evolution of 3D Secure\n\n3D Secure is a security protocol that adds an extra layer of authentication for online card transactions. Originally developed by Visa (as Verified by Visa), it has evolved into a global standard supported by all major card brands.\n\n### Key Benefits of 3DS 2.0:\n- **Frictionless Flow:** Uses risk-based authentication to reduce checkout friction.\n- **Mobile Compatibility:** Optimized for mobile applications and in-app payments.\n- **Compliance:** Helps merchants meet strong customer authentication (SCA) requirements under regulations like PSD2.\n\nSecuring your online payment gateway is not just about compliance; it is about building trust with your customers.', 'Explore the evolution of payment security, from early 3D Secure protocols to modern risk-based authentication models that optimize merchant checkouts.', 'Security', '3DS,Payments,Compliance', 48, 1, NOW());
