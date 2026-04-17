/**
 * Self-contained inventory sync script (VPS'te doğrudan Bun ile çalışır)
 * Çalıştırma: bun /var/www/bereketfide/backend/src/scripts/sync-inventory-standalone.ts
 * Cron: 10 dakikada bir
 *
 * Bağımlılık: bun built-in (mysql2 node_modules'dan)
 */

import mysql from 'mysql2/promise';

// ─── Config ─────────────────────────────────────────────────────────────────

const DB_CONFIG = {
  host:     process.env.DB_HOST     ?? '127.0.0.1',
  port:     parseInt(process.env.DB_PORT ?? '3306'),
  user:     process.env.DB_USER     ?? 'bereketfide',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME     ?? 'bereketfide',
};

const SOURCE_URL = 'http://88.250.38.79:8092/Envanter/index.php';
const PAGE_SIZE  = 50;

// ─── Types ───────────────────────────────────────────────────────────────────

type RawRow = Record<string, string>;

// ─── Scraper ─────────────────────────────────────────────────────────────────

function parseGridHtml(html: string): RawRow[] {
  const re = /class="[^"]*css_(\w+)_grid_line[^"]*"[^>]*>([\s\S]*?)<\/TD>/g;
  const cells: Array<[string, string]> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    cells.push([m[1], m[2]]);
  }
  if (!cells.length) return [];

  const fields: string[] = [];
  for (const [f] of cells) {
    if (!fields.includes(f)) fields.push(f);
  }
  const n = fields.length;
  const rows: RawRow[] = [];
  for (let i = 0; i < cells.length; i += n) {
    const slice = cells.slice(i, i + n);
    if (slice.length < n) break;
    const row: RawRow = {};
    for (const [f, raw] of slice) {
      row[f] = raw.replace(/<[^>]+>/g, '').replace(/\u00A0/g, '').trim();
    }
    if (row.malzeme_kodu) rows.push(row);
  }
  return rows;
}

async function getScriptCaseInit(): Promise<{ html: string; init: string }> {
  const res  = await fetch(SOURCE_URL, { signal: AbortSignal.timeout(25_000) });
  const html = await res.text();
  const init = html.match(/script_case_init.*?value="(\d+)"/)?.[1] ?? '1';
  return { html, init };
}

async function fetchAjaxPage(init: string, rec: number): Promise<string> {
  const res = await fetch(SOURCE_URL, {
    method:  'POST',
    headers: {
      'Content-Type':     'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: new URLSearchParams({ nmgp_opcao: 'ajax_navigate', script_case_init: init, opc: 'rec', parm: String(rec) }),
    signal: AbortSignal.timeout(25_000),
  });
  const json = await res.json() as { setValue?: Array<{ field: string; value: string }> };
  return json.setValue?.find((v) => v.field === 'sc_grid_body')?.value ?? '';
}

function dedup(rows: RawRow[]): RawRow[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (seen.has(r.malzeme_kodu)) return false;
    seen.add(r.malzeme_kodu);
    return true;
  });
}

async function scrapeAll(): Promise<RawRow[]> {
  const { html, init } = await getScriptCaseInit();
  const all: RawRow[] = [...parseGridHtml(html)];
  for (let rec = PAGE_SIZE + 1; rec < 5000; rec += PAGE_SIZE) {
    const grid = await fetchAjaxPage(init, rec);
    if (!grid) break;
    const rows = parseGridHtml(grid);
    if (!rows.length) break;
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }
  return dedup(all);  // global dedup
}

// ─── Number parser ───────────────────────────────────────────────────────────

