import type { SpecItem } from '@/components/projects/ProjectSpecs';

export function coerceProductSpecifications(raw: unknown): Record<string, string> {
  if (raw == null) return {};
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return {};
    try {
      const p = JSON.parse(s) as unknown;
      if (p && typeof p === 'object' && !Array.isArray(p)) {
        return Object.fromEntries(
          Object.entries(p as Record<string, unknown>).map(([k, v]) => [
            k,
            v == null ? '' : String(v).trim(),
          ]),
        );
      }
    } catch {
      return {};
    }
    return {};
  }
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return Object.fromEntries(
      Object.entries(raw as Record<string, unknown>).map(([k, v]) => [
        k,
        v == null ? '' : String(v).trim(),
      ]),
    );
  }
  return {};
}

function humanizeSpecKey(key: string): string {
  const k = key.trim();
  if (!k) return key;
  return k.charAt(0).toUpperCase() + k.slice(1);
}

/** Seed / CMS `specifications` JSON → liste (Bereket Fide ürünleri). */
export function productSpecificationsToItems(specs: Record<string, string>): SpecItem[] {
  const out: SpecItem[] = [];
  for (const [k, v] of Object.entries(specs)) {
    if (!v) continue;
    out.push({
      icon: 'default',
      label: `${humanizeSpecKey(k)}:`,
      value: v,
    });
  }
  return out;
}
