-- =============================================================
-- 040_site_settings.sql (Bereket Fide) – MULTI-LOCALE (Dynamic) [FIXED]
--  - app_locales + default_locale => locale='*'
--  - localized settings => locale in ('tr','en','de')
--  - cookie_consent => LOCALIZED (tr/en/de)  ✅ (requested)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- =============================================================
-- TABLE
-- =============================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id`         CHAR(36)      NOT NULL,
  `key`        VARCHAR(100)  NOT NULL,
  `locale`     VARCHAR(8)    NOT NULL,
  `value`      TEXT          NOT NULL,
  `created_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
                ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_locale_uq` (`key`, `locale`),
  KEY `site_settings_key_idx` (`key`),
  KEY `site_settings_locale_idx` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- GLOBAL: app_locales (locale='*')  ✅ FIX: tr/en/de, uniq
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'app_locales',
  '*',
  CAST(
    JSON_ARRAY(
      JSON_OBJECT('code','tr','label','Türkçe','is_default', FALSE, 'is_active', TRUE),
      JSON_OBJECT('code','en','label','English','is_default', FALSE, 'is_active', TRUE),
      JSON_OBJECT('code','de','label','Deutsch','is_default', TRUE,  'is_active', TRUE)
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: default_locale (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'default_locale', '*', 'de', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: TR içerik ayarları  ✅ FIX: locale='tr'
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'contact_info',
  'tr',
  CAST(JSON_OBJECT(
    'companyName','Bereket Fide Tarım A.Ş.',
    'phones',JSON_ARRAY('+90 212 613 33 01'),
    'email','info@bereketfide.com.tr',
    'address','Oruçreis Mah. Tekstilkent Sit. A17 Blok No:41 34235 Esenler / İstanbul, Türkiye',
    'addressSecondary','Fabrika: Saray Mah. Gimat Cad. No:6A 06980 Kahramankazan / Ankara, Türkiye',
    'whatsappNumber','+90 531 880 31 51',
    'taxOffice','',
    'taxNumber','',
    'website','https://www.bereketfide.com.tr'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(UUID(), 'catalog_pdf_url',        'tr', 'https://www.bereketfide.com.tr/uploads/bereketfide/catalog/bereketfide-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'tr', 'bereketfide-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'tr', 'info@bereketfide.com.tr', NOW(3), NOW(3)),
(UUID(), 'site_title',             'tr', 'Bereket Fide', NOW(3), NOW(3)),
(
  UUID(),
  'socials',
  'tr',
  CAST(JSON_OBJECT(
    'instagram','https://instagram.com/bereketfide',
    'facebook','https://facebook.com/bereketfide',
    'youtube','https://youtube.com/@bereketfide',
    'linkedin','https://linkedin.com/company/bereketfide',
    'x','https://x.com/bereketfide',
    'tiktok','https://www.tiktok.com/@bereketfide'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_profile',
  'tr',
  CAST(JSON_OBJECT(
    'headline','Kaliteli Fide Üretimi',
    'subline','Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz. Teknik destek ve danışmanlık hizmetleri sunuyoruz.',
    'body','Bereket Fide olarak, modern seralarımızda domates, biber, salatalık, karpuz ve patlıcan başta olmak üzere aşılı ve standart fide üretimi yapıyoruz. Teknik destek, lojistik ve sözleşmeli üretim hizmetleriyle Türkiye tarımına kaliteli fide tedarik etmekteyiz.'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'tr',
  CAST(JSON_OBJECT(
    'name','Bereket Fide Tarım A.Ş.',
    'shortName','Bereket Fide',
    'website','https://www.bereketfide.com.tr'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'catalog_admin_user_ids',
  'tr',
  CAST(JSON_ARRAY() AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: EN içerik ayarları
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'catalog_pdf_url',        'en', 'https://www.bereketfide.com.tr/uploads/bereketfide/catalog/bereketfide-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'en', 'bereketfide-catalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'en', 'info@bereketfide.com.tr', NOW(3), NOW(3)),
(UUID(), 'site_title',             'en', 'Bereket Fide', NOW(3), NOW(3)),
(
  UUID(),
  'contact_info',
  'en',
  CAST(JSON_OBJECT(
    'companyName','Bereket Fide Agriculture Inc.',
    'phones',JSON_ARRAY('+90 212 613 33 01'),
    'email','info@bereketfide.com.tr',
    'address','Oruçreis District, Tekstilkent Site, A17 Block No:41, 34235 Esenler / Istanbul, Türkiye',
    'addressSecondary','Factory: Saray District, Gimat St. No:6A, 06980 Kahramankazan / Ankara, Türkiye',
    'whatsappNumber','+90 531 880 31 51',
    'taxOffice','',
    'taxNumber','',
    'website','https://www.bereketfide.com.tr'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'socials',
  'en',
  CAST(JSON_OBJECT(
    'instagram','https://instagram.com/bereketfide',
    'facebook','https://facebook.com/bereketfide',
    'youtube','https://youtube.com/@bereketfide',
    'linkedin','https://linkedin.com/company/bereketfide',
    'x','https://x.com/bereketfide',
    'tiktok',''
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'en',
  CAST(JSON_OBJECT(
    'name','Bereket Fide Agriculture Inc.',
    'shortName','Bereket Fide',
    'website','https://www.bereketfide.com.tr'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_profile',
  'en',
  CAST(JSON_OBJECT(
    'headline','Quality Seedling Production',
    'subline','We produce grafted and standard seedlings in our modern greenhouses.',
    'body','Bereket Fide produces grafted and standard seedlings for tomato, pepper, cucumber and other vegetables in modern greenhouses. We provide technical support, logistics and contract farming services.'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: DE içerik ayarları
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'catalog_pdf_url',        'de', 'https://www.bereketfide.com.tr/uploads/bereketfide/catalog/bereketfide-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_pdf_filename',   'de', 'bereketfide-katalog.pdf', NOW(3), NOW(3)),
(UUID(), 'catalog_admin_email',    'de', 'info@bereketfide.com.tr', NOW(3), NOW(3)),
(UUID(), 'site_title',             'de', 'Bereket Fide', NOW(3), NOW(3)),
(
  UUID(),
  'contact_info',
  'de',
  CAST(JSON_OBJECT(
    'companyName','Bereket Fide Landwirtschaft GmbH',
    'phones',JSON_ARRAY('+90 212 613 33 01'),
    'email','info@bereketfide.com.tr',
    'address','Oruçreis Mah., Tekstilkent Sit., A17 Blok No:41, 34235 Esenler / Istanbul, Türkei',
    'addressSecondary','Werk: Saray Mah., Gimat Cad. No:6A, 06980 Kahramankazan / Ankara, Türkei',
    'whatsappNumber','+90 531 880 31 51',
    'taxOffice','',
    'taxNumber','',
    'website','https://www.bereketfide.com.tr'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'socials',
  'de',
  CAST(JSON_OBJECT(
    'instagram','https://instagram.com/bereketfide',
    'facebook','https://facebook.com/bereketfide',
    'youtube','https://youtube.com/@bereketfide',
    'linkedin','https://linkedin.com/company/bereketfide',
    'x','https://x.com/bereketfide',
    'tiktok','https://www.tiktok.com/@bereketfide'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_brand',
  'de',
  CAST(JSON_OBJECT(
    'name','Bereket Fide Landwirtschaft GmbH',
    'shortName','Bereket Fide',
    'website','https://www.bereketfide.com.tr'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'company_profile',
  'de',
  CAST(JSON_OBJECT(
    'headline','Qualitäts-Setzlingsproduktion',
    'subline','Wir produzieren veredelte und Standard-Setzlinge in modernen Gewächshäusern.',
    'body','Bereket Fide produziert veredelte und Standard-Setzlinge in modernen Gewächshäusern für Tomaten, Paprika, Gurken und weiteres Gemüse.'
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Storage (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'storage_driver',             '*', 'cloudinary',                                  NOW(3), NOW(3)),
(UUID(), 'storage_local_root',         '*', './uploads',                    NOW(3), NOW(3)),
(UUID(), 'storage_local_base_url',     '*', '/uploads',                                    NOW(3), NOW(3)),
(UUID(), 'cloudinary_cloud_name',      '*', 'dbozv7wqd',                                   NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_key',         '*', '644676135993432',                             NOW(3), NOW(3)),
(UUID(), 'cloudinary_api_secret',      '*', 'C2VWxsJ5j0jZpcxOhvuTOTKhaMo',                 NOW(3), NOW(3)),
(UUID(), 'cloudinary_folder',          '*', 'uploads/bereketfide',                             NOW(3), NOW(3)),
(UUID(), 'cloudinary_unsigned_preset', '*', 'bereketfide_unsigned',                            NOW(3), NOW(3)),
(UUID(), 'storage_cdn_public_base',    '*', 'https://res.cloudinary.com',                  NOW(3), NOW(3)),
(UUID(), 'storage_public_api_base',    '*', 'https://www.bereketfide.com.tr/api',     NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Public Base URL (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'public_base_url', '*', 'https://www.bereketfide.com.tr', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: SMTP (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'smtp_host',       '*', 'smtp.example.com',        NOW(3), NOW(3)),
(UUID(), 'smtp_port',       '*', '465',                     NOW(3), NOW(3)),
(UUID(), 'smtp_username',   '*', 'no-reply@bereketfide.com.tr', NOW(3), NOW(3)),
(UUID(), 'smtp_password',   '*', 'change-me-in-admin',      NOW(3), NOW(3)),
(UUID(), 'smtp_from_email', '*', 'no-reply@bereketfide.com.tr', NOW(3), NOW(3)),
(UUID(), 'smtp_from_name',  '*', 'Bereket Fide',                 NOW(3), NOW(3)),
(UUID(), 'smtp_ssl',        '*', 'true',                    NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: Google OAuth (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'google_client_id',     '*', 'your-google-client-id.apps.googleusercontent.com', NOW(3), NOW(3)),
(UUID(), 'google_client_secret', '*', 'change-me-in-admin',                               NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- GLOBAL: GTM + GA4 (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'gtm_container_id',   '*', 'GTM-WV5FRN93', NOW(3), NOW(3)),
(UUID(), 'ga4_measurement_id', '*', 'G-7S6TW9CNRJ', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);


-- =============================================================
-- GLOBAL: Site Media (locale='*')  ✅ UPDATED
-- Keys:
--  - site_logo
--  - site_logo_dark
--  - site_logo_light
--  - site_favicon
--  - site_apple_touch_icon   (180x180)
--  - site_app_icon_512       (512x512 manifest/icon)
--  - site_og_default_image   (1200x630 OG default)
--
-- Value format:
--  - simplest: URL string
--  - optional: JSON_OBJECT('url',..., 'width',..., 'height',..., 'asset_id',..., 'alt',...)
-- Service layer parseMediaUrl() supports both.
-- =============================================================

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'site_logo', '*',
 '{"url":"/logo/bereket-logo-light.png","alt":"Bereket Fide Logo"}',
 NOW(3), NOW(3)),
(UUID(), 'site_logo_dark', '*',
 '{"url":"/logo/bereket-logo-dark.png","alt":"Bereket Fide Logo (Dark)"}',
 NOW(3), NOW(3)),
(UUID(), 'site_logo_light', '*',
 '{"url":"/logo/bereket-logo-light.png","alt":"Bereket Fide Logo (Light)"}',
 NOW(3), NOW(3)),
(UUID(), 'site_favicon', '*',
 '{"url":"/logo/bereket-favicon.png","alt":"Bereket Fide Favicon"}',
 NOW(3), NOW(3)),
(UUID(), 'site_apple_touch_icon', '*',
 '{"url":"/logo/bereket-apple-touch-icon.png","alt":"Bereket Fide Apple Touch Icon"}',
 NOW(3), NOW(3)),
(UUID(), 'site_app_icon_512', '*',
 '{"url":"/logo/bereket-apple-touch-icon.png","alt":"Bereket Fide App Icon (512x512)"}',
 NOW(3), NOW(3)),
(UUID(), 'site_og_default_image', '*',
 '{"url":"/logo/bereket-logo-light.png","alt":"Bereket Fide"}',
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__site_logo', '*',
 '{"logo_url":"/logo/bereket-logo-light.png","logo_alt":"Bereket Fide","logo_dark_url":"/logo/bereket-logo-dark.png","favicon_url":"/logo/bereket-favicon.png","apple_touch_icon_url":"/logo/bereket-apple-touch-icon.png"}',
 NOW(3), NOW(3)),
(UUID(), 'logo', '*',
 '{"logo_url":"/logo/bereket-logo-light.png","logo_alt":"Bereket Fide","favicon_url":"/logo/bereket-favicon.png","logo_dark_url":"/logo/bereket-logo-dark.png"}',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- LOCALIZED: Cookie Consent Config (tr/en/de) ✅ FIX: NOT GLOBAL
-- consent_version değişince tekrar onay al
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(
  UUID(),
  'cookie_consent',
  'tr',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT('necessary', TRUE, 'analytics', FALSE, 'marketing', FALSE),
      'ui', JSON_OBJECT('enabled', TRUE, 'position', 'bottom', 'show_reject_all', TRUE),
      'texts', JSON_OBJECT(
        'title', 'Çerez Tercihleri',
        'description', 'Sitemizin doğru çalışmasını sağlamak ve isteğe bağlı analiz yapmak için çerezler kullanıyoruz. Tercihlerinizi yönetebilirsiniz.'
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cookie_consent',
  'en',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT('necessary', TRUE, 'analytics', FALSE, 'marketing', FALSE),
      'ui', JSON_OBJECT('enabled', TRUE, 'position', 'bottom', 'show_reject_all', TRUE),
      'texts', JSON_OBJECT(
        'title', 'Cookie Preferences',
        'description', 'We use cookies to ensure the site works properly and to optionally analyze traffic. You can manage your preferences.'
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'cookie_consent',
  'de',
  CAST(
    JSON_OBJECT(
      'consent_version', 1,
      'defaults', JSON_OBJECT('necessary', TRUE, 'analytics', FALSE, 'marketing', FALSE),
      'ui', JSON_OBJECT('enabled', TRUE, 'position', 'bottom', 'show_reject_all', TRUE),
      'texts', JSON_OBJECT(
        'title', 'Cookie-Einstellungen',
        'description', 'Wir verwenden Cookies, um die Website korrekt zu betreiben und optional den Traffic zu analysieren. Sie können Ihre Einstellungen verwalten.'
      )
    ) AS CHAR CHARACTER SET utf8mb4
  ),
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- ADMIN PANEL UI CONFIG (locale='*')
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'ui_admin_config', '*',
 CAST(JSON_OBJECT(
   'default_locale','tr',
   'theme', JSON_OBJECT('mode','light','preset','default','font','inter'),
   'layout', JSON_OBJECT('sidebar_variant','sidebar','sidebar_collapsible','icon','navbar_style','sticky','content_layout','centered'),
   'branding', JSON_OBJECT(
     'app_name','Bereket Fide Admin Panel',
     'app_copyright','Bereket Fide',
     'meta', JSON_OBJECT('title','Bereket Fide Admin Panel','description','Bereket Fide admin paneli.','og_title','Bereket Fide Admin Panel','og_description','Bereket Fide admin paneli.')
   )
 ) AS CHAR CHARACTER SET utf8mb4), NOW(3), NOW(3)),
(UUID(), 'bereketfide__ui_admin_config', '*',
 CAST(JSON_OBJECT(
   'default_locale','tr',
   'theme', JSON_OBJECT('mode','light','preset','default','font','inter'),
   'layout', JSON_OBJECT('sidebar_variant','sidebar','sidebar_collapsible','icon','navbar_style','sticky','content_layout','centered'),
   'branding', JSON_OBJECT(
     'app_name','Bereket Fide Admin Panel',
     'app_copyright','Bereket Fide',
     'meta', JSON_OBJECT('title','Bereket Fide Admin Panel','description','Bereket Fide admin paneli.','og_title','Bereket Fide Admin Panel','og_description','Bereket Fide admin paneli.')
   )
 ) AS CHAR CHARACTER SET utf8mb4), NOW(3), NOW(3)),
(UUID(), 'bereketfide__ui_admin_pages', 'tr',
 CAST(JSON_OBJECT(
   'dashboard', JSON_OBJECT('title','Dashboard','description','Genel bakis'),
   'products', JSON_OBJECT('title','Urunler','description','Urun yonetimi'),
   'categories', JSON_OBJECT('title','Kategoriler','description','Kategori yonetimi')
 ) AS CHAR CHARACTER SET utf8mb4), NOW(3), NOW(3)),
(UUID(), 'bereketfide__ui_admin_pages', '*',
 CAST(JSON_OBJECT('dashboard', JSON_OBJECT('title','Dashboard','description','Overview')) AS CHAR CHARACTER SET utf8mb4),
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

-- =============================================================
-- HERO VIDEO + CONFIG (global + prefixed)
-- =============================================================
INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'hero_video', '*',
 '{"url":"/uploads/video/2d7f.mp4","alt":"Bereket Fide - Kaliteli Fide Üretimi","poster":""}',
 NOW(3), NOW(3)),
(UUID(), 'hero_config', '*',
 '{"title":"Kaliteli Fide Üretimi","subtitle":"Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz","cta_text":"Ürünlerimiz","cta_url":"/urunler","cta2_text":"Teklif Al","cta2_url":"/teklif"}',
 NOW(3), NOW(3)),
(UUID(), 'hero_config', 'tr',
 '{"title":"Kaliteli Fide Üretimi","subtitle":"Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz","cta_text":"Ürünlerimiz","cta_url":"/urunler","cta2_text":"Teklif Al","cta2_url":"/teklif"}',
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__hero_video', '*',
 '{"url":"/uploads/video/2d7f.mp4","alt":"Bereket Fide - Kaliteli Fide Üretimi","poster":""}',
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__hero_config', '*',
 '{"title":"Kaliteli Fide Üretimi","subtitle":"Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz","cta_text":"Ürünlerimiz","cta_url":"/urunler","cta2_text":"Teklif Al","cta2_url":"/teklif"}',
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__hero_config', 'tr',
 '{"title":"Kaliteli Fide Üretimi","subtitle":"Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz","cta_text":"Ürünlerimiz","cta_url":"/urunler","cta2_text":"Teklif Al","cta2_url":"/teklif"}',
 NOW(3), NOW(3)),
(UUID(), 'hero', '*',
 '{"video_desktop":"/uploads/video/2d7f.mp4","headline_tr":"Kaliteli Fide Üretimi","headline_en":"Quality Seedling Production","subheadline_tr":"Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz","subheadline_en":"We produce grafted and standard seedlings","cta_text_tr":"Ürünlerimiz","cta_text_en":"Our Products","cta_url":"/urunler"}',
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__hero', '*',
 '{"video_desktop":"/uploads/video/2d7f.mp4","headline_tr":"Kaliteli Fide Üretimi","headline_en":"Quality Seedling Production","subheadline_tr":"Modern seralarımızda aşılı ve standart fide üretimi yapıyoruz","subheadline_en":"We produce grafted and standard seedlings","cta_text_tr":"Ürünlerimiz","cta_text_en":"Our Products","cta_url":"/urunler"}',
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
