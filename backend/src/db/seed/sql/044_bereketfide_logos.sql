-- =============================================================
-- 044_bereketfide_logos.sql – Bereket Fide Logo & Favicon
-- Bu dosya seed çalıştığında logoların kaybolmamasını sağlar.
-- NOT: Yollar /uploads/logo/ altında — backend staticUploads plugin'i serve eder.
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- bereketfide__site_logo (admin panel kullanıyor)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(), 'bereketfide__site_logo', '*',
  '{"logo_url":"/uploads/logo/logo-23_51_59.png","logo_alt":"Bereket Fide","favicon_url":"/uploads/logo/logo-23_51_59.png","apple_touch_icon_url":"/uploads/logo/logo-23_51_59.png"}',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- site_logo (frontend + public API)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'site_logo', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide Logo"}',
 NOW(3), NOW(3)),
(UUID(), 'site_logo_dark', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide Logo (Dark)"}',
 NOW(3), NOW(3)),
(UUID(), 'site_logo_light', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide Logo (Light)"}',
 NOW(3), NOW(3)),
(UUID(), 'site_favicon', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide Favicon"}',
 NOW(3), NOW(3)),
(UUID(), 'site_apple_touch_icon', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide Apple Touch Icon"}',
 NOW(3), NOW(3)),
(UUID(), 'site_app_icon_512', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide App Icon (512x512)"}',
 NOW(3), NOW(3)),
(UUID(), 'site_og_default_image', '*',
 '{"url":"/uploads/logo/logo-23_51_59.png","alt":"Bereket Fide"}',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- legacy logo key (backward compat)
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(), 'logo', '*',
  '{"logo_url":"/uploads/logo/logo-23_51_59.png","logo_alt":"Bereket Fide","favicon_url":"/uploads/logo/logo-23_51_59.png"}',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);
