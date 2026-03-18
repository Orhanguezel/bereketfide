import type { RouteHandler } from 'fastify';
import { db } from '@/db/client';
import { themeConfig, THEME_ROW_ID } from './schema';
import { DEFAULT_THEME } from './defaults';
import { themeUpdateSchema } from './validation';
import { eq } from 'drizzle-orm';
import type { ThemeConfig } from './types';

function deepMerge<T extends Record<string, any>>(base: T, patch: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const val = patch[key];
    if (val !== undefined && val !== null && typeof val === 'object' && !Array.isArray(val) && typeof base[key] === 'object') {
      result[key] = deepMerge(base[key] as any, val as any);
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}

async function getStoredConfig(): Promise<ThemeConfig> {
  const [row] = await db.select().from(themeConfig).where(eq(themeConfig.id, THEME_ROW_ID)).limit(1);
  if (!row?.config) return { ...DEFAULT_THEME };
  try {
    const stored = JSON.parse(row.config) as Partial<ThemeConfig>;
    return deepMerge(DEFAULT_THEME, stored);
  } catch {
    return { ...DEFAULT_THEME };
  }
}

/** GET /admin/theme — mevcut tema konfigürasyonunu döndür */
export const adminGetTheme: RouteHandler = async (_req, reply) => {
  const config = await getStoredConfig();
  return reply.send(config);
};

/** PUT /admin/theme — kısmi güncelleme (deep merge) */
export const adminUpdateTheme: RouteHandler = async (req, reply) => {
  const body = themeUpdateSchema.parse(req.body || {});
  const current = await getStoredConfig();
  const merged = deepMerge(current, body as Partial<ThemeConfig>);
  const json = JSON.stringify(merged);

  const [existing] = await db.select({ id: themeConfig.id }).from(themeConfig).where(eq(themeConfig.id, THEME_ROW_ID)).limit(1);

  if (existing) {
    await db.update(themeConfig).set({ config: json }).where(eq(themeConfig.id, THEME_ROW_ID));
  } else {
    await db.insert(themeConfig).values({ id: THEME_ROW_ID, config: json, is_active: 1 });
  }

  return reply.send(merged);
};

/** POST /admin/theme/reset — varsayılana sıfırla */
export const adminResetTheme: RouteHandler = async (_req, reply) => {
  const json = JSON.stringify(DEFAULT_THEME);

  const [existing] = await db.select({ id: themeConfig.id }).from(themeConfig).where(eq(themeConfig.id, THEME_ROW_ID)).limit(1);

  if (existing) {
    await db.update(themeConfig).set({ config: json }).where(eq(themeConfig.id, THEME_ROW_ID));
  } else {
    await db.insert(themeConfig).values({ id: THEME_ROW_ID, config: json, is_active: 1 });
  }

  return reply.send(DEFAULT_THEME);
};

/** GET /theme — public endpoint (frontend için) */
export const publicGetTheme: RouteHandler = async (_req, reply) => {
  const config = await getStoredConfig();
  reply.header('cache-control', 'public, max-age=60, stale-while-revalidate=300');
  return reply.send(config);
};
