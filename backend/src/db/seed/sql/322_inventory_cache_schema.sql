-- =============================================================
-- FILE: 322_inventory_cache_schema.sql
-- Bereket Fide – Harici Envanter Cache (ScriptCase senkronizasyonu)
-- Kaynak: http://88.250.38.79:8092/Envanter/
-- =============================================================

CREATE TABLE IF NOT EXISTS inventory_cache (
  malzeme_kodu     VARCHAR(20)    NOT NULL PRIMARY KEY,
  malzeme_adi      VARCHAR(255)   NOT NULL DEFAULT '',
  ozel_kodu        VARCHAR(100)   NULL,
  devir            INT            NOT NULL DEFAULT 0,
  devir_tutari     DECIMAL(15,2)  NOT NULL DEFAULT 0,
  girisler         INT            NOT NULL DEFAULT 0,
  girisler_tutari  DECIMAL(15,2)  NOT NULL DEFAULT 0,
  cikislar         INT            NOT NULL DEFAULT 0,
  cikislar_tutari  DECIMAL(15,2)  NOT NULL DEFAULT 0,
  envanter_miktari INT            NOT NULL DEFAULT 0,
  ortalama_fiyat   DECIMAL(15,4)  NOT NULL DEFAULT 0,
  envanter_tutari  DECIMAL(15,2)  NOT NULL DEFAULT 0,
  synced_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_sync_log (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT PRIMARY KEY,
  synced_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_rows   INT            NOT NULL DEFAULT 0,
  changed_rows INT            NOT NULL DEFAULT 0,
  new_rows     INT            NOT NULL DEFAULT 0,
  duration_ms  INT            NOT NULL DEFAULT 0,
  status       ENUM('ok','error') NOT NULL DEFAULT 'ok',
  error_msg    TEXT           NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_image_map (
  malzeme_kodu     VARCHAR(20) NOT NULL PRIMARY KEY,
  front_asset_id   CHAR(36)    NULL,
  back_asset_id    CHAR(36)    NULL,
  front_image_path VARCHAR(255) NOT NULL,
  back_image_path  VARCHAR(255) NOT NULL,
  image_pair_no    VARCHAR(10)  NOT NULL,
  manual_price     DECIMAL(15,2) NULL,
  confidence       ENUM('guvenli','manuel_kontrol') NOT NULL DEFAULT 'guvenli',
  note             TEXT NULL,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_inventory_image_confidence (confidence),
  KEY idx_inventory_image_front_asset (front_asset_id),
  KEY idx_inventory_image_back_asset (back_asset_id),
  CONSTRAINT fk_inventory_image_front_asset
    FOREIGN KEY (front_asset_id) REFERENCES storage_assets(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_inventory_image_back_asset
    FOREIGN KEY (back_asset_id) REFERENCES storage_assets(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @inventory_image_map_manual_price_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'inventory_image_map'
    AND COLUMN_NAME = 'manual_price'
);
SET @inventory_image_map_manual_price_sql := IF(
  @inventory_image_map_manual_price_exists = 0,
  'ALTER TABLE inventory_image_map ADD COLUMN manual_price DECIMAL(15,2) NULL AFTER image_pair_no',
  'SELECT 1'
);
PREPARE inventory_image_map_manual_price_stmt FROM @inventory_image_map_manual_price_sql;
EXECUTE inventory_image_map_manual_price_stmt;
DEALLOCATE PREPARE inventory_image_map_manual_price_stmt;
