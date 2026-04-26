-- =============================================================
-- FILE: 328_extra_seedlings_schema.sql
-- Bereket Fide - Ekstra fide firsat stoklari
-- =============================================================

CREATE TABLE IF NOT EXISTS extra_seedlings (
  id                 CHAR(36) NOT NULL PRIMARY KEY,
  category           VARCHAR(60) NOT NULL,
  product_name       VARCHAR(255) NOT NULL,
  tray_type          SMALLINT UNSIGNED NOT NULL,
  quantity           INT UNSIGNED NOT NULL DEFAULT 0,
  available_on       DATE NULL,
  availability_label VARCHAR(80) NULL,
  status             ENUM('draft','published','reserved','sold_out','archived') NOT NULL DEFAULT 'draft',
  image_url          VARCHAR(500) NULL,
  note               TEXT NULL,
  source_date        DATE NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_extra_seedlings_status (status),
  KEY idx_extra_seedlings_category (category),
  KEY idx_extra_seedlings_available_on (available_on),
  KEY idx_extra_seedlings_tray_type (tray_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS extra_seedling_requests (
  id                 CHAR(36) NOT NULL PRIMARY KEY,
  extra_seedling_id  CHAR(36) NOT NULL,
  dealer_user_id     CHAR(36) NULL,
  dealer_name        VARCHAR(255) NULL,
  dealer_phone       VARCHAR(50) NULL,
  requested_quantity INT UNSIGNED NOT NULL,
  note               TEXT NULL,
  status             ENUM('new','contacted','approved','rejected','cancelled') NOT NULL DEFAULT 'new',
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_extra_requests_extra (extra_seedling_id),
  KEY idx_extra_requests_status (status),
  KEY idx_extra_requests_dealer (dealer_user_id),
  CONSTRAINT fk_extra_requests_seedling
    FOREIGN KEY (extra_seedling_id) REFERENCES extra_seedlings(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
