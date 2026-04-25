import 'server-only';
import { HalPriceTickerClient, type WidgetItem } from './HalPriceTickerClient';
import { fetchSetting } from '@/i18n/server';

const DEFAULT_SLUGS = 'domates,biber,patlican,salatalik,kabak,havuc,sogan,marul,brokoli,kavun,karpuz';

async function getTickerSlugs(): Promise<string> {
  try {
    const row = await fetchSetting('bereketfide__hal_ticker_slugs', '*', { revalidate: 3600 });
    const val = (row as any)?.value;
    if (Array.isArray(val) && val.length) return val.join(',');
    if (typeof val === 'string' && val.trim()) return val.trim();
  } catch {
    // fall through
  }
  return DEFAULT_SLUGS;
}

async function fetchWidgetItems(): Promise<WidgetItem[]> {
  const slugs = await getTickerSlugs();
  const url = `https://haldefiyat.com/api/v1/prices/widget?slugs=${encodeURIComponent(slugs)}&limit=24`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.items) ? json.items : [];
  } catch {
    return [];
  }
}

export async function HalPriceTicker() {
  const items = await fetchWidgetItems();
  if (!items.length) return null;
  return <HalPriceTickerClient items={items} />;
}
