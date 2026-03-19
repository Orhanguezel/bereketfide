// src/modules/library/router.ts
// =============================================================

import type { FastifyInstance } from 'fastify';

import {
  listLibraryPublic,
  getLibraryPublic,
  getLibraryBySlugPublic,
  listLibraryImagesPublic,
  listLibraryFilesPublic,
} from './controller';

const BASE = '/library';

export async function registerLibrary(app: FastifyInstance) {
  // list + detail
  app.get(`${BASE}`, { config: { public: true } }, listLibraryPublic);
  app.get(`${BASE}/:id`, { config: { public: true } }, getLibraryPublic);
  app.get(`${BASE}/by-slug/:slug`, { config: { public: true } }, getLibraryBySlugPublic);

  // gallery
  app.get(`${BASE}/:id/images`, { config: { public: true } }, listLibraryImagesPublic);

  // files
  app.get(`${BASE}/:id/files`, { config: { public: true } }, listLibraryFilesPublic);

  // download tracking
  app.post(`${BASE}/:id/track-download`, { config: { public: true } }, async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      const pool = (app as any).mysql?.pool || (app as any).db;
      if (pool) {
        await pool.query('UPDATE library SET download_count = download_count + 1 WHERE id = ?', [id]);
      }
      reply.send({ ok: true });
    } catch {
      reply.send({ ok: false });
    }
  });
}
