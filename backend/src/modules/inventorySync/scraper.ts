/**
 * ScriptCase Envanter scraper
 * Kaynak: http://88.250.38.79:8092/Envanter/
 * Auth yok, AJAX pagination kullanıyor.
 */

const BASE_URL = 'http://88.250.38.79:8092/Envanter/index.php';
const PAGE_SIZE = 50;

export type RawInventoryRow = {
  malzeme_kodu: string;
  malzeme_adi: string;
  ozel_kodu: string;
  devir: string;
  devir_tutari: string;
  girisler: string;
  girisler_tutari: string;
  cikislar: string;
  cikislar_tutari: string;
  envanter_miktari: string;
  ortalama_fiyat: string;
  envanter_tutari: string;
};

function parseGridHtml(html: string): RawInventoryRow[] {
  const pattern = /class="[^"]*css_(\w+)_grid_line[^"]*"[^>]*>([\s\S]*?)<\/TD>/g;
  const matches: Array<[string, string]> = [];
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(html)) !== null) {
    matches.push([m[1], m[2]]);
  }
  if (!matches.length) return [];

  const fieldsOrder: string[] = [];
  for (const [field] of matches) {
    if (!fieldsOrder.includes(field)) fieldsOrder.push(field);
  }
  const numFields = fieldsOrder.length;
  if (!numFields) return [];

  const rows: RawInventoryRow[] = [];
  for (let i = 0; i < matches.length; i += numFields) {
    const cells = matches.slice(i, i + numFields);
    if (cells.length < numFields) break;
    const row: Record<string, string> = {};
    for (const [field, raw] of cells) {
      const clean = raw.replace(/<[^>]+>/g, '').replace(/\u00A0/g, '').trim();
      row[field] = clean;
    }
    if (row.malzeme_kodu) rows.push(row as RawInventoryRow);
  }
  return rows;
}

function buildCookieHeader(raw: string | null): string {
  if (!raw) return '';
  return raw
    .split(/, (?=[^ ;]+=)/)
    .map((part) => part.split(';')[0]?.trim())
    .filter(Boolean)
    .join('; ');
}

function dedupeByMaterialCode(rows: RawInventoryRow[]): RawInventoryRow[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.malzeme_kodu)) return false;
    seen.add(row.malzeme_kodu);
    return true;
  });
}

async function fetchPage1(): Promise<{ html: string; scriptCaseInit: string; cookie: string }> {
  const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(20_000) });
  const cookie = buildCookieHeader(res.headers.get('set-cookie'));
  const html = await res.text();
  const initMatch = html.match(/script_case_init.*?value="(\d+)"/);
  const scriptCaseInit = initMatch?.[1] ?? '1';
  return { html, scriptCaseInit, cookie };
}

async function fetchPageAjax(scriptCaseInit: string, recStart: number, cookie: string): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: new URLSearchParams({
      nmgp_opcao: 'ajax_navigate',
      script_case_init: scriptCaseInit,
      opc: 'rec',
      parm: String(recStart),
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const json = await res.json() as { setValue?: Array<{ field: string; value: string }> };
  const gridItem = json.setValue?.find((v) => v.field === 'sc_grid_body');
  return gridItem?.value ?? '';
}

export async function scrapeAllInventory(): Promise<RawInventoryRow[]> {
  const { html: page1Html, scriptCaseInit, cookie } = await fetchPage1();
  const allRows: RawInventoryRow[] = parseGridHtml(page1Html);

  for (let recStart = PAGE_SIZE + 1; recStart < 2000; recStart += PAGE_SIZE) {
    const gridHtml = await fetchPageAjax(scriptCaseInit, recStart, cookie);
    if (!gridHtml) break;
    const rows = parseGridHtml(gridHtml);
    if (!rows.length) break;
    allRows.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }

  return dedupeByMaterialCode(allRows);
}
