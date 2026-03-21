import 'server-only';

import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { API_BASE_URL, absoluteAssetUrl } from '@/lib/utils';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl } from '@/seo';

import { buildMediaAlt } from '@/lib/media-seo';
import { SeoIssueBeacon } from '@/components/monitoring/SeoIssueBeacon';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { fetchSetting } from '@/i18n/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import type { ProjectViewItem } from '@/components/projects/ProjectsView';
import specKeysData from '@shared/spec-keys.json';

const PROJECT_PLACEHOLDER = '/media/gallery-placeholder.svg';

async function fetchProjects(locale: string) {
  const params = new URLSearchParams({
    item_type: 'bereketfide',
    is_active: '1',
    locale,
    limit: '50',
  });
  try {
    const res = await fetch(`${API_BASE_URL}/products?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

import { fetchSeoPage } from '@/seo/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoPage(locale, 'urunler');
  const t = await getTranslations({ locale });

  return buildPageMetadata({
    locale,
    pathname: '/urunler',
    title: seo?.title || t('projects.title'),
    description: seo?.description || t('projects.description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

type SpecEntry = { id: string; keys: Record<string, string>; labels: Record<string, string> };
const SPEC_ENTRIES: SpecEntry[] = specKeysData.project;

/** Get all locale key variants for a spec id */
function allKeysForId(id: string): string[] {
  const entry = SPEC_ENTRIES.find((e) => e.id === id);
  return entry ? Object.values(entry.keys) : [id];
}

/** Case-insensitive spec lookup by spec id — searches all locale key variants */
function specById(specs: Record<string, string> | undefined, id: string): string | undefined {
  if (!specs) return undefined;
  for (const k of allKeysForId(id)) {
    const norm = k.toLowerCase().replace(/[\s_]+/g, '');
    for (const [sk, sv] of Object.entries(specs)) {
      if (sk.toLowerCase().replace(/[\s_]+/g, '') === norm && sv) return sv;
    }
  }
  return undefined;
}

function toViewItem(p: any, locale: string): ProjectViewItem {
  const specs = p.specifications as Record<string, string> | undefined;
  return {
    id: p.id,
    title: p.title,
    href: p.slug
      ? localizedPath(locale, `/urunler/${p.slug}`)
      : `${localizedPath(locale, '/teklif')}?proje=${encodeURIComponent(p.title)}`,
    imageSrc: absoluteAssetUrl(p.featured_image) || absoluteAssetUrl(p.image_url) || absoluteAssetUrl(p.images?.[0]) || PROJECT_PLACEHOLDER,
    alt: buildMediaAlt({
      locale,
      kind: 'project',
      title: p.title,
      alt: p.alt,
      caption: p.caption,
      description: p.description,
    }),
    category: p.category?.name || p.category_name || p.type || specById(specs, 'type') || undefined,
    location: specById(specs, 'location') || undefined,
    architects: specById(specs, 'architects') || specById(specs, 'lead_architect') || undefined,
    year: specById(specs, 'year') || undefined,
    area: specById(specs, 'area') || undefined,
    status: specById(specs, 'status') || undefined,
    materials: specById(specs, 'materials') || undefined,
    floors: specById(specs, 'floors') || undefined,
    client: specById(specs, 'contractor') || specById(specs, 'client') || undefined,
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isEn = locale.startsWith('en');

  const [projects, profile] = await Promise.all([
    fetchProjects(locale),
    fetchSetting('company_profile', locale),
  ]);

  const companyProfile = (profile?.value as any) ?? {};
  const companyName = companyProfile.company_name || 'Bereket Fide';

  const totalCount = projects.length;
  const viewItems = projects.map((p: any) => toViewItem(p, locale));

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 48px' }}>
        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: t('projects.title') },
        ]} />
        <JsonLd
          data={jsonld.graph([
            jsonld.collectionPage({
              name: t('projects.title'),
              description: t('projects.description'),
              url: localizedUrl(locale, '/urunler'),
              mainEntity: jsonld.itemList(
                projects.slice(0, 12).map((item: any) => ({
                  name: item.title,
                  url: item.slug
                    ? localizedUrl(locale, `/urunler/${item.slug}`)
                    : localizedUrl(locale, '/teklif'),
                })),
              ),
            }),
          ])}
        />

        {/* ── Title + count ── */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {t('projects.title')}
          </h1>
          <span style={{ fontSize: 15, color: 'var(--color-text-muted)', fontWeight: 400 }}>
            | {totalCount} {t('projects.results')}
          </span>
        </div>

        {/* ── Description ── */}
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            marginTop: 6,
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          {t('projects.description')}
        </p>

        {/* ── Tabs + Filters + View toggle + Content ── */}
        <div style={{ marginTop: 16 }}>
          <Suspense fallback={null}><ProjectsView
            projects={viewItems}
            locale={locale}
            labels={{
              projects: t('projects.title'),
              images: t('projects.images'),
            }}
            filterLabels={{
              category: t('projects.filters.type'),
              location: t('projects.filters.location'),
              architects: t('projects.filters.architects'),
              year: t('projects.filters.year'),
              materials: t('projects.filters.materials'),
              area: t('projects.filters.area'),
              floors: t('projects.filters.floors'),
              client: t('projects.filters.client'),
              status: t('projects.filters.status'),
              all: t('projects.filters.all'),
              search: t('projects.filters.search'),
              clearFilters: t('common.clearFilters'),
              noResults: t('common.noResults'),
              allLabel: t('common.allLabel'),
            }}
            detailLabels={{
              architects: t('projects.detail.architect'),
              location: t('projects.detail.location'),
              year: t('projects.detail.year'),
              area: t('projects.detail.area'),
            }}
          /></Suspense>
        </div>
      </div>
    </div>
  );
}
