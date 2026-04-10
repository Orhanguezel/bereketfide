'use client';

import Image from 'next/image';
import { useGetSiteSettingByKeyQuery } from '@/integrations/hooks';

const BRAND_PREFIX = process.env.NEXT_PUBLIC_BRAND_PREFIX || 'bereketfide__';
const LOGO_FALLBACK = '/admin/logo/bereket_logo_512.png';

type Props = {
  heading: string;
  subtext: string;
};

export function AuthBrandPanel({ heading, subtext }: Props) {
  const { data: logoSetting } = useGetSiteSettingByKeyQuery(`${BRAND_PREFIX}site_logo`);
  const { data: logoSettingGlobal } = useGetSiteSettingByKeyQuery('site_logo');
  const { data: configSetting } = useGetSiteSettingByKeyQuery(`${BRAND_PREFIX}ui_admin_config`);

  const logoVal = (logoSetting?.value || logoSettingGlobal?.value) as any;
  const configVal = configSetting?.value as any;

  // DB'de logo_url veya url alanı olabilir
  const rawLogoUrl: string = logoVal?.logo_url || logoVal?.url || LOGO_FALLBACK;
  // SVG and /uploads/ paths cannot go through Next.js image optimizer
  const isSvg = rawLogoUrl.endsWith('.svg');
  const needsUnoptimized = isSvg || rawLogoUrl.startsWith('/uploads/');
  const logoUrl = rawLogoUrl;
  const logoAlt: string = logoVal?.alt || 'Logo';
  const appName: string = configVal?.branding?.app_name || 'Bereket Fide';

  return (
    <div className="hidden bg-primary lg:flex lg:w-1/3 flex-col items-center justify-center p-12 text-center">
      <div className="space-y-6">
        <div className="mx-auto size-48 relative">
          <Image
            src={logoUrl}
            alt={logoAlt}
            fill
            className="object-contain"
            unoptimized={needsUnoptimized}
          />
        </div>
        <div className="space-y-2">
          <p className="text-primary-foreground/60 text-xs font-semibold tracking-widest uppercase">
            {appName}
          </p>
          <h1 className="font-light text-5xl text-primary-foreground">{heading}</h1>
          <p className="text-primary-foreground/80 text-xl">{subtext}</p>
        </div>
      </div>
    </div>
  );
}
