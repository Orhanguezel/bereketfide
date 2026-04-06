-- Opsiyonel: Veritabaninda onceki Drizzle semasi (entity_type, entity_id, status) kaldiysa
-- ve yeni kod (target_type, target_id, is_approved) ile uyumsuzluk varsa, once yedek alip
-- asagidaki satirlari ihtiyaca gore tek tek calistirin (kolon adlari mevcut semaya gore).

-- ALTER TABLE `comments` CHANGE COLUMN `entity_type` `target_type` VARCHAR(50) NOT NULL DEFAULT 'project';
-- ALTER TABLE `comments` CHANGE COLUMN `entity_id` `target_id` VARCHAR(100) NOT NULL;
-- ALTER TABLE `comments` ADD COLUMN `is_approved` TINYINT(1) NOT NULL DEFAULT 0 AFTER `image_url`;
-- UPDATE `comments` SET `is_approved` = CASE WHEN `status` = 'approved' THEN 1 ELSE 0 END WHERE EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'comments' AND COLUMN_NAME = 'status');
