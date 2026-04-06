-- =============================================================
-- FILE: 302_bereketfide_menu_items.seed.sql
-- Bereket Fide — header + footer menu items (TR/EN)
-- URL'ler frontend route'larıyla birebir eşleşir
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- 0) CLEANUP
-- =========================
DELETE FROM `menu_items_i18n` WHERE `menu_item_id` IN (SELECT id FROM `menu_items` WHERE `site_id` = 'bereketfide');
DELETE FROM `menu_items` WHERE `site_id` = 'bereketfide';

-- =============================================================
-- 1) HEADER
-- =============================================================
INSERT INTO `menu_items`
(`id`, `parent_id`, `location`, `section_id`, `site_id`, `type`, `page_id`, `icon`, `order_num`, `is_active`)
VALUES
('dd010001-4001-4001-8001-dd0000000001', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 0, 1), -- Ana Sayfa
('dd010002-4002-4002-8002-dd0000000002', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 1, 1), -- Ürünler
('dd010003-4003-4003-8003-dd0000000003', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 2, 1), -- Bilgi Bankası
('dd010004-4004-4004-8004-dd0000000004', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 3, 1), -- Galeri
('dd010005-4005-4005-8005-dd0000000005', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 4, 1), -- Kurumsal
('dd010006-4006-4006-8006-dd0000000006', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 5, 1), -- İletişim
('dd010007-4007-4007-8007-dd0000000007', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 6, 1), -- Teklif Al
('dd010008-4008-4008-8008-dd0000000008', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 7, 1),
('dd010081-4081-4081-8081-dd0000000081', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 0, 1),
('dd010082-4082-4082-8082-dd0000000082', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 1, 1),
('dd010083-4083-4083-8083-dd0000000083', 'dd010008-4008-4008-8008-dd0000000008', 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 2, 1),
('dd030001-4001-4001-8001-dd0000000001', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 0, 1),
('dd030002-4002-4002-8002-dd0000000002', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 1, 1),
('dd030003-4003-4003-8003-dd0000000003', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 2, 1),
('dd030004-4004-4004-8004-dd0000000004', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 3, 1),
('dd030005-4005-4005-8005-dd0000000005', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 4, 1),
('dd030006-4006-4006-8006-dd0000000006', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 5, 1),

-- FOOTER: Yasal
('dd040001-4001-4001-8001-dd0000000001', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 0, 1),
('dd040002-4002-4002-8002-dd0000000002', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 1, 1),
('dd040003-4003-4003-8003-dd0000000003', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 2, 1),
('dd040004-4004-4004-8004-dd0000000004', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 3, 1),

