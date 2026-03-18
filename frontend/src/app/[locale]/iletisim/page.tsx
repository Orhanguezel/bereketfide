import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContentPageHeader } from '@/components/patterns/ContentPageHeader';
import { InfoListPanel } from '@/components/patterns/InfoListPanel';
import { ContactFormClient } from '@/components/sections/ContactForm';
import { GoogleMap } from '@/components/widgets/GoogleMap';
import { fetchSetting } from '@/i18n/server';
import { JsonLd, buildPageMetadata, jsonld, localizedPath, localizedUrl, organizationJsonLd, readSettingValue } from '@/seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

async function fetchContactInfo(locale: string) {
  try {
    return await fetchSetting('contact_info', locale, { revalidate: 3600 });
  } catch {
    return null;
  }
}

import { fetchSeoPage } from '@/seo/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoPage(locale, 'iletisim');
  const t = await getTranslations({ locale, namespace: 'contact' });
  const companyProfileSetting = await fetchSetting('company_profile', locale);
  const companyProfile = readSettingValue(companyProfileSetting) as Record<string, string>;

  return buildPageMetadata({
    locale,
    pathname: '/iletisim',
    title: seo?.title || `${t('title')} — ${companyProfile?.company_name || (locale.startsWith('en') ? 'Bereket Fide' : 'Bereket Fide')}`,
    description: seo?.description || t('description'),
    ogImage: seo?.og_image || undefined,
    noIndex: seo?.no_index,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const [contactSetting, companyProfileSetting] = await Promise.all([
     fetchContactInfo(locale),
     fetchSetting('company_profile', locale)
  ]);

  const info = readSettingValue(contactSetting) as Record<string, string>;
  const companyProfile = readSettingValue(companyProfileSetting) as Record<string, string>;

  const companyName = info.company_name || companyProfile?.company_name || 'Bereket Fide';
  const address = info.address || '';
  const phone = info.phone || '';
  const email = info.email || 'info@bereketfide.com.tr';
  const hours = info.hours || info.working_hours || 'Pazartesi - Cuma, 09:00 - 18:00';
  const embedUrl = info.maps_embed_url;
  const responseItems = Object.values(t.raw('contact.response.items') as Record<string, string>);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 60px' }}>
      <div>
        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: locale.startsWith('en') ? 'Contact' : 'İletişim' },
        ]} />
        <JsonLd
          data={jsonld.graph([
            jsonld.org(
              organizationJsonLd(locale, {
                description: t('contact.description'),
                email,
                telephone: phone,
                address,
              }),
            ),
            jsonld.localBusiness({
              name: companyName,
              url: localizedUrl(locale, '/iletisim'),
              description: t('contact.description'),
              email,
              telephone: phone,
              address,
              openingHours: hours,
            }),
          ])}
        />
        <ContentPageHeader
          title={t('contact.title')}
          description={t('contact.description')}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <ContactFormClient locale={locale} />

          <div className="space-y-6">
            <section className="surface-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold">{t('contact.info.title')}</h2>
              <div className="mt-5 space-y-4 text-sm text-(--color-text-secondary)">
                <div>
                  <p className="font-medium text-(--color-text-primary)">
                    {t('contact.info.address')}
                  </p>
                  <p>{companyName}</p>
                  {address && <p>{address}</p>}
                </div>
                {phone && (
                  <div>
                    <p className="font-medium text-(--color-text-primary)">
                      {t('contact.info.phone')}
                    </p>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className="hover:text-(--color-brand)"
                    >
                      {phone}
                    </a>
                  </div>
                )}
                <div>
                  <p className="font-medium text-(--color-text-primary)">
                    {t('contact.info.email')}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-(--color-brand)"
                  >
                    {email}
                  </a>
                </div>
                <div>
                  <p className="font-medium text-(--color-text-primary)">
                    {t('contact.info.hours')}
                  </p>
                  <p>{hours}</p>
                </div>
              </div>
            </section>

            <InfoListPanel
              title={t('contact.response.title')}
              items={responseItems}
            />

            <div className="surface-card overflow-hidden rounded-2xl p-2">
              <GoogleMap 
                className="h-64 w-full overflow-hidden rounded-xl" 
                embedUrl={embedUrl}
                title={`${companyName} ${locale.startsWith('en') ? 'Location' : 'Konum'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
