/** Rota her zaman `/insan-kaynaklari`; CMS `by-slug` locale bazli farkli slug kullanir. */
export const HR_LIST_PATH = '/insan-kaynaklari' as const;

export function hrCmsSlugForLocale(locale: string): string {
  const lc = String(locale || 'tr').toLowerCase();
  if (lc.startsWith('tr')) return 'insan-kaynaklari';
  if (lc.startsWith('de')) return 'karriere';
  return 'careers';
}
