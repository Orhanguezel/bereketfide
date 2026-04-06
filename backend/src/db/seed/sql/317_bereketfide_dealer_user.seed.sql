-- Örnek bayi kullanıcı (Bayi Girişi /bayi-girisi)
-- E-posta: bayi@example.com
-- Şifre: BAYI_PASSWORD (env) → yoksa ADMIN_PASSWORD → yoksa seed varsayılanı admin123
-- Hash: {{BAYI_PASSWORD_HASH}} (db/seed/index.ts bcrypt 12)
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @BAYI_ID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
SET @BAYI_EMAIL := 'bayi@example.com';

INSERT INTO `users` (
  `id`, `email`, `password_hash`, `full_name`, `phone`, `role`, `is_active`, `email_verified`, `created_at`, `updated_at`
) VALUES (
  @BAYI_ID,
  @BAYI_EMAIL,
  '{{BAYI_PASSWORD_HASH}}',
  'Test Bayi',
  NULL,
  'user',
  1,
  1,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  `password_hash` = VALUES(`password_hash`),
  `full_name` = VALUES(`full_name`),
  `is_active` = VALUES(`is_active`);

INSERT INTO `user_roles` (`id`, `user_id`, `role`, `created_at`)
VALUES (UUID(), @BAYI_ID, 'dealer', CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE `role` = VALUES(`role`);

INSERT INTO `dealer_profiles` (
  `id`, `user_id`, `company_name`, `city`, `region`, `tax_number`, `tax_office`,
  `credit_limit`, `risk_limit`, `current_balance`, `discount_rate`, `is_approved`, `list_public`, `created_at`, `updated_at`
)
SELECT
  UUID(),
  u.id,
  'Test Bayi Ltd.',
  'Antalya',
  'Akdeniz',
  '1234567890',
  'Antalya VD',
  50000.00,
  0.00,
  0.00,
  10.00,
  1,
  0,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
FROM `users` u
WHERE u.email = @BAYI_EMAIL
ON DUPLICATE KEY UPDATE
  `company_name` = VALUES(`company_name`),
  `credit_limit` = VALUES(`credit_limit`),
  `discount_rate` = VALUES(`discount_rate`),
  `is_approved` = VALUES(`is_approved`);
