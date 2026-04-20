-- =============================================================
-- FILE: 131_bereketfide_storage_assets.seed.sql
-- Bereket Fide — Local Storage Assets (uploads/)
-- =============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================
-- PRODUCT IMAGES
-- =========================
INSERT INTO `storage_assets`
(`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `hash`, `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`, `provider_version`, `etag`, `metadata`, `created_at`, `updated_at`)
VALUES
  ('bf-prd-img-0004', NULL, '23.27.59 (1).jpeg', 'products', 'products/23.27.59 (1).jpeg', 'products', 'image/jpeg', 385060, 800, 800, '/uploads/products/23.27.59 (1).jpeg', NULL, 'local', 'products/23.27.59 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0005', NULL, '23.27.59.jpeg', 'products', 'products/23.27.59.jpeg', 'products', 'image/jpeg', 397190, 800, 800, '/uploads/products/23.27.59.jpeg', NULL, 'local', 'products/23.27.59.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0006', NULL, '23.28.00.jpeg', 'products', 'products/23.28.00.jpeg', 'products', 'image/jpeg', 277119, 800, 800, '/uploads/products/23.28.00.jpeg', NULL, 'local', 'products/23.28.00.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0007', NULL, '23.28.01.jpeg', 'products', 'products/23.28.01.jpeg', 'products', 'image/jpeg', 406875, 800, 800, '/uploads/products/23.28.01.jpeg', NULL, 'local', 'products/23.28.01.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0008', NULL, '23.28.04.jpeg', 'products', 'products/23.28.04.jpeg', 'products', 'image/jpeg', 414644, 800, 800, '/uploads/products/23.28.04.jpeg', NULL, 'local', 'products/23.28.04.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0009', NULL, '23.28.05.jpeg', 'products', 'products/23.28.05.jpeg', 'products', 'image/jpeg', 420753, 800, 800, '/uploads/products/23.28.05.jpeg', NULL, 'local', 'products/23.28.05.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0010', NULL, '23.28.06 (1).jpeg', 'products', 'products/23.28.06 (1).jpeg', 'products', 'image/jpeg', 333178, 800, 800, '/uploads/products/23.28.06 (1).jpeg', NULL, 'local', 'products/23.28.06 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0011', NULL, '23.28.06.jpeg', 'products', 'products/23.28.06.jpeg', 'products', 'image/jpeg', 224503, 800, 800, '/uploads/products/23.28.06.jpeg', NULL, 'local', 'products/23.28.06.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0012', NULL, '23.28.07 (1).jpeg', 'products', 'products/23.28.07 (1).jpeg', 'products', 'image/jpeg', 243201, 800, 800, '/uploads/products/23.28.07 (1).jpeg', NULL, 'local', 'products/23.28.07 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0013', NULL, '23.28.07 (2).jpeg', 'products', 'products/23.28.07 (2).jpeg', 'products', 'image/jpeg', 231762, 800, 800, '/uploads/products/23.28.07 (2).jpeg', NULL, 'local', 'products/23.28.07 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0014', NULL, '23.28.07 (3).jpeg', 'products', 'products/23.28.07 (3).jpeg', 'products', 'image/jpeg', 252813, 800, 800, '/uploads/products/23.28.07 (3).jpeg', NULL, 'local', 'products/23.28.07 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0015', NULL, '23.28.07.jpeg', 'products', 'products/23.28.07.jpeg', 'products', 'image/jpeg', 286311, 800, 800, '/uploads/products/23.28.07.jpeg', NULL, 'local', 'products/23.28.07.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0016', NULL, '23.28.08 (1).jpeg', 'products', 'products/23.28.08 (1).jpeg', 'products', 'image/jpeg', 253872, 800, 800, '/uploads/products/23.28.08 (1).jpeg', NULL, 'local', 'products/23.28.08 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0017', NULL, '23.28.08 (2).jpeg', 'products', 'products/23.28.08 (2).jpeg', 'products', 'image/jpeg', 249574, 800, 800, '/uploads/products/23.28.08 (2).jpeg', NULL, 'local', 'products/23.28.08 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0018', NULL, '23.28.08 (3).jpeg', 'products', 'products/23.28.08 (3).jpeg', 'products', 'image/jpeg', 310105, 800, 800, '/uploads/products/23.28.08 (3).jpeg', NULL, 'local', 'products/23.28.08 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0019', NULL, '23.28.08.jpeg', 'products', 'products/23.28.08.jpeg', 'products', 'image/jpeg', 275008, 800, 800, '/uploads/products/23.28.08.jpeg', NULL, 'local', 'products/23.28.08.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0020', NULL, '23.28.09 (1).jpeg', 'products', 'products/23.28.09 (1).jpeg', 'products', 'image/jpeg', 272781, 800, 800, '/uploads/products/23.28.09 (1).jpeg', NULL, 'local', 'products/23.28.09 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0021', NULL, '23.28.09 (2).jpeg', 'products', 'products/23.28.09 (2).jpeg', 'products', 'image/jpeg', 251004, 800, 800, '/uploads/products/23.28.09 (2).jpeg', NULL, 'local', 'products/23.28.09 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0022', NULL, '23.28.09.jpeg', 'products', 'products/23.28.09.jpeg', 'products', 'image/jpeg', 273132, 800, 800, '/uploads/products/23.28.09.jpeg', NULL, 'local', 'products/23.28.09.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0023', NULL, '23.28.13 (1).jpeg', 'products', 'products/23.28.13 (1).jpeg', 'products', 'image/jpeg', 395019, 800, 800, '/uploads/products/23.28.13 (1).jpeg', NULL, 'local', 'products/23.28.13 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0024', NULL, '23.28.13.jpeg', 'products', 'products/23.28.13.jpeg', 'products', 'image/jpeg', 402847, 800, 800, '/uploads/products/23.28.13.jpeg', NULL, 'local', 'products/23.28.13.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0025', NULL, '23.28.14 (1).jpeg', 'products', 'products/23.28.14 (1).jpeg', 'products', 'image/jpeg', 348929, 800, 800, '/uploads/products/23.28.14 (1).jpeg', NULL, 'local', 'products/23.28.14 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0026', NULL, '23.28.14.jpeg', 'products', 'products/23.28.14.jpeg', 'products', 'image/jpeg', 413685, 800, 800, '/uploads/products/23.28.14.jpeg', NULL, 'local', 'products/23.28.14.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0027', NULL, '23.28.15 (1).jpeg', 'products', 'products/23.28.15 (1).jpeg', 'products', 'image/jpeg', 283132, 800, 800, '/uploads/products/23.28.15 (1).jpeg', NULL, 'local', 'products/23.28.15 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0028', NULL, '23.28.15 (2).jpeg', 'products', 'products/23.28.15 (2).jpeg', 'products', 'image/jpeg', 303321, 800, 800, '/uploads/products/23.28.15 (2).jpeg', NULL, 'local', 'products/23.28.15 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0029', NULL, '23.28.15 (3).jpeg', 'products', 'products/23.28.15 (3).jpeg', 'products', 'image/jpeg', 196783, 800, 800, '/uploads/products/23.28.15 (3).jpeg', NULL, 'local', 'products/23.28.15 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0030', NULL, '23.28.15 (4).jpeg', 'products', 'products/23.28.15 (4).jpeg', 'products', 'image/jpeg', 197365, 800, 800, '/uploads/products/23.28.15 (4).jpeg', NULL, 'local', 'products/23.28.15 (4).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0031', NULL, '23.28.15 (5).jpeg', 'products', 'products/23.28.15 (5).jpeg', 'products', 'image/jpeg', 193605, 800, 800, '/uploads/products/23.28.15 (5).jpeg', NULL, 'local', 'products/23.28.15 (5).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0032', NULL, '23.28.15 (6).jpeg', 'products', 'products/23.28.15 (6).jpeg', 'products', 'image/jpeg', 206262, 800, 800, '/uploads/products/23.28.15 (6).jpeg', NULL, 'local', 'products/23.28.15 (6).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0033', NULL, '23.28.15.jpeg', 'products', 'products/23.28.15.jpeg', 'products', 'image/jpeg', 242241, 800, 800, '/uploads/products/23.28.15.jpeg', NULL, 'local', 'products/23.28.15.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0034', NULL, '23.28.16 (1).jpeg', 'products', 'products/23.28.16 (1).jpeg', 'products', 'image/jpeg', 333342, 800, 800, '/uploads/products/23.28.16 (1).jpeg', NULL, 'local', 'products/23.28.16 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0035', NULL, '23.28.16 (2).jpeg', 'products', 'products/23.28.16 (2).jpeg', 'products', 'image/jpeg', 324035, 800, 800, '/uploads/products/23.28.16 (2).jpeg', NULL, 'local', 'products/23.28.16 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0036', NULL, '23.28.16.jpeg', 'products', 'products/23.28.16.jpeg', 'products', 'image/jpeg', 420992, 800, 800, '/uploads/products/23.28.16.jpeg', NULL, 'local', 'products/23.28.16.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0037', NULL, '23.28.17 (1).jpeg', 'products', 'products/23.28.17 (1).jpeg', 'products', 'image/jpeg', 412629, 800, 800, '/uploads/products/23.28.17 (1).jpeg', NULL, 'local', 'products/23.28.17 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0038', NULL, '23.28.17 (2).jpeg', 'products', 'products/23.28.17 (2).jpeg', 'products', 'image/jpeg', 320022, 800, 800, '/uploads/products/23.28.17 (2).jpeg', NULL, 'local', 'products/23.28.17 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0039', NULL, '23.28.17 (3).jpeg', 'products', 'products/23.28.17 (3).jpeg', 'products', 'image/jpeg', 409462, 800, 800, '/uploads/products/23.28.17 (3).jpeg', NULL, 'local', 'products/23.28.17 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0040', NULL, '23.28.17.jpeg', 'products', 'products/23.28.17.jpeg', 'products', 'image/jpeg', 371916, 800, 800, '/uploads/products/23.28.17.jpeg', NULL, 'local', 'products/23.28.17.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0041', NULL, '23.28.20.jpeg', 'products', 'products/23.28.20.jpeg', 'products', 'image/jpeg', 410306, 800, 800, '/uploads/products/23.28.20.jpeg', NULL, 'local', 'products/23.28.20.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0042', NULL, '23.28.22 (1).jpeg', 'products', 'products/23.28.22 (1).jpeg', 'products', 'image/jpeg', 484027, 800, 800, '/uploads/products/23.28.22 (1).jpeg', NULL, 'local', 'products/23.28.22 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0043', NULL, '23.28.22 (2).jpeg', 'products', 'products/23.28.22 (2).jpeg', 'products', 'image/jpeg', 460909, 800, 800, '/uploads/products/23.28.22 (2).jpeg', NULL, 'local', 'products/23.28.22 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0044', NULL, '23.28.22.jpeg', 'products', 'products/23.28.22.jpeg', 'products', 'image/jpeg', 371084, 800, 800, '/uploads/products/23.28.22.jpeg', NULL, 'local', 'products/23.28.22.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0045', NULL, '23.28.23.jpeg', 'products', 'products/23.28.23.jpeg', 'products', 'image/jpeg', 573767, 800, 800, '/uploads/products/23.28.23.jpeg', NULL, 'local', 'products/23.28.23.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0046', NULL, '23.28.30 (1).jpeg', 'products', 'products/23.28.30 (1).jpeg', 'products', 'image/jpeg', 455935, 800, 800, '/uploads/products/23.28.30 (1).jpeg', NULL, 'local', 'products/23.28.30 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0047', NULL, '23.28.30 (2).jpeg', 'products', 'products/23.28.30 (2).jpeg', 'products', 'image/jpeg', 246719, 800, 800, '/uploads/products/23.28.30 (2).jpeg', NULL, 'local', 'products/23.28.30 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0048', NULL, '23.28.30.jpeg', 'products', 'products/23.28.30.jpeg', 'products', 'image/jpeg', 467987, 800, 800, '/uploads/products/23.28.30.jpeg', NULL, 'local', 'products/23.28.30.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0049', NULL, '23.28.31 (1).jpeg', 'products', 'products/23.28.31 (1).jpeg', 'products', 'image/jpeg', 342762, 800, 800, '/uploads/products/23.28.31 (1).jpeg', NULL, 'local', 'products/23.28.31 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0050', NULL, '23.28.31 (2).jpeg', 'products', 'products/23.28.31 (2).jpeg', 'products', 'image/jpeg', 176797, 800, 800, '/uploads/products/23.28.31 (2).jpeg', NULL, 'local', 'products/23.28.31 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0051', NULL, '23.28.31.jpeg', 'products', 'products/23.28.31.jpeg', 'products', 'image/jpeg', 214337, 800, 800, '/uploads/products/23.28.31.jpeg', NULL, 'local', 'products/23.28.31.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0052', NULL, '23.28.32 (1).jpeg', 'products', 'products/23.28.32 (1).jpeg', 'products', 'image/jpeg', 161300, 800, 800, '/uploads/products/23.28.32 (1).jpeg', NULL, 'local', 'products/23.28.32 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0053', NULL, '23.28.32 (2).jpeg', 'products', 'products/23.28.32 (2).jpeg', 'products', 'image/jpeg', 152459, 800, 800, '/uploads/products/23.28.32 (2).jpeg', NULL, 'local', 'products/23.28.32 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0054', NULL, '23.28.32.jpeg', 'products', 'products/23.28.32.jpeg', 'products', 'image/jpeg', 182623, 800, 800, '/uploads/products/23.28.32.jpeg', NULL, 'local', 'products/23.28.32.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0055', NULL, '23.28.33 (1).jpeg', 'products', 'products/23.28.33 (1).jpeg', 'products', 'image/jpeg', 256846, 800, 800, '/uploads/products/23.28.33 (1).jpeg', NULL, 'local', 'products/23.28.33 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0056', NULL, '23.28.33 (2).jpeg', 'products', 'products/23.28.33 (2).jpeg', 'products', 'image/jpeg', 269693, 800, 800, '/uploads/products/23.28.33 (2).jpeg', NULL, 'local', 'products/23.28.33 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0057', NULL, '23.28.33 (3).jpeg', 'products', 'products/23.28.33 (3).jpeg', 'products', 'image/jpeg', 291125, 800, 800, '/uploads/products/23.28.33 (3).jpeg', NULL, 'local', 'products/23.28.33 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0058', NULL, '23.28.33.jpeg', 'products', 'products/23.28.33.jpeg', 'products', 'image/jpeg', 278988, 800, 800, '/uploads/products/23.28.33.jpeg', NULL, 'local', 'products/23.28.33.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0059', NULL, '23.28.34 (1).jpeg', 'products', 'products/23.28.34 (1).jpeg', 'products', 'image/jpeg', 228035, 800, 800, '/uploads/products/23.28.34 (1).jpeg', NULL, 'local', 'products/23.28.34 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0060', NULL, '23.28.34 (2).jpeg', 'products', 'products/23.28.34 (2).jpeg', 'products', 'image/jpeg', 214992, 800, 800, '/uploads/products/23.28.34 (2).jpeg', NULL, 'local', 'products/23.28.34 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0061', NULL, '23.28.34 (3).jpeg', 'products', 'products/23.28.34 (3).jpeg', 'products', 'image/jpeg', 487776, 800, 800, '/uploads/products/23.28.34 (3).jpeg', NULL, 'local', 'products/23.28.34 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0062', NULL, '23.28.34.jpeg', 'products', 'products/23.28.34.jpeg', 'products', 'image/jpeg', 241750, 800, 800, '/uploads/products/23.28.34.jpeg', NULL, 'local', 'products/23.28.34.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0063', NULL, '23.28.35 (1).jpeg', 'products', 'products/23.28.35 (1).jpeg', 'products', 'image/jpeg', 408205, 800, 800, '/uploads/products/23.28.35 (1).jpeg', NULL, 'local', 'products/23.28.35 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0064', NULL, '23.28.35 (2).jpeg', 'products', 'products/23.28.35 (2).jpeg', 'products', 'image/jpeg', 499962, 800, 800, '/uploads/products/23.28.35 (2).jpeg', NULL, 'local', 'products/23.28.35 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0065', NULL, '23.28.35 (3).jpeg', 'products', 'products/23.28.35 (3).jpeg', 'products', 'image/jpeg', 319469, 800, 800, '/uploads/products/23.28.35 (3).jpeg', NULL, 'local', 'products/23.28.35 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0066', NULL, '23.28.35 (4).jpeg', 'products', 'products/23.28.35 (4).jpeg', 'products', 'image/jpeg', 340682, 800, 800, '/uploads/products/23.28.35 (4).jpeg', NULL, 'local', 'products/23.28.35 (4).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0067', NULL, '23.28.35.jpeg', 'products', 'products/23.28.35.jpeg', 'products', 'image/jpeg', 401240, 800, 800, '/uploads/products/23.28.35.jpeg', NULL, 'local', 'products/23.28.35.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0068', NULL, '23.28.36 (1).jpeg', 'products', 'products/23.28.36 (1).jpeg', 'products', 'image/jpeg', 319164, 800, 800, '/uploads/products/23.28.36 (1).jpeg', NULL, 'local', 'products/23.28.36 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0069', NULL, '23.28.36 (2).jpeg', 'products', 'products/23.28.36 (2).jpeg', 'products', 'image/jpeg', 282867, 800, 800, '/uploads/products/23.28.36 (2).jpeg', NULL, 'local', 'products/23.28.36 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0070', NULL, '23.28.36 (3).jpeg', 'products', 'products/23.28.36 (3).jpeg', 'products', 'image/jpeg', 297433, 800, 800, '/uploads/products/23.28.36 (3).jpeg', NULL, 'local', 'products/23.28.36 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0071', NULL, '23.28.36 (4).jpeg', 'products', 'products/23.28.36 (4).jpeg', 'products', 'image/jpeg', 424145, 800, 800, '/uploads/products/23.28.36 (4).jpeg', NULL, 'local', 'products/23.28.36 (4).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0072', NULL, '23.28.36.jpeg', 'products', 'products/23.28.36.jpeg', 'products', 'image/jpeg', 394564, 800, 800, '/uploads/products/23.28.36.jpeg', NULL, 'local', 'products/23.28.36.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0073', NULL, '23.28.37 (1).jpeg', 'products', 'products/23.28.37 (1).jpeg', 'products', 'image/jpeg', 232315, 800, 800, '/uploads/products/23.28.37 (1).jpeg', NULL, 'local', 'products/23.28.37 (1).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0074', NULL, '23.28.37 (2).jpeg', 'products', 'products/23.28.37 (2).jpeg', 'products', 'image/jpeg', 390691, 800, 800, '/uploads/products/23.28.37 (2).jpeg', NULL, 'local', 'products/23.28.37 (2).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0075', NULL, '23.28.37 (3).jpeg', 'products', 'products/23.28.37 (3).jpeg', 'products', 'image/jpeg', 367278, 800, 800, '/uploads/products/23.28.37 (3).jpeg', NULL, 'local', 'products/23.28.37 (3).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0076', NULL, '23.28.37 (4).jpeg', 'products', 'products/23.28.37 (4).jpeg', 'products', 'image/jpeg', 214149, 800, 800, '/uploads/products/23.28.37 (4).jpeg', NULL, 'local', 'products/23.28.37 (4).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0077', NULL, '23.28.37 (5).jpeg', 'products', 'products/23.28.37 (5).jpeg', 'products', 'image/jpeg', 252915, 800, 800, '/uploads/products/23.28.37 (5).jpeg', NULL, 'local', 'products/23.28.37 (5).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0078', NULL, '23.28.37 (6).jpeg', 'products', 'products/23.28.37 (6).jpeg', 'products', 'image/jpeg', 250258, 800, 800, '/uploads/products/23.28.37 (6).jpeg', NULL, 'local', 'products/23.28.37 (6).jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-prd-img-0079', NULL, '23.28.37.jpeg', 'products', 'products/23.28.37.jpeg', 'products', 'image/jpeg', 411933, 800, 800, '/uploads/products/23.28.37.jpeg', NULL, 'local', 'products/23.28.37.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  url = VALUES(url),
  size = VALUES(size),
  updated_at = NOW();

-- =========================
-- NEWS IMAGES
-- =========================
INSERT INTO `storage_assets`
(`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `hash`, `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`, `provider_version`, `etag`, `metadata`, `created_at`, `updated_at`)
VALUES
  ('bf-news-img-0001', NULL, 'bugem.jpeg',  'news', 'news/bugem.jpeg',  'news', 'image/jpeg', 321046, 1200, 800, '/uploads/news/bugem.jpeg',  NULL, 'local', 'news/bugem.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0002', NULL, 'bugem2.jpeg', 'news', 'news/bugem2.jpeg', 'news', 'image/jpeg', 360066, 1200, 800, '/uploads/news/bugem2.jpeg', NULL, 'local', 'news/bugem2.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0003', NULL, 'aksu.jpeg',   'news', 'news/aksu.jpeg',   'news', 'image/jpeg', 316171, 1200, 800, '/uploads/news/aksu.jpeg',   NULL, 'local', 'news/aksu.jpeg',   'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0004', NULL, 'aksu2.jpeg',  'news', 'news/aksu2.jpeg',  'news', 'image/jpeg', 170888, 1200, 800, '/uploads/news/aksu2.jpeg',  NULL, 'local', 'news/aksu2.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0005', NULL, 'aksu3.jpeg',  'news', 'news/aksu3.jpeg',  'news', 'image/jpeg', 273223, 1200, 800, '/uploads/news/aksu3.jpeg',  NULL, 'local', 'news/aksu3.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0006', NULL, 'aksu4.jpeg',  'news', 'news/aksu4.jpeg',  'news', 'image/jpeg', 312237, 1200, 800, '/uploads/news/aksu4.jpeg',  NULL, 'local', 'news/aksu4.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0007', NULL, 'aksu5.jpeg',  'news', 'news/aksu5.jpeg',  'news', 'image/jpeg', 281663, 1200, 800, '/uploads/news/aksu5.jpeg',  NULL, 'local', 'news/aksu5.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0008', NULL, 'samsun.jpeg',  'news', 'news/samsun.jpeg',  'news', 'image/jpeg', 507283, 1200, 800, '/uploads/news/samsun.jpeg',  NULL, 'local', 'news/samsun.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0009', NULL, 'samsun2.jpeg', 'news', 'news/samsun2.jpeg', 'news', 'image/jpeg', 217424, 1200, 800, '/uploads/news/samsun2.jpeg', NULL, 'local', 'news/samsun2.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0010', NULL, 'samsun3.jpeg', 'news', 'news/samsun3.jpeg', 'news', 'image/jpeg', 686649, 1200, 800, '/uploads/news/samsun3.jpeg', NULL, 'local', 'news/samsun3.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0011', NULL, 'samsun4.jpeg', 'news', 'news/samsun4.jpeg', 'news', 'image/jpeg', 379621, 1200, 800, '/uploads/news/samsun4.jpeg', NULL, 'local', 'news/samsun4.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0012', NULL, 'samsun5.jpeg', 'news', 'news/samsun5.jpeg', 'news', 'image/jpeg', 537420, 1200, 800, '/uploads/news/samsun5.jpeg', NULL, 'local', 'news/samsun5.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0013', NULL, 'samsun6.jpeg', 'news', 'news/samsun6.jpeg', 'news', 'image/jpeg', 241424, 1200, 800, '/uploads/news/samsun6.jpeg', NULL, 'local', 'news/samsun6.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0014', NULL, 'samsun7.jpeg', 'news', 'news/samsun7.jpeg', 'news', 'image/jpeg', 287820, 1200, 800, '/uploads/news/samsun7.jpeg', NULL, 'local', 'news/samsun7.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0015', NULL, 'samsun8.jpeg', 'news', 'news/samsun8.jpeg', 'news', 'image/jpeg', 503636, 1200, 800, '/uploads/news/samsun8.jpeg', NULL, 'local', 'news/samsun8.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0016', NULL, 'aksuj.jpeg',  'news', 'news/aksuj.jpeg',  'news', 'image/jpeg', 537420, 1200, 800, '/uploads/news/aksuj.jpeg',  NULL, 'local', 'news/aksuj.jpeg',  'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0017', NULL, 'aksuj2.jpeg', 'news', 'news/aksuj2.jpeg', 'news', 'image/jpeg', 241424, 1200, 800, '/uploads/news/aksuj2.jpeg', NULL, 'local', 'news/aksuj2.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-news-img-0018', NULL, 'aksuj3.jpeg', 'news', 'news/aksuj3.jpeg', 'news', 'image/jpeg', 287820, 1200, 800, '/uploads/news/aksuj3.jpeg', NULL, 'local', 'news/aksuj3.jpeg', 'image', 'jpg', NULL, NULL, '{}', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  url = VALUES(url),
  size = VALUES(size),
  updated_at = NOW();

-- =========================
-- BRAND REFERENCES (is birligi firma logolari)
-- =========================
INSERT INTO `storage_assets`
(`id`, `user_id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `width`, `height`, `url`, `hash`, `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`, `provider_version`, `etag`, `metadata`, `created_at`, `updated_at`)
VALUES
  ('bf-brand-img-0001', NULL, 'enzazaden.jpg',              'brand_references', 'brand_references/enzazaden.jpg',              'brand_references', 'image/jpeg', 24613, NULL, NULL, '/uploads/brand_references/enzazaden.jpg',              NULL, 'local', 'brand_references/enzazaden.jpg',              'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0002', NULL, 'rijkzwaan.jpg',              'brand_references', 'brand_references/rijkzwaan.jpg',              'brand_references', 'image/jpeg', 23825, NULL, NULL, '/uploads/brand_references/rijkzwaan.jpg',              NULL, 'local', 'brand_references/rijkzwaan.jpg',              'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0003', NULL, 'seminis.jpg',                'brand_references', 'brand_references/seminis.jpg',                'brand_references', 'image/jpeg', 39834, NULL, NULL, '/uploads/brand_references/seminis.jpg',                NULL, 'local', 'brand_references/seminis.jpg',                'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0004', NULL, 'sakata.png',                 'brand_references', 'brand_references/sakata.png',                 'brand_references', 'image/png',  54667,  750, 215, '/uploads/brand_references/sakata.png',                 NULL, 'local', 'brand_references/sakata.png',                 'image', 'png', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0005', NULL, 'nunhems.png',                'brand_references', 'brand_references/nunhems.png',                'brand_references', 'image/png',   8882,  253, 199, '/uploads/brand_references/nunhems.png',                NULL, 'local', 'brand_references/nunhems.png',                'image', 'png', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0006', NULL, 'hmclause.png',               'brand_references', 'brand_references/hmclause.png',               'brand_references', 'image/png',  27298, 2000, 571, '/uploads/brand_references/hmclause.png',               NULL, 'local', 'brand_references/hmclause.png',               'image', 'png', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0007', NULL, 'genetika.png',               'brand_references', 'brand_references/genetika.png',               'brand_references', 'image/png',   2076,  225, 225, '/uploads/brand_references/genetika.png',               NULL, 'local', 'brand_references/genetika.png',               'image', 'png', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0008', NULL, 'yukseltohum.jpg',            'brand_references', 'brand_references/yukseltohum.jpg',            'brand_references', 'image/jpeg', 86327, NULL, NULL, '/uploads/brand_references/yukseltohum.jpg',            NULL, 'local', 'brand_references/yukseltohum.jpg',            'image', 'jpg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0009', NULL, 'anamas.jpeg',                'brand_references', 'brand_references/anamas.jpeg',                'brand_references', 'image/jpeg',  8213, NULL, NULL, '/uploads/brand_references/anamas.jpeg',                NULL, 'local', 'brand_references/anamas.jpeg',                'image', 'jpeg', NULL, NULL, '{}', NOW(), NOW()),
  ('bf-brand-img-0010', NULL, 'vistaseed_logo_black.png',   'brand_references', 'brand_references/vistaseed_logo_black.png',   'brand_references', 'image/png',  38607, 2014, 494, '/uploads/brand_references/vistaseed_logo_black.png',   NULL, 'local', 'brand_references/vistaseed_logo_black.png',   'image', 'png', NULL, NULL, '{}', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  url = VALUES(url),
  size = VALUES(size),
  width = VALUES(width),
  height = VALUES(height),
  updated_at = NOW();

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
