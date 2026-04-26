-- =============================================================
-- FILE: 327_inventory_image_map.seed.sql
-- Bereket Fide - Inventory rows to storage-backed package images
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

INSERT INTO `inventory_image_map`
(`malzeme_kodu`, `front_asset_id`, `back_asset_id`, `front_image_path`, `back_image_path`, `image_pair_no`, `confidence`, `note`)
VALUES
  ('TŞ00057', 'bf-inv-seed-img-0002', 'bf-inv-seed-img-0001', '/uploads/inventory-seeds/urun-01-on.jpg', '/uploads/inventory-seeds/urun-01-arka.jpg', '01', 'guvenli', 'GÜLPEMBE DOMATES TOHUMU'),
  ('TŞ00455', 'bf-inv-seed-img-0004', 'bf-inv-seed-img-0003', '/uploads/inventory-seeds/urun-02-on.jpg', '/uploads/inventory-seeds/urun-02-arka.jpg', '02', 'guvenli', 'ROUGINA RZ F1 (74-511) DOMATES TOHUMU'),
  ('TŞ00643', 'bf-inv-seed-img-0008', 'bf-inv-seed-img-0007', '/uploads/inventory-seeds/urun-04-on.jpg', '/uploads/inventory-seeds/urun-04-arka.jpg', '04', 'guvenli', 'BAMBUS DOMATES TOHUMU'),
  ('TŞ00373', 'bf-inv-seed-img-0014', 'bf-inv-seed-img-0013', '/uploads/inventory-seeds/urun-07-on.jpg', '/uploads/inventory-seeds/urun-07-arka.jpg', '07', 'guvenli', 'KANYON BİBER TOHUMU'),
  ('TŞ00822', 'bf-inv-seed-img-0022', 'bf-inv-seed-img-0021', '/uploads/inventory-seeds/urun-11-on.jpg', '/uploads/inventory-seeds/urun-11-arka.jpg', '11', 'guvenli', 'RAPTOR DOMATES TOHUMU'),
  ('TŞ00862', 'bf-inv-seed-img-0038', 'bf-inv-seed-img-0037', '/uploads/inventory-seeds/urun-19-on.jpg', '/uploads/inventory-seeds/urun-19-arka.jpg', '19', 'guvenli', 'ERSOY DOMATES TOHUMU'),
  ('TŞ00824', 'bf-inv-seed-img-0040', 'bf-inv-seed-img-0039', '/uploads/inventory-seeds/urun-20-on.jpg', '/uploads/inventory-seeds/urun-20-arka.jpg', '20', 'guvenli', 'MONABELL DOMATES TOHUMU'),
  ('TŞ00363', 'bf-inv-seed-img-0042', 'bf-inv-seed-img-0041', '/uploads/inventory-seeds/urun-21-on.jpg', '/uploads/inventory-seeds/urun-21-arka.jpg', '21', 'guvenli', 'VEYRON DOMATES TOHUMU'),
  ('TŞ00502', 'bf-inv-seed-img-0044', 'bf-inv-seed-img-0043', '/uploads/inventory-seeds/urun-22-on.jpg', '/uploads/inventory-seeds/urun-22-arka.jpg', '22', 'guvenli', 'KANUNİ DOMATES TOHUMU'),
  ('TŞ00985', 'bf-inv-seed-img-0048', 'bf-inv-seed-img-0047', '/uploads/inventory-seeds/urun-24-on.jpg', '/uploads/inventory-seeds/urun-24-arka.jpg', '24', 'guvenli', 'DOLUNAY DOMATES TOHUMU'),
  ('TŞ00056', 'bf-inv-seed-img-0058', 'bf-inv-seed-img-0057', '/uploads/inventory-seeds/urun-29-on.jpg', '/uploads/inventory-seeds/urun-29-arka.jpg', '29', 'guvenli', 'LAPÇİN DOMATES TOHUMU'),
  ('TŞ00546', 'bf-inv-seed-img-0060', 'bf-inv-seed-img-0059', '/uploads/inventory-seeds/urun-30-on.jpg', '/uploads/inventory-seeds/urun-30-arka.jpg', '30', 'guvenli', 'UG 464913 DOMATES TOHUMU'),
  ('TŞ00912', 'bf-inv-seed-img-0062', 'bf-inv-seed-img-0061', '/uploads/inventory-seeds/urun-31-on.jpg', '/uploads/inventory-seeds/urun-31-arka.jpg', '31', 'guvenli', 'LEROTA DOMATES TOHUMU'),
  ('TŞ00152', 'bf-inv-seed-img-0066', 'bf-inv-seed-img-0065', '/uploads/inventory-seeds/urun-33-on.jpg', '/uploads/inventory-seeds/urun-33-arka.jpg', '33', 'guvenli', 'ZÜMRA KAVUN TOHUMU'),
  ('TŞ01006', 'bf-inv-seed-img-0082', 'bf-inv-seed-img-0081', '/uploads/inventory-seeds/urun-41-on.jpg', '/uploads/inventory-seeds/urun-41-arka.jpg', '41', 'guvenli', 'FULLCİN BİBER TOHUMU'),
  ('TŞ00872', 'bf-inv-seed-img-0012', 'bf-inv-seed-img-0011', '/uploads/inventory-seeds/urun-06-on.jpg', '/uploads/inventory-seeds/urun-06-arka.jpg', '06', 'manuel_kontrol', 'SHERVİNA DOMATES TOHUMU - fotoğraftaki HTP Tomatoes 10-686 SH F1 etiketi manuel kontrol edilmeli'),
  ('TŞ00927', 'bf-inv-seed-img-0068', 'bf-inv-seed-img-0067', '/uploads/inventory-seeds/urun-34-on.jpg', '/uploads/inventory-seeds/urun-34-arka.jpg', '34', 'manuel_kontrol', 'KUZU KAVUN TOHUMU - fotoğraf listesinde tür Soğan yazdığı için manuel kontrol edilmeli'),
  ('TŞ00708', 'bf-inv-seed-img-0084', 'bf-inv-seed-img-0083', '/uploads/inventory-seeds/urun-42-on.jpg', '/uploads/inventory-seeds/urun-42-arka.jpg', '42', 'manuel_kontrol', 'BEYONSE BİBER TOHUMU - fotoğraf listesinde tür Fasulye yazdığı için manuel kontrol edilmeli'),
  ('TY00815', 'bf-inv-seed-img-0086', 'bf-inv-seed-img-0085', '/uploads/inventory-seeds/urun-43-on.jpg', '/uploads/inventory-seeds/urun-43-arka.jpg', '43', 'manuel_kontrol', 'VEGASTAR KARPUZ TOHUMU - fotoğraf listesinde tür Hıyar yazdığı için manuel kontrol edilmeli')
ON DUPLICATE KEY UPDATE
  front_asset_id = VALUES(front_asset_id),
  back_asset_id = VALUES(back_asset_id),
  front_image_path = VALUES(front_image_path),
  back_image_path = VALUES(back_image_path),
  image_pair_no = VALUES(image_pair_no),
  confidence = VALUES(confidence),
  note = VALUES(note);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
