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
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const LEGAL_FALLBACK_KIND = {
  privacy: 'privacy',
  terms: 'terms',
  'kalite-politikasi': 'quality',
  'quality-policy': 'quality',
  qualitaetspolitik: 'quality',
  'hizmet-politikasi': 'service',
  'service-policy': 'service',
  servicepolitik: 'service',
  'kvkk-aydinlatma-metni': 'dataProtection',
  'pdpl-information-notice': 'dataProtection',
  cookies: 'cookies',
} as const;

function getLegalFallback(t: any, slug: string): LegalFallback | null {
  const kind = LEGAL_FALLBACK_KIND[slug as keyof typeof LEGAL_FALLBACK_KIND];
  if (!kind) return null;

  if (kind === 'privacy') {
    return {
      title: t('legal.privacy'),
      description: t('legal.privacyDesc'),
      content: t('legal.privacyContent'),
    };
  }

  if (kind === 'terms') {
    return {
      title: t('legal.terms'),
      description: t('legal.termsDesc'),
      content: t('legal.termsContent'),
    };
  }

  if (kind === 'quality') {
    return {
      title: t('legal.qualityPolicy'),
      description: t('legal.qualityPolicyDesc'),
      content: t('legal.qualityPolicyContent'),
    };
  }

  if (kind === 'dataProtection') {
    return {
      title: t('legal.dataProtectionNotice'),
      description: t('legal.dataProtectionNoticeDesc'),
      content: t('legal.dataProtectionNoticeContent'),
    };
  }

  if (kind === 'cookies') {
    return {
      title: t('legal.cookiePolicy'),
      description: t('legal.cookiePolicyDesc'),
      content: t('legal.cookiePolicyContent'),
    };
  }

  return {
    title: t('legal.servicePolicy'),
    description: t('legal.servicePolicyDesc'),
    content: t('legal.servicePolicyContent'),
  };
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
