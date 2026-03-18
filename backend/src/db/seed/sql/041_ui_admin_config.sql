-- =============================================================
-- 041_ui_admin_config.sql – Admin Panel UI config keys
-- =============================================================

SET NAMES utf8mb4;

INSERT INTO `site_settings` (`id`, `key`, `locale`, `value`, `created_at`, `updated_at`)
VALUES
(UUID(), 'bereketfide__ui_admin_config', '*',
 JSON_OBJECT(
   'default_locale', 'tr',
   'theme', JSON_OBJECT('mode','light','preset','default','font','inter'),
   'layout', JSON_OBJECT('sidebar_variant','sidebar','sidebar_collapsible','icon','navbar_style','sticky','content_layout','centered'),
   'branding', JSON_OBJECT(
     'app_name','Bereket Fide Admin Panel',
     'app_copyright','Bereket Fide',
     'meta', JSON_OBJECT(
       'title','Bereket Fide Admin Panel',
       'description','Bereket Fide icin urun, galeri, teklif, blog ve site ayarlarini yoneten admin paneli.',
       'og_title','Bereket Fide Admin Panel',
       'og_description','Bereket Fide urunleri icin icerik ve site ayari yonetim ekrani.'
     )
   )
 ),
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__ui_admin_pages', 'tr',
 JSON_OBJECT(
   'dashboard', JSON_OBJECT('title','Dashboard','description','Genel bakis'),
   'products', JSON_OBJECT('title','Urunler','description','Urun yonetimi'),
   'categories', JSON_OBJECT('title','Kategoriler','description','Kategori yonetimi')
 ),
 NOW(3), NOW(3)),
(UUID(), 'bereketfide__ui_admin_pages', '*',
 JSON_OBJECT('dashboard', JSON_OBJECT('title','Dashboard','description','Overview')),
 NOW(3), NOW(3)),
(UUID(), 'ui_admin_config', '*',
 JSON_OBJECT(
   'default_locale', 'tr',
   'theme', JSON_OBJECT('mode','light','preset','default','font','inter'),
   'layout', JSON_OBJECT('sidebar_variant','sidebar','sidebar_collapsible','icon','navbar_style','sticky','content_layout','centered'),
   'branding', JSON_OBJECT(
     'app_name','Bereket Fide Admin Panel',
     'app_copyright','Bereket Fide',
     'meta', JSON_OBJECT(
       'title','Bereket Fide Admin Panel',
       'description','Bereket Fide icin urun, galeri, teklif, blog ve site ayarlarini yoneten admin paneli.',
       'og_title','Bereket Fide Admin Panel',
       'og_description','Bereket Fide urunleri icin icerik ve site ayari yonetim ekrani.'
     )
   )
 ),
 NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE
  `value`      = VALUES(`value`),
  `updated_at` = VALUES(`updated_at`);
