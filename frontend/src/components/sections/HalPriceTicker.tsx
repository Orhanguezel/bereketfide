import 'server-only';
import { HalPriceTickerClient, type WidgetItem } from './HalPriceTickerClient';

const SLUGS = 'domates,biber,patlican,salatalik,kabak,havuc,sogan,marul,brokoli,kavun,karpuz';
const HAL_WIDGET_URL = `https://haldefiyat.com/api/v1/prices/widget?slugs=${SLUGS}&limit=12`;

async function fetchWidgetItems(): Promise<WidgetItem[]> {
  try {
    const res = await fetch(HAL_WIDGET_URL, { next: { revalidate: 3600 } });
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
