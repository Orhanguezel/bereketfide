-- Canlı ScriptCase envanteri ile güvenli resim eşleşmeleri
-- Kaynak: http://88.250.38.79:8092/Envanter/
-- Çekim zamanı: 2026-04-26T00:04:16.218Z

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
('TŞ00057', '/uploads/inventory-seeds/urun-01-on.jpg', '/uploads/inventory-seeds/urun-01-arka.jpg', '01', 'guvenli', 'GÜLPEMBE DOMATES TOHUMU'),
('TŞ00455', '/uploads/inventory-seeds/urun-02-on.jpg', '/uploads/inventory-seeds/urun-02-arka.jpg', '02', 'guvenli', 'ROUGINA RZ F1 (74-511) DOMATES TOHUMU'),
('TŞ00373', '/uploads/inventory-seeds/urun-07-on.jpg', '/uploads/inventory-seeds/urun-07-arka.jpg', '07', 'guvenli', 'KANYON BİBER TOHUMU'),
('TŞ00862', '/uploads/inventory-seeds/urun-19-on.jpg', '/uploads/inventory-seeds/urun-19-arka.jpg', '19', 'guvenli', 'ERSOY DOMATES TOHUMU'),
('TŞ00363', '/uploads/inventory-seeds/urun-21-on.jpg', '/uploads/inventory-seeds/urun-21-arka.jpg', '21', 'guvenli', 'VEYRON DOMATES TOHUMU'),
('TŞ00502', '/uploads/inventory-seeds/urun-22-on.jpg', '/uploads/inventory-seeds/urun-22-arka.jpg', '22', 'guvenli', 'KANUNİ DOMATES TOHUMU'),
('TŞ00056', '/uploads/inventory-seeds/urun-29-on.jpg', '/uploads/inventory-seeds/urun-29-arka.jpg', '29', 'guvenli', 'LAPÇİN DOMATES TOHUMU'),
('TŞ00546', '/uploads/inventory-seeds/urun-30-on.jpg', '/uploads/inventory-seeds/urun-30-arka.jpg', '30', 'guvenli', 'UG 464913 DOMATES TOHUMU'),
('TŞ00912', '/uploads/inventory-seeds/urun-31-on.jpg', '/uploads/inventory-seeds/urun-31-arka.jpg', '31', 'guvenli', 'LEROTA DOMATES TOHUMU'),
('TŞ00152', '/uploads/inventory-seeds/urun-33-on.jpg', '/uploads/inventory-seeds/urun-33-arka.jpg', '33', 'guvenli', 'ZÜMRA KAVUN TOHUMU')
ON DUPLICATE KEY UPDATE
  front_image_path=VALUES(front_image_path),
  back_image_path=VALUES(back_image_path),
  image_pair_no=VALUES(image_pair_no),
  confidence=VALUES(confidence),
  note=VALUES(note);
