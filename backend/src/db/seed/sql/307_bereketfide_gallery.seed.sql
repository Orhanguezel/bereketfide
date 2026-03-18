-- =============================================================
-- FILE: 307_bereketfide_gallery.seed.sql
-- Bereket Fide — Örnek galeri verileri (TR/EN)
-- module_key = 'bereketfide'
-- source_type = 'project'
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `galleries`
(
  `id`,
  `module_key`,
  `source_id`,
  `source_type`,
  `is_active`,
  `is_featured`,
  `display_order`
)
VALUES
  ('kg010001-8001-4001-9001-eeeeeeee0001', 'bereketfide', 'kd010001-7001-4001-9001-dddddddd0001', 'project', 1, 1, 10),
  ('kg010002-8002-4002-9002-eeeeeeee0002', 'bereketfide', 'kd010002-7002-4002-9002-dddddddd0002', 'project', 1, 1, 20),
  ('kg010003-8003-4003-9003-eeeeeeee0003', 'bereketfide', 'kd010003-7003-4003-9003-dddddddd0003', 'project', 1, 0, 30)
ON DUPLICATE KEY UPDATE
  `module_key` = VALUES(`module_key`),
  `source_id` = VALUES(`source_id`),
  `source_type` = VALUES(`source_type`),
  `is_active` = VALUES(`is_active`),
  `is_featured` = VALUES(`is_featured`),
  `display_order` = VALUES(`display_order`);

INSERT INTO `gallery_i18n`
(
  `gallery_id`,
  `locale`,
  `title`,
  `slug`,
  `description`,
  `meta_title`,
  `meta_description`
)
VALUES
  -- Galeri 1 — Boğaz Rezidans (TR/EN)
  ('kg010001-8001-4001-9001-eeeeeeee0001', 'tr',
   'Boğaz Manzaralı Rezidans — Yapım Süreci Galerisi',
   'bogaz-manzarali-rezidans-yapim-galerisi',
   'Boğaz Manzaralı Rezidans projesinin temel, betonarme, dış cephe ve peyzaj aşamalarını belgeleyen yapım süreci fotoğrafları.',
   'Boğaz Manzaralı Rezidans Yapım Galerisi | Bereket Fide',
   'Boğaz Manzaralı Rezidans projesinin yapım süreci fotoğrafları. Temel, betonarme ve cephe aşamaları.'),
  ('kg010001-8001-4001-9001-eeeeeeee0001', 'en',
   'Bosphorus View Residences — Construction Progress Gallery',
   'bosphorus-view-residences-construction-gallery',
   'Construction progress photographs documenting the foundation, structural frame, facade, and landscaping phases of the Bosphorus View Residences project.',
   'Bosphorus View Residences Construction Gallery | Bereket Fide',
   'Construction progress gallery for Bosphorus View Residences. Foundation, frame, and facade phases documented.'),
  -- Galeri 2 — Levent Ofis (TR/EN)
  ('kg010002-8002-4002-9002-eeeeeeee0002', 'tr',
   'Levent Ofis Kulesi — İnşaat ve Cephe Galerisi',
   'levent-ofis-kulesi-insaat-galerisi',
   'Levent Ofis Kulesi''nin çelik strüktür montajı, curtain wall giydirme ve ortak alan bitişini belgeleyen galeri.',
   'Levent Ofis Kulesi İnşaat Galerisi | Bereket Fide',
   'Levent Ofis Kulesi çelik montaj, curtain wall ve iç bitişi yapım süreci fotoğrafları.'),
  ('kg010002-8002-4002-9002-eeeeeeee0002', 'en',
   'Levent Office Tower — Construction & Facade Gallery',
   'levent-office-tower-construction-gallery',
   'Gallery documenting steel structure erection, curtain wall installation, and common area finishing for the Levent Office Tower project.',
   'Levent Office Tower Construction Gallery | Bereket Fide',
   'Steel erection, curtain wall, and interior finishing construction photos for Levent Office Tower.'),
  -- Galeri 3 — Kadıköy Karma (TR/EN)
  ('kg010003-8003-4003-9003-eeeeeeee0003', 'tr',
   'Kadıköy Karma Yapı Kompleksi — Yapım Galerisi',
   'kadikoy-karma-yapi-galerisi',
   'Kadıköy Karma Yapı Kompleksi''nin betonarme iskelet, cephe ve iç mekân bitişini belgeleyen fotoğraf serisi.',
   'Kadıköy Karma Yapı Kompleksi Yapım Galerisi | Bereket Fide',
   'Kadıköy Karma Yapı Kompleksi yapım süreci galerisi. Betonarme, cephe ve iç mekân aşamaları.'),
  ('kg010003-8003-4003-9003-eeeeeeee0003', 'en',
   'Kadıköy Mixed-Use Complex — Construction Gallery',
   'kadikoy-mixed-use-construction-gallery',
   'Photo series documenting the reinforced concrete frame, facade system, and interior finishing of the Kadıköy Mixed-Use Complex.',
   'Kadıköy Mixed-Use Complex Construction Gallery | Bereket Fide',
   'Construction gallery for Kadıköy Mixed-Use Complex. RC frame, facade, and interior finishing phases.')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `slug` = VALUES(`slug`),
  `description` = VALUES(`description`),
  `meta_title` = VALUES(`meta_title`),
  `meta_description` = VALUES(`meta_description`);

