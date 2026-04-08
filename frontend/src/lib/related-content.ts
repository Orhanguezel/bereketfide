import { API_BASE_URL } from '@/lib/utils';

type Entity = {
  id?: string;
  slug?: string;
  title?: string;
  description?: string | null;
  tags?: string[];
};

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f]+/gi, ' ')
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 2);
}

function entityTerms(entity: Entity): Set<string> {
  const terms = new Set<string>();

  for (const source of [entity.title, entity.description, entity.slug]) {
    if (!source) continue;
    for (const token of tokenize(source)) terms.add(token);
  }

  for (const tag of entity.tags ?? []) {
    for (const token of tokenize(tag)) terms.add(token);
  }

  return terms;
}

function scoreRelation(base: Entity, candidate: Entity): number {
  const baseTerms = entityTerms(base);
  const candidateTerms = entityTerms(candidate);
  let score = 0;

  for (const term of candidateTerms) {
    if (baseTerms.has(term)) score += 1;
  }

  return score;
}

async function fetchList(endpoint: string, locale: string): Promise<any[]> {
  try {
    const joiner = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(
      `${API_BASE_URL}${endpoint}${joiner}locale=${encodeURIComponent(locale)}&limit=12`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data as any)?.items ?? [];
  } catch {
    return [];
  }
}

function rankRelated<T extends Entity>(base: Entity, items: T[], currentSlug: string, limit = 3): T[] {
  return items
    .filter((item) => item.slug && item.slug !== currentSlug)
    .map((item) => ({ item, score: scoreRelation(base, item) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.item.title ?? '').localeCompare(String(b.item.title ?? ''));
    })
    .slice(0, limit)
    .map((entry) => entry.item);
}

export async function fetchRelatedContent(base: Entity, currentSlug: string, locale: string) {
  const [products, newsPosts, galleries, knowledgePosts, knowledgeBasePosts] = await Promise.all([
    fetchList('/products?item_type=bereketfide&is_active=1', locale),
    fetchList('/custom-pages?module_key=news&is_published=1', locale),
    fetchList('/galleries?module_key=bereketfide&is_active=1', locale),
    fetchList('/custom-pages?module_key=blog&is_published=1', locale),
    fetchList('/custom-pages?module_key=bilgi-bankasi&is_published=1', locale),
  ]);

  return {
    products: rankRelated(base, products, currentSlug),
    blogPosts: rankRelated(base, newsPosts, currentSlug),
    knowledgePosts: rankRelated(base, knowledgePosts, currentSlug),
    knowledgeBasePosts: rankRelated(base, knowledgeBasePosts, currentSlug),
    galleries: rankRelated(base, galleries, currentSlug),
  };
}
