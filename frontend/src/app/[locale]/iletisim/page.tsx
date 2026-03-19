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
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

async function fetchContactInfo(locale: string) {
  try {
    return await fetchSetting('contact_info', locale, { revalidate: 0 });
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
    title: seo?.title || `${t('title')} — ${companyProfile?.company_name || 'Bereket Fide'}`,
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
  const hours = info.hours || info.working_hours || (locale.startsWith('en') ? 'Monday - Friday, 09:00 - 18:00' : 'Pazartesi - Cuma, 09:00 - 18:00');
  const embedUrl = info.maps_embed_url;
  const responseItems = Object.values(t.raw('contact.response.items') as Record<string, string>);

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <style>{`
        .ct-info-card{background:var(--color-surface);border:1px solid var(--color-border);padding:24px;border-radius:16px;transition:all .3s ease}
        .ct-info-card:hover{border-color:var(--color-brand);box-shadow:0 12px 24px rgba(0,0,0,0.06)}
        .ct-icon-box{width:48px;height:48px;border-radius:12px;background:rgba(185, 142, 61, 0.1);color:var(--color-brand);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
        .ct-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-text-muted);margin-bottom:8px;display:block}
        .ct-value{font-size:15px;color:var(--color-text-primary);line-height:1.6;font-weight:500;text-decoration:none;transition:color .2s ease}
        .ct-value:hover{color:var(--color-brand)}
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 80px' }}>
        <Breadcrumbs items={[
          { label: companyName, href: localizedPath(locale, '/') },
          { label: t('contact.title') },
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

        <div style={{ marginTop: 24, marginBottom: 48 }}>
          <ContentPageHeader
            title={t('contact.title')}
            description={t('contact.description')}
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <ContactFormClient locale={locale} />
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="ct-info-card">
                <div className="ct-icon-box">
                  <MapPin size={24} />
                </div>
                <span className="ct-label">{t('contact.info.address')}</span>
                <p className="ct-value">{companyName}</p>
                {address && <p className="ct-value" style={{ marginTop: 4, fontWeight: 400, opacity: 0.8 }}>{address}</p>}
              </div>

              <div className="ct-info-card">
                <div className="ct-icon-box">
                  <Phone size={24} />
                </div>
                <span className="ct-label">{t('contact.info.phone')}</span>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="ct-value">{phone}</a>
              </div>

              <div className="ct-info-card">
                <div className="ct-icon-box">
                  <Mail size={24} />
                </div>
                <span className="ct-label">{t('contact.info.email')}</span>
                <a href={`mailto:${email}`} className="ct-value">{email}</a>
              </div>

              <div className="ct-info-card">
                <div className="ct-icon-box">
                  <Clock size={24} />
                </div>
                <span className="ct-label">{t('contact.info.hours')}</span>
                <p className="ct-value">{hours}</p>
              </div>
            </div>

            <InfoListPanel
              title={t('contact.response.title')}
              items={responseItems}
            />

            <div className="surface-card overflow-hidden rounded-2xl p-2 border border-(--color-border)">
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
