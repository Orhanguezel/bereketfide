import { describe, it, expect, afterAll } from 'bun:test';
import { getTestApp, closeTestApp, apiV1 } from './setup';

afterAll(closeTestApp);

describe('Dealer finance API', () => {
  it('GET /dealer/finance/summary returns 401 without token', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'GET',
      url: apiV1('/dealer/finance/summary'),
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /dealer/profile returns 401 without token', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'GET',
      url: apiV1('/dealer/profile'),
    });
    expect(res.statusCode).toBe(401);
  });

  it('POST /dealer/register returns 400 for invalid body', async () => {
    const app = await getTestApp();
    const res = await app.inject({
      method: 'POST',
      url: apiV1('/dealer/register'),
      headers: { 'content-type': 'application/json' },
      payload: {},
    });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body) as { error?: { message?: string } };
    expect(body?.error?.message).toBe('validation_error');
  });
});