-- FOOTER: Sosyal
('dd050001-4001-4001-8001-dd0000000001', NULL, 'footer', 'ee010003-4003-4003-8003-ee0000000003', 'bereketfide', 'custom', NULL, 'instagram', 0, 1),
('dd050002-4002-4002-8002-dd0000000002', NULL, 'footer', 'ee010003-4003-4003-8003-ee0000000003', 'bereketfide', 'custom', NULL, 'linkedin', 1, 1)
ON DUPLICATE KEY UPDATE
  `parent_id`  = VALUES(`parent_id`),
  `location`   = VALUES(`location`),
  `section_id` = VALUES(`section_id`),
  `site_id`    = VALUES(`site_id`),
  `type`       = VALUES(`type`),
  `icon`       = VALUES(`icon`),
  `order_num`  = VALUES(`order_num`),
  `is_active`  = VALUES(`is_active`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =============================================================
-- 3) I18N — TR (URL = frontend route, locale-agnostic)
-- =============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
-- HEADER
(UUID(), 'dd010001-4001-4001-8001-dd0000000001', 'tr', 'Ana Sayfa',      '/',          NOW(3), NOW(3)),
(UUID(), 'dd010002-4002-4002-8002-dd0000000002', 'tr', 'Ürünler',        '/urunler',   NOW(3), NOW(3)),
(UUID(), 'dd010003-4003-4003-8003-dd0000000003', 'tr', 'Bilgi Bankası',  '/blog',      NOW(3), NOW(3)),
(UUID(), 'dd010004-4004-4004-8004-dd0000000004', 'tr', 'Galeri',         '/galeri',    NOW(3), NOW(3)),
(UUID(), 'dd010005-4005-4005-8005-dd0000000005', 'tr', 'Kurumsal',       '/hakkimizda',NOW(3), NOW(3)),
(UUID(), 'dd010006-4006-4006-8006-dd0000000006', 'tr', 'İletişim',       '/iletisim',  NOW(3), NOW(3)),
(UUID(), 'dd010007-4007-4007-8007-dd0000000007', 'tr', 'Teklif Al',      '/teklif',     NOW(3), NOW(3)),
(UUID(), 'dd010008-4008-4008-8008-dd0000000008', 'tr', 'Bayi',          '#',           NOW(3), NOW(3)),
(UUID(), 'dd010081-4081-4081-8081-dd0000000081', 'tr', 'Bayi Ağı',      '/bayi-agi',   NOW(3), NOW(3)),
(UUID(), 'dd010082-4082-4082-8082-dd0000000082', 'tr', 'Bayi Başvurusu','/bayi-kayit', NOW(3), NOW(3)),
(UUID(), 'dd010083-4083-4083-8083-dd0000000083', 'tr', 'Bayi Girişi',   '/bayi-girisi',NOW(3), NOW(3)),

-- FOOTER: Keşfet
(UUID(), 'dd030001-4001-4001-8001-dd0000000001', 'tr', 'Ana Sayfa',      '/',          NOW(3), NOW(3)),
(UUID(), 'dd030002-4002-4002-8002-dd0000000002', 'tr', 'Ürünler',        '/urunler',   NOW(3), NOW(3)),
(UUID(), 'dd030003-4003-4003-8003-dd0000000003', 'tr', 'Bilgi Bankası',  '/blog',      NOW(3), NOW(3)),
(UUID(), 'dd030004-4004-4004-8004-dd0000000004', 'tr', 'Galeri',         '/galeri',    NOW(3), NOW(3)),
(UUID(), 'dd030005-4005-4005-8005-dd0000000005', 'tr', 'Kurumsal',       '/hakkimizda',NOW(3), NOW(3)),
(UUID(), 'dd030006-4006-4006-8006-dd0000000006', 'tr', 'İletişim',       '/iletisim',  NOW(3), NOW(3)),

-- FOOTER: Yasal
(UUID(), 'dd040001-4001-4001-8001-dd0000000001', 'tr', 'Gizlilik Politikası', '/legal/privacy',      NOW(3), NOW(3)),
(UUID(), 'dd040002-4002-4002-8002-dd0000000002', 'tr', 'KVKK',                '/legal/kvkk',         NOW(3), NOW(3)),
(UUID(), 'dd040003-4003-4003-8003-dd0000000003', 'tr', 'Kullanım Koşulları',  '/legal/terms',        NOW(3), NOW(3)),
(UUID(), 'dd040004-4004-4004-8004-dd0000000004', 'tr', 'Çerez Politikası',    '/legal/cookie-policy',NOW(3), NOW(3)),