function parseTR(v: string): number {
  if (!v || v === '-') return 0;
  return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const t0    = Date.now();
const conn  = await mysql.createConnection(DB_CONFIG);
let status  = 'ok';
let errMsg: string | null = null;
let total = 0, changed = 0, newCount = 0;

try {
  console.log('[inventory-sync] Scraping...');
  const scraped = await scrapeAll();
  total = scraped.length;
  if (!total) throw new Error('Scraper 0 kayıt döndürdü');
  console.log(`[inventory-sync] ${total} kayıt alındı`);

  // Mevcut stok miktarlarını tek sorguda çek
  const [existing] = await conn.query<mysql.RowDataPacket[]>(
    'SELECT malzeme_kodu, envanter_miktari, girisler, cikislar, malzeme_adi FROM inventory_cache',
  );
  const existMap = new Map(existing.map((r) => [r.malzeme_kodu as string, r]));

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const inserts: unknown[][] = [];
  const updates: RawRow[]   = [];

  for (const raw of scraped) {
    const prev = existMap.get(raw.malzeme_kodu);
    if (!prev) {
      newCount++;
      inserts.push([
        raw.malzeme_kodu, raw.malzeme_adi, raw.ozel_kodu || null,
        parseTR(raw.devir), parseTR(raw.devir_tutari),
        parseTR(raw.girisler), parseTR(raw.girisler_tutari),
        parseTR(raw.cikislar), parseTR(raw.cikislar_tutari),
        parseTR(raw.envanter_miktari), parseTR(raw.ortalama_fiyat), parseTR(raw.envanter_tutari),
        now, now,
      ]);
    } else {
      const isChanged =
        Number(prev.envanter_miktari) !== parseTR(raw.envanter_miktari) ||
        Number(prev.girisler)         !== parseTR(raw.girisler) ||
        Number(prev.cikislar)         !== parseTR(raw.cikislar) ||
        prev.malzeme_adi              !== raw.malzeme_adi;
      if (isChanged) {
        changed++;
        updates.push(raw);
      }
    }
  }

  if (inserts.length) {
    await conn.query(
      `INSERT IGNORE INTO inventory_cache
        (malzeme_kodu,malzeme_adi,ozel_kodu,devir,devir_tutari,girisler,girisler_tutari,
         cikislar,cikislar_tutari,envanter_miktari,ortalama_fiyat,envanter_tutari,synced_at,updated_at)
       VALUES ?`,
      [inserts],
    );
    console.log(`[inventory-sync] ${inserts.length} yeni kayıt eklendi`);
  }

  for (const raw of updates) {
    await conn.query(
      `UPDATE inventory_cache SET
        malzeme_adi=?,ozel_kodu=?,devir=?,devir_tutari=?,girisler=?,girisler_tutari=?,
        cikislar=?,cikislar_tutari=?,envanter_miktari=?,ortalama_fiyat=?,envanter_tutari=?,
        synced_at=?,updated_at=?
       WHERE malzeme_kodu=?`,
      [
        raw.malzeme_adi, raw.ozel_kodu || null,
        parseTR(raw.devir), parseTR(raw.devir_tutari),
        parseTR(raw.girisler), parseTR(raw.girisler_tutari),
        parseTR(raw.cikislar), parseTR(raw.cikislar_tutari),
        parseTR(raw.envanter_miktari), parseTR(raw.ortalama_fiyat), parseTR(raw.envanter_tutari),
        now, now, raw.malzeme_kodu,
      ],
    );
  }
  if (updates.length) console.log(`[inventory-sync] ${updates.length} kayıt güncellendi`);

} catch (err) {
  status = 'error';
  errMsg = err instanceof Error ? err.message : String(err);
  console.error('[inventory-sync] HATA:', errMsg);
}

await conn.query(
  'INSERT INTO inventory_sync_log (total_rows,changed_rows,new_rows,duration_ms,status,error_msg) VALUES (?,?,?,?,?,?)',
  [total, changed, newCount, Date.now() - t0, status, errMsg],
);

console.log(`[inventory-sync] ${status.toUpperCase()} toplam:${total} yeni:${newCount} değişen:${changed} (${Date.now() - t0}ms)`);
await conn.end();