-- =========================
-- GALLERY 1: Boğaz Manzaralı Rezidans — images 1-20
-- =========================
INSERT INTO `gallery_images`
(`id`, `gallery_id`, `storage_asset_id`, `image_url`, `display_order`, `is_cover`)
VALUES
  ('gi-g1-0001', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0001-0001-0001-000000000001', '/uploads/projects/vista-insaat-proje-01.jpeg', 1, 1),
  ('gi-g1-0002', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0002-0002-0002-000000000002', '/uploads/projects/vista-insaat-proje-02.jpeg', 2, 0),
  ('gi-g1-0003', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0003-0003-0003-000000000003', '/uploads/projects/vista-insaat-proje-03.jpeg', 3, 0),
  ('gi-g1-0004', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0004-0004-0004-000000000004', '/uploads/projects/vista-insaat-proje-04.jpeg', 4, 0),
  ('gi-g1-0005', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0005-0005-0005-000000000005', '/uploads/projects/vista-insaat-proje-05.jpeg', 5, 0),
  ('gi-g1-0006', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0006-0006-0006-000000000006', '/uploads/projects/vista-insaat-proje-06.jpeg', 6, 0),
  ('gi-g1-0007', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0007-0007-0007-000000000007', '/uploads/projects/vista-insaat-proje-07.jpeg', 7, 0),
  ('gi-g1-0008', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0008-0008-0008-000000000008', '/uploads/projects/vista-insaat-proje-08.jpeg', 8, 0),
  ('gi-g1-0009', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0009-0009-0009-000000000009', '/uploads/projects/vista-insaat-proje-09.jpeg', 9, 0),
  ('gi-g1-0010', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0010-0010-0010-000000000010', '/uploads/projects/vista-insaat-proje-10.jpeg', 10, 0),
  ('gi-g1-0011', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0011-0011-0011-000000000011', '/uploads/projects/vista-insaat-proje-11.jpeg', 11, 0),
  ('gi-g1-0012', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0012-0012-0012-000000000012', '/uploads/projects/vista-insaat-proje-12.jpeg', 12, 0),
  ('gi-g1-0013', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0013-0013-0013-000000000013', '/uploads/projects/vista-insaat-proje-13.jpeg', 13, 0),
  ('gi-g1-0014', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0014-0014-0014-000000000014', '/uploads/projects/vista-insaat-proje-14.jpeg', 14, 0),
  ('gi-g1-0015', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0015-0015-0015-000000000015', '/uploads/projects/vista-insaat-proje-15.jpeg', 15, 0),
  ('gi-g1-0016', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0016-0016-0016-000000000016', '/uploads/projects/vista-insaat-proje-16.jpeg', 16, 0),
  ('gi-g1-0017', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0017-0017-0017-000000000017', '/uploads/projects/vista-insaat-proje-17.jpeg', 17, 0),
  ('gi-g1-0018', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0018-0018-0018-000000000018', '/uploads/projects/vista-insaat-proje-18.jpeg', 18, 0),
  ('gi-g1-0019', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0019-0019-0019-000000000019', '/uploads/projects/vista-insaat-proje-19.jpeg', 19, 0),
  ('gi-g1-0020', 'kg010001-8001-4001-9001-eeeeeeee0001', 'sa-prj-0020-0020-0020-000000000020', '/uploads/projects/vista-insaat-proje-20.jpeg', 20, 0)
ON DUPLICATE KEY UPDATE
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `image_url` = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover` = VALUES(`is_cover`);

-- =========================
-- GALLERY 2: Levent Ofis Kulesi — images 21-40
-- =========================
INSERT INTO `gallery_images`
(`id`, `gallery_id`, `storage_asset_id`, `image_url`, `display_order`, `is_cover`)
VALUES
  ('gi-g2-0001', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0021-0021-0021-000000000021', '/uploads/projects/vista-insaat-proje-21.jpeg', 1, 1),
  ('gi-g2-0002', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0022-0022-0022-000000000022', '/uploads/projects/vista-insaat-proje-22.jpeg', 2, 0),
  ('gi-g2-0003', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0023-0023-0023-000000000023', '/uploads/projects/vista-insaat-proje-23.jpeg', 3, 0),
  ('gi-g2-0004', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0024-0024-0024-000000000024', '/uploads/projects/vista-insaat-proje-24.jpeg', 4, 0),
  ('gi-g2-0005', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0025-0025-0025-000000000025', '/uploads/projects/vista-insaat-proje-25.jpeg', 5, 0),
  ('gi-g2-0006', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0026-0026-0026-000000000026', '/uploads/projects/vista-insaat-proje-26.jpeg', 6, 0),
  ('gi-g2-0007', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0027-0027-0027-000000000027', '/uploads/projects/vista-insaat-proje-27.jpeg', 7, 0),
  ('gi-g2-0008', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0028-0028-0028-000000000028', '/uploads/projects/vista-insaat-proje-28.jpeg', 8, 0),
  ('gi-g2-0009', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0029-0029-0029-000000000029', '/uploads/projects/vista-insaat-proje-29.jpeg', 9, 0),
  ('gi-g2-0010', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0030-0030-0030-000000000030', '/uploads/projects/vista-insaat-proje-30.jpeg', 10, 0),
  ('gi-g2-0011', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0031-0031-0031-000000000031', '/uploads/projects/vista-insaat-proje-31.jpeg', 11, 0),
  ('gi-g2-0012', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0032-0032-0032-000000000032', '/uploads/projects/vista-insaat-proje-32.jpeg', 12, 0),
  ('gi-g2-0013', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0033-0033-0033-000000000033', '/uploads/projects/vista-insaat-proje-33.jpeg', 13, 0),
  ('gi-g2-0014', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0034-0034-0034-000000000034', '/uploads/projects/vista-insaat-proje-34.jpeg', 14, 0),
  ('gi-g2-0015', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0035-0035-0035-000000000035', '/uploads/projects/vista-insaat-proje-35.jpeg', 15, 0),
  ('gi-g2-0016', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0036-0036-0036-000000000036', '/uploads/projects/vista-insaat-proje-36.jpeg', 16, 0),
  ('gi-g2-0017', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0037-0037-0037-000000000037', '/uploads/projects/vista-insaat-proje-37.jpeg', 17, 0),
  ('gi-g2-0018', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0038-0038-0038-000000000038', '/uploads/projects/vista-insaat-proje-38.jpeg', 18, 0),
  ('gi-g2-0019', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0039-0039-0039-000000000039', '/uploads/projects/vista-insaat-proje-39.jpeg', 19, 0),
  ('gi-g2-0020', 'kg010002-8002-4002-9002-eeeeeeee0002', 'sa-prj-0040-0040-0040-000000000040', '/uploads/projects/vista-insaat-proje-40.jpeg', 20, 0)
ON DUPLICATE KEY UPDATE
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `image_url` = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover` = VALUES(`is_cover`);

-- =========================
-- GALLERY 3: Kadıköy Karma Yapı — images 41-58
-- =========================
INSERT INTO `gallery_images`
(`id`, `gallery_id`, `storage_asset_id`, `image_url`, `display_order`, `is_cover`)
VALUES
  ('gi-g3-0001', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0041-0041-0041-000000000041', '/uploads/projects/vista-insaat-proje-41.jpeg', 1, 1),
  ('gi-g3-0002', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0042-0042-0042-000000000042', '/uploads/projects/vista-insaat-proje-42.jpeg', 2, 0),
  ('gi-g3-0003', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0043-0043-0043-000000000043', '/uploads/projects/vista-insaat-proje-43.jpeg', 3, 0),
  ('gi-g3-0004', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0044-0044-0044-000000000044', '/uploads/projects/vista-insaat-proje-44.jpeg', 4, 0),
  ('gi-g3-0005', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0045-0045-0045-000000000045', '/uploads/projects/vista-insaat-proje-45.jpeg', 5, 0),
  ('gi-g3-0006', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0046-0046-0046-000000000046', '/uploads/projects/vista-insaat-proje-46.jpeg', 6, 0),
  ('gi-g3-0007', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0047-0047-0047-000000000047', '/uploads/projects/vista-insaat-proje-47.jpeg', 7, 0),
  ('gi-g3-0008', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0048-0048-0048-000000000048', '/uploads/projects/vista-insaat-proje-48.jpeg', 8, 0),
  ('gi-g3-0009', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0049-0049-0049-000000000049', '/uploads/projects/vista-insaat-proje-49.jpeg', 9, 0),
  ('gi-g3-0010', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0050-0050-0050-000000000050', '/uploads/projects/vista-insaat-proje-50.jpeg', 10, 0),
  ('gi-g3-0011', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0051-0051-0051-000000000051', '/uploads/projects/vista-insaat-proje-51.jpeg', 11, 0),
  ('gi-g3-0012', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0052-0052-0052-000000000052', '/uploads/projects/vista-insaat-proje-52.jpeg', 12, 0),
  ('gi-g3-0013', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0053-0053-0053-000000000053', '/uploads/projects/vista-insaat-proje-53.jpeg', 13, 0),
  ('gi-g3-0014', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0054-0054-0054-000000000054', '/uploads/projects/vista-insaat-proje-54.jpeg', 14, 0),
  ('gi-g3-0015', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0055-0055-0055-000000000055', '/uploads/projects/vista-insaat-proje-55.jpeg', 15, 0),
  ('gi-g3-0016', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0056-0056-0056-000000000056', '/uploads/projects/vista-insaat-proje-56.jpeg', 16, 0),
  ('gi-g3-0017', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0057-0057-0057-000000000057', '/uploads/projects/vista-insaat-proje-57.jpeg', 17, 0),
  ('gi-g3-0018', 'kg010003-8003-4003-9003-eeeeeeee0003', 'sa-prj-0058-0058-0058-000000000058', '/uploads/projects/vista-insaat-proje-58.jpeg', 18, 0)
ON DUPLICATE KEY UPDATE
  `storage_asset_id` = VALUES(`storage_asset_id`),
  `image_url` = VALUES(`image_url`),
  `display_order` = VALUES(`display_order`),
  `is_cover` = VALUES(`is_cover`);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
