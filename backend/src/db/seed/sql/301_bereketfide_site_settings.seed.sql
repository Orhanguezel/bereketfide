-- =============================================================
-- FILE: 301_bereketfide_site_settings.seed.sql
-- Bereket Fide — site_settings (bereketfide__ prefix)
-- Keys: app_locales, seo, logo, site_logo, site_favicon, site_apple_touch_icon, site_og_default_image, contact_info, branding
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- APP LOCALES — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__app_locales',
  '*',
  JSON_ARRAY(
    JSON_OBJECT('code', 'tr', 'label', 'Türkçe', 'is_default', true, 'is_active', true),
    JSON_OBJECT('code', 'en', 'label', 'English', 'is_default', false, 'is_active', true),
    JSON_OBJECT('code', 'de', 'label', 'Deutsch', 'is_default', false, 'is_active', false)
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__seo',
  'tr',
  JSON_OBJECT(
    'site_title',       'Bereket Fide | Kaliteli ve Yüksek Verimli Fide Üretimi',
    'site_description', 'Antalya Aksu’da 2006’dan beri modern seralarda aşılı ve normal domates, biber, salatalık fideleri üretimi.',
    'keywords',         'bereket fide, antalya fide, aşılı fide, domates fidesi, biber fidesi, sebze fidesi, tarım, fide üretimi',
    'og_image',         '',
    'og_type',          'website'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SEO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__seo',
  'en',
  JSON_OBJECT(
    'site_title',       'Bereket Fide | High Quality and High Yield Seedling Production',
    'site_description', 'Production of grafted and normal tomato, pepper, and cucumber seedlings in modern greenhouses in Aksu, Antalya since 2006.',
    'keywords',         'bereket fide, antalya seedling, grafted seedling, tomato seedling, pepper seedling, vegetable seedling, agriculture',
    'og_image',         '',
    'og_type',          'website'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOGO — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__logo',
  '*',
  JSON_OBJECT(
    'logo_url',         '/uploads/logo/logo-23_51_59.png',
    'logo_alt',         'Bereket Fide Logo',
    'favicon_url',      '/uploads/logo/logo-23_59_55-kopie-3.png',
    'logo_dark_url',    '/uploads/logo/logo-23_58_23-kopie.png'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE LOGO — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__site_logo',
  '*',
  JSON_OBJECT(
    'logo_url',              '/uploads/logo/logo-23_51_59.png',
    'logo_alt',              'Bereket Fide',
    'logo_dark_url',         '/uploads/logo/logo-23_58_23-kopie.png',
    'favicon_url',           '/uploads/logo/logo-23_59_55-kopie-3.png',
    'apple_touch_icon_url',  '/uploads/logo/logo-23_59_55-kopie.png'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE FAVICON — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__site_favicon',
  '*',
  JSON_OBJECT(
    'url', '/uploads/logo/logo-23_59_55-kopie-3.png',
    'alt', 'Bereket Fide Favicon'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE APPLE TOUCH ICON — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__site_apple_touch_icon',
  '*',
  JSON_OBJECT(
    'url', '/uploads/logo/logo-23_59_55-kopie.png',
    'alt', 'Bereket Fide Apple Touch Icon'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- SITE OG DEFAULT IMAGE — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__site_og_default_image',
  '*',
  JSON_OBJECT(
    'url', '',
    'alt', 'Bereket Fide Social Sharing Image'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CONTACT INFO — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__contact_info',
  'tr',
  JSON_OBJECT(
    'company_name',     'Bereket Fide',
    'address',          'Fatih Mah. Isparta Yolu 07112',
    'city',             'Aksu / Antalya',
    'country',          'Türkiye',
    'phone',            '0242 464 19 25',
    'phone_2',          '',
    'email',            'info@bereketfide.com.tr',
    'email_2',          '',
    'working_hours',    'Pazartesi - Cumartesi: 08:00 - 18:00',
    'maps_embed_url',   '',
    'maps_lat',         '36.9392215',
    'maps_lng',         '30.8525091'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME STATS — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__home_stats',
  'tr',
  JSON_ARRAY(
    JSON_OBJECT('value', 376, 'label', 'Mutlu Müşteri'),
    JSON_OBJECT('value', 20, 'label', 'Çeşit Fidan'),
    JSON_OBJECT('value', 16, 'label', 'Yıllık deneyim'),
    JSON_OBJECT('value', 31, 'label', 'Tamamlanan Proje')
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME STATS — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__home_stats',
  'en',
  JSON_ARRAY(
    JSON_OBJECT('value', 376, 'label', 'Happy Customers'),
    JSON_OBJECT('value', 20, 'label', 'Seedling Varieties'),
    JSON_OBJECT('value', 16, 'label', 'Years of Experience'),
    JSON_OBJECT('value', 31, 'label', 'Completed Projects')
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CONTACT INFO — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__contact_info',
  'en',
  JSON_OBJECT(
    'company_name',     'Bereket Fide',
    'address',          'Fatih Mah. Isparta Yolu 07112',
    'city',             'Aksu / Antalya',
    'country',          'Turkey',
    'phone',            '+90 242 464 19 25',
    'phone_2',          '',
    'email',            'info@bereketfide.com.tr',
    'email_2',          '',
    'working_hours',    'Monday - Saturday: 08:00 - 18:00',
    'maps_embed_url',   '',
    'maps_lat',         '36.9392215',
    'maps_lng',         '30.8525091'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- BRANDING — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__branding',
  '*',
  JSON_OBJECT(
    'brand_name',       'Bereket Fide',
    'brand_tagline_tr', 'Bereketli Hasatlar İçin Kaliteli Fideler',
    'brand_tagline_en', 'Quality Seedlings for Bountiful Harvests',
    'primary_color',    '#27823b',
    'accent_color',     '#69ba83',
    'dark_color',       '#2b2b2b',
    'font_family',      'Outfit',
    'font_display',     'Syne'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HOME BACKGROUNDS — global (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__home_backgrounds',
  '*',
  '[{"url":"/uploads/products/23.28.37 (1).jpeg","alt":"Bereket Fide Seraları 1"},{"url":"/uploads/products/23.28.37 (3).jpeg","alt":"Bereket Fide Seraları 2"},{"url":"/uploads/products/23.28.37.jpeg","alt":"Bereket Fide Seraları 3"}]',
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CTA OFFER — TR
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__cta_offer',
  'tr',
  JSON_OBJECT(
    'title',       'Fide Siparişiniz İçin Ücretsiz Fiyat Teklifi Hazırlayalım',
    'description', 'Sebze, meyve veya süs bitkisi fideleriniz için çeşit, miktar ve teslimat beklentilerinizi birlikte netleştirip size özel teklif hazırlayalım.',
    'button_text', 'Teklif İste',
    'button_url',  '/teklif'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- CTA OFFER — EN
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES (
  UUID(),
  'bereketfide__cta_offer',
  'en',
  JSON_OBJECT(
    'title',       'Get a Free Quote for Your Seedling Order',
    'description', 'Let us determine your seedling variety, quantity and delivery expectations together and prepare a custom quote for you.',
    'button_text', 'Request Quote',
    'button_url',  '/teklif'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
