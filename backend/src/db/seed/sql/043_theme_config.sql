-- =============================================================
-- 043_theme_config.sql – Bereket Fide Theme Config
-- Altın (başak) + Yeşil (fide/doğa) paleti
-- Humintech referans: kurumsal, temiz, ekolojik
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS `theme_config` (
  `id`         CHAR(36)     NOT NULL,
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
  `config`     MEDIUMTEXT   NOT NULL,
  `created_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `theme_config` (`id`, `is_active`, `config`, `created_at`, `updated_at`)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  1,
  CAST(JSON_OBJECT(
    'colors', JSON_OBJECT(
      'primary','#319760',
      'primaryDark','#267a4e',
      'accent','#5cb989',
      'background','#faf9f6',
      'surfaceBase','#f5f2eb',
      'surfaceRaised','#ffffff',
      'surfaceMuted','#f0f9f4',
      'textStrong','#1a1a1a',
      'textBody','#2b2b2b',
      'textMuted','#6d6d6d',
      'border','#d1d1d1',
      'borderLight','#e7e7e7',
      'navBg','#ffffff',
      'navFg','#1a1a1a',
      'footerBg','#2b2b2b',
      'footerFg','#e7e7e7',
      'success','#319760',
      'warning','#d4a843',
      'danger','#c23a2a',
      'surfaceDarkBg','#2b2b2b',
      'surfaceDarkText','#e7e7e7',
      'surfaceDarkHeading','#319760'
    ),
    'typography', JSON_OBJECT(
      'fontHeading','Plus Jakarta Sans, system-ui, sans-serif',
      'fontBody','Inter, system-ui, sans-serif'
    ),
    'radius', '0.375rem',
    'darkMode', 'light',
    'sectionBackgrounds', JSON_ARRAY(
      JSON_OBJECT('key','hero','bg','transparent','overlay','rgba(26,58,14,0.7)'),
      JSON_OBJECT('key','intro','bg','#faf9f6'),
      JSON_OBJECT('key','categories','bg','#f0f5eb'),
      JSON_OBJECT('key','featured_products','bg','#ffffff'),
      JSON_OBJECT('key','services','bg','#1a3a0e','textColor','#ffffff','headingColor','#d4a843'),
      JSON_OBJECT('key','about_numbers','bg','#faf9f6'),
      JSON_OBJECT('key','catalog_references','bg','#f0f5eb'),
      JSON_OBJECT('key','news','bg','#ffffff'),
      JSON_OBJECT('key','contact_cta','bg','#1a3a0e','textColor','#ffffff','headingColor','#d4a843')
    )
  ) AS CHAR CHARACTER SET utf8mb4),
  NOW(3), NOW(3)
)
ON DUPLICATE KEY UPDATE
  `config` = VALUES(`config`),
  `updated_at` = VALUES(`updated_at`);
