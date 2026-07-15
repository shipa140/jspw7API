import { expect, test } from '../lib/fixtures/app.fixture';
import { TaskBuilder } from '../lib/builders/task.builder';

// Чтение задач: списки, фильтры, форматы ответа и OPTIONS.
test.describe('Задачи · чтение', () => {
  let sessionId;

  test.beforeAll(async ({ app }) => {
    sessionId = await app.openSession();
  });

  test.afterAll(async ({ app }) => {
    await app.tasks.purge(sessionId);
  });

  test('GET /todos — список задач с валидной структурой @GET', async ({ app }) => {
    const { body, status } = await app.tasks.list(sessionId);

    expect(status).toBe(200);
    expect(Array.isArray(body.todos)).toBe(true);
    expect(body.todos.length).toBeGreaterThan(0);

    const [first] = body.todos;
    expect(first).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        doneStatus: expect.any(Boolean),
        description: expect.any(String),
      }),
    );
  });

  test('GET /todo — неверный путь отдаёт 404 @GET', async ({ app }) => {
    const { status } = await app.tasks.listFromWrongPath(sessionId);
    expect(status).toBe(404);
  });

  test('GET /todos/{id} — задача читается по идентификатору @GET', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(true).withDescription(2).build();
    const { body: created } = await app.tasks.create(sessionId, draft);

    const { body, status } = await app.tasks.fetchById(sessionId, created.id);

    expect(status).toBe(200);
    expect(body.todos).toHaveLength(1);
    expect(body.todos[0].id).toBe(created.id);
    expect(body.todos[0].title).toBe(draft.title);
  });

  test('GET /todos?doneStatus=true — фильтр возвращает только выполненные @GET', async ({ app }) => {
    const done = new TaskBuilder().withTitle(2).withDone(true).withDescription(2).build();
    await app.tasks.create(sessionId, done);

    const { body, status } = await app.tasks.listByDoneStatus(sessionId, true);

    expect(status).toBe(200);
    expect(body.todos.length).toBeGreaterThan(0);
    expect(body.todos.every((todo) => todo.doneStatus === true)).toBe(true);
  });

  test('GET /todos — ответ в формате XML @GET', async ({ app }) => {
    const { body, status, headers } = await app.tasks.listAsXml(sessionId);

    expect(status).toBe(200);
    expect(headers['content-type']).toContain('application/xml');
    expect(body).toContain('<todos>');
    expect(body).toContain('<title>');
    expect(body).toContain('</todos>');
  });

  test('GET /todos — ответ в формате JSON @GET', async ({ app }) => {
    const { body, status, headers } = await app.tasks.listAsJson(sessionId);

    expect(status).toBe(200);
    expect(headers['content-type']).toContain('application/json');
    expect(body.todos[0]).toHaveProperty('id');
    expect(body.todos[0]).toHaveProperty('title');
    expect(body.todos[0]).toHaveProperty('doneStatus');
    expect(body.todos[0]).toHaveProperty('description');
  });

  test('GET /todos — неподдерживаемый Accept даёт 406 @GET', async ({ app }) => {
    const { body, status } = await app.tasks.listWithUnsupportedAccept(sessionId);

    expect(status).toBe(406);
    expect(body.errorMessages).toContain('Unrecognised Accept Type');
  });

  test('OPTIONS /todos — перечислены разрешённые методы @OPTIONS', async ({ app }) => {
    const { status, headers } = await app.tasks.options(sessionId);

    expect(status).toBe(200);
    expect(headers.allow).toBeDefined();
    expect(headers.allow).toContain('GET');
    expect(headers.allow).toContain('POST');
  });
});
