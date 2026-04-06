-- Eski enum (admin/moderator/user) -> @agro/shared-backend ile uyumlu roller
-- Yeni kurulumda 004 zaten yeni enum ile gelir; bu dosya idempotent tekrar calismaya calisir.

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE `user_roles` SET `role` = 'editor' WHERE `role` = 'moderator';
UPDATE `user_roles` SET `role` = 'customer' WHERE `role` = 'user';

ALTER TABLE `user_roles`
  MODIFY COLUMN `role` ENUM('admin','editor','carrier','customer','dealer') NOT NULL DEFAULT 'customer';
