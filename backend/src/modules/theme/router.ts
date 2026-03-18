import type { FastifyInstance } from 'fastify';
import { publicGetTheme } from './admin.controller';

export async function registerTheme(app: FastifyInstance) {
  app.get('/theme', { config: { public: true } }, publicGetTheme);
}
