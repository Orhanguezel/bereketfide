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
