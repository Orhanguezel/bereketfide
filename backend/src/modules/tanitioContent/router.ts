// =============================================================
// Tanitio icerik kaynagi ucu (content-source v1.3).
//   GET /api/v1/integrations/tanitio/contract
//   GET /api/v1/integrations/tanitio/products
//   GET /api/v1/integrations/tanitio/articles
// Auth: X-Api-Key: <key> veya Authorization: Bearer <key>
//       Anahtar TANITIO_CONTENT_API_KEY env'inden okunur. Tanimli degilse uclar
//       503 doner (fail-closed); yedek/varsayilan anahtar YOKTUR.
// Kanonik adres: TANITIO_CONTENT_SITE_URL (yoksa PUBLIC_URL). Adresler her dilde
// "/<dil>/" onekini tasir (sitenin kendi yol yapisi).
// Yanitlar salt-okunur, private/no-store; kisisel veri icermez.
// =============================================================
import { createHash, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '@/db/client';
import { env } from '@/core/env';

const BASE = '/integrations/tanitio';
const PRODUCT_ITEM_TYPE = 'bereketfide';
const DEFAULT_LOCALE = 'tr';
const LOCALES = ['tr', 'en'] as const;
const MAX_LIMIT = 60;

type Query = {
  limit: number;
  offset: number;
  q: string;
  sort: string;
  locale: string;
  type: string;
  updatedSince: Date | null;
};

function siteUrl() {
  return String(process.env.TANITIO_CONTENT_SITE_URL || env.PUBLIC_URL).replace(/\/+$/, '');
}

function mediaUrl(value: unknown) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return encodeURI(`${String(env.PUBLIC_URL).replace(/\/+$/, '')}/${raw.replace(/^\/+/, '')}`);
}

function pageUrl(locale: string, section: string, slug: string) {
  return `${siteUrl()}/${locale}/${section}/${encodeURIComponent(slug)}`;
}

