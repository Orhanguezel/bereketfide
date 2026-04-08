SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `orders`
  MODIFY COLUMN `payment_status`
    ENUM('unpaid','pending','paid','failed','refunded')
    NOT NULL DEFAULT 'unpaid';