-- FOOTER: Sosyal
(UUID(), 'dd050001-4001-4001-8001-dd0000000001', 'tr', 'Instagram', 'https://www.instagram.com/bereketfide', NOW(3), NOW(3)),
(UUID(), 'dd050002-4002-4002-8002-dd0000000002', 'tr', 'LinkedIn',  'https://www.linkedin.com/company/bereketfide', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`), `url` = VALUES(`url`), `updated_at` = CURRENT_TIMESTAMP(3);

-- =============================================================
-- 4) I18N — EN (aynı route'lar — locale prefix layout tarafından eklenir)
-- =============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
-- HEADER
(UUID(), 'dd010001-4001-4001-8001-dd0000000001', 'en', 'Home',           '/',          NOW(3), NOW(3)),
(UUID(), 'dd010002-4002-4002-8002-dd0000000002', 'en', 'Products',       '/urunler',   NOW(3), NOW(3)),
(UUID(), 'dd010003-4003-4003-8003-dd0000000003', 'en', 'Knowledge Base', '/blog',      NOW(3), NOW(3)),
(UUID(), 'dd010004-4004-4004-8004-dd0000000004', 'en', 'Gallery',        '/galeri',    NOW(3), NOW(3)),
(UUID(), 'dd010005-4005-4005-8005-dd0000000005', 'en', 'Corporate',      '/hakkimizda',NOW(3), NOW(3)),
(UUID(), 'dd010006-4006-4006-8006-dd0000000006', 'en', 'Contact',        '/iletisim',  NOW(3), NOW(3)),
(UUID(), 'dd010007-4007-4007-8007-dd0000000007', 'en', 'Request Quote',  '/teklif',      NOW(3), NOW(3)),
(UUID(), 'dd010008-4008-4008-8008-dd0000000008', 'en', 'Dealer',        '#',            NOW(3), NOW(3)),
(UUID(), 'dd010081-4081-4081-8081-dd0000000081', 'en', 'Dealer Network','/bayi-agi',    NOW(3), NOW(3)),
(UUID(), 'dd010082-4082-4082-8082-dd0000000082', 'en', 'Dealer Apply',  '/bayi-kayit',  NOW(3), NOW(3)),
(UUID(), 'dd010083-4083-4083-8083-dd0000000083', 'en', 'Dealer Login',  '/bayi-girisi', NOW(3), NOW(3)),

-- FOOTER: Discover
(UUID(), 'dd030001-4001-4001-8001-dd0000000001', 'en', 'Home',           '/',          NOW(3), NOW(3)),
(UUID(), 'dd030002-4002-4002-8002-dd0000000002', 'en', 'Products',       '/urunler',   NOW(3), NOW(3)),
(UUID(), 'dd030003-4003-4003-8003-dd0000000003', 'en', 'Knowledge Base', '/blog',      NOW(3), NOW(3)),
(UUID(), 'dd030004-4004-4004-8004-dd0000000004', 'en', 'Gallery',        '/galeri',    NOW(3), NOW(3)),
(UUID(), 'dd030005-4005-4005-8005-dd0000000005', 'en', 'Corporate',      '/hakkimizda',NOW(3), NOW(3)),
(UUID(), 'dd030006-4006-4006-8006-dd0000000006', 'en', 'Contact',        '/iletisim',  NOW(3), NOW(3)),

-- FOOTER: Legal
(UUID(), 'dd040001-4001-4001-8001-dd0000000001', 'en', 'Privacy Policy',          '/legal/privacy',       NOW(3), NOW(3)),
(UUID(), 'dd040002-4002-4002-8002-dd0000000002', 'en', 'Data Protection (KVKK)',   '/legal/kvkk',          NOW(3), NOW(3)),
(UUID(), 'dd040003-4003-4003-8003-dd0000000003', 'en', 'Terms of Use',            '/legal/terms',         NOW(3), NOW(3)),
(UUID(), 'dd040004-4004-4004-8004-dd0000000004', 'en', 'Cookie Policy',           '/legal/cookie-policy', NOW(3), NOW(3)),

-- FOOTER: Social
(UUID(), 'dd050001-4001-4001-8001-dd0000000001', 'en', 'Instagram', 'https://www.instagram.com/bereketfide', NOW(3), NOW(3)),
(UUID(), 'dd050002-4002-4002-8002-dd0000000002', 'en', 'LinkedIn',  'https://www.linkedin.com/company/bereketfide', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`), `url` = VALUES(`url`), `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
