import { log } from '@agro/shared-backend/core/app-logger';
/**
 * Startup: uploads/ klasörünü tarar, storage_assets tablosunda eksik dosyaları ekler.
 * Hot reload'da DB sıfırlansa bile dosyalar tekrar kaydedilir.
 */
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { db } from '@/db/client';
import { storageAssets } from '@agro/shared-backend/modules/storage/schema';
import { sql, eq } from 'drizzle-orm';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

export async function syncUploadsToStorage() {
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsRoot)) return;

  const files = walkDir(uploadsRoot);
  if (!files.length) return;

  // Mevcut kayıtları al
  const existing = await db
    .select({ path: storageAssets.path })
    .from(storageAssets);
  const existingPaths = new Set(existing.map((r) => r.path));

  const toInsert = files
    .map((full) => {
      const rel = path.relative(process.cwd(), full); // uploads/folder/file
      if (existingPaths.has(rel)) return null;

      const folder = path.dirname(rel).replace(/^uploads\/?/, '');
      const name = path.basename(full);
      const ext = path.extname(name).toLowerCase();
      const mime = MIME_MAP[ext] || 'application/octet-stream';
      const size = fs.statSync(full).size;
      const url = '/' + rel;

      return {
        id: randomUUID(),
        user_id: null,
        name,
        bucket: 'local' as const,
        path: rel,
        folder,
        mime,
        size,
        url,
        provider: 'local' as const,
      };
    })
    .filter(Boolean) as any[];

  if (!toInsert.length) return;

  // Batch insert
  const BATCH = 50;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    await db.insert(storageAssets).values(batch).onDuplicateKeyUpdate({
      set: { url: sql`VALUES(url)` },
    });
  }

  log.info(`[sync-uploads] ${toInsert.length} new files registered in storage_assets`);
}
