import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';

import { API_BASE_URL } from '@/lib/utils';
import { normalizeRichContent } from '@/lib/rich-content';
import { HR_LIST_PATH, hrCmsSlugForLocale } from '@/lib/hr-page';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';
import { fetchSeoPage } from '@/seo/server';
import { fetchSetting } from '@/i18n/server';

async function fetchHrCmsPage(locale: string) {
  const slug = hrCmsSlugForLocale(locale);
  try {
    const res = await fetch(
      `${API_BASE_URL}/custom-pages/by-slug/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoPage(locale, 'insan_kaynaklari');
  const t = await getTranslations({ locale, namespace: 'careerPage' });
  const page = await fetchHrCmsPage(locale);
  const title = seo?.title || page?.meta_title || page?.title || t('title');
  const description =
    seo?.description || page?.meta_description || page?.summary || t('description');

  return buildPageMetadata({
    locale,
    pathname: HR_LIST_PATH,
    title,
    description,
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function InsanKaynaklariPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'careerPage' });
  const [page, profileSetting] = await Promise.all([
    fetchHrCmsPage(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profileSetting?.value as Record<string, string> | undefined) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const fromApi = page ? normalizeRichContent(page.content) : '';
  const body = fromApi.trim() ? fromApi : normalizeRichContent(t('fallbackContent'));
  const title = page?.title || t('title');
  const description = page?.summary || page?.meta_description || t('description');
  const listUrl = localizedUrl(locale, HR_LIST_PATH);

  return (
    <div className="section-py">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Breadcrumbs
          items={[
            { label: companyName, href: localizedPath(locale, '/') },
            { label: title },
          ]}
        />
        <JsonLd
          data={jsonld.breadcrumb([
            { name: companyName, url: localizedUrl(locale, '/') },
            { name: title, url: listUrl },
          ])}
        />
        <ContentPageHeader title={title} description={description} />
        {body ? (
          <div
            className="prose prose-theme mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : null}
        <p className="mt-8 text-sm text-muted-foreground">
          <Link
            href={localizedPath(locale, '/iletisim')}
            className="text-primary underline-offset-4 hover:underline"
          >
            {t('contactCta')}
          </Link>
        </p>
      </div>
    </div>
  );
}
