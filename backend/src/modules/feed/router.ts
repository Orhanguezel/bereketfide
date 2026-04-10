import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/db/client';
import { customPages, customPagesI18n } from '@agro/shared-backend/modules/customPages/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { env } from '@/core/env';

const SITE_URL = env.PUBLIC_URL || 'https://www.bereketfide.com.tr';
const FEED_LOCALES = ['tr', 'en'];
const BLOG_MODULES = ['blog', 'haberler', 'news'];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function getFeedItems(locale: string, limit: number) {
  const rows = await db
    .select({
      id: customPages.id,
      module_key: customPages.module_key,
      featured_image: customPages.featured_image,
      created_at: customPages.created_at,
      updated_at: customPages.updated_at,
      title: customPagesI18n.title,
      slug: customPagesI18n.slug,
      summary: customPagesI18n.summary,
      meta_description: customPagesI18n.meta_description,
    })
    .from(customPages)
    .innerJoin(customPagesI18n, eq(customPages.id, customPagesI18n.page_id))
    .where(
      and(
        eq(customPages.is_published, 1),
        eq(customPagesI18n.locale, locale),
        inArray(customPages.module_key, BLOG_MODULES),
      ),
    )
    .orderBy(desc(customPages.created_at))
    .limit(limit);

  return rows;
}

function buildRss(locale: string, items: Awaited<ReturnType<typeof getFeedItems>>): string {
  const langLabel = locale === 'tr' ? 'Türkçe' : 'English';
  const channelTitle = `Bereket Fide Blog — ${langLabel}`;
  const channelDesc =
    locale === 'tr'
      ? 'Antalya merkezli fide üretim şirketinin tarım, sera ve fide rehberleri'
      : 'Agricultural guides and news from a leading seedling producer in Antalya';
  const channelLink = `${SITE_URL}/${locale}/blog`;
  const now = new Date().toUTCString();

  const itemsXml = items
    .map((item) => {
      const moduleKey = item.module_key as string;
      const slug = item.slug as string;
      const title = item.title as string;
      const summary = item.summary as string | null;
      const metaDesc = item.meta_description as string | null;
      const createdAt = item.created_at as string | number | Date | null;
      const featuredImage = item.featured_image as string | null;

      const moduleSlug = BLOG_MODULES.includes(moduleKey) ? moduleKey : 'blog';
      const link = `${SITE_URL}/${locale}/${moduleSlug}/${slug}`;
      const description = escapeXml(
        stripHtml(summary || metaDesc || '').slice(0, 300),
      );
      const pubDate = createdAt ? new Date(createdAt).toUTCString() : now;

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${description}</description>` : ''}
      ${featuredImage ? `<enclosure url="${escapeXml(featuredImage)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>${locale}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/v1/feed/rss?locale=${locale}" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;
}

async function feedHandler(req: FastifyRequest, reply: FastifyReply) {
  const query = req.query as { locale?: string; limit?: string };
  const locale = FEED_LOCALES.includes(query.locale ?? '') ? (query.locale as string) : 'tr';
  const limit = Math.min(Math.max(parseInt(query.limit ?? '20', 10) || 20, 1), 50);

  const items = await getFeedItems(locale, limit);
  const xml = buildRss(locale, items);

  reply
    .header('Content-Type', 'application/rss+xml; charset=utf-8')
    .header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')
    .send(xml);
}

export async function registerFeed(app: FastifyInstance) {
  app.get('/feed/rss', { config: { public: true } }, feedHandler);
}
