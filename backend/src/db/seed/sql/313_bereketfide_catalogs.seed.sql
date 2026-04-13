DELETE FROM `library_files`
WHERE `library_id` IN (
  'c1111111-5001-4001-9001-cccccccc0001',
  'c3333333-5003-4003-9003-cccccccc0003'
);

DELETE FROM `library_i18n`
WHERE `library_id` IN (
  'c1111111-5001-4001-9001-cccccccc0001',
  'c3333333-5003-4003-9003-cccccccc0003'
);

DELETE FROM `library`
WHERE `id` IN (
  'c1111111-5001-4001-9001-cccccccc0001',
  'c3333333-5003-4003-9003-cccccccc0003'
);

INSERT INTO `library` (
  `id`, `type`, `category_id`, `sub_category_id`, `featured`, `is_published`, `is_active`,
  `display_order`, `featured_image`, `image_url`, `image_asset_id`, `views`, `download_count`,
  `published_at`, `created_at`, `updated_at`
) VALUES
  (
    'c1111111-5001-4001-9001-cccccccc0001',
    'catalog',
    NULL,
    NULL,
    1,
    1,
    1,
    10,
    '/uploads/products/23.28.37 (1).jpeg',
    '/uploads/products/23.28.37 (1).jpeg',
    'bf-prd-img-0073',
    0,
    0,
    NOW(3),
    NOW(3),
    NOW(3)
  ),
  (
    'c3333333-5003-4003-9003-cccccccc0003',
    'catalog',
    NULL,
    NULL,
    1,
    1,
    1,
    30,
    '/uploads/products/23.28.37 (4).jpeg',
    '/uploads/products/23.28.37 (4).jpeg',
    'bf-prd-img-0076',
    0,
    0,
    NOW(3),
    NOW(3),
    NOW(3)
  );

INSERT INTO `library_i18n` (
  `id`, `library_id`, `locale`, `slug`, `name`, `description`, `image_alt`,
  `tags`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`
) VALUES
  (UUID(), 'c1111111-5001-4001-9001-cccccccc0001', 'tr', 'sebze-fideleri-katalogu', 'Sebze Fideleri Kataloğu', 'Sebze fidesi çeşitleri, teknik bilgiler ve sipariş için katalog içeriği.', 'Sebze fideleri kataloğu kapağı', 'katalog, sebze fideleri', 'Sebze Fideleri Kataloğu | Bereket Fide', 'Sebze fidesi çeşitlerini içeren katalog.', 'sebze fideleri katalog', NOW(3), NOW(3)),
  (UUID(), 'c3333333-5003-4003-9003-cccccccc0003', 'tr', 'asisli-fide-katalogu', 'Aşılı Fide Kataloğu', 'Aşılı fide çeşitleri, kullanım alanları ve ürün detayları.', 'Aşılı fide kataloğu kapağı', 'katalog, aşılı fide', 'Aşılı Fide Kataloğu | Bereket Fide', 'Aşılı fide çeşitlerini içeren katalog.', 'aşılı fide katalog', NOW(3), NOW(3)),
  (UUID(), 'c1111111-5001-4001-9001-cccccccc0001', 'en', 'vegetable-seedlings-catalog', 'Vegetable Seedlings Catalog', 'Catalog featuring vegetable seedling varieties and technical details.', 'Vegetable seedlings catalog cover', 'catalog, vegetable seedlings', 'Vegetable Seedlings Catalog | Bereket Fide', 'Catalog for vegetable seedling varieties.', 'vegetable seedlings catalog', NOW(3), NOW(3)),
  (UUID(), 'c3333333-5003-4003-9003-cccccccc0003', 'en', 'grafted-seedlings-catalog', 'Grafted Seedlings Catalog', 'Catalog featuring grafted seedling varieties and product details.', 'Grafted seedlings catalog cover', 'catalog, grafted seedlings', 'Grafted Seedlings Catalog | Bereket Fide', 'Catalog for grafted seedling varieties.', 'grafted seedlings catalog', NOW(3), NOW(3)),
  (UUID(), 'c1111111-5001-4001-9001-cccccccc0001', 'de', 'gemuese-setzlinge-katalog', 'Gemüse-Setzlinge Katalog', 'Katalog mit Gemüse-Setzlingssorten und technischen Details.', 'Titelbild des Gemüse-Setzlinge Katalogs', 'katalog, gemüse-setzlinge', 'Gemüse-Setzlinge Katalog | Bereket Fide', 'Katalog für Gemüse-Setzlingssorten.', 'gemüse setzlinge katalog', NOW(3), NOW(3)),
  (UUID(), 'c3333333-5003-4003-9003-cccccccc0003', 'de', 'veredelte-setzlinge-katalog', 'Veredelte Setzlinge Katalog', 'Katalog mit veredelten Setzlingssorten und Produktdetails.', 'Titelbild des Veredelte-Setzlinge Katalogs', 'katalog, veredelte setzlinge', 'Veredelte Setzlinge Katalog | Bereket Fide', 'Katalog für veredelte Setzlingssorten.', 'veredelte setzlinge katalog', NOW(3), NOW(3));

INSERT INTO `library_files` (
  `id`, `library_id`, `asset_id`, `file_url`, `name`, `size_bytes`, `mime_type`,
  `tags_json`, `display_order`, `is_active`, `created_at`, `updated_at`
) VALUES
  (
    UUID(),
    'c1111111-5001-4001-9001-cccccccc0001',
    NULL,
    '/uploads/offers/offer-7061d23b-2285-11f1-982c-f29618b44128.pdf',
    'sebze-fideleri-katalogu.pdf',
    NULL,
    'application/pdf',
    JSON_ARRAY('catalog'),
    10,
    1,
    NOW(3),
    NOW(3)
  ),
  (
    UUID(),
    'c3333333-5003-4003-9003-cccccccc0003',
    NULL,
    '/uploads/offers/offer-7061d23b-2285-11f1-982c-f29618b44128.pdf',
    'asili-fide-katalogu.pdf',
    NULL,
    'application/pdf',
    JSON_ARRAY('catalog'),
    10,
    1,
    NOW(3),
    NOW(3)
  );
