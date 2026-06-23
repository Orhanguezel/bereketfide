-- Güvenli envanter-resim eşleşmeleri
-- Önce tablo yoksa oluşturur, sonra sadece güvenli eşleşmeleri upsert eder.
CREATE TABLE IF NOT EXISTS inventory_image_map (
  malzeme_kodu VARCHAR(20) NOT NULL PRIMARY KEY,
  front_image_path VARCHAR(255) NOT NULL,
  back_image_path VARCHAR(255) NOT NULL,
  image_pair_no VARCHAR(10) NOT NULL,
  confidence ENUM('guvenli','manuel_kontrol') NOT NULL DEFAULT 'guvenli',
  note TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO inventory_image_map (malzeme_kodu, front_image_path, back_image_path, image_pair_no, confidence, note) VALUES
('TŞ00057', 'duzeltilmis_resimler/urun-01-on.jpg', 'duzeltilmis_resimler/urun-01-arka.jpg', '01', 'guvenli', 'GÜLPEMBE DOMATES TOHUMU'),
('TŞ00455', 'duzeltilmis_resimler/urun-02-on.jpg', 'duzeltilmis_resimler/urun-02-arka.jpg', '02', 'guvenli', 'ROUGINA RZ F1 (74-511) DOMATES TOHUMU'),
('TŞ00643', 'duzeltilmis_resimler/urun-04-on.jpg', 'duzeltilmis_resimler/urun-04-arka.jpg', '04', 'guvenli', 'BAMBUS DOMATES TOHUMU'),
('TŞ00373', 'duzeltilmis_resimler/urun-07-on.jpg', 'duzeltilmis_resimler/urun-07-arka.jpg', '07', 'guvenli', 'KANYON BİBER TOHUMU'),
('TŞ00822', 'duzeltilmis_resimler/urun-11-on.jpg', 'duzeltilmis_resimler/urun-11-arka.jpg', '11', 'guvenli', 'RAPTOR DOMATES TOHUMU'),
('TŞ00862', 'duzeltilmis_resimler/urun-19-on.jpg', 'duzeltilmis_resimler/urun-19-arka.jpg', '19', 'guvenli', 'ERSOY DOMATES TOHUMU'),
('TŞ00824', 'duzeltilmis_resimler/urun-20-on.jpg', 'duzeltilmis_resimler/urun-20-arka.jpg', '20', 'guvenli', 'MONABELL DOMATES TOHUMU'),
('TŞ00363', 'duzeltilmis_resimler/urun-21-on.jpg', 'duzeltilmis_resimler/urun-21-arka.jpg', '21', 'guvenli', 'VEYRON DOMATES TOHUMU'),
('TŞ00502', 'duzeltilmis_resimler/urun-22-on.jpg', 'duzeltilmis_resimler/urun-22-arka.jpg', '22', 'guvenli', 'KANUNİ DOMATES TOHUMU'),
('TŞ00985', 'duzeltilmis_resimler/urun-24-on.jpg', 'duzeltilmis_resimler/urun-24-arka.jpg', '24', 'guvenli', 'DOLUNAY  DOMATES TOHUMU'),
('TŞ00056', 'duzeltilmis_resimler/urun-29-on.jpg', 'duzeltilmis_resimler/urun-29-arka.jpg', '29', 'guvenli', 'LAPÇİN DOMATES TOHUMU'),
('TŞ00546', 'duzeltilmis_resimler/urun-30-on.jpg', 'duzeltilmis_resimler/urun-30-arka.jpg', '30', 'guvenli', 'UG 464913 DOMATES TOHUMU'),
('TŞ00912', 'duzeltilmis_resimler/urun-31-on.jpg', 'duzeltilmis_resimler/urun-31-arka.jpg', '31', 'guvenli', 'LEROTA DOMATES TOHUMU'),
('TŞ00152', 'duzeltilmis_resimler/urun-33-on.jpg', 'duzeltilmis_resimler/urun-33-arka.jpg', '33', 'guvenli', 'ZÜMRA KAVUN TOHUMU'),
('TŞ01006', 'duzeltilmis_resimler/urun-41-on.jpg', 'duzeltilmis_resimler/urun-41-arka.jpg', '41', 'guvenli', 'FULLCİN  BİBER TOHUMU')
ON DUPLICATE KEY UPDATE front_image_path=VALUES(front_image_path), back_image_path=VALUES(back_image_path), image_pair_no=VALUES(image_pair_no), confidence=VALUES(confidence), note=VALUES(note);
