import { expect, test } from '../lib/fixtures/app.fixture';

// Открытие сессии и чтение прогресса челленджей.
test.describe('Сессия и прогресс', () => {
  let sessionId;

  test.beforeAll(async ({ app }) => {
    sessionId = await app.openSession();
  });

  test('POST /challenger — выдаётся идентификатор сессии @POST', async () => {
    expect(sessionId, 'сервер должен вернуть x-challenger').toBeTruthy();
    expect(sessionId).toMatch(/[0-9a-f-]{36}/i);
  });

  test('GET /challenges — возвращается полный список челленджей @GET', async ({ app }) => {
    const { body, status } = await app.progress.list(sessionId);

    expect(status).toBe(200);
    expect(Array.isArray(body.challenges)).toBe(true);
    // apichallenges публикует фиксированный набор из 59 челленджей.
    expect(body.challenges).toHaveLength(59);
    expect(body.challenges[0]).toHaveProperty('name');
  });
});
