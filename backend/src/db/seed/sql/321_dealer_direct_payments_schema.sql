SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `dealer_direct_payments` (
  `id`               CHAR(36) NOT NULL,
  `dealer_id`        CHAR(36) NOT NULL,
  `payment_ref`      CHAR(36) NOT NULL,
  `provider`         VARCHAR(32) NOT NULL,
  `status`           ENUM('pending','succeeded','failed','expired') NOT NULL DEFAULT 'pending',
  `amount`           DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `note`             VARCHAR(500) DEFAULT NULL,
  `request_payload`  LONGTEXT DEFAULT NULL,
  `response_payload` LONGTEXT DEFAULT NULL,
  `callback_payload` LONGTEXT DEFAULT NULL,
  `last_error`       VARCHAR(255) DEFAULT NULL,
  `created_at`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at`       DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `dealer_direct_payments_payment_ref_uq` (`payment_ref`),
  KEY `dealer_direct_payments_dealer_id_idx` (`dealer_id`),
  KEY `dealer_direct_payments_status_idx` (`status`),
  KEY `dealer_direct_payments_provider_idx` (`provider`),
  KEY `dealer_direct_payments_created_at_idx` (`created_at`),
  CONSTRAINT `fk_dealer_direct_payments_dealer`
    FOREIGN KEY (`dealer_id`) REFERENCES `dealer_profiles` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
