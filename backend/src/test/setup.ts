import { createApp } from '@/app';
import type { FastifyInstance } from 'fastify';

let _app: FastifyInstance | null = null;
const API_V1_PREFIX = '/api/v1';

export async function getTestApp(): Promise<FastifyInstance> {
  if (_app) return _app;
  _app = (await createApp()) as unknown as FastifyInstance;
  await _app.ready();
  return _app;
}

export async function closeTestApp() {
  if (_app) {
    await _app.close();
    _app = null;
  }
}

export function apiV1(path: string) {
  return `${API_V1_PREFIX}${path.startsWith('/') ? path : `/${path}`}`;
}
