// Bereket Fide — DB Admin Module Manifest
// Her modülün export/import kapsamındaki tablolar.
// FK'den dolayı parent→child sırası zorunlu; truncateInOrder tersi.

import type { ModuleMap } from "@agro/shared-backend/modules/db_admin";

export const BEREKETFIDE_DB_MODULES: ModuleMap = {
  // ── Site ───────────────────────────────────────────────────────────
  site_settings: {
    tablesInOrder: ["site_settings", "site_locales", "sites"],
    truncateInOrder: ["site_settings", "site_locales", "sites"],
    allowSchema: false,
    note: "Site: site_settings + site_locales + sites.",
  },

  // ── Content ────────────────────────────────────────────────────────
  products: {
    tablesInOrder: [
      "products",
      "product_i18n",
      "product_specs",
      "product_faqs",
      "product_images",
      "product_reviews",
      "product_options",
      "product_stock",
    ],
    truncateInOrder: [
      "product_stock",
      "product_options",
      "product_reviews",
      "product_images",
      "product_faqs",
      "product_specs",
      "product_i18n",
      "products",
    ],
    allowSchema: false,
    note: "Products + i18n + specs/faqs/images + reviews/options/stock.",
  },

  categories: {
    tablesInOrder: ["categories", "category_i18n"],
    truncateInOrder: ["category_i18n", "categories"],
    allowSchema: false,
  },

  subcategories: {
    tablesInOrder: ["sub_categories", "sub_category_i18n"],
    truncateInOrder: ["sub_category_i18n", "sub_categories"],
    allowSchema: false,
  },

  services: {
    tablesInOrder: ["services", "services_i18n", "service_images", "service_images_i18n"],
    truncateInOrder: ["service_images_i18n", "service_images", "services_i18n", "services"],
    allowSchema: false,
  },

  gallery: {
    tablesInOrder: ["galleries", "gallery_i18n", "gallery_images", "gallery_image_i18n"],
    truncateInOrder: ["gallery_image_i18n", "gallery_images", "gallery_i18n", "galleries"],
    allowSchema: false,
  },

  library: {
    tablesInOrder: [
      "library",
      "library_i18n",
      "library_images",
      "library_images_i18n",
      "library_files",
    ],
    truncateInOrder: [
      "library_files",
      "library_images_i18n",
      "library_images",
      "library_i18n",
      "library",
    ],
    allowSchema: false,
  },

  references: {
    tablesInOrder: ["references", "references_i18n", "reference_images", "reference_images_i18n"],
    truncateInOrder: [
      "reference_images_i18n",
      "reference_images",
      "references_i18n",
      "references",
    ],
    allowSchema: false,
    note: "İş birliği firmaları: references + i18n + gallery tablolari.",
  },

  custom_pages: {
    tablesInOrder: ["custom_pages", "custom_pages_i18n"],
    truncateInOrder: ["custom_pages_i18n", "custom_pages"],
    allowSchema: false,
  },

  menuitem: {
    tablesInOrder: ["menu_items", "menu_items_i18n"],
    truncateInOrder: ["menu_items_i18n", "menu_items"],
    allowSchema: false,
  },

  slider: {
    tablesInOrder: ["slider", "slider_i18n"],
    truncateInOrder: ["slider_i18n", "slider"],
    allowSchema: false,
  },

  footer_sections: {
    tablesInOrder: ["footer_sections", "footer_sections_i18n"],
    truncateInOrder: ["footer_sections_i18n", "footer_sections"],
    allowSchema: false,
  },

  faqs: {
    tablesInOrder: ["faqs", "faqs_i18n"],
    truncateInOrder: ["faqs_i18n", "faqs"],
    allowSchema: false,
  },

  reviews: {
    tablesInOrder: ["reviews", "review_i18n"],
    truncateInOrder: ["review_i18n", "reviews"],
    allowSchema: false,
  },

  // ── Business (Bereketfide-özel) ───────────────────────────────────
  comments: {
    tablesInOrder: ["comments", "content_reaction_totals"],
    truncateInOrder: ["content_reaction_totals", "comments"],
    allowSchema: false,
    note: "Blog/haber yorumları + reaction totals.",
  },

  offers: {
    tablesInOrder: ["offers", "offer_number_counters"],
    truncateInOrder: ["offer_number_counters", "offers"],
    allowSchema: false,
  },

  catalog_requests: {
    tablesInOrder: ["catalog_requests"],
    truncateInOrder: ["catalog_requests"],
    allowSchema: false,
  },

  contacts: {
    tablesInOrder: ["contact_messages"],
    truncateInOrder: ["contact_messages"],
    allowSchema: false,
  },

  newsletter: {
    tablesInOrder: ["newsletter_subscribers"],
    truncateInOrder: ["newsletter_subscribers"],
    allowSchema: false,
  },

  email_templates: {
    tablesInOrder: ["email_templates", "email_templates_i18n"],
    truncateInOrder: ["email_templates_i18n", "email_templates"],
    allowSchema: false,
  },

  // ── B2B / Orders ───────────────────────────────────────────────────
  orders: {
    tablesInOrder: ["orders", "order_items"],
    truncateInOrder: ["order_items", "orders"],
    allowSchema: false,
  },

  payment_attempts: {
    tablesInOrder: ["payment_attempts"],
    truncateInOrder: ["payment_attempts"],
    allowSchema: false,
  },

  dealers: {
    tablesInOrder: ["dealer_profiles", "dealer_transactions", "dealer_direct_payments"],
    truncateInOrder: ["dealer_direct_payments", "dealer_transactions", "dealer_profiles"],
    allowSchema: false,
  },

  // ── Inventory ──────────────────────────────────────────────────────
  inventory: {
    tablesInOrder: ["inventory_cache", "inventory_sync_log"],
    truncateInOrder: ["inventory_sync_log", "inventory_cache"],
    allowSchema: false,
  },

  // ── System / Infra ─────────────────────────────────────────────────
  users: {
    tablesInOrder: ["users", "refresh_tokens", "profiles", "user_roles"],
    truncateInOrder: ["user_roles", "profiles", "refresh_tokens", "users"],
    allowSchema: false,
    note: "Auth: users + refresh_tokens + profiles + user_roles.",
  },

  storage: {
    tablesInOrder: ["storage_assets", "storage_assets_i18n"],
    truncateInOrder: ["storage_assets_i18n", "storage_assets"],
    allowSchema: false,
  },

  notifications: {
    tablesInOrder: ["notifications"],
    truncateInOrder: ["notifications"],
    allowSchema: false,
  },

  support: {
    tablesInOrder: ["support_tickets", "ticket_replies"],
    truncateInOrder: ["ticket_replies", "support_tickets"],
    allowSchema: false,
  },

  audit: {
    tablesInOrder: ["audit_request_logs", "audit_auth_events", "audit_events", "ip_blocklist"],
    truncateInOrder: ["ip_blocklist", "audit_events", "audit_auth_events", "audit_request_logs"],
    allowSchema: false,
    note: "Audit logs + blocklist (büyük tablolar — dikkat).",
  },

  telegram: {
    tablesInOrder: ["telegram_inbound_messages"],
    truncateInOrder: ["telegram_inbound_messages"],
    allowSchema: false,
  },

  theme: {
    tablesInOrder: ["theme_config"],
    truncateInOrder: ["theme_config"],
    allowSchema: false,
  },
};
