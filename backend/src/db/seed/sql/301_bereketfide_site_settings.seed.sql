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
    'logo_url',         '',
    'logo_alt',         'Bereket Fide Logo',
    'favicon_url',      '',
    'logo_dark_url',    ''
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
    'logo_url',              '',
    'logo_alt',              'Bereket Fide',
    'logo_dark_url',         '',
    'favicon_url',           '',
    'apple_touch_icon_url',  ''
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
    'url', '',
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
    'url', '',
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
    'primary_color',    '#F27A1A',
    'accent_color',     '#4CAF50',
    'dark_color',       '#1A1A1A',
    'font_family',      'Inter',
    'font_display',     'Outfit'
  ),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
