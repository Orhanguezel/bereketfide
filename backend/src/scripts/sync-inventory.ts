/**
 * Standalone script: Envanter senkronizasyonu
 * Kullanım: bun src/scripts/sync-inventory.ts
 * Cron   : crontab ile her 10 dakikada bir çalıştırılır
 */
import { runInventorySync } from '@/modules/inventorySync/sync';
import { pool } from '@/db/client';

await runInventorySync();
await pool.end();
