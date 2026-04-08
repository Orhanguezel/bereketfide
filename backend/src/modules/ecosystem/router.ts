import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/db/client';
import { customPages, customPagesI18n } from '@agro/shared-backend/modules/customPages/schema';
import { products, productI18n } from '@agro/shared-backend/modules/products/schema';
import { eq, and, desc, like, inArray } from 'drizzle-orm';
import { env } from '@/core/env';

const SITE_URL = env.PUBLIC_URL || 'https://www.bereketfide.com.tr';
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<string, { data: unknown; expiresAt: number }>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

type ContentType = 'blog' | 'product' | 'knowledge' | 'event';

async function fetchBlog(locale: string, limit: number) {
  const rows = await db
    .select({
      slug: customPagesI18n.slug,
      title: customPagesI18n.title,
      excerpt: customPagesI18n.summary,
      image: customPages.featured_image,
      module_key: customPages.module_key,
      publishedAt: customPages.created_at,
    })
    .from(customPages)
    .innerJoin(customPagesI18n, and(
      eq(customPages.id, customPagesI18n.page_id),
      eq(customPagesI18n.locale, locale),
    ))
    .where(
      and(
        inArray(customPages.module_key, ['blog', 'haberler', 'news']),
        eq(customPages.is_published, 1),
      ),
    )
    .orderBy(desc(customPages.created_at))
    .limit(limit);

  return rows.map((r) => ({
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt || null,
    image: r.image || null,
    url: `${SITE_URL}/${locale}/${r.module_key === 'haberler' ? 'haberler' : 'blog'}/${r.slug}`,
    publishedAt: r.publishedAt,
    type: 'blog' as const,
  }));
}

async function fetchProducts(locale: string, category: string | undefined, limit: number) {
  const rows = await db
    .select({
      slug: productI18n.slug,
      title: productI18n.title,
      description: productI18n.description,
      image: products.image_url,
      publishedAt: products.created_at,
    })
    .from(products)
    .innerJoin(productI18n, and(
      eq(products.id, productI18n.product_id),
      eq(productI18n.locale, locale),
    ))
    .where(
      and(
        eq(products.item_type, 'bereketfide'),
        eq(products.is_active, 1),
        category ? like(products.category_name, `%${category}%`) : undefined,
      ),
    )
    .orderBy(desc(products.created_at))
    .limit(limit);

  return rows.map((r) => ({
    title: r.title,
    slug: r.slug,
    excerpt: r.description?.slice(0, 160) || null,
    image: r.image || null,
    url: `${SITE_URL}/${locale}/urunler/${r.slug}`,
    publishedAt: r.publishedAt,
    type: 'product' as const,
  }));
}

async function fetchKnowledge(locale: string, limit: number) {
  const rows = await db
    .select({
      slug: customPagesI18n.slug,
      title: customPagesI18n.title,
      excerpt: customPagesI18n.summary,
      image: customPages.featured_image,
      publishedAt: customPages.created_at,
    })
    .from(customPages)
    .innerJoin(customPagesI18n, and(
      eq(customPages.id, customPagesI18n.page_id),
      eq(customPagesI18n.locale, locale),
    ))
    .where(
      and(
        eq(customPages.module_key, 'bilgi-bankasi'),
        eq(customPages.is_published, 1),
      ),
    )
    .orderBy(desc(customPages.created_at))
    .limit(limit);

  return rows.map((r) => ({
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt || null,
    image: r.image || null,
    url: `${SITE_URL}/${locale}/bilgi-bankasi/${r.slug}`,
    publishedAt: r.publishedAt,
    type: 'knowledge' as const,
  }));
}

async function contentHandler(req: FastifyRequest, reply: FastifyReply) {
  const q = (req.query || {}) as Record<string, string | undefined>;
  const type = (q.type || 'blog') as ContentType;
  const locale = q.locale || 'tr';
  const category = q.category;
  const limit = Math.min(Math.max(parseInt(q.limit || '5', 10) || 5, 1), 20);

  if (!['blog', 'product', 'knowledge', 'event'].includes(type)) {
    return reply.code(400).send({ error: { message: 'invalid_type' } });
  }

  const cacheKey = `eco:${type}:${locale}:${category || ''}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) {
    reply.header('x-cache', 'HIT');
    return reply.send(cached);
  }

  let items: unknown[];

  if (type === 'blog') {
    items = await fetchBlog(locale, limit);
  } else if (type === 'product') {
    items = await fetchProducts(locale, category, limit);
  } else if (type === 'knowledge') {
    items = await fetchKnowledge(locale, limit);
  } else {
    // event — ekim takvimi static reference
    items = [{
      title: locale === 'tr' ? 'Ekim Takvimi' : 'Planting Calendar',
      slug: 'ekim-takvimi',
      excerpt: locale === 'tr'
        ? 'Türkiye\'nin 7 bölgesi için fide dikim takvimi'
        : 'Seedling planting calendar for 7 regions of Turkey',
      image: null,
      url: `${SITE_URL}/${locale}/ekim-takvimi`,
      publishedAt: null,
      type: 'event',
    }];
  }

  const result = {
    source: 'bereketfide',
    type,
    locale,
    items,
    generatedAt: new Date().toISOString(),
  };

  setCached(cacheKey, result);
  reply.header('x-cache', 'MISS');
  reply.header('cache-control', 'public, max-age=300');
  return reply.send(result);
}

export async function registerEcosystem(app: FastifyInstance) {
  app.get('/ecosystem/content', contentHandler);
}
