import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { inventoryCache, inventorySyncLog } from './schema';
import { scrapeAllInventory } from './scraper';

function parseTR(val: string): number {
  // "1.234,56" → 1234.56  |  "1.234" → 1234
  if (!val || val === '-') return 0;
  const normalized = val.replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized) || 0;
}

export async function runInventorySync(): Promise<void> {
  const start = Date.now();
  let status: 'ok' | 'error' = 'ok';
  let errorMsg: string | null = null;
  let totalRows = 0;
  let changedRows = 0;
  let newRows = 0;

  try {
    const scraped = await scrapeAllInventory();
    totalRows = scraped.length;
    if (!totalRows) throw new Error('Scraper 0 kayıt döndürdü');

    // Mevcut kayıtları çek
    const existing = await db.select().from(inventoryCache);
    const existingMap = new Map(existing.map((r) => [r.malzeme_kodu, r]));

    const now = new Date();
    const toInsert: typeof inventoryCache.$inferInsert[] = [];
    const toUpdate: typeof inventoryCache.$inferInsert[] = [];

    for (const raw of scraped) {
      const row: typeof inventoryCache.$inferInsert = {
        malzeme_kodu:     raw.malzeme_kodu,
        malzeme_adi:      raw.malzeme_adi,
        ozel_kodu:        raw.ozel_kodu || null,
        devir:            parseTR(raw.devir),
        devir_tutari:     String(parseTR(raw.devir_tutari)),
        girisler:         parseTR(raw.girisler),
        girisler_tutari:  String(parseTR(raw.girisler_tutari)),
        cikislar:         parseTR(raw.cikislar),
        cikislar_tutari:  String(parseTR(raw.cikislar_tutari)),
        envanter_miktari: parseTR(raw.envanter_miktari),
        ortalama_fiyat:   String(parseTR(raw.ortalama_fiyat)),
        envanter_tutari:  String(parseTR(raw.envanter_tutari)),
        synced_at:        now,
        updated_at:       now,
      };

      const prev = existingMap.get(raw.malzeme_kodu);
      if (!prev) {
        newRows++;
        toInsert.push(row);
      } else {
        const changed =
          prev.envanter_miktari !== row.envanter_miktari ||
          prev.girisler !== row.girisler ||
          prev.cikislar !== row.cikislar ||
          prev.malzeme_adi !== row.malzeme_adi;
        if (changed) {
          changedRows++;
          toUpdate.push(row);
        }
      }
    }

    // Batch insert yeni kayıtlar
    if (toInsert.length) {
      await db.insert(inventoryCache).values(toInsert);
    }

    // Update değişen kayıtlar
    for (const row of toUpdate) {
      await db
        .update(inventoryCache)
        .set({
          malzeme_adi:      row.malzeme_adi,
          ozel_kodu:        row.ozel_kodu,
          devir:            row.devir,
          devir_tutari:     row.devir_tutari,
          girisler:         row.girisler,
          girisler_tutari:  row.girisler_tutari,
          cikislar:         row.cikislar,
          cikislar_tutari:  row.cikislar_tutari,
          envanter_miktari: row.envanter_miktari,
          ortalama_fiyat:   row.ortalama_fiyat,
          envanter_tutari:  row.envanter_tutari,
          synced_at:        now,
          updated_at:       now,
        })
        .where(eq(inventoryCache.malzeme_kodu, row.malzeme_kodu!));
    }
  } catch (err) {
    status = 'error';
    errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[inventory-sync] Hata:', errorMsg);
  }

  await db.insert(inventorySyncLog).values({
    total_rows:   totalRows,
    changed_rows: changedRows,
    new_rows:     newRows,
    duration_ms:  Date.now() - start,
    status,
    error_msg:    errorMsg,
  });

  console.log(
    `[inventory-sync] ${status.toUpperCase()} — toplam:${totalRows} yeni:${newRows} değişen:${changedRows} (${Date.now() - start}ms)`,
  );
}
