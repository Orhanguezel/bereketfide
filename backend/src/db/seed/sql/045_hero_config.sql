-- =============================================================
-- 045_hero_config.sql – Bereket Fide Hero Video + Config
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Hero video (global)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'hero_video', '*',
 '{"url":"/uploads/video/2d7f.mp4","alt":"Bereket Fide - Kaliteli Fide Üretimi","poster":""}',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- Hero config (TR)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'hero_config', 'tr',
 CAST(JSON_OBJECT(
   'title', 'Kaliteli Fide Üretimi',
   'subtitle', 'Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz',
   'cta_text', 'Ürünlerimiz',
   'cta_url', '/urunler',
   'cta2_text', 'Teklif Al',
   'cta2_url', '/teklif'
 ) AS CHAR CHARACTER SET utf8mb4),
 NOW(3), NOW(3)),
(UUID(), 'hero_config', 'en',
 CAST(JSON_OBJECT(
   'title', 'Quality Seedling Production',
   'subtitle', 'We produce grafted and standard seedlings in our modern greenhouses',
   'cta_text', 'Our Products',
   'cta_url', '/urunler',
   'cta2_text', 'Get a Quote',
   'cta2_url', '/teklif'
 ) AS CHAR CHARACTER SET utf8mb4),
 NOW(3), NOW(3)),
(UUID(), 'hero_config', '*',
 CAST(JSON_OBJECT(
   'title', 'Kaliteli Fide Üretimi',
   'subtitle', 'Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz',
   'cta_text', 'Ürünlerimiz',
   'cta_url', '/urunler',
   'cta2_text', 'Teklif Al',
   'cta2_url', '/teklif'
 ) AS CHAR CHARACTER SET utf8mb4),
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- Video storage asset kaydı
INSERT INTO `storage_assets` (`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`, `provider`, `created_at`, `updated_at`)
VALUES (UUID(), NULL, '2d7f.mp4', 'local', 'uploads/video/2d7f.mp4', 'video', 'video/mp4', 24676304, '/uploads/video/2d7f.mp4', 'local', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `updated_at` = VALUES(`updated_at`);
