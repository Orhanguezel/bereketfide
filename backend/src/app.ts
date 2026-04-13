import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import authPlugin from './plugins/authPlugin';
import mysqlPlugin from '@/plugins/mysql';
import staticUploads from './plugins/staticUploads';
import { localeMiddleware } from '@/common/middleware/locale';
import type { FastifyInstance } from 'fastify';
import { env } from '@/core/env';
import { registerErrorHandlers } from '@agro/shared-backend/core/error';
import { loggerConfig } from '@agro/shared-backend/core/logger';
import { registerSharedPublic, registerSharedAdmin, shouldSkipAuditLog, writeRequestAuditLog, startRetentionJob } from './routes/shared';
import { registerProjectPublic, registerProjectAdmin } from './routes/project';
import { startPaymentTimeoutJob } from '@agro/shared-backend/modules/orders/payment-timeout.service';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

function parseCorsOrigins(v?: string | string[]): boolean | string[] {
  if (!v) return true;
  if (Array.isArray(v)) return v;
  const arr = String(v).trim().split(',').map((x) => x.trim()).filter(Boolean);
  return arr.length ? arr : true;
}

export async function createApp() {
  const { default: buildFastify } = (await import('fastify')) as unknown as {
    default: (opts?: Parameters<FastifyInstance['log']['child']>[0]) => FastifyInstance;
  };

  const app = buildFastify({ logger: loggerConfig }) as FastifyInstance;

  await app.register(cors, {
    origin: parseCorsOrigins(env.CORS_ORIGIN as any),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-lang', 'Prefer', 'Accept', 'Accept-Language', 'X-Locale', 'x-skip-auth', 'Range'],
    exposedHeaders: ['x-total-count', 'content-range', 'range'],
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: { title: 'Bereket Fide API', version: '0.1.0' },
      servers: [{ url: `http://${process.env.HOST || 'localhost'}:${env.PORT}` }],
      components: { securitySchemes: { apiKey: { type: 'apiKey', name: 'Authorization', in: 'header' } } },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: { docExpansion: 'list', deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (h) => h.replace('style-src', "style-src 'unsafe-inline'"),
  });

  const cookieSecret = (globalThis as any).Bun?.env?.COOKIE_SECRET ?? process.env.COOKIE_SECRET ?? 'cookie-secret';
  await app.register(cookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: { httpOnly: true, path: '/', sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', secure: env.NODE_ENV === 'production' },
  });

  await app.register(jwt, { secret: env.JWT_SECRET, cookie: { cookieName: 'access_token', signed: false } });

  await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
    allowList: (req) => {
      const ip = req.ip ?? '';
      const path = (req.url ?? '').split('?')[0] ?? '';
      // SSR (Next.js) calls come from localhost — never rate-limit them
      if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') return true;
      return path === '/health' || path === '/api/health' || path.startsWith('/uploads/');
    },
  });

  app.addHook('onRequest', localeMiddleware);
  await app.register(authPlugin);
  await app.register(mysqlPlugin);

  app.get('/health', async () => ({ ok: true }));
  await app.register(multipart, { throwFileSizeLimit: true, limits: { fileSize: 20 * 1024 * 1024 } });

  app.addContentTypeParser(
    'application/x-www-form-urlencoded',
    { parseAs: 'string' },
    (_req, body, done) => {
      try {
        done(null, Object.fromEntries(new URLSearchParams(body as string)));
      } catch {
        done(null, {});
      }
    },
  );

  await app.register(staticUploads);

  await app.register(
    async (_api) => {
      const api = _api as unknown as FastifyInstance;
      api.get('/health', async () => ({ ok: true }));

      api.addHook('onResponse', async (req, reply) => {
        try {
          if (shouldSkipAuditLog(req)) return;
          const reqId = String((req as any).id || '');
          const elapsed = typeof (reply as any).elapsedTime === 'number' ? (reply as any).elapsedTime : 0;
          await writeRequestAuditLog({ req, reply, reqId, responseTimeMs: elapsed });
        } catch (err) {
          (req as any).log?.warn?.({ err }, 'audit_request_log_failed');
        }
      });

      // /api/v1/...
      await api.register(
        async (v1) => {
          await registerSharedAdmin(v1);
          await registerProjectAdmin(v1);
          await registerSharedPublic(v1);
          await registerProjectPublic(v1);
        },
        { prefix: '/v1' },
      );
    },
    { prefix: '/api' },
  );

  registerErrorHandlers(app);
  startRetentionJob();
  startPaymentTimeoutJob(app.log);
  import('@/db/sync-uploads').then((m) => m.syncUploadsToStorage()).catch(() => {});

  return app;
}
