import { createApp } from './app';
import { env } from '@/core/env';

async function main() {
  const app = await createApp();
  const host = process.env.HOST ?? '127.0.0.1';

  await app.listen({ port: env.PORT, host });
  app.log.info(`API listening ${host}:${env.PORT}`);
}

main().catch((e) => {
  console.error('Server failed', e);
  process.exit(1);
});
