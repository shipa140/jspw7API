import { expect, test } from '../lib/fixtures/app.fixture';
import { TaskBuilder } from '../lib/builders/task.builder';

// Негативные сценарии создания/обновления задач и валидация ошибок.
test.describe('Задачи · негативные проверки', () => {
  let sessionId;

  test.beforeAll(async ({ app }) => {
    sessionId = await app.openSession();
  });

  test('POST /todos — doneStatus строкой вместо boolean (400) @POST', async ({ app }) => {
    const invalid = new TaskBuilder()
      .withTitle(2)
      .withRawDone('да')
      .withDescription(2)
      .build();

    const { body, status } = await app.tasks.create(sessionId, invalid);

    expect(status).toBe(400);
    expect(body.errorMessages).toContain(
      'Failed Validation: doneStatus should be BOOLEAN but was STRING',
    );
  });

  test('POST /todos — заголовок длиннее 50 символов (400) @POST', async ({ app }) => {
    const invalid = new TaskBuilder().withTitleOfLength(51).withDone(true).withDescription(2).build();

    const { body, status } = await app.tasks.create(sessionId, invalid);

    expect(status).toBe(400);
    expect(body.errorMessages).toContain(
      'Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50',
    );
  });

  test('POST /todos — описание длиннее 200 символов (400) @POST', async ({ app }) => {
    const invalid = new TaskBuilder().withTitle(2).withDone(true).withDescriptionOfLength(201).build();

    const { body, status } = await app.tasks.create(sessionId, invalid);

    expect(status).toBe(400);
    expect(body.errorMessages).toContain(
      'Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200',
    );
  });

  test('POST /todos — тело запроса больше 5000 байт (413) @POST', async ({ app }) => {
    const tooBig = new TaskBuilder().withTitle(2).withDone(true).withDescriptionOfLength(5001).build();

    const { body, status } = await app.tasks.create(sessionId, tooBig);

    expect(status).toBe(413);
    expect(body.errorMessages).toContain(
      'Error: Request body too large, max allowed is 5000 bytes',
    );
  });

  test('POST /todos — неизвестное поле в теле (400) @POST', async ({ app }) => {
    const invalid = new TaskBuilder().withTitle(2).withExtraField('priority', 'high').build();

    const { body, status } = await app.tasks.create(sessionId, invalid);

    expect(status).toBe(400);
    expect(body.errorMessages).toContain('Could not find field: priority');
  });

  test('POST /todos/{id} — обновление несуществующей задачи (404) @POST', async ({ app }) => {
    const patch = new TaskBuilder().withTitle(2).build();

    const { body, status } = await app.tasks.amendById(sessionId, 1000, patch);

    expect(status).toBe(404);
    expect(body.errorMessages).toContain('No such todo entity instance with id == 1000 found');
  });

  test('POST /todos — неподдерживаемый Content-Type text/plain (415) @POST', async ({ app }) => {
    const { body, status } = await app.tasks.createWithPlainText(sessionId, 'просто текст');

    expect(status).toBe(415);
    expect(body.errorMessages).toContain('Unsupported Content Type - text/plain');
  });
});
