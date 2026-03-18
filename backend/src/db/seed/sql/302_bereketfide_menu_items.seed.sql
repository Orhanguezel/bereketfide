-- =============================================================
-- FILE: 302_bereketfide_menu_items.seed.sql
-- Bereket Fide — header + footer menu items (TR/EN)
-- site_id = 'bereketfide'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =============================================================
-- 1) PARENT (menu_items) — HEADER
-- =============================================================
INSERT INTO `menu_items`
(`id`, `parent_id`, `location`, `section_id`, `site_id`, `type`, `page_id`, `icon`, `order_num`, `is_active`)
VALUES
-- HEADER ROOT
('dd010001-4001-4001-8001-dd0000000001', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 0, 1), -- Ana Sayfa
('dd010002-4002-4002-8002-dd0000000002', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 1, 1), -- Projeler
('dd010003-4003-4003-8003-dd0000000003', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 2, 1), -- Hizmetler
('dd010004-4004-4004-8004-dd0000000004', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 3, 1), -- Galeri
('dd010005-4005-4005-8005-dd0000000005', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 4, 1), -- Hakkımızda
('dd010006-4006-4006-8006-dd0000000006', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 5, 1), -- İletişim
('dd010007-4007-4007-8007-dd0000000007', NULL, 'header', NULL, 'bereketfide', 'custom', NULL, NULL, 6, 1), -- Teklif Al

-- =============================================================
-- 2) PARENT (menu_items) — FOOTER
-- =============================================================

-- FOOTER: HIZLI ERİŞİM  (section = ee010001)
('dd030001-4001-4001-8001-dd0000000001', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 0, 1), -- Ana Sayfa
('dd030002-4002-4002-8002-dd0000000002', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 1, 1), -- Projeler
('dd030003-4003-4003-8003-dd0000000003', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 2, 1), -- Hizmetler
('dd030004-4004-4004-8004-dd0000000004', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 3, 1), -- Galeri
('dd030005-4005-4005-8005-dd0000000005', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 4, 1), -- Hakkımızda
('dd030006-4006-4006-8006-dd0000000006', NULL, 'footer', 'ee010001-4001-4001-8001-ee0000000001', 'bereketfide', 'custom', NULL, NULL, 5, 1), -- İletişim

-- FOOTER: YASAL  (section = ee010002)
('dd040001-4001-4001-8001-dd0000000001', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 0, 1), -- Gizlilik Politikası
('dd040002-4002-4002-8002-dd0000000002', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 1, 1), -- KVKK
('dd040003-4003-4003-8003-dd0000000003', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 2, 1), -- Kullanım Koşulları
('dd040004-4004-4004-8004-dd0000000004', NULL, 'footer', 'ee010002-4002-4002-8002-ee0000000002', 'bereketfide', 'custom', NULL, NULL, 3, 1), -- Çerez Politikası

-- FOOTER: SOSYAL  (section = ee010003)
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
-- 3) I18N — TR
-- =============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
-- HEADER
(UUID(), 'dd010001-4001-4001-8001-dd0000000001', 'tr', 'Ana Sayfa', '/', NOW(3), NOW(3)),
(UUID(), 'dd010002-4002-4002-8002-dd0000000002', 'tr', 'Ürünler', '/urunler', NOW(3), NOW(3)),
(UUID(), 'dd010003-4003-4003-8003-dd0000000003', 'tr', 'Bilgi Bankası', '/bilgi-bankasi', NOW(3), NOW(3)),
(UUID(), 'dd010004-4004-4004-8004-dd0000000004', 'tr', 'Galeri', '/galeri', NOW(3), NOW(3)),
(UUID(), 'dd010005-4005-4005-8005-dd0000000005', 'tr', 'Kurumsal', '/hakkimizda', NOW(3), NOW(3)),
(UUID(), 'dd010006-4006-4006-8006-dd0000000006', 'tr', 'İletişim', '/iletisim', NOW(3), NOW(3)),
(UUID(), 'dd010007-4007-4007-8007-dd0000000007', 'tr', 'Teklif Al', '/teklif', NOW(3), NOW(3)),

-- FOOTER: HIZLI ERİŞİM
(UUID(), 'dd030001-4001-4001-8001-dd0000000001', 'tr', 'Ana Sayfa', '/', NOW(3), NOW(3)),
(UUID(), 'dd030002-4002-4002-8002-dd0000000002', 'tr', 'Ürünler', '/urunler', NOW(3), NOW(3)),
(UUID(), 'dd030003-4003-4003-8003-dd0000000003', 'tr', 'Bilgi Bankası', '/bilgi-bankasi', NOW(3), NOW(3)),
(UUID(), 'dd030004-4004-4004-8004-dd0000000004', 'tr', 'Galeri', '/galeri', NOW(3), NOW(3)),
(UUID(), 'dd030005-4005-4005-8005-dd0000000005', 'tr', 'Kurumsal', '/hakkimizda', NOW(3), NOW(3)),
(UUID(), 'dd030006-4006-4006-8006-dd0000000006', 'tr', 'İletişim', '/iletisim', NOW(3), NOW(3)),

