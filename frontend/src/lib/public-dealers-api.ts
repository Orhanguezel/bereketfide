import { API_BASE_URL } from '@/lib/utils';

export type PublicDealerRow = {
  id: string;
  company_name: string | null;
  city: string | null;
  region: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
};

export type PublicDealersResponse = {
  data: PublicDealerRow[];
  page: number;
  limit: number;
  total: number;
};

export async function fetchPublicDealers(params: {
  page?: number;
  limit?: number;
  q?: string;
  city?: string;
  region?: string;
}): Promise<PublicDealersResponse> {
  const sp = new URLSearchParams();
  sp.set('page', String(params.page ?? 1));
  sp.set('limit', String(Math.min(params.limit ?? 40, 50)));
  if (params.q?.trim()) sp.set('q', params.q.trim());
  if (params.city?.trim()) sp.set('city', params.city.trim());
  if (params.region?.trim()) sp.set('region', params.region.trim());

  const url = `${API_BASE_URL}/dealers/public?${sp.toString()}`;
  const res = await fetch(url, { credentials: 'omit', cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`public_dealers_${res.status}`);
  }
  return res.json() as Promise<PublicDealersResponse>;
}