function plainText(value: unknown) {
  return String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function iso(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function digest(value: string) {
  return createHash('sha256').update(value).digest();
}

function authorize(req: FastifyRequest, reply: FastifyReply) {
  const expected = String(process.env.TANITIO_CONTENT_API_KEY || '').trim();
  if (!expected) {
    reply.code(503).send({ error: { code: 'content_source_not_configured' } });
    return false;
  }
  const header = req.headers['x-api-key'];
  const bearer = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const given = String((Array.isArray(header) ? header[0] : header) || bearer || '').trim();
  if (!given || !timingSafeEqual(digest(given), digest(expected))) {
    reply.code(401).send({ error: { code: 'unauthorized' } });
    return false;
  }
  reply.header('Cache-Control', 'private, no-store');
  return true;
}

function parseQuery(raw: unknown): Query | null {
  const q = (raw ?? {}) as Record<string, unknown>;
  const cursor = q.cursor === undefined ? null : String(q.cursor);
  if (cursor !== null && !/^\d{1,7}$/.test(cursor)) return null;
  const limit = q.limit === undefined ? 20 : Number(q.limit);
  const offset = cursor !== null ? Number(cursor) : q.offset === undefined ? 0 : Number(q.offset);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) return null;
  if (!Number.isInteger(offset) || offset < 0 || offset > 1_000_000) return null;
  const locale = String(q.locale ?? DEFAULT_LOCALE).toLowerCase().slice(0, 2);
  if (!(LOCALES as readonly string[]).includes(locale)) return null;
  let updatedSince: Date | null = null;
  if (q.updated_since !== undefined) {
    updatedSince = new Date(String(q.updated_since));
    if (Number.isNaN(updatedSince.getTime())) return null;
  }
  return {
    limit,
    offset,
    q: String(q.q ?? '').trim().slice(0, 120),
    sort: String(q.sort ?? ''),
    locale,
    type: String(q.type ?? '').trim().toLowerCase(),
    updatedSince,
  };
}

function page<T>(items: T[], total: number, query: Query) {
  const consumed = query.offset + items.length;
  const hasMore = consumed < total;
  return { items, total, hasMore, nextCursor: hasMore ? String(consumed) : null };
}

async function listProducts(query: Query) {
  const where = ['p.is_active = 1', 'p.item_type = ?'];
  const args: unknown[] = [PRODUCT_ITEM_TYPE];
  if (query.q) { where.push('i.title LIKE ?'); args.push(`%${query.q}%`); }
  if (query.updatedSince) { where.push('GREATEST(p.updated_at, i.updated_at) >= ?'); args.push(query.updatedSince); }
  const order = query.sort === 'newest' ? 'p.created_at DESC'
    : query.sort === 'price_asc' ? 'p.price IS NULL, p.price ASC'
      : query.sort === 'price_desc' ? 'p.price DESC'
        : query.sort === 'popular' ? 'p.is_featured DESC, p.order_num ASC, p.updated_at DESC'
          : 'p.updated_at DESC';
  const from = `FROM products p INNER JOIN product_i18n i ON i.product_id = p.id AND i.locale = ? WHERE ${where.join(' AND ')}`;
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total ${from}`, [query.locale, ...args]) as [any[], unknown];
  const [rows] = await pool.query(
    `SELECT p.id, p.price, p.image_url, p.is_featured, p.created_at, p.updated_at,
            i.title, i.slug, i.description, i.meta_title, i.meta_description, i.updated_at AS i_updated_at
       ${from} ORDER BY ${order}, p.id DESC LIMIT ? OFFSET ?`,
    [query.locale, ...args, query.limit, query.offset],
  ) as [any[], unknown];
  const items = rows.map((r) => {
    const slug = String(r.slug || r.id);
    const price = r.price === null || r.price === undefined ? null : Number(r.price);
    return {
      id: String(r.id),
      content_type: 'product',
      title: String(r.title || slug),
      slug,
      url: pageUrl(query.locale, 'urunler', slug),
      excerpt: plainText(r.description).slice(0, 220),
      content_html: r.description ? String(r.description) : null,
      seo_title: r.meta_title || null,
      seo_description: r.meta_description || null,
      image_url: mediaUrl(r.image_url),
      price: price !== null && Number.isFinite(price) && price > 0 ? price : null,
      currency: 'TRY',
      featured: Boolean(r.is_featured),
      published_at: iso(r.created_at),
      updated_at: iso(r.i_updated_at && r.i_updated_at > r.updated_at ? r.i_updated_at : r.updated_at),
    };
  });
  return page(items, Number(countRows[0]?.total ?? 0), query);
}

const NEWS_MODULES = ['news', 'haberler'];
const BLOG_MODULES = ['blog'];

async function listArticles(query: Query) {
  const modules = query.type === 'news' || query.type === 'announcement' ? NEWS_MODULES
    : query.type === 'blog' || query.type === 'article' ? BLOG_MODULES
      : query.type ? [] : [...BLOG_MODULES, ...NEWS_MODULES];
  if (!modules.length) return page([], 0, query);
  const where = ['p.is_published = 1', `p.module_key IN (${modules.map(() => '?').join(', ')})`];
  const args: unknown[] = [...modules];
  if (query.q) { where.push('i.title LIKE ?'); args.push(`%${query.q}%`); }
  if (query.updatedSince) { where.push('GREATEST(p.updated_at, i.updated_at) >= ?'); args.push(query.updatedSince); }
  const order = query.sort === 'updated' ? 'p.updated_at DESC' : 'p.created_at DESC';
  const from = `FROM custom_pages p INNER JOIN custom_pages_i18n i ON i.page_id = p.id AND i.locale = ? WHERE ${where.join(' AND ')}`;
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total ${from}`, [query.locale, ...args]) as [any[], unknown];
  const [rows] = await pool.query(
    `SELECT p.id, p.module_key, p.featured_image, p.image_url, p.created_at, p.updated_at,
            i.title, i.slug, i.summary, i.content, i.meta_title, i.meta_description
       ${from} ORDER BY ${order}, p.id DESC LIMIT ? OFFSET ?`,
    [query.locale, ...args, query.limit, query.offset],
  ) as [any[], unknown];
  const items = rows.map((r) => {
    const slug = String(r.slug || r.id);
    const isNews = NEWS_MODULES.includes(String(r.module_key));
    return {
      id: String(r.id),
      content_type: isNews ? 'news' : 'blog',
      title: String(r.title || slug),
      slug,
      url: pageUrl(query.locale, isNews ? 'haberler' : 'blog', slug),
      excerpt: r.summary ? String(r.summary) : plainText(r.content).slice(0, 220),
      content_html: r.content ? String(r.content) : null,
      seo_title: r.meta_title || null,
      seo_description: r.meta_description || null,
      image_url: mediaUrl(r.featured_image || r.image_url),
      published_at: iso(r.created_at),
      updated_at: iso(r.updated_at),
    };
  });
  return page(items, Number(countRows[0]?.total ?? 0), query);
}

export async function registerTanitioContent(api: FastifyInstance) {
  api.get(`${BASE}/contract`, async (req, reply) => {
    if (!authorize(req, reply)) return;
    return {
      contract: 'content-source',
      version: '1.3',
      capabilities: { articles: true, products: true, incremental: true, tombstones: false, popularity: false, price: true },
      locales: [...LOCALES],
      defaultLocale: DEFAULT_LOCALE,
      endpoints: {
        products: `${String(env.PUBLIC_URL).replace(/\/+$/, '')}/api/v1${BASE}/products`,
        articles: `${String(env.PUBLIC_URL).replace(/\/+$/, '')}/api/v1${BASE}/articles`,
      },
    };
  });

  api.get(`${BASE}/products`, async (req, reply) => {
    if (!authorize(req, reply)) return;
    const query = parseQuery(req.query);
    if (!query) return reply.code(400).send({ error: { code: 'invalid_query' } });
    try {
      return await listProducts(query);
    } catch (err) {
      req.log.error({ err, event: 'tanitio_content_products_failed' }, 'tanitio_content_products_failed');
      return reply.code(500).send({ error: { code: 'internal_error' } });
    }
  });

  api.get(`${BASE}/articles`, async (req, reply) => {
    if (!authorize(req, reply)) return;
    const query = parseQuery(req.query);
    if (!query) return reply.code(400).send({ error: { code: 'invalid_query' } });
    try {
      return await listArticles(query);
    } catch (err) {
      req.log.error({ err, event: 'tanitio_content_articles_failed' }, 'tanitio_content_articles_failed');
      return reply.code(500).send({ error: { code: 'internal_error' } });
    }
  });
}
