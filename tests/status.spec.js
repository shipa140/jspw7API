import { expect, test } from '../lib/fixtures/app.fixture';

// Служебный эндпоинт /heartbeat: доступность и поведение на разных методах.
test.describe('Служебный статус · heartbeat', () => {
  let sessionId;

  test.beforeAll(async ({ app }) => {
    sessionId = await app.openSession();
  });

  test('GET /heartbeat — сервис отвечает 204 @GET', async ({ app }) => {
    const { status } = await app.status.ping(sessionId);
    expect(status).toBe(204);
  });

  test('DELETE /heartbeat — метод не разрешён (405) @DELETE', async ({ app }) => {
    const { status } = await app.status.remove(sessionId);
    expect(status).toBe(405);
  });

  test('PATCH /heartbeat — внутренняя ошибка сервера (500) @PATCH', async ({ app }) => {
    const { status } = await app.status.patch(sessionId);
    expect(status).toBe(500);
  });

  test('POST /heartbeat с override DELETE — метод не разрешён (405) @POST', async ({ app }) => {
    const { status } = await app.status.overrideAsDelete(sessionId);
    expect(status).toBe(405);
  });
});