-- FOOTER: YASAL
(UUID(), 'dd040001-4001-4001-8001-dd0000000001', 'tr', 'Gizlilik Politikası', '/legal/gizlilik-politikasi', NOW(3), NOW(3)),
(UUID(), 'dd040002-4002-4002-8002-dd0000000002', 'tr', 'KVKK', '/legal/kvkk', NOW(3), NOW(3)),
(UUID(), 'dd040003-4003-4003-8003-dd0000000003', 'tr', 'Kullanım Koşulları', '/legal/kullanim-kosullari', NOW(3), NOW(3)),
(UUID(), 'dd040004-4004-4004-8004-dd0000000004', 'tr', 'Çerez Politikası', '/legal/cerez-politikasi', NOW(3), NOW(3)),

-- FOOTER: SOSYAL
(UUID(), 'dd050001-4001-4001-8001-dd0000000001', 'tr', 'Instagram', 'https://www.instagram.com/bereketfide', NOW(3), NOW(3)),
(UUID(), 'dd050002-4002-4002-8002-dd0000000002', 'tr', 'LinkedIn', 'https://www.linkedin.com/company/bereketfide', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `url`        = VALUES(`url`),
  `updated_at` = CURRENT_TIMESTAMP(3);

-- =============================================================
-- 4) I18N — EN
-- =============================================================
INSERT INTO `menu_items_i18n`
(`id`, `menu_item_id`, `locale`, `title`, `url`, `created_at`, `updated_at`)
VALUES
-- HEADER
(UUID(), 'dd010001-4001-4001-8001-dd0000000001', 'en', 'Home', '/', NOW(3), NOW(3)),
(UUID(), 'dd010002-4002-4002-8002-dd0000000002', 'en', 'Products', '/products', NOW(3), NOW(3)),
(UUID(), 'dd010003-4003-4003-8003-dd0000000003', 'en', 'Knowledge Base', '/knowledge-base', NOW(3), NOW(3)),
(UUID(), 'dd010004-4004-4004-8004-dd0000000004', 'en', 'Gallery', '/gallery', NOW(3), NOW(3)),
(UUID(), 'dd010005-4005-4005-8005-dd0000000005', 'en', 'Corporate', '/about-us', NOW(3), NOW(3)),
(UUID(), 'dd010006-4006-4006-8006-dd0000000006', 'en', 'Contact', '/contact', NOW(3), NOW(3)),
(UUID(), 'dd010007-4007-4007-8007-dd0000000007', 'en', 'Request Quote', '/quote', NOW(3), NOW(3)),

-- FOOTER: QUICK ACCESS
(UUID(), 'dd030001-4001-4001-8001-dd0000000001', 'en', 'Home', '/', NOW(3), NOW(3)),
(UUID(), 'dd030002-4002-4002-8002-dd0000000002', 'en', 'Products', '/products', NOW(3), NOW(3)),
(UUID(), 'dd030003-4003-4003-8003-dd0000000003', 'en', 'Knowledge Base', '/knowledge-base', NOW(3), NOW(3)),
(UUID(), 'dd030004-4004-4004-8004-dd0000000004', 'en', 'Gallery', '/gallery', NOW(3), NOW(3)),
(UUID(), 'dd030005-4005-4005-8005-dd0000000005', 'en', 'Corporate', '/about-us', NOW(3), NOW(3)),
(UUID(), 'dd030006-4006-4006-8006-dd0000000006', 'en', 'Contact', '/contact', NOW(3), NOW(3)),

-- FOOTER: LEGAL
(UUID(), 'dd040001-4001-4001-8001-dd0000000001', 'en', 'Privacy Policy', '/legal/privacy-policy', NOW(3), NOW(3)),
(UUID(), 'dd040002-4002-4002-8002-dd0000000002', 'en', 'Data Protection (KVKK)', '/legal/pdpl-kvkk', NOW(3), NOW(3)),
(UUID(), 'dd040003-4003-4003-8003-dd0000000003', 'en', 'Terms of Use', '/legal/terms-of-use', NOW(3), NOW(3)),
(UUID(), 'dd040004-4004-4004-8004-dd0000000004', 'en', 'Cookie Policy', '/legal/cookie-policy', NOW(3), NOW(3)),

-- FOOTER: SOCIAL
(UUID(), 'dd050001-4001-4001-8001-dd0000000001', 'en', 'Instagram', 'https://www.instagram.com/bereketfide', NOW(3), NOW(3)),
(UUID(), 'dd050002-4002-4002-8002-dd0000000002', 'en', 'LinkedIn', 'https://www.linkedin.com/company/bereketfide', NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `title`      = VALUES(`title`),
  `url`        = VALUES(`url`),
  `updated_at` = CURRENT_TIMESTAMP(3);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
