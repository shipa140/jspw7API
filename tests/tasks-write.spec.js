import { expect, test } from '../lib/fixtures/app.fixture';
import { TaskBuilder } from '../lib/builders/task.builder';

// Создание, обновление и удаление задач (happy-path CRUD).
test.describe('Задачи · запись', () => {
  let sessionId;

  test.beforeAll(async ({ app }) => {
    sessionId = await app.openSession();
  });

  test.afterAll(async ({ app }) => {
    await app.tasks.purge(sessionId);
  });

  test('POST /todos — задача создаётся, счётчик растёт на 1 @POST', async ({ app }) => {
    const before = (await app.tasks.list(sessionId)).body.todos.length;

    const draft = new TaskBuilder().withTitle(2).withDone(true).withDescription(3).build();
    const { body, status } = await app.tasks.create(sessionId, draft);

    expect(status).toBe(201);
    expect(body.title).toBe(draft.title);
    expect(body.description).toBe(draft.description);
    expect(body.doneStatus).toBe(true);

    const after = (await app.tasks.list(sessionId)).body.todos.length;
    expect(after).toBe(before + 1);

    await app.tasks.removeById(sessionId, body.id);
  });

  test('POST /todos — создание с явными JSON-заголовками @POST', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(false).withDescription(2).build();

    const { body, status, headers } = await app.tasks.createAsJson(sessionId, draft);

    expect(status).toBe(201);
    expect(headers['content-type']).toContain('application/json');
    expect(body.title).toBe(draft.title);
    expect(body.doneStatus).toBe(false);

    await app.tasks.removeById(sessionId, body.id);
  });

  test('POST /todos/{id} — частичное обновление заголовка @POST', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(true).withDescription(3).build();
    const { body: created } = await app.tasks.create(sessionId, draft);

    const patch = new TaskBuilder().withTitle(3).build();
    const { body, status } = await app.tasks.amendById(sessionId, created.id, patch);

    expect(status).toBe(200);
    expect(body.title).toBe(patch.title);
    // описание и статус не передавали — они должны сохраниться
    expect(body.description).toBe(draft.description);
    expect(body.doneStatus).toBe(true);

    await app.tasks.removeById(sessionId, created.id);
  });

  test('PUT /todos/{id} — полная замена задачи @PUT', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(false).withDescription(2).build();
    const { body: created } = await app.tasks.create(sessionId, draft);

    const replacement = new TaskBuilder().withTitle(3).withDone(true).withDescription(4).build();
    const { body, status } = await app.tasks.replaceById(sessionId, created.id, replacement);

    expect(status).toBe(200);
    expect(body.title).toBe(replacement.title);
    expect(body.description).toBe(replacement.description);
    expect(body.doneStatus).toBe(true);

    await app.tasks.removeById(sessionId, created.id);
  });

  test('PUT /todos/{id} — замена только заголовком выставляет дефолты @PUT', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(true).withDescription(3).build();
    const { body: created } = await app.tasks.create(sessionId, draft);

    const onlyTitle = new TaskBuilder().withTitle(3).build();
    const { body, status } = await app.tasks.replaceById(sessionId, created.id, onlyTitle);

    expect(status).toBe(200);
    expect(body.title).toBe(onlyTitle.title);
    expect(body.doneStatus).toBe(false);
    expect(body.description).toBe('');

    await app.tasks.removeById(sessionId, created.id);
  });

  test('PUT /todos/{id} — попытка сменить id отклоняется (400) @PUT', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(true).withDescription(2).build();
    const { body: created } = await app.tasks.create(sessionId, draft);

    const foreignId = created.id + 1;
    const conflicting = new TaskBuilder().withId(foreignId).withTitle(2).withDescription(2).build();

    const { body, status } = await app.tasks.replaceById(sessionId, created.id, conflicting);

    expect(status).toBe(400);
    expect(body.errorMessages).toContain(`Can not amend id from ${created.id} to ${foreignId}`);

    await app.tasks.removeById(sessionId, created.id);
  });

  test('DELETE /todos/{id} — задача удаляется, счётчик падает на 1 @DELETE', async ({ app }) => {
    const draft = new TaskBuilder().withTitle(2).withDone(false).build();
    const { body: created } = await app.tasks.create(sessionId, draft);

    const before = (await app.tasks.list(sessionId)).body.todos.length;
    const { status } = await app.tasks.removeById(sessionId, created.id);
    expect(status).toBe(200);

    const after = (await app.tasks.list(sessionId)).body.todos.length;
    expect(after).toBe(before - 1);
  });

  test('DELETE /todos — полная очистка списка задач @DELETE', async ({ app }) => {
    // гарантируем, что есть что удалять
    await app.tasks.create(sessionId, new TaskBuilder().withTitle(2).withDone(true).build());

    const { body } = await app.tasks.list(sessionId);
    for (const { id } of body.todos) {
      const { status } = await app.tasks.removeById(sessionId, id);
      expect(status).toBe(200);
    }

    const { body: emptied } = await app.tasks.list(sessionId);
    expect(emptied.todos).toHaveLength(0);
  });
});
