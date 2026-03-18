import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { buildPageMetadata } from '@/seo';

type LegalFallback = {
  title: string;
  description: string;
  content: string;
};

async function fetchLegalPage(slug: string, locale: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom_pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getLegalFallback(t: any, slug: string): LegalFallback | null {
  if (slug === 'privacy') {
    return {
      title: t('legal.privacy'),
      description: t('legal.privacyDesc'),
      content: t('legal.privacyContent'),
    };
  }

  if (slug === 'terms') {
    return {
      title: t('legal.terms'),
      description: t('legal.termsDesc'),
      content: t('legal.termsContent'),
    };
  }

  return null;
}

import { fetchSeoPage } from '@/seo/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const seo = await fetchSeoPage(locale, `legal_${slug}`);
  const page = await fetchLegalPage(slug, locale);
  const fallback = page ? null : getLegalFallback(t, slug);
  const resolved = page || fallback;

  if (!resolved && !seo) return {};

  return buildPageMetadata({
    locale,
    pathname: `/legal/${slug}`,
    title: seo?.title || ('meta_title' in resolved ? resolved.meta_title || resolved.title : resolved.title),
    description: seo?.description || (
      'meta_description' in resolved
        ? resolved.meta_description || resolved.description || resolved.title
        : resolved.description
    ),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const page = await fetchLegalPage(slug, locale);
  const fallback = page ? null : getLegalFallback(t, slug);
  const resolved = page || fallback;
  if (!resolved) notFound();
  const content = 'content' in resolved ? normalizeRichContent(resolved.content) : '';

  return (
    <div className="section-py">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <ContentPageHeader
          title={resolved.title}
          description={resolved.description}
        />
        {content && (
          <div
            className="prose prose-theme mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
